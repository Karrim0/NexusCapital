<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Translates CMS/project/blog content into the site's non-English languages.
 *
 * Important behavior:
 * - English remains the source of truth.
 * - Translation failures never block saving English content.
 * - Controllers can translate only top-level sections that actually changed,
 *   which keeps dashboard saves much lighter than retranslating a whole page.
 * - Backfill tools can optionally request one target language at a time.
 */
class AutoTranslationService
{
    /** ISO codes for every language the site supports besides English. */
    public const TARGET_LANGUAGES = ['ar', 'de', 'pl', 'cs', 'nl', 'hu', 'ro', 'ru', 'fr'];

    /** Small pause between MyMemory requests to avoid hammering the free API. */
    private const REQUEST_DELAY_MICROSECONDS = 150000; // 0.15s

    /** Keep individual MyMemory requests comfortably below its text limit. */
    private const MAX_CHUNK_LENGTH = 450;

    /**
     * MyMemory needs no API key. This flag only lets the site owner disable
     * automatic translation explicitly from .env.
     */
    public static function isConfigured(): bool
    {
        return filter_var(env('AUTO_TRANSLATE_ENABLED', true), FILTER_VALIDATE_BOOL);
    }

    /**
     * Translate selected top-level fields.
     *
     * @param array $data Full source record/page data.
     * @param array $translatableFields Top-level keys that may be translated.
     * @param array|null $targetLanguages Optional subset of TARGET_LANGUAGES.
     * @return array<string, array>
     */
    public static function translate(
        array $data,
        array $translatableFields,
        ?array $targetLanguages = null
    ): array {
        if (!self::isConfigured()) {
            return [];
        }

        $languages = self::normalizeTargetLanguages($targetLanguages);
        if (empty($languages)) {
            return [];
        }

        /*
         * Keep only fields that both exist and actually contain at least one
         * translatable string. This avoids storing useless translation copies
         * for pure IDs, paths, image URLs, booleans, etc.
         */
        $subset = [];
        foreach (array_unique($translatableFields) as $field) {
            if (!array_key_exists($field, $data)) {
                continue;
            }

            $fieldStrings = [];
            self::flatten($data[$field], [$field], $fieldStrings);

            if (!empty($fieldStrings)) {
                $subset[$field] = $data[$field];
            }
        }

        if (empty($subset)) {
            return [];
        }

        $strings = [];
        self::flatten($subset, [], $strings);

        if (empty($strings)) {
            return [];
        }

        // Repeated labels are common in CMS arrays; translate each only once.
        $unique = array_values(array_unique($strings));

        $result = [];
        @set_time_limit(300);

        foreach ($languages as $lang) {
            try {
                $translatedMap = self::translateUniqueStrings($unique, $lang);

                if ($translatedMap === null) {
                    continue;
                }

                /*
                 * Start from the complete selected section so list arrays keep
                 * their original shape. Only string leaves found in the map are
                 * replaced; paths/URLs/numbers remain untouched.
                 */
                $rebuilt = $subset;
                self::rebuild($rebuilt, [], $strings, $translatedMap);
                $result[$lang] = $rebuilt;
            } catch (\Throwable $e) {
                Log::warning(
                    "AutoTranslationService: failed translating to [{$lang}]: ".$e->getMessage()
                );
            }
        }

        return $result;
    }

    /**
     * Returns the top-level fields whose values changed between two versions.
     */
    public static function changedTopLevelFields(array $before, array $after): array
    {
        $fields = [];
        $keys = array_values(array_unique(array_merge(array_keys($before), array_keys($after))));

        foreach ($keys as $key) {
            $beforeExists = array_key_exists($key, $before);
            $afterExists = array_key_exists($key, $after);

            if (!$beforeExists || !$afterExists || $before[$key] !== $after[$key]) {
                $fields[] = $key;
            }
        }

        return $fields;
    }

