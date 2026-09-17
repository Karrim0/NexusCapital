<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

class PropertyController extends Controller
{
    /**
     * List properties with optional filters.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Property::query();

        // Scope: public listing vs dashboard
        $scope = $request->query('scope', 'public');

        if ($scope === 'public') {
            $query->where('is_active', true);
        } elseif ($scope === 'dashboard') {
            $user = $request->user();

            if (! $user) {
                abort(401);
            }

            // Only admin / agent can use dashboard scope
            if (! $user->hasRole('admin') && ! $user->hasRole('agent')) {
                abort(403, 'You are not allowed to access dashboard properties.');
            }

            // Admin & agents can see the full dashboard list.
            // Update / delete permissions are still enforced per-property
            // in the update / destroy methods, so an agent can only modify
            // or delete properties they own.
        }

        // Filter by "for" segment used in frontend (buy, rent, lands)
        // This determines which page the property should appear on:
        // - "buy" → BuyView.jsx (all properties with deal_type = "For Sale" or "للبيع")
        // - "rent" → RentView.jsx (all properties with deal_type = "For Rent" or "للإيجار")
        // - "lands" → LandsView.jsx (all properties with property_type = "Land" or "Building", regardless of deal_type)
        $for = $request->query('for');

        if ($for === 'buy') {
            // BuyView: Show all properties for SALE (any property type: Apartment, Villa, Land, Building, etc.)
            // دعم القيم الإنجليزية والعربية
            $query->whereIn('deal_type', ['For Sale', 'للبيع']);
        } elseif ($for === 'rent') {
            // RentView: Show all properties for RENT (any property type: Apartment, Villa, Land, Building, etc.)
            // دعم القيم الإنجليزية والعربية
            $query->whereIn('deal_type', ['For Rent', 'للإيجار']);
        } elseif ($for === 'lands') {
            // LandsView: Show ONLY Land and Building properties (regardless of deal_type - can be For Sale or For Rent)
            // صفحة LandsView تعرض الأراضي والمباني فقط (سواء بيع أو إيجار)
            $query->whereIn('property_type', ['Land', 'Building']);
        }

        // Optional basic filters
        if ($dealType = $request->query('deal_type')) {
            $query->where('deal_type', $dealType);
        }

        if ($propertyType = $request->query('property_type')) {
            $query->where('property_type', $propertyType);
        }

        if ($location = $request->query('location')) {
            $query->where('location', 'like', '%' . $location . '%');
        }

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        $properties = $query->latest()->get();

        // Ensure all image URLs are full URLs and views is always present
        $properties->transform(function ($property) {
            if ($property->main_image_url && !str_starts_with($property->main_image_url, 'http')) {
                $property->main_image_url = rtrim(env('FRONTEND_URLS', config('app.url')), '/') . '/storage/' . ltrim($property->main_image_url, '/');
            }
            if ($property->images && is_array($property->images)) {
                $property->images = array_map(function ($url) {
                    if ($url && !str_starts_with($url, 'http')) {
                        return rtrim(env('FRONTEND_URLS', config('app.url')), '/') . '/storage/' . ltrim($url, '/');
                    }
                    return $url;
                }, $property->images);
            }
            // Ensure views is always a number (default to 0 if not set or column doesn't exist)
            if (!isset($property->views) || $property->views === null) {
                $property->views = 0;
            } else {
                $property->views = (int) $property->views;
            }

            return $property;
        });

        return response()->json([
            'properties' => $properties,
        ]);
    }

    /**
     * Show a single property.
     */
    public function show(Property $property): JsonResponse
    {
        try {
            if (! $property->is_active) {
                abort(404);
            }

            // Increment views count when property is viewed
            try {
                // Try to check if column exists
                $hasViewsColumn = false;
                try {
                    $hasViewsColumn = Schema::hasColumn('properties', 'views');
                } catch (\Exception $schemaError) {
                    // Column check failed, continue
                }

                // Try to increment views - if column doesn't exist, this will fail gracefully
                if ($hasViewsColumn || $property->getConnection()->getSchemaBuilder()->hasColumn('properties', 'views')) {
                    // Use DB::table to ensure increment works directly on database
                    DB::table('properties')
                        ->where('id', $property->id)
                        ->increment('views', 1);

                    // Refresh the model to get updated value
                    $property->refresh();
                }
            } catch (\Exception $e) {
                // If views column doesn't exist or increment fails, continue without incrementing
            }

            // Ensure all image URLs are full URLs
            $appUrl = rtrim(env('FRONTEND_URLS', config('app.url')), '/');

            if ($property->main_image_url) {
                $mainImageUrl = $property->main_image_url;
                if (!str_starts_with($mainImageUrl, 'http://') && !str_starts_with($mainImageUrl, 'https://')) {
                    $property->main_image_url = $appUrl . '/storage/' . ltrim($mainImageUrl, '/');
                }
            }

            if ($property->images) {
                if (is_string($property->images)) {
                    // If images is a JSON string, decode it
                    $decoded = json_decode($property->images, true);
                    if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                        $property->images = $decoded;
                    } else {
                        $property->images = [];
                    }
                }

                if (is_array($property->images)) {
                    $property->images = array_filter(array_map(function ($url) use ($appUrl) {
                        if (!$url) {
                            return null;
                        }
                        if (!str_starts_with($url, 'http://') && !str_starts_with($url, 'https://')) {
                            return $appUrl . '/storage/' . ltrim($url, '/');
                        }
                        return $url;
                    }, $property->images));
                } else {
                    $property->images = [];
                }
            } else {
                $property->images = [];
            }

            // Refresh to get updated views count
            $property->refresh();

            return response()->json([
                'property' => $property,
            ]);
        } catch (\Exception $e) {
            Log::error('Error in PropertyController@show: ' . $e->getMessage(), [
                'property_id' => $property->id ?? null,
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'error' => 'Failed to load property details.',
                'message' => config('app.debug') ? $e->getMessage() : 'An error occurred while loading the property.',
            ], 500);
        }
    }

    /**
     * Store a new property.
     */
    public function store(Request $request): JsonResponse
    {
        // Convert string booleans to actual booleans before validation
        $request->merge([
            'is_featured' => filter_var($request->input('is_featured'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false,
            'is_active' => filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? true,
            'is_rented' => filter_var($request->input('is_rented'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false,
            'is_sold' => filter_var($request->input('is_sold'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false,
            'has_offer' => filter_var($request->input('has_offer'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false,
        ]);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'property_type' => ['nullable', 'string', 'max:255'],
            'deal_type' => ['required', 'string', 'in:For Sale,For Rent,للبيع,للإيجار'],
            'listing_type' => ['nullable', 'string', 'in:primary,resale'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'in:USD,EUR,GBP,EGP'],
            'area' => ['nullable', 'integer', 'min:0'],
            'bedrooms' => ['nullable', 'integer', 'min:0'],
            'bathrooms' => ['nullable', 'integer', 'min:0'],
            'garage' => ['nullable', 'integer', 'min:0'],
            'district' => ['nullable', 'string', 'max:255'],
            'location' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:500'],
            'badge' => ['nullable', 'string', 'max:100'],
            'features' => ['nullable', 'array'],
            'features.*' => ['string', 'max:255'],
            'is_featured' => ['boolean'],
            'is_active' => ['boolean'],
            'floor' => ['nullable', 'string', 'max:100'],
            'view_category' => ['nullable', 'string', 'max:100'],
            'delivery_date' => ['nullable', 'string', 'max:100'],
            'contract_type' => ['nullable', 'string', 'max:100'],
            'project_name' => ['nullable', 'string', 'max:255'],
            'down_payment_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'installment_years_max' => ['nullable', 'integer', 'min:0', 'max:30'],
            'cash_discount_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'video_url' => ['nullable', 'string', 'max:500'],
            'map_embed_url' => ['nullable', 'string'],
            'booking_url' => ['nullable', 'string', 'max:500'],
            'is_rented' => ['nullable', 'boolean'],
            'is_sold' => ['nullable', 'boolean'],
            'has_offer' => ['nullable', 'boolean'],

            // Images: separate main image and gallery images
            'main_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:102400'], // 10MB
            'gallery_images' => ['nullable', 'array'],
            'gallery_images.*' => ['image', 'mimes:jpg,jpeg,png', 'max:102400'],
        ]);

        $user = $request->user();

        // Only admin or agent can create properties
        if (! $user || (! $user->hasRole('admin') && ! $user->hasRole('agent'))) {
            abort(403, 'Only admins and agents can create properties.');
        }

        // Handle main image upload (single)
        $mainImageUrl = null;
        if ($request->hasFile('main_image')) {
            $path = $request->file('main_image')->store('properties/main', 'uploads');
            // Generate full URL using frontend domain (where storage folder is accessible)
            $frontendUrl = env('FRONTEND_URLS', config('app.url'));
            $mainImageUrl = rtrim($frontendUrl, '/') . '/storage/' . $path;
        }

        // Handle gallery images upload (multiple)
        $gallery = [];
        if ($request->hasFile('gallery_images')) {
            $frontendUrl = env('FRONTEND_URLS', config('app.url'));
            foreach ($request->file('gallery_images') as $image) {
                $path = $image->store('properties/gallery', 'uploads');
                // Generate full URL using frontend domain (where storage folder is accessible)
                $gallery[] = rtrim($frontendUrl, '/') . '/storage/' . $path;
            }
        }

        // Remove file-only keys from $data so they are not mass-assigned
        unset($data['main_image'], $data['gallery_images']);

        // Ensure features is an array (even if empty)
        if (!isset($data['features']) || !is_array($data['features'])) {
            $data['features'] = [];
        }

        $property = Property::create([
            'user_id' => $user->id,
            'main_image_url' => $mainImageUrl,
            'images' => $gallery,
            ...$data,
        ]);

        // Refresh to get the property with all relationships
        $property->refresh();

        // URLs are already full URLs from above, but ensure they're correct
        if ($property->main_image_url && !str_starts_with($property->main_image_url, 'http')) {
            $property->main_image_url = rtrim(env('FRONTEND_URLS', config('app.url')), '/') . '/storage/' . ltrim($property->main_image_url, '/');
        }
        if ($property->images && is_array($property->images)) {
            $property->images = array_map(function ($url) {
                if ($url && !str_starts_with($url, 'http')) {
                    return rtrim(env('FRONTEND_URLS', config('app.url')), '/') . '/storage/' . ltrim($url, '/');
                }
                return $url;
            }, $property->images);
        }

        return response()->json([
            'message' => 'Property created successfully.',
            'property' => $property,
        ], 201);
    }

    /**
     * Update an existing property.
     */
    public function update(Request $request, Property $property): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'property_type' => ['nullable', 'string', 'max:255'],
            'deal_type' => ['required', 'string', 'in:For Sale,For Rent,للبيع,للإيجار'],
            'listing_type' => ['nullable', 'string', 'in:primary,resale'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'in:USD,EUR,GBP,EGP'],
            'area' => ['nullable', 'integer', 'min:0'],
            'bedrooms' => ['nullable', 'integer', 'min:0'],
            'bathrooms' => ['nullable', 'integer', 'min:0'],
            'garage' => ['nullable', 'integer', 'min:0'],
            'district' => ['nullable', 'string', 'max:255'],
            'location' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:500'],
            'badge' => ['nullable', 'string', 'max:100'],
            'features' => ['nullable', 'array'],
            'features.*' => ['string', 'max:255'],
            'is_featured' => ['nullable', 'boolean'],
            'is_active' => ['nullable', 'boolean'],
            'floor' => ['nullable', 'string', 'max:100'],
            'view_category' => ['nullable', 'string', 'max:100'],
            'delivery_date' => ['nullable', 'string', 'max:100'],
            'contract_type' => ['nullable', 'string', 'max:100'],
            'project_name' => ['nullable', 'string', 'max:255'],
            'down_payment_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'installment_years_max' => ['nullable', 'integer', 'min:0', 'max:30'],
            'cash_discount_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'video_url' => ['nullable', 'string', 'max:500'],
            'map_embed_url' => ['nullable', 'string'],
            'booking_url' => ['nullable', 'string', 'max:500'],
            'is_rented' => ['nullable', 'boolean'],
            'is_sold' => ['nullable', 'boolean'],
            'has_offer' => ['nullable', 'boolean'],
            'main_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:102400'],
            'gallery_images' => ['nullable', 'array'],
            'gallery_images.*' => ['image', 'mimes:jpg,jpeg,png', 'max:102400'],
            'existing_images' => ['nullable', 'array'],
            'existing_images.*' => ['string'],
            'remove_main_image' => ['nullable', 'boolean'],
        ]);

        // Convert string booleans to actual booleans for FormData
        if (isset($data['is_featured'])) {
            $data['is_featured'] = filter_var($data['is_featured'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false;
        }
        if (isset($data['is_active'])) {
            $data['is_active'] = filter_var($data['is_active'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? true;
        }
        if (isset($data['is_rented'])) {
            $data['is_rented'] = filter_var($data['is_rented'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false;
        }
        if (isset($data['is_sold'])) {
            $data['is_sold'] = filter_var($data['is_sold'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false;
        }
        if (isset($data['has_offer'])) {
            $data['has_offer'] = filter_var($data['has_offer'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false;
        }

        // Handle empty string values - convert to null for nullable fields
        $nullableFields = ['description', 'short_description', 'property_type', 'price', 'area', 'bedrooms', 'bathrooms', 'garage', 'city', 'address', 'badge'];
        foreach ($nullableFields as $field) {
            if (isset($data[$field]) && $data[$field] === '') {
                $data[$field] = null;
            }
        }

        $user = $request->user();

        // Only admin or the owner (agent) can update
        if (! $user || (! $user->hasRole('admin') && $property->user_id !== $user->id)) {
            abort(403, 'You are not allowed to modify this property.');
        }

        // Handle main image replacement if a new one is uploaded
        if ($request->hasFile('main_image')) {
            $path = $request->file('main_image')->store('properties/main', 'uploads');
            // Generate full URL using frontend domain (where storage folder is accessible)
            $frontendUrl = env('FRONTEND_URLS', config('app.url'));
            $data['main_image_url'] = rtrim($frontendUrl, '/') . '/storage/' . $path;
        }

        // Allow explicitly removing current main image (when no new one is uploaded)
        if (! $request->hasFile('main_image') && $request->boolean('remove_main_image')) {
            $data['main_image_url'] = null;
        }

        // Start with existing images that the frontend kept
        $existing = $request->input('existing_images', []);
        if (! is_array($existing)) {
            $existing = [];
        }

        $gallery = $existing;

        // Append any newly uploaded gallery images
        if ($request->hasFile('gallery_images')) {
            $frontendUrl = env('FRONTEND_URLS', config('app.url'));
            foreach ($request->file('gallery_images') as $image) {
                $path = $image->store('properties/gallery', 'uploads');
                // Generate full URL using frontend domain (where storage folder is accessible)
                $gallery[] = rtrim($frontendUrl, '/') . '/storage/' . $path;
            }
        }

        // Always persist gallery images (even if empty array to clear them)
        $data['images'] = $gallery;

        unset($data['main_image'], $data['gallery_images']);

        $property->update($data);
        $property->refresh(); // Reload to get updated attributes

        // Ensure image URLs are full URLs in response
        if ($property->main_image_url && !str_starts_with($property->main_image_url, 'http')) {
            $property->main_image_url = rtrim(env('FRONTEND_URLS', config('app.url')), '/') . '/storage/' . ltrim($property->main_image_url, '/');
        }
        if ($property->images && is_array($property->images)) {
            $property->images = array_map(function ($url) {
                if ($url && !str_starts_with($url, 'http')) {
                    return rtrim(env('FRONTEND_URLS', config('app.url')), '/') . '/storage/' . ltrim($url, '/');
                }
                return $url;
            }, $property->images);
        }

        return response()->json([
            'message' => 'Property updated successfully.',
            'property' => $property,
        ]);
    }

    /**
     * Delete a property.
     */
    public function destroy(Property $property): JsonResponse
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();

        if (! $user || (! $user->hasRole('admin') && $property->user_id !== $user->id)) {
            abort(403, 'You are not allowed to delete this property.');
        }

        // Soft delete (move to "deleted properties")
        $property->delete();

        return response()->json([
            'message' => 'Property deleted successfully.',
        ]);
    }

    /**
     * List soft-deleted properties.
     */
    public function deleted(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user || (! $user->hasRole('admin') && ! $user->hasRole('agent'))) {
            abort(403, 'You are not allowed to access deleted properties.');
        }

        $query = Property::onlyTrashed();

        if ($user->hasRole('agent')) {
            $query->where('user_id', $user->id);
        }

        $properties = $query->latest('deleted_at')->get();

        return response()->json([
            'properties' => $properties,
        ]);
    }

    /**
     * Restore a soft-deleted property.
     */
    public function restore(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $property = Property::onlyTrashed()->findOrFail($id);

        if (! $user || (! $user->hasRole('admin') && $property->user_id !== $user->id)) {
            abort(403, 'You are not allowed to restore this property.');
        }

        $property->restore();

        return response()->json([
            'message' => 'Property restored successfully.',
        ]);
    }

    /**
     * Permanently delete a soft-deleted property.
     */
    public function forceDestroy(Request $request, int $id): JsonResponse
    {
        /** @var \App\Models\User|null $user */
        $user = $request->user();
        $property = Property::onlyTrashed()->findOrFail($id);

        if (! $user || (! $user->hasRole('admin') && $property->user_id !== $user->id)) {
            abort(403, 'You are not allowed to permanently delete this property.');
        }

        $property->forceDelete();

        return response()->json([
            'message' => 'Property permanently deleted.',
        ]);
    }
}
