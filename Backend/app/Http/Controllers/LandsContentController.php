<?php

namespace App\Http\Controllers;

use App\Models\HomeContent;
use App\Services\AutoTranslationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Support\ContentMerge;

class LandsContentController extends Controller
{
    protected const KEY = 'lands';

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
            abort(403, 'Only admins can edit the lands & buildings page content.');
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
            Log::error('LandsContentController@update: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to save lands & buildings page content.'], 500);
        }

        return response()->json(['message' => 'Lands & buildings page content updated.', 'data' => $record->data]);
    }

    protected function defaultContent(): array
    {
        return [
            'hero' => [
                'eyebrow'       => 'HURGHADA · SAHL HASHEESH · LAND & BUILDING OPPORTUNITIES',
                'badge'         => 'NEXUS CAPITAL',
                'title_prefix'  => 'Land and buildings on the Red Sea with',
                'title_highlight' => 'Nexus Capital',
                'subtitle'      => 'A focused service for land plots, standalone buildings, and commercial units: compare zoning, plot size, and development potential, and confirm ownership steps with our Hurghada team on WhatsApp.',
                'primary_cta'   => 'SEARCH LAND & BUILDINGS',
                'secondary_cta' => 'SEND LAND BRIEF',
                'quick_filters' => ['Land plots', 'Standalone buildings', 'Commercial units', 'WhatsApp advisor support'],
                'stats' => [
                    ['value' => '—', 'label' => 'Land & building listings'],
                    ['value' => 'Sort', 'label' => 'By price or size'],
                    ['value' => '4', 'label' => 'Compare at once'],
                ],
            ],

            'brief_panel' => [
                'title'       => 'Nexus Capital Land Brief',
                'subtitle'    => 'Send your target area, plot size, and use case and receive matching land and building opportunities.',
                'eyebrow'     => 'NEXUS CAPITAL',
                'criteria_title' => 'Comparison criteria',
                'criteria_description' => 'Compare land and buildings by area, plot size, price, zoning, and ownership documentation.',
                'criteria_options' => ['Price', 'Plot size', 'Zoning'],
                'helper_note' => 'Recommended next step: choose an area and intended use (residential, commercial, or investment), then request the title documents, boundaries, and available plans.',
                'submit_whatsapp_label' => 'SEND ON WHATSAPP',
                'submit_email_label'    => 'SEND EMAIL BRIEF',
                'form_disclaimer' => 'The email brief is sent directly to info@nexuscapital.com. Never include payment details or sensitive documents.',
                'area_options'    => ['Hurghada', 'Sahl Hasheesh', 'Al Ahyaa', 'El Gouna', 'Makadi', 'Soma Bay'],
                'home_type_options' => ['Residential land', 'Commercial land', 'Standalone building', 'Commercial unit'],
                'budget_options'  => ['Up to €50,000', '€50,000 - €150,000', '€150,000 - €350,000', '€350,000+'],
                'purpose_options' => ['Personal development', 'Commercial development', 'Long-term land investment', 'Resale opportunity'],
            ],

            'feature_strip' => [
                ['title' => 'Verified land & building listings', 'description' => 'Filter by location, plot size, zoning, and budget.'],
                ['title' => 'Residential and commercial options', 'description' => 'Compare land plots, standalone buildings, and commercial units.'],
                ['title' => 'Area guidance', 'description' => 'Understand zoning, access, and development potential across Red Sea areas.'],
                ['title' => 'Trust-first ownership', 'description' => 'Request title documents, boundaries, registration status, and next steps.'],
            ],

            'listing_section' => [
                'eyebrow'     => 'NEXUS CAPITAL LAND & BUILDINGS',
                'title'       => 'Compare Red Sea land and building opportunities',
                'description' => 'Explore Nexus Capital land and building listings with clear prices, plot sizes, and direct access to a WhatsApp property advisor.',
                'search_placeholder' => 'Search by area, plot size, or title',
                'location_all_label' => 'All locations',
                'type_all_label'     => 'All types',
                'budget_all_label'   => 'Any budget',
                'sort_options'       => ['Newest first', 'Price: low to high', 'Price: high to low'],
                'quick_filters'      => ['ALL', 'LAND', 'BUILDINGS', 'COMMERCIAL', 'BEACHFRONT', 'UNDER €50K', '€50K-€150K', '€150K+'],
                'reset_filters_label' => 'RESET FILTERS',
                'results_template'   => 'Showing {shown} of {total} matching listings',
                'view_listing_label' => 'VIEW LISTING',
                'whatsapp_label'     => 'WHATSAPP',
                'compare_label'      => 'Add to compare request',
                'empty_state'        => 'No land or buildings match these filters yet. Try widening your search.',
            ],
        ];
    }
}