    /**
     * Translate only changed top-level sections, then merge them into existing
     * translations. Intended for CMS update controllers.
     */
    public static function translateChangedIntoExisting(
        array $before,
        array $after,
        ?array $existingTranslations,
        ?array $targetLanguages = null
    ): array {
        $changedFields = self::changedTopLevelFields($before, $after);

        if (empty($changedFields)) {
            return $existingTranslations ?? [];
        }

        $freshTranslations = self::translate($after, $changedFields, $targetLanguages);

        return self::mergeIntoExisting($existingTranslations, $freshTranslations);
    }

    /**
     * Merge newly translated sections over existing language JSON.
     */
    public static function mergeIntoExisting(?array $existingTranslations, array $freshTranslations): array
    {
        $existingTranslations = $existingTranslations ?? [];

        foreach ($freshTranslations as $lang => $data) {
            $existingTranslations[$lang] = array_replace_recursive(
                $existingTranslations[$lang] ?? [],
                $data
            );
        }

        return $existingTranslations;
    }

    /**
     * Normalize/validate an optional requested language subset.
     */
    private static function normalizeTargetLanguages(?array $targetLanguages): array
    {
        if ($targetLanguages === null) {
            return self::TARGET_LANGUAGES;
        }

        return array_values(array_unique(array_intersect(
            self::TARGET_LANGUAGES,
            $targetLanguages
        )));
    }

    /** Recursively collect translatable string leaves with dotted paths. */
    private static function flatten($value, array $path, array &$out): void
    {
        if (is_array($value)) {
            foreach ($value as $k => $v) {
                self::flatten($v, [...$path, $k], $out);
            }
            return;
        }

        if (
            is_string($value)
            && trim($value) !== ''
            && !self::looksNonTranslatable($value)
        ) {
            $out[implode('.', $path)] = $value;
        }
    }

    /**
     * Skip values that are clearly technical/non-language content.
     *
     * Do NOT skip ordinary one-word text: words such as "Verify", "Premium",
     * "Contact", etc. are real UI/CMS copy and must be translated.
     */
    private static function looksNonTranslatable(string $value): bool
    {
        $trimmed = trim($value);

        if (preg_match('#^https?://#i', $trimmed)) {
            return true;
        }

        if (str_starts_with($trimmed, '/storage/') || str_starts_with($trimmed, 'storage/')) {
            return true;
        }

        if (preg_match('/\.(jpg|jpeg|png|webp|gif|svg|mp4|pdf|avif)(\?.*)?$/i', $trimmed)) {
            return true;
        }

        if (filter_var($trimmed, FILTER_VALIDATE_EMAIL)) {
            return true;
        }

        // Phone-like values.
        if (preg_match('/^\+?[\d\s().-]{6,}$/', $trimmed)) {
            return true;
        }

        // Pure numbers, percentages, prices, and symbols.
        if (preg_match('/^[\d\s.,%+€$£¥-]+$/u', $trimmed)) {
            return true;
        }

        // Common placeholder tokens used by unfinished CMS fields.
        if (preg_match('/^\[[A-Z0-9 _\/-]+\]$/', $trimmed)) {
            return true;
        }

        // File/system paths or machine identifiers with underscores.
        if (!str_contains($trimmed, ' ') && (
            str_contains($trimmed, '/')
            || str_contains($trimmed, '\\')
            || str_contains($trimmed, '_')
        )) {
            return true;
        }

        return false;
    }

    /** Recursively rewrite string leaves using the translated map. */
    private static function rebuild(
        &$value,
        array $path,
        array $originalStrings,
        array $translatedMap
    ): void {
        if (is_array($value)) {
            foreach ($value as $k => &$v) {
                self::rebuild($v, [...$path, $k], $originalStrings, $translatedMap);
            }
            unset($v);
            return;
        }

        $key = implode('.', $path);

        if (
            isset($originalStrings[$key])
            && array_key_exists($originalStrings[$key], $translatedMap)
        ) {
            $value = $translatedMap[$originalStrings[$key]];
        }
    }

