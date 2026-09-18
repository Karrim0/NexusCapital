<?php

namespace App\Http\Controllers;

use App\Models\HomeContent;
use App\Services\AutoTranslationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Support\ContentMerge;

class ContactContentController extends Controller
{
    protected const KEY = 'contact';

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
            abort(403, 'Only admins can edit the Contact page content.');
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
            Log::error('ContactContentController@update: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to save Contact page content.'], 500);
        }

        return response()->json(['message' => 'Contact page content updated.', 'data' => $record->data]);
    }

    protected function defaultContent(): array
    {
        return [
            'hero' => [
                'eyebrow'         => 'CONTACT NEXUS CAPITAL',
                'title_prefix'    => 'Speak with a',
                'title_highlight' => 'Red Sea Property Advisor',
                'description'     => "Reach our Hurghada office for buying, selling, renting, viewing trips, project availability, payment plans, after-sales support, property management, maintenance coordination, and local guidance across Egypt's Red Sea coast.",
                'whatsapp_cta'    => 'WhatsApp Advisor',
                'call_cta'        => 'Call Office',
                'email_cta'       => 'Email Team',
                'chips' => ['Hurghada office', 'WhatsApp-first response', 'Buyer, seller & rental support', 'Red Sea area guidance'],
                'panel' => [
                    'title'    => 'Get in Touch',
                    'subtitle' => 'Choose the fastest channel for your enquiry.',
                    'phone_note'   => 'Phone and WhatsApp advisor line',
                    'email_note'   => 'Email for property enquiries',
                    'address_note' => 'Mohamed Said Street, Al Manzil Building No 155',
                    'address_label'=> 'Al-Kawther, Hurghada',
                    'form_cta_label' => 'Send Message Form',
                    'map_cta_label'  => 'Open Google Map',
                ],
                'quick_info' => [
                    ['title' => 'Hurghada', 'subtitle' => 'Office location'],
                    ['title' => '', 'subtitle' => 'Phone and WhatsApp'],
                    ['title' => '9:00 AM–5:00 PM', 'subtitle' => 'Open daily'],
                ],
            ],

            'trust_items' => [
                ['title' => 'WhatsApp First', 'description' => 'Send your buying brief and receive guidance, availability, and next steps.'],
                ['title' => 'Office Visits', 'description' => 'Visit our Hurghada office in Al-Kawther for in-person consultations.'],
                ['title' => 'Property Requests', 'description' => 'Ask for available apartments, villas, studios, commercial units, and projects.'],
                ['title' => 'After-Sales Help', 'description' => 'Coordinate property management, maintenance, legal introductions, and handover support.'],
            ],

            'help_section' => [
                'eyebrow'     => 'RED SEA REAL ESTATE SUPPORT',
                'title'       => 'Contact a local Hurghada team before you decide',
                'description' => 'Use this page to contact the team by phone, email, WhatsApp, office visit, or the message form below.',
                'card_title'  => 'How the team can help',
                'paragraphs' => [
                    'Nexus Capital is a Hurghada-based real estate brokerage and advisory company helping clients explore property opportunities in Hurghada, Sahl Hasheesh, El Gouna, Makadi, and Soma Bay.',
                    'The team supports developers, individual home buyers, domestic investors, and international investors by matching each client with suitable developments, fair pricing, location guidance, and practical next steps.',
                ],
                'bullets' => [
                    'Buy a studio, apartment, villa, duplex, or commercial unit',
                    'Compare projects, developers, prices, and payment plans',
                    'Arrange viewing trips or remote video viewings',
                    'Ask about rental service, resale, management, maintenance, or introductions to independent legal professionals',
                ],
                'side_title'       => 'Fastest reply route',
                'side_description' => 'For the fastest property guidance, send a WhatsApp message with your area, budget, preferred property type, and buying timeline.',
                'side_cta_label'   => 'Start WhatsApp Brief',
            ],

            'details_section' => [
                'eyebrow'     => 'CONTACT DETAILS',
                'title'       => 'Use the channel that suits your enquiry best',
                'description' => 'For the fastest property guidance, send a WhatsApp message with your area, budget, preferred property type, and buying timeline.',
                'items' => [
                    ['title' => 'Phone Number', 'description' => 'Call the Nexus Capital advisor line for direct assistance.', 'link_label' => 'Call Now'],
                    ['title' => 'WhatsApp', 'description' => 'Best for shortlists, availability, payment plans, viewing requests, and quick questions.', 'link_label' => 'Start WhatsApp'],
                    ['title' => 'Email', 'description' => 'Email the team for detailed property briefs, documents, and longer questions.', 'link_label' => 'Send Email'],
                    ['title' => 'Office Address', 'description' => 'Visit the office for Red Sea real estate guidance and buyer consultation.', 'link_label' => 'Open Map'],
                ],
            ],

            'form_section' => [
                'eyebrow'     => 'SEND US A MESSAGE',
                'title'       => 'Tell us what you need and send your enquiry directly',
                'description' => 'Complete the form with your contact details and property goal. The website will submit your enquiry securely to Nexus Capital without opening an email app.',
                'badges' => [
                    ['number' => '01', 'title' => 'Property buying enquiries'],
                    ['number' => '02', 'title' => 'Viewing trips and remote tours'],
                    ['number' => '03', 'title' => 'Rent, resale, and after-sales'],
                    ['number' => '04', 'title' => 'Project availability requests'],
                ],
                'form_title' => 'Contact form',
                'form_note'  => 'Fields marked * are required. Please include at least one contact number or email address.',
                'method_note' => 'Every submission requires at least one contact route. WhatsApp or phone selections require a number; an email selection requires an email address.',
                'contact_method_options' => ['WhatsApp', 'Phone call', 'Email', 'Office visit'],
                'enquiry_options' => ['Buy a property', 'Sell a property', 'Rent a property', 'Property viewing trip', 'Developer project availability', 'After-sales / management / maintenance', 'General question'],
                'area_options'    => ['Hurghada', 'Sahl Hasheesh', 'El Gouna', 'Makadi', 'Soma Bay', 'Not sure yet'],
                'budget_options'  => ['No budget preference', 'Up to €50,000', '€50,000 - €100,000', '€100,000 - €250,000', '€250,000+'],
                'timeline_options'=> ['No timeline preference', 'Immediately', '1–3 months', '3–6 months', 'Just researching'],
                'consent_label'   => 'I ask Nexus Capital to use these details to answer and follow up on this enquiry. I will not enter payment or sensitive information. I may request correction or deletion by emailing the team. I understand the privacy notice shown with this form.',
                'submit_label'    => 'Send Message',
                'whatsapp_label'  => 'Continue on WhatsApp',
                'disclaimer'      => 'When you send this form, Nexus Capital will use your details only to answer and follow up on this property enquiry. Do not include payment, passport, banking, or other sensitive information.',
            ],

            'location_section' => [
                'eyebrow'     => 'LOCATION',
                'title'       => 'Visit Nexus Capital in Al-Kawther, Hurghada',
                'description' => 'Use the map below to find the office, or open Google Maps directly for directions.',
                'map_placeholder_title'       => 'Load the interactive office map',
                'map_placeholder_description' => 'The map is provided by Google and loads only after you choose it. Loading it may share technical connection data with Google.',
                'load_map_label' => 'Load Google Map',
                'map_embed_url'  => null,
                'info_title'  => 'Office information',
                'info_note'   => 'For property consultations, viewings, and detailed Red Sea guidance, contact the team before visiting so the right advisor can prepare for you.',
                'directions_label' => 'Open Directions',
                'call_label'        => 'Call Office',
            ],

            'ask_section' => [
                'eyebrow'     => 'WHAT TO ASK US',
                'title'       => 'Send a focused request and get a clearer answer',
                'description' => 'These enquiry paths help our advisors understand your needs and respond with useful property guidance.',
                'items' => [
                    ['number' => '1', 'title' => 'Buying Property', 'description' => 'Ask for current availability, prices, floor plans, payment plans, delivery dates, and area comparison.'],
                    ['number' => '2', 'title' => 'Viewing Trips', 'description' => 'Request an in-person schedule or remote video tour for apartments, villas, projects, or commercial units.'],
                    ['number' => '3', 'title' => 'Rent or Sell', 'description' => 'Contact the team about rental service, resale guidance, valuation context, and owner support.'],
                    ['number' => '4', 'title' => 'After-Sales', 'description' => 'Ask about handover, property management, maintenance coordination, furnishing, or legal introductions.'],
                ],
            ],

            'faq_section' => [
                'eyebrow'     => 'CONTACT QUESTIONS',
                'title'       => 'Before you message us',
                'description' => 'A little detail helps the team send you the right options faster.',
                'items' => [
                    ['question' => 'What details should I include in my message?', 'answer' => 'Share your preferred area, budget, property type, buying purpose, timeline, and whether you prefer ready-to-move properties or developer projects with payment plans.'],
                    ['question' => 'Can I contact Nexus Capital from outside Egypt?', 'answer' => 'Yes. Use WhatsApp or email to request remote guidance, video tours, project brochures, floor plans, and updated availability before travelling.'],
                    ['question' => 'Can I visit the office directly?', 'answer' => 'Yes. The office is in Al-Kawther, Hurghada. Contact the team before visiting so an advisor can prepare the right property information for your meeting.'],
                    ['question' => 'Can the team help after I buy?', 'answer' => 'Yes. Nexus Capital can guide you through after-sales needs such as handover coordination, property management, maintenance, and professional introductions where needed.'],
                ],
            ],

            'cta_section' => [
                'title'       => 'Ready to own property by the Red Sea?',
                'description' => 'Speak with Nexus Capital and receive a curated shortlist based on your budget, area, and investment goal.',
                'cta_label'   => 'BOOK WHATSAPP CONSULTATION',
            ],
        ];
    }
}
