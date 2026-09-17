<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Automatically translates newly saved/updated content (blog posts, projects,
 * and every *ContentController page) into every non-English site language,
 * using the MyMemory Translation API — a genuinely free service that needs
 * no API key, no billing account, and no credit card. (An optional free
 * email address can be added in .env to raise the daily quota — see
 * MYMEMORY_EMAIL below — but nothing is required to get started.)
 *
 * How it is used: each controller calls
 *   AutoTranslationService::translate($data, $translatableFields)
 * right before saving, and stores the returned array in the model's
 * `translations` JSON column: { "ar": {...}, "de": {...}, ... }.
 *
 * Design notes:
 *  - Only the fields listed in $translatableFields are touched; slugs, prices,
 *    dates, URLs, flags, etc. are left completely alone.
 *  - Every string leaf inside those fields (including nested arrays like
 *    content_blocks, faqs, unit_types...) is translated, structure preserved.
 *  - Identical strings are only sent to the API once per language (dedup),
 *    to keep requests to a minimum on a free, rate-limited service.
 *  - If any language/network call fails, that language is skipped and the
 *    English content is used as its fallback — this NEVER blocks or fails
 *    the actual content save.
 *  - MyMemory's free tier translates one string per HTTP request and caps
 *    daily volume per IP (1,000 words/day anonymously, 10,000 words/day if
 *    MYMEMORY_EMAIL is set in .env — still free, just an email address).
 *    A small delay between calls keeps usage polite and within that limit.
 */
class AutoTranslationService
{
    /** ISO codes for every language the site supports besides English. */
    public const TARGET_LANGUAGES = ['ar', 'de', 'pl', 'cs', 'nl', 'hu', 'ro', 'ru', 'fr'];

    /** Microseconds to wait between individual MyMemory requests (be a polite free-tier citizen). */
    private const REQUEST_DELAY_MICROSECONDS = 150000; // 0.15s

    /**
     * Auto-translation needs no API key with MyMemory — this only exists so
     * an admin can explicitly turn it off via .env if they ever want to
     * (AUTO_TRANSLATE_ENABLED=false), without touching any code.
     */
    public static function isConfigured(): bool
    {
        return filter_var(env('AUTO_TRANSLATE_ENABLED', true), FILTER_VALIDATE_BOOL);
    }

    /**
     * @param array $data               Full record data (as it is about to be saved).
     * @param array $translatableFields Top-level keys of $data that should be translated.
     * @return array{string: array}     [ 'ar' => [...translated subset...], 'de' => [...], ... ]
     */
    public static function translate(array $data, array $translatableFields): array
    {
        if (!self::isConfigured()) {
            return [];
        }

        // 1) Keep only the translatable subset of the record.
        $subset = array_intersect_key($data, array_flip($translatableFields));
        if (empty($subset)) {
            return [];
        }

        // 2) Flatten every string leaf to "path => string", so nested arrays
        //    (content_blocks, faqs, unit_types, quick_facts...) are covered.
        $strings = [];
        self::flatten($subset, [], $strings);
        if (empty($strings)) {
            return [];
        }

        // 3) Deduplicate — many short labels/words repeat across a record.
        $unique = array_values(array_unique($strings));

        $result = [];
        // Allow more time than the default PHP limit — MyMemory is one
        // request per string, so a record with many strings takes a while.
        @set_time_limit(300);

        foreach (self::TARGET_LANGUAGES as $lang) {
            try {
                $translatedMap = self::translateUniqueStrings($unique, $lang);
                if ($translatedMap === null) {
                    continue; // this language failed; fall back to English for it
                }
                $rebuilt = $subset;
                self::rebuild($rebuilt, [], $strings, $translatedMap);
                $result[$lang] = $rebuilt;
            } catch (\Throwable $e) {
                Log::warning("AutoTranslationService: failed translating to [{$lang}]: " . $e->getMessage());
                // Skip this language only — never let a translation failure
                // stop the admin from saving their content.
            }
        }

        return $result;
    }

    /**
     * Merges freshly auto-translated content over any existing translations,
     * so manually-refined translations for OTHER fields/languages are kept,
     * while the just-edited fields get updated everywhere automatically.
     */
    public static function mergeIntoExisting(?array $existingTranslations, array $freshTranslations): array
    {
        $existingTranslations = $existingTranslations ?? [];
        foreach ($freshTranslations as $lang => $data) {
            $existingTranslations[$lang] = array_replace_recursive($existingTranslations[$lang] ?? [], $data);
        }
        return $existingTranslations;
    }

