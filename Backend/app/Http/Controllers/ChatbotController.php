<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Property;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatbotController extends Controller
{
    protected const MAX_HISTORY_MESSAGES = 12; // keep the request small & fast

    public function chat(Request $request): JsonResponse
    {
        $request->validate([
            'message' => ['required', 'string', 'max:1000'],
            'history' => ['nullable', 'array'],
            'history.*.role' => ['required_with:history', 'in:user,assistant'],
            'history.*.content' => ['required_with:history', 'string'],
        ]);

        $apiKey = env('GEMINI_API_KEY');
        if (!$apiKey) {
            return response()->json([
                'reply' => "I'm not fully set up yet — please contact us directly on WhatsApp and our team will help right away.",
                'configured' => false,
            ]);
        }

        $history = array_slice($request->input('history', []), -self::MAX_HISTORY_MESSAGES);
        $turns = array_merge($history, [
            ['role' => 'user', 'content' => $request->input('message')],
        ]);

        // Gemini uses "model" instead of "assistant" for the bot's turns, and
        // wraps each message's text inside a "parts" array.
        $contents = array_map(function ($turn) {
            return [
                'role' => $turn['role'] === 'assistant' ? 'model' : 'user',
                'parts' => [['text' => $turn['content']]],
            ];
        }, $turns);

        $model = env('GEMINI_CHAT_MODEL', 'gemini-3.6-flash');

        try {
            $response = Http::timeout(20)->post(
                "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}",
                [
                    'system_instruction' => [
                        'parts' => [['text' => $this->systemPrompt()]],
                    ],
                    'contents' => $contents,
                    'generationConfig' => [
                        'maxOutputTokens' => 800,
                    ],
                ]
            );

            if (!$response->ok()) {
                Log::error('ChatbotController: Gemini API error: ' . $response->body());
                return response()->json([
                    'reply' => "Sorry, I'm having trouble answering right now. You can reach our team directly on WhatsApp for immediate help.",
                    'configured' => true,
                    'error' => true,
                ], 200);
            }

            $data = $response->json();
            $parts = $data['candidates'][0]['content']['parts'] ?? [];

            // This model does internal "thinking" before answering — Google
            // marks those internal reasoning parts with thought:true, so we
            // only keep the genuine, final answer text and ignore the rest.
            $text = collect($parts)
                ->filter(fn ($part) => empty($part['thought']) && !empty($part['text']))
                ->pluck('text')
                ->implode("\n");

            // Safety net: strip any markdown bold/heading symbols the model
            // might still slip in, since the widget only renders plain text.
            $text = trim(preg_replace('/[*#]{1,3}/', '', (string) $text));

            return response()->json([
                'reply' => $text ?: "Sorry, I didn't quite catch that — could you rephrase your question?",
                'configured' => true,
            ]);
        } catch (\Throwable $e) {
            Log::error('ChatbotController@chat: ' . $e->getMessage());
            return response()->json([
                'reply' => "Sorry, something went wrong. Please try again or reach us on WhatsApp.",
                'configured' => true,
                'error' => true,
            ], 200);
        }
    }

    /**
     * Builds the system prompt: who the assistant is, what Nexus Capital
     * offers, and a short live snapshot of a few featured projects so the
     * assistant can answer with real, current details instead of guessing.
     */
    protected function systemPrompt(): string
    {
        $projectsSummary = $this->featuredProjectsSummary();
        $propertiesSummary = $this->availablePropertiesSummary();

        return <<<PROMPT
You are the friendly property assistant for Nexus Capital, a real estate investment company specializing in Red Sea properties in Hurghada, Egypt (areas include Al Ahyaa, Sahl Hasheesh, El Gouna, Makadi Bay, Soma Bay).

Nexus Capital offers:
- Buying and renting apartments, studios, villas, penthouses, duplexes, and compounds on the Red Sea coast.
- Off-plan project sales with flexible payment plans (down payment + installments over several years).
- Legal Services: property due diligence, contract review, ownership verification, registration, power of attorney.
- Rental Services: property listing, tenant screening, rent collection, maintenance coordination, short-term/holiday rentals.
- Furniture & Furnishing: Basic, Premium, and Luxury furnishing packages for properties.
- A team organized by Sales, Rental, Marketing, Management, and Customer Service departments.

A few currently featured off-plan/resale PROJECTS (multi-unit developments — for reference, always tell the user to confirm exact pricing and availability with an advisor since details change):
{$projectsSummary}

A few currently listed individual PROPERTIES/UNITS (single apartments, studios, villas, etc. available now — for reference, always tell the user to confirm exact pricing and availability with an advisor since details change):
{$propertiesSummary}

Your job:
- Answer questions about buying, renting, pricing ranges, locations, payment plans, legal steps, rental management, and furnishing in a warm, concise, helpful way.
- If asked about a specific unit's exact price, availability, or floor plan, say pricing/availability should be confirmed live with an advisor (do not invent numbers not shown above).
- For anything you're not sure about, or if the visitor wants to book a viewing, get a personalized shortlist, or speak to a human, suggest contacting the team on WhatsApp.
- Keep answers short (2-5 sentences) and conversational — this is a chat widget, not an essay.
- Reply in the same language the visitor is writing in.
- Write in plain text only — no markdown, no asterisks, no bullet symbols, no headings. Use plain sentences or simple line breaks instead.
- When you mention a specific multi-unit PROJECT by name, include its page link on its own line straight after, using exactly this format: /projects/{slug} (using the slug shown next to that project above). Do not invent a slug for a project not listed above.
- When you mention a specific individual PROPERTY/unit by its listed details, include its page link on its own line straight after, using exactly this format: /properties/{id} (using the id shown next to that property above). Do not invent an id for a property not listed above.
- Never invent legal, financial, or contractual guarantees. For legal/contract questions, mention Nexus Capital's legal consultant can help via the Legal Services page.
PROMPT;
    }

    protected function featuredProjectsSummary(): string
    {
        try {
            $projects = Project::query()
                ->where('is_featured', true)
                ->orWhere('is_active', true)
                ->limit(20)
                ->get(['title', 'slug', 'location', 'starting_price', 'currency', 'delivery_date']);

            if ($projects->isEmpty()) {
                return "(No live project data available right now — always direct pricing questions to an advisor.)";
            }

            return $projects->map(function ($p) {
                $price = $p->starting_price ? ($p->currency ?? '€') . number_format((float) $p->starting_price) : 'price on request';
                return "- {$p->title} | slug: {$p->slug} | {$p->location} | from {$price} | delivery {$p->delivery_date}";
            })->implode("\n");
        } catch (\Throwable $e) {
            return "(Live project data unavailable — always direct pricing questions to an advisor.)";
        }
    }

    protected function availablePropertiesSummary(): string
    {
        try {
            $properties = Property::query()
                ->where('is_active', true)
                ->where('is_sold', false)
                ->limit(25)
                ->get(['id', 'title', 'property_type', 'bedrooms', 'price', 'location']);

            if ($properties->isEmpty()) {
                return "(No live property listings available right now — always direct availability questions to an advisor.)";
            }

            return $properties->map(function ($p) {
                $price = $p->price ? '€' . number_format((float) $p->price) : 'price on request';
                $beds = $p->bedrooms ? "{$p->bedrooms} bed" : '';
                return "- id: {$p->id} | {$p->title} | {$p->property_type} {$beds} | {$p->location} | {$price}";
            })->implode("\n");
        } catch (\Throwable $e) {
            return "(Live property data unavailable — always direct availability questions to an advisor.)";
        }
    }
}
