<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    protected $fillable = [
        'name',
        'title',
        'photo',
        'bio',
        'department',
        'years_of_experience',
        'specialization',
        'location',
        'expertise',
        'languages',
        'phone',
        'whatsapp',
        'email',
        'linkedin_url',
        'sort_order',
        'is_active',
        'translations',
    ];

    protected $casts = [
        'expertise'     => 'array',
        'languages'     => 'array',
        'is_active'     => 'boolean',
        'sort_order'    => 'integer',
        'translations'  => 'array',
    ];

    public static array $translatableFields = [
        'name', 'title', 'bio', 'department', 'specialization', 'location', 'expertise',
    ];

    /**
     * Returns this member as an array with the given locale's overrides merged over the
     * English base fields. Falls back to English for any field with no translation.
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
