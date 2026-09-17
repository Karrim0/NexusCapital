<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    /**
     * Get authenticated user's favorite properties.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $favorites = $user?->favoriteProperties()
            ->where('is_active', true)
            ->latest()
            ->get() ?? collect();

        return response()->json([
            'favorites' => $favorites,
        ]);
    }

    /**
     * Toggle favorite for a property.
     */
    public function toggle(Request $request, Property $property): JsonResponse
    {
        $user = $request->user();

        $alreadyFavorited = $user->favoriteProperties()
            ->where('property_id', $property->id)
            ->exists();

        if ($alreadyFavorited) {
            $user->favoriteProperties()->detach($property->id);

            return response()->json([
                'status' => 'removed',
                'message' => 'Property removed from favorites.',
            ]);
        }

        $user->favoriteProperties()->attach($property->id);

        return response()->json([
            'status' => 'added',
            'message' => 'Property added to favorites.',
        ]);
    }
}