    /**
     * Translate each unique source string. Returns null only when every
     * attempted request for this language failed.
     */
    private static function translateUniqueStrings(array $unique, string $lang): ?array
    {
        $map = [];
        $email = env('MYMEMORY_EMAIL');
        $anySucceeded = false;
        $anyAttempted = false;

        foreach ($unique as $original) {
            $anyAttempted = true;

            $translated = self::translateText($original, $lang, $email);

            if ($translated !== null) {
                $map[$original] = $translated;
                $anySucceeded = true;
            }
        }

        if ($anyAttempted && !$anySucceeded) {
            Log::warning(
                "AutoTranslationService: MyMemory returned no usable translations for [{$lang}] ".
                '— possibly a quota/network limit.'
            );

            return null;
        }

        return $map;
    }

    /**
     * Translate one string. Long paragraphs are split into safe chunks instead
     * of being silently left in English.
     */
    private static function translateText(string $text, string $lang, ?string $email): ?string
    {
        $chunks = self::chunkText($text, self::MAX_CHUNK_LENGTH);
        $translatedChunks = [];

        foreach ($chunks as $chunk) {
            try {
                $response = Http::timeout(20)->get(
                    'https://api.mymemory.translated.net/get',
                    array_filter([
                        'q'        => $chunk,
                        'langpair' => "en|{$lang}",
                        'de'       => $email ?: null,
                    ])
                );
            } catch (\Throwable $e) {
                usleep(self::REQUEST_DELAY_MICROSECONDS);
                return null;
            }

            if (!$response->ok()) {
                usleep(self::REQUEST_DELAY_MICROSECONDS);
                return null;
            }

            $translated = $response->json('responseData.translatedText');
            $status = $response->json('responseStatus');

            if (!$translated || (int) $status !== 200) {
                usleep(self::REQUEST_DELAY_MICROSECONDS);
                return null;
            }

            $translatedChunks[] = html_entity_decode($translated, ENT_QUOTES);
            usleep(self::REQUEST_DELAY_MICROSECONDS);
        }

        return implode(' ', $translatedChunks);
    }

    /**
     * Split long copy into sentence/word chunks that fit MyMemory.
     */
    private static function chunkText(string $text, int $maxLength): array
    {
        if (mb_strlen($text) <= $maxLength) {
            return [$text];
        }

        $sentences = preg_split('/(?<=[.!?])\s+/u', trim($text), -1, PREG_SPLIT_NO_EMPTY);
        $chunks = [];
        $current = '';

        foreach ($sentences ?: [$text] as $sentence) {
            if (mb_strlen($sentence) > $maxLength) {
                if ($current !== '') {
                    $chunks[] = $current;
                    $current = '';
                }

                foreach (self::chunkByWords($sentence, $maxLength) as $piece) {
                    $chunks[] = $piece;
                }

                continue;
            }

            $candidate = $current === '' ? $sentence : $current.' '.$sentence;

            if (mb_strlen($candidate) <= $maxLength) {
                $current = $candidate;
            } else {
                if ($current !== '') {
                    $chunks[] = $current;
                }
                $current = $sentence;
            }
        }

        if ($current !== '') {
            $chunks[] = $current;
        }

        return $chunks;
    }

    private static function chunkByWords(string $text, int $maxLength): array
    {
        $words = preg_split('/\s+/u', trim($text), -1, PREG_SPLIT_NO_EMPTY);
        $chunks = [];
        $current = '';

        foreach ($words ?: [$text] as $word) {
            $candidate = $current === '' ? $word : $current.' '.$word;

            if (mb_strlen($candidate) <= $maxLength) {
                $current = $candidate;
                continue;
            }

            if ($current !== '') {
                $chunks[] = $current;
            }

            /*
             * Extremely long no-space tokens are not useful translation input;
             * keep them unchanged rather than producing invalid requests.
             */
            if (mb_strlen($word) > $maxLength) {
                $chunks[] = $word;
                $current = '';
            } else {
                $current = $word;
            }
        }

        if ($current !== '') {
            $chunks[] = $current;
        }

        return $chunks;
    }
}
