<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    /**
     * List invoices.
     * Admin sees all, agent sees own invoices only.
     */
    public function index(Request $request): JsonResponse
    {
        /** @var \App\Models\User|null $user */
        $user = $request->user();

        if (! $user) {
            abort(401);
        }

        $query = Invoice::with([
            'user:id,name,email',
            'property:id,title',
        ])->latest();

        if (! $user->isAdmin()) {
            if (! $user->isAgent()) {
                abort(403, 'Only admins and agents can view invoices.');
            }

            $query->where('user_id', $user->id);
        }

        $invoices = $query->get();

        return response()->json([
            'invoices' => $invoices,
        ]);
    }

    /**
     * Create a new invoice.
     * Admin and agents can create invoices.
     */
    public function store(Request $request): JsonResponse
    {
        /** @var \App\Models\User|null $user */
        $user = $request->user();

        if (! $user || (! $user->isAdmin() && ! $user->isAgent())) {
            abort(403, 'Only admins and agents can create invoices.');
        }

        $data = $request->validate([
            'property_id' => ['nullable', 'integer', 'exists:properties,id'],
            'amount' => ['required', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:3'],
            'status' => ['nullable', 'string', 'max:50'],
            'description' => ['nullable', 'string', 'max:500'],
        ]);

        $invoice = Invoice::create([
            'user_id' => $user->id,
            'property_id' => $data['property_id'] ?? null,
            'amount' => $data['amount'],
            'currency' => $data['currency'] ?? 'AED',
            'status' => $data['status'] ?? 'pending',
            'description' => $data['description'] ?? null,
        ]);

        return response()->json([
            'message' => 'Invoice created successfully.',
            'invoice' => $invoice->load(['user:id,name,email', 'property:id,title']),
        ], 201);
    }
}

