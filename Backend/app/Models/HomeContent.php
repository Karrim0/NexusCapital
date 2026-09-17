<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Support\ContentMerge;

class HomeContent extends Model
{
    protected $fillable = [
        'key',
        'data',
        'translations',
    ];

    protected $casts = [
        'data'         => 'array',
        'translations' => 'array',
    ];

    /**
     * Deep-merges this row's translation for $locale over $data (the already
     * default-merged English content). Falls back to English for anything
     * missing in that locale's translation — never returns a blank field.
     */
    public function localize(?string $locale, array $data): array
    {
        $locale = $locale ?: 'en';
        if ($locale === 'en') {
            return $data;
        }

        $translation = $this->translations[$locale] ?? null;
        if (!is_array($translation)) {
            return $data;
        }

        return ContentMerge::merge($data, $translation);
    }
}
