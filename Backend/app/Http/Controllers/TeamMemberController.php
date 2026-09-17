<?php

namespace App\Http\Controllers;

use App\Models\TeamMember;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TeamMemberController extends Controller
{
    /**
     * Public: list all active team members, grouped by department.
     */
    public function index(Request $request): JsonResponse
    {
        $lang = $request->query('lang', 'en');

        $members = TeamMember::query()
            ->where('is_active', true)
            ->orderBy('department')->orderBy('sort_order')->orderBy('id')
            ->get()
            ->map(fn (TeamMember $member) => $member->toLocalizedArray($lang, $member->toArray()));

        return response()->json(['data' => $members]);
    }

    /**
     * Admin/dashboard: list every team member, including inactive ones.
     */
    public function indexAll(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        $members = TeamMember::query()
            ->orderBy('department')->orderBy('sort_order')->orderBy('id')
            ->get();

        return response()->json(['data' => $members]);
    }

    public function show(Request $request, TeamMember $teamMember): JsonResponse
    {
        $lang = $request->query('lang', 'en');
        return response()->json(['data' => $teamMember->toLocalizedArray($lang, $teamMember->toArray())]);
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        $data = $this->validateData($request);
        $member = new TeamMember($data);
        $this->handlePhoto($request, $member);
        $member->save();

        return response()->json(['message' => 'Team member added.', 'data' => $member], 201);
    }

    public function update(Request $request, TeamMember $teamMember): JsonResponse
    {
        $this->authorizeAdmin($request);

        $data = $this->validateData($request);
        $teamMember->fill($data);
        $this->handlePhoto($request, $teamMember);
        $teamMember->save();

        return response()->json(['message' => 'Team member updated.', 'data' => $teamMember]);
    }

    public function destroy(Request $request, TeamMember $teamMember): JsonResponse
    {
        $this->authorizeAdmin($request);
        $teamMember->delete();

        return response()->json(['message' => 'Team member removed.']);
    }

    protected function authorizeAdmin(Request $request): void
    {
        $user = $request->user();
        if (!$user || !$user->hasRole('admin')) {
            abort(403, 'Only admins can manage team members.');
        }
    }

    protected function validateData(Request $request): array
    {
        $validated = $request->validate([
            'name'                 => ['required', 'string', 'max:255'],
            'title'                => ['nullable', 'string', 'max:255'],
            'bio'                  => ['nullable', 'string'],
            'department'           => ['required', 'string', 'max:100'],
            'years_of_experience'  => ['nullable', 'string', 'max:100'],
            'specialization'       => ['nullable', 'string', 'max:255'],
            'location'             => ['nullable', 'string', 'max:255'],
            'expertise'            => ['nullable', 'string'],
            'languages'            => ['nullable', 'string'],
            'phone'                => ['nullable', 'string', 'max:50'],
            'whatsapp'             => ['nullable', 'string', 'max:50'],
            'email'                => ['nullable', 'string', 'email', 'max:255'],
            'linkedin_url'         => ['nullable', 'string', 'max:255'],
            'sort_order'           => ['nullable', 'integer'],
            'is_active'            => ['nullable'],
            'photo'                => ['nullable', 'image', 'max:8192'],
        ]);

        // expertise/languages arrive as JSON-encoded arrays in a multipart form.
        foreach (['expertise', 'languages'] as $field) {
            if (isset($validated[$field])) {
                $decoded = json_decode($validated[$field], true);
                $validated[$field] = is_array($decoded) ? $decoded : [];
            }
        }

        if (array_key_exists('is_active', $validated)) {
            $validated['is_active'] = filter_var($validated['is_active'], FILTER_VALIDATE_BOOL);
        }

        unset($validated['photo']); // handled separately as a file upload

        return $validated;
    }

    protected function handlePhoto(Request $request, TeamMember $member): void
    {
        if ($request->hasFile('photo')) {
            try {
                $path = $request->file('photo')->store('team', 'uploads');
                $member->photo = rtrim(env('FRONTEND_URLS', config('app.url')), '/') . '/storage/' . ltrim($path, '/');
            } catch (\Throwable $e) {
                Log::error('TeamMemberController: photo upload failed: ' . $e->getMessage());
            }
        }
    }
}
