<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Property extends Model
{
    use HasFactory;
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'short_description',
        'property_type',
        'deal_type',
        'listing_type',
        'price',
        'currency',
        'area',
        'bedrooms',
        'bathrooms',
        'garage',
        'district',
        'location',
        'address',
        'badge',
        'main_image_url',
        'images',
        'features',
        'is_featured',
        'is_active',
        'views',
        'floor',
        'view_category',
        'delivery_date',
        'contract_type',
        'project_name',
        'down_payment_percent',
        'installment_years_max',
        'cash_discount_percent',
        'video_url',
        'map_embed_url',
        'booking_url',
        'is_rented',
        'is_sold',
        'has_offer',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'images' => 'array',
        'features' => 'array',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'down_payment_percent' => 'float',
        'installment_years_max' => 'integer',
        'cash_discount_percent' => 'float',
        'is_rented' => 'boolean',
        'is_sold' => 'boolean',
        'has_offer' => 'boolean',
    ];

    /**
     * Owner (creator) of the property.
     */
    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Users who favorited this property.
     */
    public function favoritedBy()
    {
        return $this->belongsToMany(User::class, 'favorites')->withTimestamps();
    }

    /**
     * Contact requests sent by customers for this property.
     *
     * @return HasMany<ContactRequest>
     */
    public function contactRequests(): HasMany
    {
        return $this->hasMany(ContactRequest::class);
    }

    /**
     * Get the main image URL attribute (ensure full URL).
     * This accessor ensures images always have full URLs.
     */
    public function getImageAttribute()
    {
        $url = $this->main_image_url;
        if (!$url) {
            return null;
        }
        // If already absolute URL, return as is
        if (str_starts_with($url, 'http://') || str_starts_with($url, 'https://')) {
            return $url;
        }
        // If relative path, prepend APP_URL
        return rtrim(env('FRONTEND_URLS', config('app.url')), '/') . '/storage/' . ltrim($url, '/');
    }

}
