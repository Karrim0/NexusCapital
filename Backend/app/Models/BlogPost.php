<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BlogPost extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'cover_image',
        'category',
        'tags',
        'reading_time_label',
        'card_type_label',
        'hero_eyebrow',
        'title_highlight',
        'primary_cta_label',
        'primary_cta_url',
        'secondary_cta_label',
        'quick_facts',
        'content_blocks',
        'checklist_items',
        'disclaimer',
        'benefit_cards',
        'gallery',
        'faqs',
        'translations',
        'is_published',
        'is_featured',
        'published_at',
    ];

    protected $casts = [
        'tags'            => 'array',
        'quick_facts'     => 'array',
        'content_blocks'  => 'array',
        'checklist_items' => 'array',
        'benefit_cards'   => 'array',
        'gallery'         => 'array',
        'faqs'            => 'array',
        'translations'    => 'array',
        'is_published'    => 'boolean',
        'is_featured'     => 'boolean',
        'published_at'    => 'datetime',
    ];

    /**
     * Fields that can carry a per-locale override inside the `translations` JSON column.
     * Anything not listed here (slug, cover_image, dates, flags, urls...) always stays in English.
     */
    public static array $translatableFields = [
        'title', 'excerpt', 'category', 'tags',
        'reading_time_label', 'card_type_label', 'hero_eyebrow', 'title_highlight',
        'primary_cta_label', 'secondary_cta_label',
        'quick_facts', 'content_blocks', 'checklist_items', 'disclaimer', 'benefit_cards', 'faqs',
    ];

    /**
     * Returns this post as an array with the given locale's overrides merged over the
     * English base fields. Falls back to English for any field missing in that locale.
     */
    public function toLocalizedArray(?string $locale, array $data): array
    {
        $locale = $locale ?: 'en';
        if ($locale === 'en') {
            return $data;
        }

        $overrides = $this->translations[$locale] ?? null;
        if (!is_array($overrides)) {
            return $data;
        }

        foreach (self::$translatableFields as $field) {
            if (array_key_exists($field, $overrides) && $overrides[$field] !== null && $overrides[$field] !== '') {
                $data[$field] = $overrides[$field];
            }
        }

        return $data;
    }
}
