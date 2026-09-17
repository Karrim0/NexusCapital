<?php

namespace App\Http\Controllers;

use App\Models\HomeContent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Support\ContentMerge;
use Illuminate\Support\Facades\Storage;

class HomeContentController extends Controller
{
    /**
     * The single record we manage this content under.
     */
    protected const KEY = 'home';

    /**
     * GET /home-content — public.
     * Returns the saved content, or a sensible default set the first time
     * (before an admin has ever opened the "Home Page" dashboard screen).
     */
    public function show(Request $request): JsonResponse
    {
        $record = HomeContent::firstWhere('key', self::KEY);
        $data = $record?->data ?: $this->defaultContent();

        // Always fill in any keys that might be missing from an older/partial
        // saved record, so the frontend never has to guard against undefined.
        $data = ContentMerge::merge($this->defaultContent(), $data);

        $logo = $data['logo_url'] ?? null;
        $data['logo_url'] = $this->resolveUrl($logo);

        $heroBg = $data['hero']['background_image'] ?? null;
        $data['hero']['background_image'] = $this->resolveUrl($heroBg);

        $data = $record?->localize($request->query('lang', 'en'), $data) ?? $data;

        return response()->json([
            'data'        => $data,
            'updated_at'  => $record?->updated_at,
        ]);
    }

