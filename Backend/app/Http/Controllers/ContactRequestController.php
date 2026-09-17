<?php

namespace App\Http\Controllers;

use App\Models\ContactRequest;
use App\Models\Property;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ContactRequestController extends Controller
{
    /**
     * Store a new contact request for a specific property (public).
     */
    public function store(Request $request, Property $property): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'string', 'email', 'max:255'],
            'message' => ['nullable', 'string'],
        ]);

        $contactRequest = ContactRequest::create([
            'property_id' => $property->id,
            'agent_id' => $property->user_id,
            'name' => $data['name'],
            'phone' => $data['phone'] ?? null,
            'email' => $data['email'] ?? null,
            'message' => $data['message'] ?? null,
            'status' => 'new',
        ]);

        return response()->json([
            'message' => 'Your request has been sent successfully.',
            'contact_request' => $contactRequest,
        ], 201);
    }

    /**
     * Store a general contact request (not related to a specific property) - public.
     * These requests are visible only to admins.
     */
    public function storeGeneral(Request $request): JsonResponse
    {
        try {
            $data = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'phone' => ['nullable', 'string', 'max:50'],
                'email' => ['nullable', 'string', 'email', 'max:255'],
                'subject' => ['nullable', 'string', 'max:255'],
                'message' => ['nullable', 'string'],
            ]);

            $contactRequest = ContactRequest::create([
                'property_id' => null, // No property associated
                'agent_id' => null, // No agent - only admins see this
                'name' => $data['name'],
                'phone' => $data['phone'] ?? null,
                'email' => $data['email'] ?? null,
                'message' => ($data['subject'] ? $data['subject'] . "\n\n" : '') . ($data['message'] ?? ''),
                'status' => 'new',
            ]);

            return response()->json([
                'message' => 'Your request has been sent successfully.',
                'contact_request' => $contactRequest,
            ], 201);
        } catch (\Illuminate\Database\QueryException $e) {
            // Check if the error is related to property_id being NOT NULL
            if (str_contains($e->getMessage(), 'property_id') || str_contains($e->getMessage(), 'NOT NULL')) {
                Log::error('Contact request creation failed: property_id column is not nullable. Please run migration: 2025_12_08_030353_make_property_id_nullable_in_contact_requests_table', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);

                return response()->json([
                    'message' => 'Database configuration error. Please contact the administrator.',
                    'error' => 'Migration required: property_id column must be nullable',
                ], 500);
            }

            // Log other database errors
            Log::error('Contact request creation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Failed to send your request. Please try again later.',
                'error' => 'Database error occurred',
            ], 500);
        } catch (\Exception $e) {
            Log::error('Contact request creation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Failed to send your request. Please try again later.',
                'error' => 'An unexpected error occurred',
            ], 500);
        }
    }

    /**
     * List contact requests for dashboard:
     * - Admin: sees all requests
     * - Agent: sees only requests related to his properties
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user) {
            abort(401);
        }

        if (! $user->isAdmin() && ! $user->isAgent()) {
            abort(403, 'Only admins and agents can view contact requests.');
        }

        $query = ContactRequest::with([
            'property:id,title,location,deal_type,price,user_id',
        ])->latest();

        if ($user->isAgent()) {
            // Agents only see requests related to their properties
            $query->where('agent_id', $user->id);
        }
        // Admins see all requests (including general contact requests with null property_id)

        $requests = $query->get();

        return response()->json([
            'contact_requests' => $requests,
        ]);
    }
}
