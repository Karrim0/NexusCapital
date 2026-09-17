<?php

namespace App\Http\Controllers;

use App\Models\HomeContent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Support\ContentMerge;

class BuyContentController extends Controller
{
    /**
     * Reuses the same generic "home_contents" key/JSON table as the
     * homepage editor (HomeContentController) — this record just lives
     * under a different key ("buy").
     */
    protected const KEY = 'buy';

    public function show(Request $request): JsonResponse
    {
        $record = HomeContent::firstWhere('key', self::KEY);
        $data = $record?->data ?: $this->defaultContent();
        $data = ContentMerge::merge($this->defaultContent(), $data);

        $bg = $data['hero']['background_image'] ?? null;
        $data['hero']['background_image'] = $this->resolveUrl($bg);
        $consultBg = $data['consultation_section']['background_image'] ?? null;
        $data['consultation_section']['background_image'] = $this->resolveUrl($consultBg);

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
            abort(403, 'Only admins can edit the buy page content.');
        }

        $request->validate([
            'data' => ['required', 'string'],
            'hero_background' => ['nullable', 'image', 'max:8192'],
            'consultation_background' => ['nullable', 'image', 'max:8192'],
        ]);

        $incoming = json_decode($request->input('data'), true);
        if (!is_array($incoming)) {
            return response()->json(['message' => 'Invalid content payload.'], 422);
        }

        $record = HomeContent::firstOrNew(['key' => self::KEY]);
        $current = $record->data ?: $this->defaultContent();
        $merged = ContentMerge::merge3($this->defaultContent(), $current, $incoming);

        if ($request->hasFile('hero_background')) {
            $path = $request->file('hero_background')->store('buy/hero', 'uploads');
            $merged['hero']['background_image'] = $path;
        }

        if ($request->hasFile('consultation_background')) {
            $path = $request->file('consultation_background')->store('buy/consultation', 'uploads');
            $merged['consultation_section']['background_image'] = $path;
        }

