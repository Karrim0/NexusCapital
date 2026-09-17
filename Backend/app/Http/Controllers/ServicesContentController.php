<?php

namespace App\Http\Controllers;

use App\Models\HomeContent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Support\ContentMerge;

class ServicesContentController extends Controller
{
    protected const KEY = 'services';

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
            abort(403, 'Only admins can edit the services page content.');
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
            $record->save();
        } catch (\Exception $e) {
            Log::error('ServicesContentController@update: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to save services page content.'], 500);
        }

        return response()->json(['message' => 'Services page content updated.', 'data' => $record->data]);
    }

    protected function defaultContent(): array
    {
        return [
            'hero' => [
                'title_prefix'    => 'Property Services That Keep Every Step',
                'title_highlight' => 'Clear, Safe & Simple',
                'description'     => "From consulting and ownership-document guidance to viewing trips, rental support, developer opportunities, and after-sales coordination, the team helps buyers and owners make confident decisions across Hurghada and Egypt's Red Sea coast.",
                'primary_cta'     => 'EXPLORE SERVICES',
                'secondary_cta'   => 'ASK ON WHATSAPP',
                'quick_filters'   => ['Consulting service', 'Property viewing trips', 'Rental service', 'After-sales support'],
                'stats' => [
                    ['value' => '6', 'label' => 'Core service areas'],
                    ['value' => '1:1', 'label' => 'Advisor-led support'],
                    ['value' => 'Red Sea', 'label' => 'Hurghada area knowledge'],
                ],
            ],

            'request_panel' => [
                'title'       => 'Request Service Support',
                'subtitle'    => 'Choose what you need and continue instantly on WhatsApp or email.',
                'service_options'  => ['Property Sales & Buying Advisory', 'Consulting & Ownership Documents', 'Property Viewing Trips', 'Rental Service', 'Developer Projects & Payment Plans', 'After-Sales & Owner Support'],
                'area_options'     => ['Hurghada', 'Sahl Hasheesh', 'Al Ahyaa', 'El Gouna', 'Makadi', 'Soma Bay'],
                'timeline_options' => ['As soon as possible', 'Within 3 months', 'Within 6 months', 'Just researching'],
                'helper_note'      => 'Choose your service, preferred area, and timeline so we can prepare the right advisor response.',
                'submit_whatsapp_label' => 'SEND WHATSAPP',
                'submit_email_label'    => 'SEND EMAIL',
                'form_disclaimer' => 'Choose WhatsApp for instant chat, or Send Email to submit the completed request. Do not include passport, banking, payment-card, or other sensitive information.',
            ],

            'trust_items' => [
                ['title' => 'Local Red Sea Knowledge', 'description' => 'Guidance for Hurghada, Sahl Hasheesh, El Gouna, Makadi, Soma Bay, and nearby areas.'],
                ['title' => 'Document Clarity', 'description' => 'Support for ownership-document review, ownership sequence questions, and next-step coordination.'],
                ['title' => 'Remote or In-Person', 'description' => 'Video tours, area briefings, property viewing trips, and organized shortlist preparation.'],
                ['title' => 'After-Sales Support', 'description' => 'Help after reservation, including handover, furnishing guidance, rental readiness, and owner support.'],
            ],

            'services_section' => [
                'eyebrow'     => 'OUR SERVICES',
                'title'       => 'Complete real estate support for buyers, investors, and owners',
                'description' => 'Use one team for the practical details: shortlist creation, consulting, viewing arrangements, developer information, rental planning, and post-purchase coordination.',
                'items' => [
                    ['number' => '01', 'title' => 'Property Sales & Buying Advisory', 'description' => 'Personal support for buyers comparing apartments, studios, villas, duplexes, beachfront units, and new developer projects.', 'bullets' => ['Area and lifestyle matching', 'Budget and payment-plan guidance', 'Ready-to-move and off-plan options'], 'cta_label' => 'ASK FOR BUYING ADVISORY'],
                    ['number' => '02', 'title' => 'Consulting & Ownership Documents', 'description' => 'Consulting for ownership documents, tracing ownership sequence, and coordinating questions related to governmental offices.', 'bullets' => ['Ownership-document support', 'Ownership sequence questions', 'Practical next-step coordination'], 'cta_label' => 'REQUEST CONSULTING SUPPORT'],
                    ['number' => '03', 'title' => 'Property Viewing Trips', 'description' => 'Plan an efficient viewing route across selected properties, areas, and projects so you can compare options with confidence.', 'bullets' => ['Shortlist before arrival', 'Area and project visits', 'Remote viewing alternatives'], 'cta_label' => 'PLAN A VIEWING TRIP'],
                    ['number' => '04', 'title' => 'Rental Service', 'description' => 'Support for apartments and villas for short-term or long-term rent across Hurghada, Makadi, Sahl Hasheesh, Al Ahyaa, El Gouna, and nearby areas.', 'bullets' => ['Owner rental-readiness guidance', 'Short and long-term rental needs', 'Area demand context'], 'cta_label' => 'ASK ABOUT RENTAL SERVICE'],
                    ['number' => '05', 'title' => 'Developer Projects & Payment Plans', 'description' => 'Get clear information about developer projects, floor plans, current availability, reservation steps, delivery dates, and staged payment plans.', 'bullets' => ['Brochures and floor plans', 'Availability and project requests', 'Down payment and installment comparison'], 'cta_label' => 'REQUEST PROJECT INFORMATION'],
                    ['number' => '06', 'title' => 'After-Sales & Owner Support', 'description' => 'Continue with structured support after reservation or purchase, including handover coordination, furnishing guidance, rental readiness, and resale planning.', 'bullets' => ['Handover coordination', 'Furnishing and service referrals', 'Long-term ownership support'], 'cta_label' => 'GET OWNER SUPPORT'],
                ],
            ],

            'spotlight' => [
                'eyebrow'     => 'SERVICE DETAILS',
                'title'       => 'Built around the real questions buyers and owners ask first',
                'description' => 'Every service is designed to reduce confusion, speed up decision-making, and give buyers or owners a clear next step through a dedicated advisor.',
                'tag'         => 'CONSULTING SERVICE',
                'spotlight_title'       => 'Ownership-document guidance before you make a serious decision',
                'spotlight_description' => 'When a property question involves ownership documents, ownership sequence, registration context, or coordination with official offices, the first priority is clarity. This consulting service helps you understand what should be checked, what information is missing, and what practical next steps to take.',
                'columns' => [
                    ['title' => 'Document Review Direction', 'description' => 'Clarify what documents and ownership details should be requested before proceeding.'],
                    ['title' => 'Ownership Sequence', 'description' => 'Understand prior ownership context and questions that may need confirmation.'],
                    ['title' => 'Government Office Support', 'description' => 'Coordinate questions and next steps where official-office follow-up is needed.'],
                ],
                'primary_cta'   => 'REQUEST CONSULTING',
                'secondary_cta' => 'CONTACT OFFICE',
                'side_tag'      => 'Document Clarity',
                'side_title'    => 'Know what to ask before reservation, purchase, rental, or resale planning.',
                'side_bullets'  => ['Ownership-document questions', 'Contract and registration discussion points', 'Lawyer-introduction coordination where needed'],
            ],

            'finder' => [
                'eyebrow'     => 'SERVICE FINDER',
                'title'       => 'Not sure which service you need?',
                'description' => 'Choose your situation and we will recommend the right first step. The result can be sent directly to the team on WhatsApp.',
                'situation_options' => [
                    'I want to buy a property' => [
                        'service' => 'Property Sales & Buying Advisory',
                        'description' => 'Start with a shortlist based on your budget, property type, and payment-plan needs, then compare projects or arrange a viewing.',
                    ],
                    'I need help with ownership documents' => [
                        'service' => 'Consulting & Ownership Documents',
                        'description' => 'Get clarity on what documents and ownership details should be checked before you proceed.',
                    ],
                    'I want to view properties in person or remotely' => [
                        'service' => 'Property Viewing Trips',
                        'description' => 'Plan an efficient shortlist and viewing route across your selected areas and projects.',
                    ],
                    'I want to rent out my property' => [
                        'service' => 'Rental Service',
                        'description' => 'Get owner rental-readiness guidance and area demand context for short or long-term rental.',
                    ],
                    'I am interested in developer projects' => [
                        'service' => 'Developer Projects & Payment Plans',
                        'description' => 'Request brochures, floor plans, current availability, and staged payment plan comparisons.',
                    ],
                    'I already purchased and need support' => [
                        'service' => 'After-Sales & Owner Support',
                        'description' => 'Coordinate handover, furnishing guidance, rental readiness, and resale planning.',
                    ],
                ],
                'area_options'     => ['Hurghada', 'Sahl Hasheesh', 'Al Ahyaa', 'El Gouna', 'Makadi', 'Soma Bay'],
                'timeline_options' => ['Immediately', 'Within 3 months', 'Within 6 months', 'Just researching'],
                'result_title'     => 'Your recommended service',
                'result_note'      => 'Recommendation is a guide only. The team can confirm the best route after reviewing your details.',
                'contact_cta_label' => 'CONTACT TEAM',
            ],

            'process' => [
                'eyebrow'     => 'HOW IT WORKS',
                'title'       => 'A simple process from request to next step',
                'description' => 'Whether you are buying, renting, preparing a property, or checking documents, the goal is the same: fast clarity and a practical plan.',
                'steps' => [
                    ['number' => '1', 'title' => 'Send Your Request', 'description' => 'Tell us the service needed, area, timeline, and what problem you want to solve.'],
                    ['number' => '2', 'title' => 'Advisor Reviews', 'description' => 'The team checks your request and identifies the most useful next step.'],
                    ['number' => '3', 'title' => 'Prepare Options', 'description' => 'Receive a shortlist, document checklist, rental route, viewing plan, or project comparison.'],
                    ['number' => '4', 'title' => 'Compare Clearly', 'description' => 'Review advantages, risks, area context, budget fit, and expected next actions.'],
                    ['number' => '5', 'title' => 'Move Forward', 'description' => 'Book a viewing, request documents, reserve a unit, prepare rental, or coordinate owner support.'],
                ],
            ],

            'owners' => [
                'eyebrow'     => 'OWNERS & LANDLORDS',
                'title'       => 'Support after the purchase matters just as much as the sale',
                'description' => 'Owners often need help with handover, furnishing, rental readiness, tenant expectations, maintenance coordination, and resale planning. Use the owner support path to keep everything organized.',
                'cta_label'   => 'ASK FOR OWNER SUPPORT',
                'cards' => [
                    ['tag' => 'Rental-readiness guidance', 'description' => 'Discuss furnishing level, presentation, access, maintenance, and area suitability.'],
                    ['tag' => 'Handover coordination', 'description' => 'Keep track of delivery dates, handover steps, owner responsibilities, and follow-up tasks.'],
                    ['tag' => 'Resale and next investment', 'description' => 'Review whether to hold, rent, upgrade, resell, or compare a second Red Sea opportunity.'],
                ],
            ],

            'faq_section' => [
                'eyebrow'     => 'SERVICES FAQ',
                'title'       => 'Common questions before requesting support',
                'description' => 'These answers help visitors understand what to ask before buying, viewing, renting, or requesting document-related support.',
                'items' => [
                    ['question' => 'What is included in the consulting service?', 'answer' => 'The consulting service helps with property ownership-document questions, tracing ownership sequence, and coordinating practical next steps where governmental-office follow-up may be needed.'],
                    ['question' => 'Can you organize property viewing trips?', 'answer' => 'Yes. The team can help prepare a shortlist before arrival and organize viewings by area, property type, budget, and project interest. Remote viewing options can also be requested.'],
                    ['question' => 'Do you help with short-term and long-term rentals?', 'answer' => 'Yes. Rental service support can cover apartments and villas for short-term or long-term needs in Hurghada, Makadi, Sahl Hasheesh, Al Ahyaa, El Gouna, and surrounding areas.'],
                    ['question' => 'Can I request developer project brochures and payment plans?', 'answer' => 'Yes. Ask for current availability, floor plans, price lists, down payment requirements, installment schedules, delivery dates, and reservation steps.'],
                    ['question' => 'Do you support international buyers remotely?', 'answer' => 'Yes. You can request WhatsApp consultation, video tours, project information, area comparisons, document guidance, and next-step coordination before travelling.'],
                    ['question' => 'What should I send before contacting you?', 'answer' => 'Send your preferred area, budget, property type, buying purpose, timeline, and the specific service you need. For document support, mention the property status and what documents or questions you already have.'],
                ],
            ],

            'cta_section' => [
                'title'       => 'Ready to own property by the Red Sea?',
                'description' => 'Speak with the team and receive a curated shortlist based on your budget, area, and investment goal.',
                'cta_label'   => 'BOOK WHATSAPP CONSULTATION',
            ],
        ];
    }
}