    /** Recursively collect every string leaf value with a dotted path key. */
    private static function flatten($value, array $path, array &$out): void
    {
        if (is_array($value)) {
            foreach ($value as $k => $v) {
                self::flatten($v, [...$path, $k], $out);
            }
            return;
        }
        if (is_string($value) && trim($value) !== '' && !self::looksNonTranslatable($value)) {
            $out[implode('.', $path)] = $value;
        }
    }

    /**
     * Heuristic guard so image paths, uploaded file URLs, and embed URLs
     * never get sent to the translation API (they are not language text).
     */
    private static function looksNonTranslatable(string $value): bool
    {
        if (preg_match('#^https?://#i', $value)) {
            return true;
        }
        if (str_starts_with($value, '/storage/') || str_starts_with($value, 'storage/')) {
            return true;
        }
        if (preg_match('/\.(jpg|jpeg|png|webp|gif|svg|mp4|pdf|avif)$/i', $value)) {
            return true;
        }
        // Bare identifiers/slugs/paths rarely contain a space; real sentences almost always do.
        if (!str_contains($value, ' ') && (str_contains($value, '/') || preg_match('/^[a-z0-9_\-]+$/i', $value))) {
            return strlen($value) < 60; // still allow long no-space marketing headlines through
        }
        return false;
    }

    /** Recursively rewrite every string leaf using the translated map. */
    private static function rebuild(&$value, array $path, array $originalStrings, array $translatedMap): void
    {
        if (is_array($value)) {
            foreach ($value as $k => &$v) {
                self::rebuild($v, [...$path, $k], $originalStrings, $translatedMap);
            }
            unset($v);
            return;
        }
        $key = implode('.', $path);
        if (isset($originalStrings[$key]) && isset($translatedMap[$originalStrings[$key]])) {
            $value = $translatedMap[$originalStrings[$key]];
        }
    }

    /**
     * Translates a list of unique strings into $lang using MyMemory's free
     * API (one string per request — there is no batch endpoint on the free
     * tier). Long strings (MyMemory caps ~500 chars per request) are passed
     * through untouched rather than sent, since they are almost always rich
     * paragraphs better reviewed by a human anyway.
     * Returns [originalString => translatedString] or null if every request
     * for this language failed (so the caller can fall back to English).
     */
    private static function translateUniqueStrings(array $unique, string $lang): ?array
    {
        $map = [];
        $email = env('MYMEMORY_EMAIL'); // optional — raises the free daily quota, still free
        $anySucceeded = false;
        $anyAttempted = false;

        foreach ($unique as $original) {
            if (mb_strlen($original) > 490) {
                // MyMemory's free tier rejects very long strings; leave these
                // for manual translation later rather than failing the batch.
                continue;
            }

            $anyAttempted = true;
            try {
                $response = Http::timeout(20)->get('https://api.mymemory.translated.net/get', array_filter([
                    'q'       => $original,
                    'langpair'=> "en|{$lang}",
                    'de'      => $email ?: null,
                ]));
            } catch (\Throwable $e) {
                usleep(self::REQUEST_DELAY_MICROSECONDS);
                continue;
            }

            if ($response->ok()) {
                $translated = $response->json('responseData.translatedText');
                $status = $response->json('responseStatus');
                if ($translated && (int) $status === 200 && mb_strtolower($translated) !== mb_strtolower($original)) {
                    $map[$original] = html_entity_decode($translated, ENT_QUOTES);
                    $anySucceeded = true;
                } elseif ($translated && (int) $status === 200) {
                    // Identical output can be legitimate (e.g. a brand name), keep it.
                    $map[$original] = html_entity_decode($translated, ENT_QUOTES);
                    $anySucceeded = true;
                }
            }

            usleep(self::REQUEST_DELAY_MICROSECONDS);
        }

        if ($anyAttempted && !$anySucceeded) {
            // Likely the daily free quota was hit for this run — stop trying
            // this language so we don't hammer a failing endpoint.
            Log::warning("AutoTranslationService: MyMemory returned no usable translations for [{$lang}] — possibly a daily quota limit. Try again later or set MYMEMORY_EMAIL in .env for a higher limit.");
            return null;
        }

        return $map;
    }
}
