<?php

namespace App\Http\Controllers;

use App\Models\ContactRequest;
use App\Models\Invoice;
use App\Models\Property;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminReportController extends Controller
{
    /**
     * Aggregate summary for dashboard reports.
     */
    public function summary(Request $request): JsonResponse
    {
        /** @var \App\Models\User|null $admin */
        $admin = $request->user();

        if (! $admin || ! $admin->isAdmin()) {
            abort(403, 'Only admins can view reports.');
        }

        $properties = [
            'total' => Property::count(),
            'active' => Property::where('is_active', true)->count(),
            'deleted' => Property::onlyTrashed()->count(),
        ];

        $users = [
            'total' => User::count(),
            'admins' => User::where('role', 'admin')->count(),
            'agents' => User::where('role', 'agent')->count(),
            'customers' => User::where('role', 'user')->count(),
        ];

        $contactRequests = [
            'total' => ContactRequest::count(),
            'new' => ContactRequest::where('status', 'new')->count(),
        ];

        $invoices = [
            'total' => Invoice::count(),
            'total_amount' => (float) Invoice::sum('amount'),
        ];

        return response()->json([
            'properties' => $properties,
            'users' => $users,
            'contact_requests' => $contactRequests,
            'invoices' => $invoices,
        ]);
    }
}

