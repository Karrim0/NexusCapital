<?php

namespace App\Http\Controllers;

use App\Models\HomeContent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Support\ContentMerge;

class ProjectsContentController extends Controller
{
    protected const KEY = 'projects';

    public function show(Request $request): JsonResponse
    {
        $record = HomeContent::firstWhere('key', self::KEY);
        $data = $record?->data ?: $this->defaultContent();
        $data = ContentMerge::merge($this->defaultContent(), $data);

        $bg = $data['hero']['background_image'] ?? null;
        $data['hero']['background_image'] = $this->resolveUrl($bg);

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
            abort(403, 'Only admins can edit the projects page content.');
        }

        $request->validate([
            'data' => ['required', 'string'],
            'hero_background' => ['nullable', 'image', 'max:8192'],
        ]);

        $incoming = json_decode($request->input('data'), true);
        if (!is_array($incoming)) {
            return response()->json(['message' => 'Invalid content payload.'], 422);
        }

        $record = HomeContent::firstOrNew(['key' => self::KEY]);
        $current = $record->data ?: $this->defaultContent();
        $merged = ContentMerge::merge3($this->defaultContent(), $current, $incoming);

        if ($request->hasFile('hero_background')) {
            $path = $request->file('hero_background')->store('projects/hero', 'uploads');
            $merged['hero']['background_image'] = $path;
        }

