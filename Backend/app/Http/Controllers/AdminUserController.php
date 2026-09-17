<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Rules\StrongPassword;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    /**
     * List all users for admin, optionally filtered by role.
     */
    public function index(Request $request): JsonResponse
    {
        /** @var \App\Models\User|null $admin */
        $admin = $request->user();

        if (! $admin || ! $admin->isAdmin()) {
            abort(403, 'Only admins can list users.');
        }

        $query = User::query()->latest();

        if ($role = $request->query('role')) {
            $query->where('role', $role);
        }

        $users = $query->get([
            'id',
            'name',
            'email',
            'role',
            'phone',
            'location',
            'is_approved',
            'created_at',
        ]);

        return response()->json([
            'users' => $users,
        ]);
    }

    /**
     * Create a new user (admin, agent, or user) from the dashboard.
     */
    public function store(Request $request): JsonResponse
    {
        /** @var \App\Models\User|null $admin */
        $admin = $request->user();

        if (! $admin || ! $admin->isAdmin()) {
            abort(403, 'Only admins can create users.');
        }

        $data = $request->validate([
            'full_name' => ['required_without:name', 'string', 'max:255'],
            'name' => ['required_without:full_name', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users,email',
            ],
            'password' => ['required', 'string', 'min:8', 'confirmed', new StrongPassword()],
            'role' => ['required', 'string', Rule::in(['admin', 'agent', 'user'])],
            'phone' => ['nullable', 'string', 'max:50'],
            'location' => ['nullable', 'string', 'max:255'],
            'avatar' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:10240'],
        ]);

        $frontendUrl = rtrim(env('FRONTEND_URLS', config('app.url')), '/');

        $user = User::create([
            'name' => $data['full_name'] ?? $data['name'],
            'email' => $data['email'],
            'password' => $data['password'], // hashed automatically by cast
            'role' => $data['role'],
            'is_approved' => true,
            'phone' => $data['phone'] ?? null,
            'location' => $data['location'] ?? null,
        ]);

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('users/avatars', 'uploads');
            $user->avatar_url = $frontendUrl . '/storage/' . $path;
            $user->save();
        }

        return response()->json([
            'message' => 'User created successfully.',
            'user' => $user,
        ], 201);
    }

    /**
     * Show a single user for the admin edit form.
     */
    public function show(Request $request, $id): JsonResponse
    {
        /** @var \App\Models\User|null $admin */
        $admin = $request->user();

        if (! $admin || ! $admin->isAdmin()) {
            abort(403, 'Only admins can view user details.');
        }

        $user = User::findOrFail($id);

        return response()->json(['user' => $user]);
    }

    /**
     * Update an existing user's profile (name, email, phone, location,
     * role, and optionally the avatar) from the dashboard.
     */
    public function update(Request $request, $id): JsonResponse
    {
        /** @var \App\Models\User|null $admin */
        $admin = $request->user();

        if (! $admin || ! $admin->isAdmin()) {
            abort(403, 'Only admins can update users.');
        }

        $user = User::findOrFail($id);

        $data = $request->validate([
            'full_name' => ['nullable', 'string', 'max:255'],
            'name' => ['nullable', 'string', 'max:255'],
            'email' => [
                'nullable',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'role' => ['nullable', 'string', Rule::in(['admin', 'agent', 'user'])],
            'phone' => ['nullable', 'string', 'max:50'],
            'location' => ['nullable', 'string', 'max:255'],
            'avatar' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:10240'],
            'remove_avatar' => ['nullable', 'boolean'],
        ]);

        $frontendUrl = rtrim(env('FRONTEND_URLS', config('app.url')), '/');

        if (array_key_exists('full_name', $data) && $data['full_name']) {
            $user->name = $data['full_name'];
        } elseif (array_key_exists('name', $data) && $data['name']) {
            $user->name = $data['name'];
        }
        if (array_key_exists('email', $data) && $data['email']) {
            $user->email = $data['email'];
        }
        if (array_key_exists('role', $data) && $data['role']) {
            $user->role = $data['role'];
        }
        if ($request->has('phone')) {
            $user->phone = $data['phone'] ?? null;
        }
        if ($request->has('location')) {
            $user->location = $data['location'] ?? null;
        }

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('users/avatars', 'uploads');
            $user->avatar_url = $frontendUrl . '/storage/' . $path;
        } elseif (filter_var($request->input('remove_avatar'), FILTER_VALIDATE_BOOLEAN)) {
            $user->avatar_url = null;
        }

        $user->save();

        return response()->json([
            'message' => 'User updated successfully.',
            'user' => $user,
        ]);
    }

    /**
     * Change a user's password (admin-initiated reset).
     */
    public function changePassword(Request $request, $id): JsonResponse
    {
        /** @var \App\Models\User|null $admin */
        $admin = $request->user();

        if (! $admin || ! $admin->isAdmin()) {
            abort(403, 'Only admins can reset passwords.');
        }

        $user = User::findOrFail($id);

        $data = $request->validate([
            'password' => ['required', 'string', 'min:8', 'confirmed', new StrongPassword()],
        ]);

        $user->password = $data['password']; // hashed automatically by cast
        $user->save();

        return response()->json(['message' => 'Password updated successfully.']);
    }

    /**
     * Toggle a user's approval/active status.
     */
    public function toggleStatus(Request $request, $id): JsonResponse
    {
        /** @var \App\Models\User|null $admin */
        $admin = $request->user();

        if (! $admin || ! $admin->isAdmin()) {
            abort(403, 'Only admins can change user status.');
        }

        $user = User::findOrFail($id);

        $user->is_approved = ! $user->is_approved;
        $user->save();

        return response()->json([
            'message' => 'User status updated.',
            'user' => $user,
        ]);
    }

    /**
     * Delete a user.
     */
    public function destroy(Request $request, $id): JsonResponse
    {
        /** @var \App\Models\User|null $admin */
        $admin = $request->user();

        if (! $admin || ! $admin->isAdmin()) {
            abort(403, 'Only admins can delete users.');
        }

        $user = User::findOrFail($id);

        if ($admin->id === $user->id) {
            return response()->json(['message' => 'You cannot delete your own account.'], 422);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully.']);
    }
}

