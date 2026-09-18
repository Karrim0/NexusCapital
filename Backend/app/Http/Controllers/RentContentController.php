<?php

namespace App\Http\Controllers;

use App\Models\HomeContent;
use App\Services\AutoTranslationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Support\ContentMerge;

class RentContentController extends Controller
{
    protected const KEY = 'rent';

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
            abort(403, 'Only admins can edit the rent page content.');
        }

        $request->validate([
            'data' => ['required', 'string'],
        ]);

        $incoming = json_decode($request->input('data'), true);
        if (!is_array($incoming)) {
            return response()->json(['message' => 'Invalid content payload.'], 422);
        }

        $record = HomeContent::firstOrNew(['key' => self::KEY]);
        $current = $record->data ?: $this->defaultContent();
        $merged = ContentMerge::merge3($this->defaultContent(), $current, $incoming);

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
            Log::error('RentContentController@update: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to save rent page content.'], 500);
        }

        return response()->json(['message' => 'Rent page content updated.', 'data' => $record->data]);
    }

    protected function defaultContent(): array
    {
        return [
            'hero' => [
                'eyebrow'       => 'HURGHADA · SAHL HASHEESH · SHORT & LONG-TERM RENTALS',
                'badge'         => 'NEXUS CAPITAL',
                'title_prefix'  => 'Rent a home on the Red Sea with',
                'title_highlight' => 'Nexus Capital',
                'subtitle'      => 'A focused rental service for holiday stays, seasonal escapes, and long-term living: search furnished homes, compare monthly and nightly rates, and confirm availability with our Hurghada team on WhatsApp.',
                'primary_cta'   => 'SEARCH RENTAL LISTINGS',
                'secondary_cta' => 'SEND RENTAL BRIEF',
                'quick_filters' => ['Furnished homes', 'Short-term stays', 'Long-term leases', 'WhatsApp advisor support'],
                'stats' => [
                    ['value' => '—', 'label' => 'Rental listings'],
                    ['value' => 'Sort', 'label' => 'By price or size'],
                    ['value' => '4', 'label' => 'Compare at once'],
                ],
            ],

            'brief_panel' => [
                'title'       => 'Nexus Capital Rental Brief',
                'subtitle'    => 'Send your dates, budget, and preferences and receive a shortlist of matching rentals.',
                'eyebrow'     => 'NEXUS CAPITAL',
                'criteria_title' => 'Rental preferences',
                'criteria_description' => 'Compare rentals by area, size, monthly or nightly rate, furnishing, and lease length.',
                'criteria_options' => ['Monthly', 'Nightly', 'Furnishing'],
                'helper_note' => 'Recommended next step: choose an area and lease length, then request current availability, photos, and viewing options.',
                'submit_whatsapp_label' => 'SEND ON WHATSAPP',
                'submit_email_label'    => 'SEND EMAIL BRIEF',
                'form_disclaimer' => 'The email brief is sent directly to info@nexuscapital.com. Never include payment details or sensitive documents.',
                'area_options'    => ['Hurghada', 'Sahl Hasheesh', 'Al Ahyaa', 'El Gouna', 'Makadi', 'Soma Bay'],
                'home_type_options' => ['Apartment', 'Villa', 'Duplex', 'Studio', 'Chalet'],
                'budget_options'  => ['Up to €500/month', '€500 - €1,000/month', '€1,000 - €2,000/month', '€2,000+/month'],
                'purpose_options' => ['Holiday stay', 'Seasonal / winter rental', 'Long-term relocation', 'Short-term business stay'],
            ],

            'feature_strip' => [
                ['title' => 'Verified rental listings', 'description' => 'Filter by location, property type, bedroom count, furnishing, and budget.'],
                ['title' => 'Short and long-term options', 'description' => 'Compare nightly holiday rentals with monthly and seasonal leases.'],
                ['title' => 'Area guidance', 'description' => 'Understand the lifestyle differences between Hurghada, Sahl Hasheesh, and nearby areas.'],
                ['title' => 'Trust-first renting', 'description' => 'Request updated availability, contract terms, deposit details, and move-in support.'],
            ],

            'listing_section' => [
                'eyebrow'     => 'NEXUS CAPITAL RENTALS',
                'title'       => 'Compare Red Sea homes available for rent',
                'description' => 'Explore Nexus Capital rental listings with clear prices, sizes, furnishing status, and direct access to a WhatsApp property advisor.',
                'search_placeholder' => 'Search by project, area, view, size, or title',
                'location_all_label' => 'All locations',
                'type_all_label'     => 'All types',
                'budget_all_label'   => 'Any budget',
                'sort_options'       => ['Newest first', 'Price: low to high', 'Price: high to low'],
                'quick_filters'      => ['ALL', 'FURNISHED', 'LONG-TERM', 'SHORT-TERM', 'SEA VIEW', 'POOL VIEW', 'UNDER €500', '1 BEDROOM', '2 BEDROOMS'],
                'reset_filters_label' => 'RESET FILTERS',
                'results_template'   => 'Showing {shown} of {total} matching rentals',
                'view_listing_label' => 'VIEW LISTING',
                'whatsapp_label'     => 'WHATSAPP',
                'compare_label'      => 'Add to compare request',
                'empty_state'        => 'No rentals match these filters yet. Try widening your search.',
            ],
        ];
    }
}