        try {
            $record->key = self::KEY;
            $record->data = $merged;
            $record->save();
        } catch (\Exception $e) {
            Log::error('BuyContentController@update: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to save buy page content.'], 500);
        }

        $out = $record->data;
        $out['hero']['background_image'] = $this->resolveUrl($out['hero']['background_image'] ?? null);
        $out['consultation_section']['background_image'] = $this->resolveUrl($out['consultation_section']['background_image'] ?? null);

        return response()->json(['message' => 'Buy page content updated.', 'data' => $out]);
    }

    protected function resolveUrl(?string $path): ?string
    {
        if (!$path) return null;
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }
        return rtrim(env('FRONTEND_URLS', config('app.url')), '/') . '/storage/' . ltrim($path, '/');
    }

    /**
     * Default content for the Buy page, styled after the Hurghadians
     * Property reference layout but rebranded to Nexus Capital.
     */
    protected function defaultContent(): array
    {
        return [
            'hero' => [
                'background_image' => null,
                'eyebrow'       => 'HURGHADA · SAHL HASHEESH · PROPERTY COMPARISON',
                'badge'         => 'NEXUS CAPITAL',
                'title_prefix'  => 'Compare Hurghada and Sahl Hasheesh homes with',
                'title_highlight' => 'Nexus Capital',
                'subtitle'      => 'A focused buyer service for Nexus Capital listings: search homes, compare prices and sizes, review views and move-in status, and send a clear WhatsApp brief to our Hurghada team.',
                'primary_cta'   => 'SEARCH NEXUS CAPITAL LISTINGS',
                'secondary_cta' => 'SEND BUYER BRIEF',
                'quick_filters' => ['Hurghada listings', 'Sahl Hasheesh listings', 'Price and site comparison', 'WhatsApp advisor support'],
                'stats' => [
                    ['value' => '233', 'label' => 'Properties'],
                    ['value' => 'Sort', 'label' => 'By price or size'],
                    ['value' => '4', 'label' => 'Compare at once'],
                ],
            ],

            'brief_panel' => [
                'title'       => 'Nexus Capital Buyer Brief',
                'subtitle'    => 'Send your exact requirements and receive a clear comparison of matching Nexus Capital listings.',
                'eyebrow'     => 'NEXUS CAPITAL',
                'criteria_title' => 'Comparison criteria',
                'criteria_description' => 'Compare properties by area, size, price, move-in status, view, and payment plan.',
                'criteria_options' => ['Price', 'Size', 'View'],
                'helper_note' => 'Recommended next step: choose Hurghada or Sahl Hasheesh and a property type, then request the latest availability, floor plans, payment options, and viewing options.',
                'submit_whatsapp_label' => 'SEND ON WHATSAPP',
                'submit_email_label'    => 'SEND EMAIL BRIEF',
                'form_disclaimer' => 'The email brief is sent directly to info@nexuscapital.com. Never include payment details or sensitive documents.',
                'area_options'    => ['Hurghada', 'Sahl Hasheesh', 'Al Ahyaa', 'El Gouna', 'Makadi', 'Soma Bay'],
                'home_type_options' => ['Apartment', 'Villa', 'Duplex', 'Studio', 'Loft', 'Land'],
                'budget_options'  => ['Up to €50,000', '€50,000 - €100,000', '€100,000 - €250,000', '€250,000+'],
                'purpose_options' => ['Holiday home', 'Investment', 'Relocation', 'Rental income'],
            ],

            'feature_strip' => [
                ['title' => 'Searchable catalogue', 'description' => 'Filter by location, property type, bedroom count, readiness, view, and budget.'],
                ['title' => 'Developer and resale properties', 'description' => 'Compare developer units, ready-to-move homes, studios, apartments, lofts, garden suites, and villas.'],
                ['title' => 'Area guidance', 'description' => 'Understand the lifestyle differences between Hurghada and Sahl Hasheesh before making a reservation.'],
                ['title' => 'Trust-first buying', 'description' => 'Request updated price lists, contract details, viewing options, and after-sales support.'],
            ],

            'listing_section' => [
                'eyebrow'     => 'NEXUS CAPITAL LISTINGS',
                'title'       => 'Compare Hurghada and Sahl Hasheesh homes for sale',
                'description' => 'Explore Nexus Capital listings with clear prices, sizes, move-in status, views, and direct access to a WhatsApp property advisor.',
                'search_placeholder' => 'Search by project, area, view, size, or title',
                'location_all_label' => 'All locations',
                'type_all_label'     => 'All types',
                'budget_all_label'   => 'Any budget',
                'sort_options'       => ['Newest first', 'Price: low to high', 'Price: high to low', 'Size: large to small'],
                'quick_filters'      => ['ALL', 'READY TO MOVE', 'DEVELOPER UNITS', 'LOFTS', 'SEA VIEW', 'POOL VIEW', 'UNDER €50K', '1 BEDROOM', '2 BEDROOMS'],
                'reset_filters_label' => 'RESET FILTERS',
                'results_template'   => 'Showing {shown} of {total} matching properties',
                'view_listing_label' => 'VIEW LISTING',
                'whatsapp_label'     => 'WHATSAPP',
                'compare_label'      => 'Add to comparison',
                'empty_state'        => 'No properties match these filters yet. Try widening your search.',
            ],

            'journey_section' => [
                'eyebrow'     => 'BUYER JOURNEY',
                'title_prefix' => 'From search to reservation with',
                'title_highlight' => 'fewer unknowns',
                'description' => 'Buying abroad is easier when you understand the process, required documents, payment-plan terms, and after-sales support.',
                'steps' => [
                    ['title' => 'Shortlist homes', 'description' => 'Filter by budget, location, type, view, size, readiness, and payment-plan preference.'],
                    ['title' => 'Request documents', 'description' => 'Ask for the latest prices, unit availability, floor plans, developer details, maintenance fees, and contract procedures.'],
                    ['title' => 'View remotely or in person', 'description' => 'Book video tours, private viewings, area guidance, and side-by-side project comparisons.'],
                    ['title' => 'Reserve with support', 'description' => 'Coordinate reservation, payments, handover, furnishing, rental readiness, and long-term ownership support.'],
                ],
                'calculator_title' => 'Payment-plan estimate',
                'calculator_description' => 'Use this calculator to estimate your payment plan. Confirm the final figures with a property advisor.',
                'price_options' => ['Estimated price: €50,000', 'Estimated price: €75,000', 'Estimated price: €100,000', 'Estimated price: €150,000', 'Estimated price: €250,000'],
                'down_payment_options' => ['10% down payment', '15% down payment', '20% down payment', '25% down payment', '35% down payment'],
                'duration_options' => ['Instalments over 1 year', 'Instalments over 2 years', 'Instalments over 3 years', 'Instalments over 4 years', 'Instalments over 5 years'],
                'calculator_disclaimer' => 'Estimate only. This does not include maintenance fees, taxes, exchange-rate differences, furnishing, or contract fees.',
                'checklist_title' => 'What to ask before making a reservation',
                'checklist_items' => [
                    ['label' => 'Latest unit availability', 'tag' => 'Required'],
                    ['label' => 'Down payment and instalment plan', 'tag' => 'Compare'],
                    ['label' => 'Delivery date or ready-to-move status', 'tag' => 'Verify'],
                    ['label' => 'Maintenance and finishing level', 'tag' => 'Confirm'],
                ],
            ],

            'consultation_section' => [
                'background_image' => null,
                'eyebrow'     => 'NEXUS CAPITAL BUYER CONSULTATION',
                'title'       => 'Save time. Ask Nexus Capital for homes that match your exact requirements.',
                'description' => 'Instead of scrolling through many options, send your requirements to Nexus Capital and receive a curated list with current prices, availability, floor plans, and viewing options.',
                'bullets' => [
                    'Budget and payment-plan matching',
                    'Area comparison for Hurghada and Sahl Hasheesh',
                    'Remote video tour coordination',
                    'Reservation and after-sales guidance',
                ],
                'form_title'    => 'Request buying advice',
                'form_description' => 'Complete the form to create a WhatsApp message with your requirements.',
                'timeline_options' => ['As soon as possible', 'Within 3 months', 'Within 6 months', 'Just researching'],
                'budget_options'  => ['Up to €50,000', '€50,000 - €100,000', '€100,000 - €250,000', '€250,000+'],
                'submit_label'  => 'SEND CONSULTATION REQUEST',
                'form_disclaimer' => 'Your details are used only to respond to your property enquiry.',
            ],

            'cta_section' => [
                'blog_title'       => 'Research with Nexus Capital before buying in Hurghada',
                'blog_description' => 'Explore our blog for Hurghada buyer guides, Sahl Hasheesh comparisons, payment-plan guides, investment insights, and project updates.',
                'blog_cta_label'   => 'VISIT THE PROPERTY BLOG',
                'blog_url'         => '/blog',
                'consult_title'       => 'Ready to own a property on the Red Sea?',
                'consult_description' => 'Speak with Nexus Capital and receive a curated shortlist based on your budget, preferred area, and buying goals.',
                'consult_cta_label'   => 'BOOK A WHATSAPP CONSULTATION',
            ],
        ];
    }
}
