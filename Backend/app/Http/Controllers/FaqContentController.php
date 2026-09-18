<?php

namespace App\Http\Controllers;

use App\Models\HomeContent;
use App\Services\AutoTranslationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Support\ContentMerge;

class FaqContentController extends Controller
{
    protected const KEY = 'faq';

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
            abort(403, 'Only admins can edit the FAQ page content.');
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
            Log::error('FaqContentController@update: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to save FAQ page content.'], 500);
        }

        return response()->json(['message' => 'FAQ page content updated.', 'data' => $record->data]);
    }

    protected function defaultContent(): array
    {
        $categories = ['Safe Buying', 'Viewings & Agents', 'Payments', 'Ownership & Legal', 'Rental & Management', 'Visas & Bank', 'Support'];

        $questions = [
            ['number' => 1, 'category' => 'Safe Buying', 'question' => 'How can I ensure that I do not lose my money when buying a property abroad?', 'answer' => "Work only with a licensed, reputable agency and verify the developer's track record before paying anything. Read the full contract, confirm the registration status of the land and building, and use independent legal advice rather than relying solely on the seller's paperwork."],
            ['number' => 2, 'category' => 'Viewings & Agents', 'question' => 'How do I organize a viewing appointment in Hurghada or the Red Sea area?', 'answer' => 'Share your travel dates, budget, and preferred areas with an advisor, who can shortlist matching units and book either an in-person tour or a live video walkthrough. Viewings are typically arranged within a few days once your preferences are confirmed.'],
            ['number' => 3, 'category' => 'Viewings & Agents', 'question' => 'Why should I hire an estate agent?', 'answer' => 'An experienced agent filters out unsuitable listings, negotiates on your behalf, and flags contract or pricing issues before you commit. This saves time and reduces the risk of overpaying or missing important details.'],
            ['number' => 4, 'category' => 'Safe Buying', 'question' => 'How do I find the right real estate agent?', 'answer' => "Look for an agent with verifiable local experience, clear company registration, transparent pricing, and genuine client reviews. A trustworthy agent will never rush you into reserving before you've reviewed the contract and payment terms."],
            ['number' => 5, 'category' => 'Rental & Management', 'question' => 'Can I rent my apartment in Egypt-Hurghada directly by myself?', 'answer' => 'Yes, self-managed rentals are possible, though most owners choose a rental-management service for guest communication, cleaning, and maintenance. An advisor can help you compare self-managed and fully-managed options based on how often you visit.'],
            ['number' => 6, 'category' => 'Visas & Bank', 'question' => 'Can I open a bank account in Egypt-Hurghada?', 'answer' => "Yes, foreign buyers can generally open a local account with a valid passport, visa, and proof of property purchase, though exact requirements vary by bank. It's best to confirm the current document list with the bank branch before your appointment."],
            ['number' => 7, 'category' => 'Ownership & Legal', 'question' => 'How much residential property can I buy?', 'answer' => "There's no general limit on the number of residential units a foreign buyer can own in Egypt, though large portfolios or company purchases can involve additional steps. A lawyer can confirm any restrictions relevant to your specific situation."],
            ['number' => 8, 'category' => 'Ownership & Legal', 'question' => 'Who inherits our property if one of us dies?', 'answer' => "Inheritance follows the ownership structure on the contract together with applicable inheritance law, so it's worth reviewing this with a lawyer before signing. Clear documentation at the time of purchase makes the succession process much simpler later."],
            ['number' => 9, 'category' => 'Rental & Management', 'question' => 'Can I buy furniture at reasonable prices?', 'answer' => 'Yes, furnishing packages at a range of budgets are available locally, and an advisor can introduce trusted suppliers based on your style and budget. Bundled packages are often more cost-effective than furnishing piece by piece.'],
            ['number' => 10, 'category' => 'Support', 'question' => 'What do I do if I have any further questions?', 'answer' => 'Reach out any time by phone, email, WhatsApp, or the enquiry form on this page, and an advisor will respond with guidance on buying, viewing, payment plans, ownership, rentals, or after-sales support.'],
            ['number' => 11, 'category' => 'Safe Buying', 'question' => 'How should I choose my real estate?', 'answer' => 'Start with your purpose — holiday use, rental income, long-term investment, retirement, or relocation — since that shapes which area and property type suit you best. From there, compare developer history, delivery track record, facilities, maintenance fees, and resale potential.'],
            ['number' => 12, 'category' => 'Payments', 'question' => 'When is it good to enter the market?', 'answer' => 'Timing depends on your budget, risk tolerance, and how soon you want to move in. Early-stage projects often offer lower prices and flexible payment plans, while completed units cost more upfront but remove delivery-timeline uncertainty.'],
            ['number' => 13, 'category' => 'Payments', 'question' => 'How is the payment made?', 'answer' => 'Payments are usually made by bank transfer or cash according to the schedule set out in the reservation and purchase contract. Always confirm the receiving account details, receipts, and any maintenance or transfer fees before sending money.'],
            ['number' => 14, 'category' => 'Ownership & Legal', 'question' => 'How is the contract signed?', 'answer' => "If you can't travel to Hurghada in person, signing can often be coordinated remotely through a power of attorney or courier-based signature process. Confirm the accepted signing method and have a lawyer review the document beforehand."],
            ['number' => 15, 'category' => 'Payments', 'question' => 'What happens if I can no longer pay the installments?', 'answer' => "Default terms are set out in the purchase contract, so it's important to understand grace periods, penalties, and refund conditions before signing. If a payment problem arises, speak to your advisor and a lawyer early to explore rescheduling or resale options."],
            ['number' => 16, 'category' => 'Rental & Management', 'question' => 'How can I manage the investment remotely?', 'answer' => "A rental-management company can handle marketing, bookings, cleaning, guest support, and reporting on your behalf, which is especially useful for owners who don't live locally. Larger developments sometimes offer this service in-house."],
            ['number' => 17, 'category' => 'Ownership & Legal', 'question' => 'Is the ownership for life or lease?', 'answer' => 'In Hurghada, residential ownership is typically freehold and can be passed on through inheritance, though ownership structures can differ elsewhere in Egypt. Always confirm the exact ownership basis for your specific property with a lawyer.'],
            ['number' => 18, 'category' => 'Ownership & Legal', 'question' => 'Can I resell my property?', 'answer' => 'Yes, resale is generally possible, though the contract may restrict resale until the unit is fully paid or developer approval is granted. Check the resale clause, transfer fees, and any outstanding payment balance before listing it.'],
            ['number' => 19, 'category' => 'Visas & Bank', 'question' => 'Can I get a resident visa and bank account?', 'answer' => 'Buyers may qualify for a renewable residency visa and a local bank account based on their purchase, though requirements can change over time. Confirm the current criteria before relying on either as part of your plans.'],
            ['number' => 20, 'category' => 'Ownership & Legal', 'question' => 'What documents are still required after completion?', 'answer' => 'After handover, buyers typically need to register the purchase contract and gather supporting documents such as passport copies, utility contracts, and any power-of-attorney paperwork. A lawyer can confirm the exact checklist for your property.'],
            ['number' => 21, 'category' => 'Ownership & Legal', 'question' => 'Can I contact a local lawyer?', 'answer' => 'Yes, the team can introduce buyers to a reliable, multilingual lawyer before purchase so contract, registration, inheritance, and ownership questions can be reviewed professionally.'],
            ['number' => 22, 'category' => 'Ownership & Legal', 'question' => 'What is the ownership registration process for an apartment or villa in Hurghada?', 'answer' => "Registration generally involves confirming the land and building documentation, declared value, applicable fees, and whether the property already has the required registration basis. Timelines vary, so it's worth asking for a case-specific estimate."],
            ['number' => 23, 'category' => 'Visas & Bank', 'question' => 'What should I know about passport and tourist visas?', 'answer' => 'Entry requirements depend on your nationality and travel purpose, and visa rules can change, so confirm the latest requirements through official Egyptian sources, the nearest embassy, or your travel advisor before departure.'],
            ['number' => 24, 'category' => 'Ownership & Legal', 'question' => 'What is the process of buying property and signing the contract?', 'answer' => 'A typical process includes selecting the unit, reviewing the reservation terms, preparing the sale contract, confirming seller or developer documents, signing each page, and completing any required registration steps.'],
            ['number' => 25, 'category' => 'Ownership & Legal', 'question' => 'What is Taukil?', 'answer' => "Taukil is a power of attorney used in Egyptian property transactions, allowing a representative to act on the buyer's behalf for ownership, sale, or management matters. A lawyer should explain its scope before you sign or accept one."],
            ['number' => 26, 'category' => 'Ownership & Legal', 'question' => 'What is Sahih Taukia and why register the sale contract in court?', 'answer' => "Sahih Taukia is court registration that authenticates the sale contract and confirms the transaction, offering a layer of protection distinct from the property's title documents. A lawyer can advise which registration route applies to your purchase."],
            ['number' => 27, 'category' => 'Viewings & Agents', 'question' => 'Why do you need a Realtor in Egypt?', 'answer' => 'A reputable realtor helps buyers navigate local pricing, compare projects, check legal documents, communicate with developers, and manage negotiation and registration steps — particularly valuable for international buyers unfamiliar with the market.'],
        ];

        return [
            'hero' => [
                'eyebrow'         => 'FAQ · NEXUS CAPITAL',
                'title_prefix'    => 'Questions Before Buying',
                'title_highlight' => 'Property in Hurghada?',
                'description'     => 'A modern, searchable FAQ hub for Red Sea buyers, owners, and investors. Find clear answers about viewings, payments, ownership, documents, visas, rental management, and after-sales support.',
                'primary_cta'     => 'SEARCH FAQ',
                'secondary_cta'   => 'ASK ON WHATSAPP',
                'stats' => [
                    ['value' => (string) count($questions), 'label' => 'Buyer questions'],
                    ['value' => count($categories) - 1 . '+', 'label' => 'Topic groups'],
                    ['value' => '2026', 'label' => 'Updated design system'],
                ],
            ],

            'request_panel' => [
                'title'       => 'Ask Your Question',
                'subtitle'    => 'Send your property question directly to a Nexus Capital advisor.',
                'topic_options'  => $categories,
                'status_options' => ['First-time buyer', 'Comparing options', 'Ready to reserve', 'Existing owner'],
                'submit_whatsapp_label' => 'SEND ON WHATSAPP',
                'submit_email_label'    => 'SEND EMAIL',
                'form_disclaimer' => 'Choose WhatsApp for instant chat, or Send Email to submit your completed question. Do not include passport, banking, payment-card, or other sensitive information. General information only; request professional legal advice for contract or ownership decisions.',
            ],

            'trust_items' => [
                ['title' => 'Trust & Safety', 'description' => 'Understand how to reduce risk before buying property abroad.'],
                ['title' => 'Viewing Support', 'description' => 'Plan in-person or remote property viewings across Hurghada and the Red Sea.'],
                ['title' => 'Ownership Clarity', 'description' => 'Review key terms such as Taukil, Green Contract, resale, and registration.'],
                ['title' => 'Advisor Response', 'description' => 'Ask any question and continue with the team through WhatsApp.'],
            ],

            'topics_section' => [
                'eyebrow'     => 'CHOOSE A TOPIC',
                'title'       => 'Find the answer by buyer stage',
                'description' => 'FAQ categories are designed for international buyers who want fast clarity before booking a viewing, reserving a unit, transferring money, or planning after-sales support.',
                'items' => [
                    ['number' => '01', 'title' => 'Safe Buying', 'description' => 'How to reduce risk, choose the right property, and avoid poor decisions before reserving.'],
                    ['number' => '02', 'title' => 'Viewings & Agents', 'description' => 'How viewings, agent support, and local market knowledge help international buyers.'],
                    ['number' => '03', 'title' => 'Payments', 'description' => 'Cash, transfers, installments, payment-plan risk, and what to confirm before signing.'],
                    ['number' => '04', 'title' => 'Ownership & Legal', 'description' => 'Ownership, inheritance, resale, contract signing, Green Contract, Taukil, and registration.'],
                    ['number' => '05', 'title' => 'Rental & Management', 'description' => 'Furniture, remote management, rental support, cleaning, maintenance, and owner services.'],
                    ['number' => '06', 'title' => 'Visas & Bank', 'description' => 'Bank accounts, residency, tourist visas, and documents to confirm before travel.'],
                ],
            ],

            'browser_section' => [
                'eyebrow'     => 'SEARCH THE FAQ',
                'title'       => 'Buyer questions, grouped and searchable',
                'description_template' => '{count} answers are currently visible. Use the search field or category filters to narrow the list.',
                'search_placeholder' => 'Search FAQ',
                'open_all_label'  => 'OPEN ALL',
                'close_all_label' => 'CLOSE ALL',
                'all_questions_label' => 'All Questions',
                'copy_link_label' => 'COPY ANSWER LINK',
                'copied_label'    => 'LINK COPIED',
                'sidebar_title'   => 'Need a direct answer?',
                'sidebar_description' => 'Send your question on WhatsApp with your budget, preferred area, and buying timeline.',
                'sidebar_cta_label' => 'WHATSAPP ADVISOR',
            ],

            'categories' => $categories,
            'questions'  => $questions,
        ];
    }
}