    /**
     * POST /home-content — admin only.
     * Accepts multipart/form-data with a JSON-encoded "data" field and an
     * optional "logo" file, so the whole home page (text, numbers, lists,
     * and the brand logo) can be managed from one dashboard form.
     */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user || !$user->hasRole('admin')) {
            abort(403, 'Only admins can edit the home page content.');
        }

        $request->validate([
            'data'           => ['required', 'string'],
            'logo'           => ['nullable', 'image', 'max:4096'],
            'hero_background' => ['nullable', 'image', 'max:8192'],
        ]);

        $incoming = json_decode($request->input('data'), true);
        if (!is_array($incoming)) {
            return response()->json(['message' => 'Invalid content payload.'], 422);
        }

        $record = HomeContent::firstOrNew(['key' => self::KEY]);
        $current = $record->data ?: $this->defaultContent();
        $merged = ContentMerge::merge3($this->defaultContent(), $current, $incoming);

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('home/logo', 'uploads');
            $merged['logo_url'] = $path;
        }

        if ($request->hasFile('hero_background')) {
            $path = $request->file('hero_background')->store('home/hero', 'uploads');
            $merged['hero']['background_image'] = $path;
        }

        try {
            $record->key = self::KEY;
            $record->data = $merged;
            $record->save();
        } catch (\Exception $e) {
            Log::error('HomeContentController@update: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to save home page content.'], 500);
        }

        $out = $record->data;
        $out['logo_url'] = $this->resolveUrl($out['logo_url'] ?? null);
        $out['hero']['background_image'] = $this->resolveUrl($out['hero']['background_image'] ?? null);

        return response()->json(['message' => 'Home page content updated.', 'data' => $out]);
    }

    protected function resolveUrl(?string $path): ?string
    {
        if (!$path) return null;
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }
        // Matches the convention used by PropertyController / Project model
        // for files stored on the "uploads" disk.
        return rtrim(env('FRONTEND_URLS', config('app.url')), '/') . '/storage/' . ltrim($path, '/');
    }

    /**
     * Default content, in English, styled after the "Hurghadians Property"
     * reference layout but rebranded to Nexus Capital. Every field here is
     * editable from /dashboard/home-content.
     */
    protected function defaultContent(): array
    {
        return [
            'logo_url'    => null,
            'brand_name'  => 'Nexus Capital',
            'brand_tagline' => 'Real Estate Investment',

            'topbar' => [
                'strip_text'    => 'PREMIUM RED SEA REAL ESTATE INVESTMENT',
                'phone'         => '+20 111 558 2634',
                'email'         => 'info@nexuscapital.com',
                'whatsapp_number' => '+20 111 558 2634',
                'whatsapp_label'  => 'WHATSAPP',
            ],

            // Controls which pages appear in the header navigation menu,
            // and in what order. `key` must match one of the fixed pages
            // in NAV_MENU_ITEMS on the frontend (src/constants/navMenu.js)
            // — the label and path always come from there (translated,
            // safe), the dashboard only controls visibility and order.
            'nav_menu' => [
                ['key' => 'home', 'visible' => true],
                ['key' => 'buy', 'visible' => true],
                ['key' => 'rent', 'visible' => true],
                ['key' => 'projects', 'visible' => true],
                ['key' => 'blog', 'visible' => true],
                ['key' => 'services', 'visible' => true],
                ['key' => 'faq', 'visible' => true],
                ['key' => 'landsBuildings', 'visible' => true],
                ['key' => 'about', 'visible' => true],
                ['key' => 'contact', 'visible' => true],
            ],

            'hero' => [
                'eyebrow'         => 'HURGHADA · SAHL HASHEESH · EL GOUNA · MAKADI · SOMA BAY',
                'title_prefix'    => 'Find Your',
                'title_highlight' => 'Red Sea',
                'title_suffix'    => 'Home with a Trusted Nexus Capital Team',
                'subtitle'        => 'A modern buyer-first experience for apartments, villas, beachfront projects, and investment properties across Egypt\'s Red Sea coast. Search faster, compare smarter, and request real-time availability through WhatsApp.',
                'primary_cta'     => 'BROWSE PROPERTIES',
                'secondary_cta'   => 'GET PROPERTY SHORTLIST',
                'features'        => ['Developer projects', 'Flexible payment plans', 'Remote viewings', 'After-sales support'],
                'background_image' => null,
                'form_title'      => 'Curated Property Shortlist',
                'form_subtitle'   => 'Tell us your goal and receive a curated WhatsApp shortlist.',
                'form_helper'     => 'Recommended path: choose your area, goal, and budget to generate a focused shortlist request.',
                'form_disclaimer' => 'No card details. No sensitive payment data. Just your property brief.',
                'submit_whatsapp_label' => 'SEND SHORTLIST ON WHATSAPP',
                'submit_email_label'    => 'SEND EMAIL',
            ],

            'stats' => [
                ['value' => '94+', 'label' => 'Properties in catalogue'],
                ['value' => '46',  'label' => 'Project opportunities'],
                ['value' => '21',  'label' => 'Google reviews'],
            ],

            'search_section' => [
                'eyebrow'     => '2026 SEARCH EXPERIENCE',
                'title'       => 'Start with your lifestyle, not just a listing page',
                'description' => 'Modern real estate visitors need mobile-first search, quick paths to conversion, strong visuals, and trust signals. This search block turns your homepage into a lead-generation and advisory entry point.',
                'card_title'  => 'Find Red Sea properties faster',
                'card_description' => 'Choose a destination, property type, and budget. Continue to live listings or ask the advisor to prepare a shortlist.',
                'open_listings_label' => 'OPEN LIVE LISTINGS',
                'ask_matches_label'   => 'ASK FOR MATCHES',
                'quick_filters' => ['READY-TO-MOVE', 'NEW PROJECTS', 'SEA VIEW', 'PAYMENT PLANS', 'RENTAL POTENTIAL'],
                'clarity_panel_title' => 'Buyer clarity panel',
                'clarity_panel_description' => 'Answer the questions that usually slow down international buyers before they book a tour.',
                'clarity_steps' => [
                    ['title' => 'Budget fit', 'description' => 'Shortlist by total price, down payment, and installments.'],
                    ['title' => 'Area fit', 'description' => 'Compare central Hurghada, Al Ahyaa, Sahl Hasheesh, El Gouna, Makadi, and Soma Bay.'],
                    ['title' => 'Ownership steps', 'description' => 'Reservation, documents, viewing, handover, rental readiness.'],
                ],
            ],

            'destinations_section' => [
                'eyebrow'     => 'WHERE TO BUY',
                'title'       => 'Red Sea destinations matched to lifestyle and investment goals',
                'description' => 'Guide visitors by location, not only by property cards. This improves SEO, reduces confusion, and helps buyers choose the right destination first.',
                'items' => [
                    ['name' => 'Hurghada', 'description' => 'City convenience, tourism demand, resort homes, ready units, and developer projects for holiday buyers and investors.', 'link_label' => 'Explore Hurghada properties', 'image' => null],
                    ['name' => 'Sahl Hasheesh', 'description' => 'Premium destination appeal with coastal lifestyle, upscale communities, and long-term brand value.', 'link_label' => 'Compare projects', 'image' => null],
                    ['name' => 'Al Ahyaa', 'description' => 'Growing northern Hurghada area with beachfront projects, flexible terms, and strong holiday-rental positioning.', 'link_label' => 'Request options', 'image' => null],
                    ['name' => 'Makadi & Soma Bay', 'description' => 'Resort-led coastal experiences for buyers who want a calmer Red Sea lifestyle and premium beach access.', 'link_label' => 'Ask advisor', 'image' => null],
                    ['name' => 'El Gouna', 'description' => 'Established destination appeal, marina lifestyle, and high-demand surroundings near northern Hurghada.', 'link_label' => 'View opportunities', 'image' => null],
                ],
            ],

            'featured_section' => [
                'eyebrow'     => 'FEATURED PROPERTIES',
                'title'       => 'High-interest Red Sea projects with clear next steps',
                'description' => 'Use property cards as conversion blocks: image, price anchor, benefit summary, details link, WhatsApp inquiry, and compare selection.',
                'filters'     => ['ALL', 'HURGHADA', 'SAHL HASHEESH', 'BEACHFRONT', 'INVESTMENT'],
                'cta_label'   => 'SEE ALL LISTINGS',
                'helper_note' => 'Swipe or use arrows to explore featured properties.',
                'details_label' => 'VIEW DETAILS',
                'whatsapp_label' => 'WHATSAPP',
                'compare_label'  => 'Add to compare request',
            ],

            'journey_section' => [
                'eyebrow'     => 'BUYER JOURNEY',
                'title'       => 'From first enquiry to confident ownership',
                'description' => 'A homepage should explain the journey, not only show properties. This process is designed for local and international buyers who want clarity before reserving.',
                'steps' => [
                    ['number' => '1', 'title' => 'Define Your Goal', 'description' => 'Lifestyle, investment, rental income, retirement, relocation, or developer launch opportunity.'],
                    ['number' => '2', 'title' => 'Compare Options', 'description' => 'Shortlist by area, project, unit type, down payment, installment plan, and delivery timeline.'],
                    ['number' => '3', 'title' => 'View Online or In Person', 'description' => 'Book a private viewing, remote video tour, brochure review, or advisor call.'],
                    ['number' => '4', 'title' => 'Reserve with Support', 'description' => 'Coordinate documents, reservation steps, payment milestones, handover, furnishing and resale planning.'],
                ],
                'payment_snapshot' => [
                    'title'       => 'Payment-plan snapshot',
                    'description' => 'Give buyers a quick estimate before they contact you. Final pricing must always be confirmed with the advisor.',
                    'default_price'        => 50000,
                    'default_down_percent' => 15,
                    'default_years'        => 5,
                ],
                'access_guide' => [
                    'title'       => 'Red Sea access guide',
                    'description' => 'Use local context to make international buyers feel oriented before they request a call.',
                    'items' => [
                        ['label' => 'Airport to central Hurghada', 'value' => 'Fast access'],
                        ['label' => 'Hurghada to Sahl Hasheesh', 'value' => 'Premium coast'],
                        ['label' => 'Hurghada to El Gouna', 'value' => 'North coast lifestyle'],
                        ['label' => 'Makadi / Soma Bay', 'value' => 'Resort communities'],
                    ],
                ],
            ],

            'services_section' => [
                'eyebrow'     => 'SERVICES',
                'title'       => 'Professional support for every Red Sea property decision',
                'description' => 'These service cards turn your homepage into a complete buyer advisory hub and connect naturally to your Services page.',
                'items' => [
                    ['number' => '01', 'title' => 'Property Sales Advisory', 'description' => 'Selected apartments, studios, villas, duplexes, beachfront units, and developer projects across the Red Sea.'],
                    ['number' => '02', 'title' => 'Area & Project Comparison', 'description' => 'Compare location, lifestyle, amenities, delivery status, developer reputation, and payment-plan structure.'],
                    ['number' => '03', 'title' => 'International Buyer Support', 'description' => 'Remote consultations, video tours, document coordination, and professional introductions where needed.'],
                    ['number' => '04', 'title' => 'Developer Opportunities', 'description' => 'Request brochures, launch updates, current availability, floor plans, price lists, and reservation steps.'],
                    ['number' => '05', 'title' => 'After-Sales Support', 'description' => 'Handover coordination, furnishing guidance, rental readiness, resale planning, and long-term ownership support.'],
                    ['number' => '06', 'title' => 'Fast Advisor Response', 'description' => 'WhatsApp-first communication for serious buyers who need clear answers and updated availability quickly.'],
                ],
            ],

            'shortlist_section' => [
                'eyebrow'     => 'PERSONALIZED PROPERTY SHORTLIST',
                'title'       => 'Tell us your budget. We will send matching Red Sea properties.',
                'description' => 'Save time and avoid confusion. Our team can send options that fit your preferred area, buying purpose, delivery timeline, and payment-plan needs.',
                'bullets' => [
                    'Latest availability and payment-plan guidance',
                    'Area comparison for Hurghada, Sahl Hasheesh, El Gouna, Makadi, and Soma Bay',
                    'Remote or in-person viewing coordination',
                    'After-sales support and next-step guidance',
                ],
                'form_title'       => 'Request a consultation',
                'form_description' => 'Complete the form and continue instantly on WhatsApp with a property advisor.',
                'submit_label'     => 'SEND CONSULTATION REQUEST',
                'form_disclaimer'  => 'Your details are used only to respond to your property enquiry.',
            ],

            'testimonials_section' => [
                'eyebrow'  => 'SOCIAL PROOF',
                'badge'    => 'GOOGLE REVIEWS',
                'title'    => 'Trusted by Red Sea Buyers',
                'rating_value'  => '5',
                'reviews_count' => '21',
                'reviews_note'  => 'Public client feedback highlighted on the live Nexus Capital homepage.',
                'read_reviews_label'    => 'READ GOOGLE REVIEWS',
                'message_advisor_label' => 'MESSAGE AN ADVISOR',
                'google_reviews_url'    => '',
                'reviews' => [
                    ['quote' => 'The best real estate office in Hurghada - I recommend the top service!', 'name' => 'Martin Moravek', 'source' => 'Posted on Google'],
                    ['quote' => 'Excellent service in Hurghada. I recommend them 100%.', 'name' => 'Katarina Dubovska', 'source' => 'Posted on Google'],
                    ['quote' => 'Very nice company. Totally recommend.', 'name' => 'GRC', 'source' => 'Posted on Google'],
                    ['quote' => 'Best team in the world.', 'name' => 'Nenad Trajic', 'source' => 'Posted on Google'],
                ],
            ],

            'faq_section' => [
                'eyebrow'     => 'BUYER QUESTIONS',
                'title'       => 'Clarity before you buy',
                'description' => 'Professional buyers need transparent answers before reserving property abroad. These questions reduce friction and build confidence.',
                'items' => [
                    ['question' => 'Can foreigners buy property in Hurghada?', 'answer' => 'Yes. Foreign buyers can purchase property in Egypt, and the team can guide you through property selection, reservation steps, and professional introductions where needed.'],
                    ['question' => 'Can I buy remotely before travelling?', 'answer' => 'Yes. Remote consultations, video tours, and document coordination make it possible to reserve a property before visiting in person.'],
                    ['question' => 'Do developer projects offer payment plans?', 'answer' => 'Most developer projects offer flexible installment plans with a down payment followed by instalments over several years.'],
                    ['question' => 'What should I compare before reservation?', 'answer' => 'Compare location, delivery date, developer reputation, payment plan structure, and total price including any additional fees.'],
                    ['question' => 'Can Nexus Capital help after reservation?', 'answer' => 'Yes. The team supports handover coordination, furnishing guidance, rental readiness, and long-term resale planning.'],
                ],
            ],

            'cta_section' => [
                'blog_title'       => 'Research before you invest in the Red Sea',
                'blog_description' => 'Use the blog for buyer guides, Hurghada property insights, project comparisons, payment-plan explainers, and area guides.',
                'blog_cta_label'   => 'VISIT PROPERTY BLOG',
                'blog_url'         => '/blog',
                'consult_title'       => 'Ready to own property by the Red Sea?',
                'consult_description' => 'Speak with Nexus Capital and receive a curated shortlist based on your budget, area, and investment goal.',
                'consult_cta_label'   => 'BOOK WHATSAPP CONSULTATION',
            ],

            'footer' => [
                'about' => 'Nexus Capital is a Hurghada-based real estate investment company helping buyers, investors, owners, and developers on Egypt\'s Red Sea coast.',
                'quick_links'   => [
                    ['label' => 'Home', 'url' => '/'],
                    ['label' => 'Buy', 'url' => '/buy'],
                    ['label' => 'Projects', 'url' => '/projects'],
                    ['label' => 'Services', 'url' => '/services'],
                    ['label' => 'Blog', 'url' => '/blog'],
                ],
                'popular_areas' => [
                    ['label' => 'Hurghada', 'url' => '/buy?area=hurghada'],
                    ['label' => 'Sahl Hasheesh', 'url' => '/buy?area=sahl-hasheesh'],
                    ['label' => 'El Gouna', 'url' => '/buy?area=el-gouna'],
                    ['label' => 'Makadi', 'url' => '/buy?area=makadi'],
                    ['label' => 'Soma Bay', 'url' => '/buy?area=soma-bay'],
                ],
                'contact' => [
                    'phone'   => '+20 111 558 2634',
                    'email'   => 'info@nexuscapital.com',
                    'address' => 'Mohamed Sald Street, Al Manzil Building No 155, Al-Kawther, Hurghada',
                    'whatsapp_label' => 'WhatsApp Property Advisor',
                ],
                'social' => [
                    ['platform' => 'facebook', 'url' => ''],
                    ['platform' => 'x', 'url' => ''],
                    ['platform' => 'youtube', 'url' => ''],
                    ['platform' => 'linkedin', 'url' => ''],
                    ['platform' => 'instagram', 'url' => ''],
                    ['platform' => 'tiktok', 'url' => ''],
                ],
                'tax_registration' => '560-310-153',
                'copyright_note'   => '© 2026 Nexus Capital. All rights reserved.',
                'privacy_note'     => 'Privacy-first enquiry forms',
            ],
        ];
    }
}
