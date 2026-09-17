<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AgentApprovalController extends Controller
{
    /**
     * List pending agent requests (admin only).
     */
    public function index(Request $request): JsonResponse
    {
        /** @var \App\Models\User|null $admin */
        $admin = $request->user();

        if (! $admin || ! $admin->isAdmin()) {
            abort(403, 'Only admins can view agent requests.');
        }

        $agents = User::query()
            ->where('role', 'agent')
            ->where('is_approved', false)
            ->latest()
            ->get([
                'id',
                'name',
                'email',
                'phone',
                'location',
                'created_at',
            ]);

        return response()->json([
            'agents' => $agents,
        ]);
    }

    /**
     * Approve a pending agent (admin only).
     */
    public function approve(Request $request, User $user): JsonResponse
    {
        /** @var \App\Models\User|null $admin */
        $admin = $request->user();

        if (! $admin || ! $admin->isAdmin()) {
            abort(403, 'Only admins can approve agents.');
        }

        if (! $user->isAgent()) {
            abort(422, 'Only agent accounts can be approved.');
        }

        if ($user->is_approved) {
            return response()->json([
                'message' => 'Agent is already approved.',
                'user' => $user,
            ]);
        }

        $user->is_approved = true;
        $user->save();

        return response()->json([
            'message' => 'Agent approved successfully.',
            'user' => $user->fresh(),
        ]);
    }

    /**
     * Reject a pending agent request (admin only).
     */
    public function reject(Request $request, int $id): JsonResponse
    {
        /** @var \App\Models\User|null $admin */
        $admin = $request->user();

        if (! $admin || ! $admin->isAdmin()) {
            return response()->json([
                'message' => 'Only admins can reject agent requests.',
            ], 403);
        }

        try {
            $userModel = User::find($id);

            if (! $userModel) {
                return response()->json([
                    'message' => 'User not found.',
                ], 404);
            }

            if (! $userModel->isAgent()) {
                return response()->json([
                    'message' => 'Only agent accounts can be rejected.',
                ], 422);
            }

            if ($userModel->is_approved) {
                return response()->json([
                    'message' => 'Agent is already approved and cannot be rejected.',
                ], 422);
            }

            // Delete the user permanently (reject the request)
            // This will cascade delete related properties due to foreign key constraint
            $userModel->delete();

            return response()->json([
                'message' => 'Agent request rejected successfully.',
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to reject agent request', [
                'user_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Unable to reject this agent right now. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}
