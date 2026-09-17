<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Project extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        'slug',
        'project_code',
        'title',
        'location',
        'language',
        'starting_price',
        'currency',
        'starting_area',
        'max_area',
        'delivery_date',
        'overview',
        'project_details',
        'facilities',
        'location_advantages',
        'location_advantage',
        'architectural_vision',
        'lifestyle_amenities',
        'investment_info',
        'investment_potential',
        'payment_plans',
        'amenities',
        'mins_from_airport',
        'mins_from_hospitals',
        'mins_from_downtown',
        'mins_from_beach',
        'location_description',
        'cover_image',
        'gallery',
        'map_embed_url',
        'video_url',
        'down_payment_percent',
        'installment_years',
        'cash_discount_percent',
        'maintenance_fee_percent',
        'meta_title',
        'meta_description',
        'is_active',
        'is_featured',
        'badges',
        'offer_discount_percent',
        'offer_deadline_label',
        'residence_highlights',
        'investment_cards',
        'lifestyle_cards',
        'payment_plan_rows',
        'buyer_journey_steps',
        'project_faqs',
        'construction_progress',
        'travel_distances',
        'master_plan',
        'developer_track_record',
        'unit_types',
        'translations',
    ];
    protected $casts = [
        'gallery'                 => 'array',
        'is_active'               => 'boolean',
        'is_featured'             => 'boolean',
        'starting_price'          => 'float',
        'starting_area'           => 'float',
        'max_area'                => 'float',
        'mins_from_airport'       => 'integer',
        'mins_from_hospitals'     => 'integer',
        'mins_from_downtown'      => 'integer',
        'mins_from_beach'         => 'integer',
        'down_payment_percent'    => 'float',
        'installment_years'       => 'integer',
        'cash_discount_percent'   => 'float',
        'maintenance_fee_percent' => 'float',
        'badges'                  => 'array',
        'offer_discount_percent'  => 'float',
        'residence_highlights'    => 'array',
        'investment_cards'        => 'array',
        'lifestyle_cards'         => 'array',
        'payment_plan_rows'       => 'array',
        'buyer_journey_steps'     => 'array',
        'project_faqs'            => 'array',
        'construction_progress'   => 'array',
        'travel_distances'        => 'array',
        'master_plan'             => 'array',
        'developer_track_record'  => 'array',
        'unit_types'              => 'array',
    ];

    public function getImageAttribute(): ?string
    {
        $url = $this->cover_image;
        if (!$url) return null;
        if (str_starts_with($url, 'http://') || str_starts_with($url, 'https://')) return $url;
        return rtrim(env('FRONTEND_URLS', config('app.url')), '/') . '/storage/' . ltrim($url, '/');
    }

    public function getMainImageUrlAttribute(): ?string
    {
        return $this->getImageAttribute();
    }

    public function getImagesAttribute(): array
    {
        $gallery = $this->attributes['gallery'] ?? null;
        $items = is_string($gallery) ? json_decode($gallery, true) : $gallery;
        if (!is_array($items)) return [];
        $appUrl = rtrim(env('FRONTEND_URLS', config('app.url')), '/');
        $resolve = function ($url) use ($appUrl) {
            if (!$url) return null;
            if (str_starts_with($url, 'http://') || str_starts_with($url, 'https://')) return $url;
            return $appUrl . '/storage/' . ltrim($url, '/');
        };
        return array_values(array_filter(array_map(function ($item) use ($resolve) {
            // Legacy entries are plain URL strings; newer entries carry a caption too.
            if (is_array($item)) {
                $url = $resolve($item['url'] ?? null);
                if (!$url) return null;
                return ['url' => $url, 'caption' => $item['caption'] ?? null];
            }
            $url = $resolve($item);
            return $url ? ['url' => $url, 'caption' => null] : null;
        }, $items)));
    }

    /**
     * Fields that can carry a per-locale override inside the `translations` JSON column.
     * Location/district names, prices, dates, and flags always stay in the base language.
     */
    public static array $translatableFields = [
        'title', 'overview', 'project_details', 'location_description',
        'badges', 'residence_highlights', 'unit_types', 'payment_plan_rows',
        'lifestyle_cards', 'investment_cards', 'travel_distances',
        'developer_track_record', 'project_faqs', 'offer_deadline_label',
    ];

    /**
     * Returns this project as an array with the given locale's overrides merged over the
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