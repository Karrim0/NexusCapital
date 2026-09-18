<?php

namespace App\Http\Controllers;

use App\Models\HomeContent;
use App\Services\AutoTranslationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Support\ContentMerge;

class FurnitureContentController extends Controller
{
    protected const KEY = 'furniture_services';

    public function show(Request $request): JsonResponse
    {
        $record = HomeContent::firstWhere('key', self::KEY);
        $data = $record?->data ?: $this->defaultContent();
        $data = ContentMerge::merge($this->defaultContent(), $data);
        $data = $record?->localize($request->query('lang', 'en'), $data) ?? $data;

        return response()->json([
            'data'       => $data,
            'updated_at' => $record?->updated_at,
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user || !$user->hasRole('admin')) {
            abort(403, 'Only admins can edit the furniture & furnishing page content.');
        }

        $request->validate([
            'data'            => ['required', 'string'],
            'package_photo_0' => ['nullable', 'image', 'max:8192'],
            'package_photo_1' => ['nullable', 'image', 'max:8192'],
            'package_photo_2' => ['nullable', 'image', 'max:8192'],
        ]);

        $incoming = json_decode($request->input('data'), true);
        if (!is_array($incoming)) {
            return response()->json(['message' => 'Invalid content payload.'], 422);
        }

        $record = HomeContent::firstOrNew(['key' => self::KEY]);
        $current = $record->data ?: $this->defaultContent();
        $merged = ContentMerge::merge3($this->defaultContent(), $current, $incoming);

        foreach ([0, 1, 2] as $i) {
            if ($request->hasFile("package_photo_{$i}")) {
                $path = $request->file("package_photo_{$i}")->store('furniture/packages', 'uploads');
                $merged['packages'][$i]['image'] = rtrim(env('FRONTEND_URLS', config('app.url')), '/') . '/storage/' . ltrim($path, '/');
            }
        }

        try {
            $record->key = self::KEY;
            $record->data = $merged;
            $record->translations = AutoTranslationService::translateChangedIntoExisting(
                $current,
                $merged,
                $record->translations
            );
            $record->save();
        } catch (\Exception $e) {
            Log::error('FurnitureContentController@update: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to save furniture & furnishing page content.'], 500);
        }

        return response()->json(['message' => 'Furniture & furnishing page content updated.', 'data' => $record->data]);
    }

    protected function defaultContent(): array
    {
        return [
            'hero' => [
                'eyebrow'     => 'Furniture & Furnishing',
                'title'       => 'Furnish Your Property, Move-In Ready',
                'description' => 'From a single room to a fully ready-to-move apartment, our furnishing team helps owners and investors furnish Red Sea properties quickly, affordably, and to a standard that suits guests, tenants, or your own family.',
            ],

            'service_types' => [
                ['title' => 'Full Apartment Furnishing', 'description' => ''],
                ['title' => 'Bedroom Furniture', 'description' => ''],
                ['title' => 'Living Room & Reception', 'description' => ''],
                ['title' => 'Kitchen & Appliances', 'description' => ''],
                ['title' => 'Bathroom Accessories', 'description' => ''],
                ['title' => 'Lighting', 'description' => ''],
                ['title' => 'Curtains & Decoration', 'description' => ''],
                ['title' => 'TV & Electrical Appliances', 'description' => ''],
                ['title' => 'Complete Ready-to-Move Packages', 'description' => ''],
            ],

            'packages' => [
                [
                    'name'        => 'Basic',
                    'image'       => '[BASIC PACKAGE IMAGE]',
                    'description' => 'Essential furniture and appliances to make a property comfortably livable.',
                    'included'    => ["Bedroom set", "Living room seating", "Basic kitchen appliances", "Bathroom essentials"],
                    'price'       => 'Request a Quote',
                ],
                [
                    'name'        => 'Premium',
                    'image'       => '[PREMIUM PACKAGE IMAGE]',
                    'description' => 'A fuller furnishing package with better finishes, ideal for rental-ready units.',
                    'included'    => ["Full bedroom & living room furniture", "Kitchen & appliances", "Lighting package", "Curtains & decoration"],
                    'price'       => 'Request a Quote',
                ],
                [
                    'name'        => 'Luxury',
                    'image'       => '[LUXURY PACKAGE IMAGE]',
                    'description' => 'A complete, high-end, ready-to-move package for owners who want a premium finish.',
                    'included'    => ["Complete furniture across all rooms", "Premium appliances & electronics", "Full lighting & decoration", "Move-in ready styling"],
                    'price'       => 'Request a Quote',
                ],
            ],

            'cta' => [
                'title'       => 'Furnish Your Property With Us',
                'description' => 'Tell us about your property and preferred package, and our team will get back to you with a tailored quote.',
                'cta_label'   => 'Request a Quote',
            ],

            'disclaimer' => 'Furnishing packages and pricing are confirmed individually based on property size, location, and selected items. Images are for illustration and may vary from the final delivered furniture.',
        ];
    }
}