        try {
            $record->key = self::KEY;
            $record->data = $merged;
            $record->save();
        } catch (\Exception $e) {
            Log::error('ProjectsContentController@update: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to save projects page content.'], 500);
        }

        $out = $record->data;
        $out['hero']['background_image'] = $this->resolveUrl($out['hero']['background_image'] ?? null);

        return response()->json(['message' => 'Projects page content updated.', 'data' => $out]);
    }

    protected function resolveUrl(?string $path): ?string
    {
        if (!$path) return null;
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }
        return rtrim(env('FRONTEND_URLS', config('app.url')), '/') . '/storage/' . ltrim($path, '/');
    }

    protected function defaultContent(): array
    {
        return [
            'hero' => [
                'background_image' => null,
                'eyebrow'       => 'DEVELOPER PROJECTS · RED SEA INVESTMENT · PAYMENT PLANS',
                'title_prefix'  => 'Explore',
                'title_highlight' => 'Red Sea',
                'title_suffix'  => 'Projects with clear availability steps',
                'subtitle'      => 'A custom project hub for Hurghada, Sahl Hasheesh, Soma Bay, Makadi, and selected Red Sea communities. Filter live project opportunities, compare price ranges, and request brochures, floor plans, payment plans, and delivery updates on WhatsApp.',
                'primary_cta'   => 'BROWSE PROJECTS',
                'secondary_cta' => 'ASK FOR PROJECT SHORTLIST',
                'quick_filters' => ['Project opportunities', 'Developer price lists', 'Floor plans & brochures', 'WhatsApp-first guidance'],
                'stats' => [
                    ['value' => '54', 'label' => 'Projects in live catalogue'],
                    ['value' => '5', 'label' => 'Core Red Sea destinations'],
                    ['value' => '€21k+', 'label' => 'Starting-price range shown'],
                ],
            ],

            'finder_panel' => [
                'title'       => 'Project Finder',
                'subtitle'    => 'Tell us your target area, budget, and buying goal. We will prepare a structured WhatsApp message for our property advisor.',
                'helper_note' => 'Recommended path: shortlist suitable units in your preferred area within your budget, prioritizing your main priority. Ask for updated availability, floor plans, payment plan, delivery date, and reservation terms.',
                'submit_label' => 'CONTINUE ON WHATSAPP',
                'form_disclaimer' => 'WhatsApp opens with your project brief ready. Tap Send there to complete the enquiry. No payment data is requested.',
                'area_options'    => ['Hurghada', 'Al Ahyaa', 'Sahl Hasheesh', 'Makadi', 'Soma Bay'],
                'budget_options'  => ['Up to €50,000', '€50,000 - €100,000', '€100,000 - €200,000', '€200,000+'],
                'priority_options' => ['Lowest price', 'Beachfront access', 'Strong rental potential', 'Fast delivery', 'Flexible payment plan'],
                'unit_type_options' => ['Any suitable unit', 'Studio', 'One-bedroom', 'Two-bedroom', 'Villa'],
            ],

            'browser_section' => [
                'eyebrow'     => 'PROJECTS BROWSER',
                'title'       => 'Filter, sort, and compare Red Sea developer projects',
                'description' => 'The grid below includes the projects currently represented in the live catalogue, with search, area filters, budget bands, WhatsApp requests, and comparison selection.',
                'search_placeholder' => 'Search by project, area, or keyword',
                'sort_options' => ['Featured / newest first', 'Price: low to high', 'Price: high to low'],
                'quick_filters' => ['ALL PROJECTS', 'HURGHADA', 'AL AHYAA', 'SAHL HASHEESH', 'SOMA BAY', 'MAKADI', 'BEACHFRONT', 'READY TO MOVE', 'UNDER €50K', '€50K-€100K', '€100K-€200K', '€200K+'],
                'ask_advisor_label' => 'ASK ADVISOR',
                'compare_button_label' => 'COMPARE AREAS ON WHATSAPP',
                'results_template' => 'Showing {shown} of {total} matching projects. Select up to 4 projects to compare by WhatsApp.',
                'request_price_label' => 'Request Price List',
                'view_details_label' => 'VIEW DETAILS',
                'whatsapp_label' => 'WHATSAPP',
                'compare_label' => 'Add to compare request',
                'load_more_label' => 'LOAD MORE PROJECTS',
                'footnote' => 'Prices and availability can change. Request the latest price list, floor plan, delivery date, and payment schedule before making a reservation decision.',
                'empty_state' => 'No projects match these filters yet. Try widening your search.',
            ],

            'destination_strategy' => [
                'eyebrow'     => 'DESTINATION STRATEGY',
                'title'       => 'Choose the project area before choosing the unit',
                'areas' => [
                    [
                        'name' => 'Hurghada & Al Ahyaa',
                        'description' => 'Best for entry-level budgets, strong tourism demand, beachfront concepts, central access, and a wide range of developers.',
                        'points' => ['More choice under €100k', 'Holiday-rental and city access', 'Good for first-time Red Sea buyers'],
                    ],
                    [
                        'name' => 'Sahl Hasheesh & Makadi',
                        'description' => 'Best for premium coastal positioning, resort-led lifestyle, beach clubs, stronger destination identity, and long-term appeal.',
                        'points' => ['Upscale destination positioning', 'Strong holiday-home identity', 'Ideal for lifestyle buyers'],
                    ],
                    [
                        'name' => 'Soma Bay',
                        'description' => 'Best for premium resort communities, higher starting budgets, calm coastal living, and established destination quality.',
                        'points' => ['Premium and luxury projects', 'Resort-community lifestyle', 'Long-term ownership planning'],
                    ],
                ],
            ],

            'buying_path' => [
                'eyebrow'     => 'PROJECT BUYING PATH',
                'title'       => 'How to compare developer projects with confidence',
                'description' => 'A project page should not only show cards. It should help visitors understand what to ask before they reserve.',
                'steps' => [
                    ['number' => '1', 'title' => 'Shortlist by Area', 'description' => 'Start with destination fit: city access, beach access, resort lifestyle, or premium community.'],
                    ['number' => '2', 'title' => 'Check Payment Plan', 'description' => 'Compare down payment, installment period, maintenance, delivery fees, and cash discounts.'],
                    ['number' => '3', 'title' => 'Confirm Availability', 'description' => 'Ask for current units, floor plans, orientation, views, finishing specs, and delivery timeline.'],
                    ['number' => '4', 'title' => 'Reserve with Support', 'description' => 'Coordinate reservation steps, required documents, viewing, contract review, handover, and after-sales.'],
                ],
            ],

            'package_section' => [
                'eyebrow'     => 'REQUEST PROJECT PACKAGE',
                'title'       => 'Get brochures, floor plans, prices, and payment plans in one WhatsApp thread',
                'description' => 'Use this form when buyers need a focused set of project options, not a long list of links. This turns their requirements into a direct advisor brief.',
                'bullets' => [
                    'Project brochure and current price list',
                    'Available unit types and floor plans',
                    'Down payment, installments, and delivery dates',
                    'Remote video tour or in-person viewing coordination',
                ],
                'form_title'       => 'Project package request',
                'form_description' => 'Complete the details and prepare your request instantly on WhatsApp.',
                'submit_label'     => 'CONTINUE ON WHATSAPP',
                'form_disclaimer'  => 'WhatsApp opens with your request ready. Tap Send there to complete it. Your details are used only to respond to your property enquiry.',
                'timeline_options' => ['As soon as possible', 'Within 3 months', 'Within 6 months', 'Just researching'],
            ],

            'faq_section' => [
                'eyebrow'     => 'PROJECT BUYER FAQ',
                'title'       => 'Questions to answer before reserving a project unit',
                'description' => 'This FAQ helps project buyers understand what to request before deciding on a unit, especially when buying remotely or comparing multiple developers.',
                'items' => [
                    ['question' => 'What should I request before choosing a project?', 'answer' => 'Ask for the latest availability, official price list, floor plans, finishing specifications, down payment, installment schedule, delivery date, maintenance fee, and reservation terms.'],
                    ['question' => 'Can I compare multiple projects on WhatsApp?', 'answer' => 'Yes. Select up to four projects from the grid and use the comparison tray to send a structured comparison request directly to the advisor.'],
                    ['question' => 'Are the prices on this page final?', 'answer' => 'No. They are starting-price anchors from the project catalogue. Developers can change availability and prices, so buyers should confirm updated details before reserving.'],
                    ['question' => 'Can I buy a project unit remotely?', 'answer' => 'Yes. You can request brochures, floor plans, video tours, remote consultation, and reservation-step guidance before travelling.'],
                    ['question' => 'Which area is best for investment?', 'answer' => 'It depends on budget, delivery timeline, rental goal, and lifestyle preferences. Hurghada and Al Ahyaa often offer more accessible price points, while Sahl Hasheesh, Makadi, and Soma Bay can suit premium resort-led strategies.'],
                ],
            ],

            'cta_section' => [
                'compare_title'       => 'Need help choosing between Red Sea projects?',
                'compare_description' => 'Ask the team for a practical comparison by area, price, payment plan, delivery date, amenities, and rental potential.',
                'compare_cta_label'   => 'COMPARE PROJECTS',
                'consult_title'       => 'Ready to own property by the Red Sea?',
                'consult_description' => 'Speak with the team and receive a curated shortlist based on your budget, area, and investment goal.',
                'consult_cta_label'   => 'BOOK WHATSAPP CONSULTATION',
            ],
        ];
    }
}
