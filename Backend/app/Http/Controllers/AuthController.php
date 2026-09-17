<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Rules\StrongPassword;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    /**
     * Public registration for a new user or admin.
     * - user  → active immediately
     * - admin → created as pending (is_approved = false) and must be approved manually before login
     *
     * Agents should use the dedicated requestAgent endpoint instead.
     */
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed', new StrongPassword()],
            'role' => ['required', 'string', Rule::in(['admin', 'agent', 'user'])],
            'phone' => ['nullable', 'string', 'max:50'],
            'location' => ['nullable', 'string', 'max:255'],
        ]);

        // For public registration we only honour "admin" and "user" roles:
        // - user  → active immediately
        // - admin → pending approval (is_approved = false)
        $role = $data['role'] === 'admin' ? 'admin' : 'user';
        $isApproved = $role === 'user';

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'], // hashed automatically by cast
            'role' => $role,
            'is_approved' => $isApproved,
            'phone' => $data['phone'] ?? null,
            'location' => $data['location'] ?? null,
        ]);

        return response()->json([
            'message' => 'Registration successful.',
            'user' => $user,
        ], 201);
    }

    /**
     * Public endpoint for agents to request an account.
     * The created agent cannot login until approved by an admin.
     */
    public function requestAgent(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed', new StrongPassword()],
            'phone' => ['nullable', 'string', 'max:50'],
            'location' => ['nullable', 'string', 'max:255'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'], // hashed automatically by cast
            'role' => 'agent',
            'is_approved' => false,
            'phone' => $data['phone'] ?? null,
            'location' => $data['location'] ?? null,
        ]);

        return response()->json([
            'message' => 'Your agent request has been submitted and is pending admin approval.',
        ], 201);
    }

    /**
     * Login user and create a session.
     */
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            return response()->json([
                'message' => 'The provided credentials are incorrect.',
            ], 422);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (! $user->is_approved && ($user->isAgent() || $user->isAdmin())) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return response()->json([
                'message' => 'Your account is pending admin approval.',
                'pending_approval' => true,
                'role' => $user->role,
            ], 403);
        }

        $request->session()->regenerate();

        return response()->json([
            'message' => 'Login successful.',
            'user' => $user,
        ]);
    }

    /**
     * Logout current user and destroy the session.
     */
    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logged out successfully ✅.',
        ]);
    }

    /**
     * Get the authenticated user.
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }

    /**
     * Update the authenticated user's profile.
     */
    public function updateProfile(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        if (! $user) {
            abort(401);
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'phone' => ['nullable', 'string', 'max:50'],
            'location' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
            // avatar_url can be handled later via upload endpoint; keep simple for now
        ]);

        $user->update($data);

        return response()->json([
            'message' => 'Profile updated successfully.',
            'user' => $user->fresh(),
        ]);
    }
}
