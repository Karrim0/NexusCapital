<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Services\AutoTranslationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Project::query();

        $scope = $request->query('scope', 'public');
        if ($scope === 'public') {
            $query->where('is_active', true);
        } else {
            $user = $request->user();
            if (!$user) abort(401);
            if (!$user->hasRole('admin') && !$user->hasRole('agent')) {
                abort(403, 'Not allowed.');
            }
        }

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        $projects = $query->latest()->get();
        $frontendUrl = rtrim(env('FRONTEND_URLS', config('app.url')), '/');
        $lang = $request->query('lang', 'en');
        $data = $projects->map(function (Project $p) use ($frontendUrl, $lang) {
            $formatted = $this->formatProject($p, $frontendUrl);
            return $formatted->toLocalizedArray($lang, $formatted->toArray());
        });

        // Return as plain array so frontend Array.isArray() works
        return response()->json($data->values());
    }

    public function show(Request $request, Project $project): JsonResponse
    {
        try {
            $frontendUrl = rtrim(env('FRONTEND_URLS', config('app.url')), '/');
            $formatted = $this->formatProject($project, $frontendUrl);
            $lang = $request->query('lang', 'en');
            return response()->json($formatted->toLocalizedArray($lang, $formatted->toArray()));
        } catch (\Exception $e) {
            Log::error('ProjectController@show: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to load project.'], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            if (!$user || !$user->hasRole('admin')) {
                abort(403, 'Only admins can create projects.');
            }

            $request->merge([
                'is_featured' => filter_var($request->input('is_featured'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false,
                'is_active'   => filter_var($request->input('is_active'),   FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? true,
            ]);

            $data = $request->validate([
                'name'                  => ['required', 'string', 'max:255'],
                'description'           => ['nullable', 'string'],
                'location'              => ['required', 'string', 'max:255'],
                'district'              => ['nullable', 'string', 'max:255'],
                'delivery_date'         => ['nullable', 'string', 'max:100'],
                'starting_price'        => ['nullable', 'numeric', 'min:0'],
                'currency'              => ['nullable', 'string', 'in:USD,EUR,GBP,EGP'],
                'size_from'             => ['nullable', 'numeric', 'min:0'],
                'size_to'               => ['nullable', 'numeric', 'min:0'],
                'total_units'           => ['nullable', 'integer', 'min:0'],
                'status'                => ['nullable', 'string', 'max:100'],
                'facilities'            => ['nullable', 'string'],
                'investment_highlights' => ['nullable', 'string'],
                'project_details'       => ['nullable', 'string'],
                'location_advantage'    => ['nullable', 'string'],
                'architectural_vision'  => ['nullable', 'string'],
                'lifestyle_amenities'   => ['nullable', 'string'],
                'investment_potential'  => ['nullable', 'string'],
                'payment_plans'         => ['nullable', 'string'],
                'amenities'             => ['nullable', 'string'],
                'mins_from_airport'     => ['nullable', 'integer', 'min:0'],
                'mins_from_hospitals'   => ['nullable', 'integer', 'min:0'],
                'mins_from_downtown'    => ['nullable', 'integer', 'min:0'],
                'mins_from_beach'       => ['nullable', 'integer', 'min:0'],
                'location_description'  => ['nullable', 'string'],
                'map_embed_url'         => ['nullable', 'string'],
                'video_url'             => ['nullable', 'string'],
                'is_featured'           => ['boolean'],
                'is_active'             => ['boolean'],
                'badges'                => ['nullable', 'string'],
                'offer_discount_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
                'offer_deadline_label'  => ['nullable', 'string', 'max:255'],
                'residence_highlights'  => ['nullable', 'string'],
                'investment_cards'      => ['nullable', 'string'],
                'lifestyle_cards'       => ['nullable', 'string'],
                'payment_plan_rows'     => ['nullable', 'string'],
                'buyer_journey_steps'   => ['nullable', 'string'],
                'project_faqs'          => ['nullable', 'string'],
                'construction_progress' => ['nullable', 'string'],
                'travel_distances'      => ['nullable', 'string'],
                'master_plan'           => ['nullable', 'string'],
                'developer_track_record' => ['nullable', 'string'],
                'unit_types'            => ['nullable', 'string'],
                'main_image'            => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:102400'],
                'images'                => ['nullable', 'array'],
                'images.*'              => ['image', 'mimes:jpg,jpeg,png,webp', 'max:102400'],
                'image_captions'        => ['nullable', 'string'],
                'ground_floor_image'    => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:102400'],
                'typical_floors_image'  => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:102400'],
            ]);

            $frontendUrl = rtrim(env('FRONTEND_URLS', config('app.url')), '/');

            $coverImage = null;
            if ($request->hasFile('main_image')) {
                $path = $request->file('main_image')->store('projects/cover', 'uploads');
                $coverImage = $frontendUrl . '/storage/' . $path;
            }

            $gallery = [];
            if ($request->hasFile('images')) {
                $captions = json_decode($request->input('image_captions', '[]'), true) ?: [];
                foreach ($request->file('images') as $i => $image) {
                    $path = $image->store('projects/gallery', 'uploads');
                    $gallery[] = ['url' => $frontendUrl . '/storage/' . $path, 'caption' => $captions[$i] ?? null];
                }
            }

            $masterPlan = $this->decodeJsonField($data, 'master_plan') ?? [];
            if ($request->hasFile('ground_floor_image')) {
                $path = $request->file('ground_floor_image')->store('projects/masterplan', 'uploads');
                $masterPlan['ground_floor_image'] = $frontendUrl . '/storage/' . $path;
            }
            if ($request->hasFile('typical_floors_image')) {
                $path = $request->file('typical_floors_image')->store('projects/masterplan', 'uploads');
                $masterPlan['typical_floors_image'] = $frontendUrl . '/storage/' . $path;
            }

            $project = Project::create($createData = [
                'title'                => $data['name'],
                'overview'             => $data['description'] ?? null,
                'location'             => $data['location'],
                'delivery_date'        => $data['delivery_date'] ?? null,
                'starting_price'       => $data['starting_price'] ?? null,
                'currency'             => $data['currency'] ?? 'EUR',
                'starting_area'        => $data['size_from'] ?? null,
                'max_area'             => $data['size_to'] ?? null,
                'facilities'           => $data['facilities'] ?? null,
                'investment_info'      => $data['investment_highlights'] ?? null,
                'project_details'      => $data['project_details'] ?? null,
                'location_advantage'   => $data['location_advantage'] ?? null,
                'architectural_vision' => $data['architectural_vision'] ?? null,
                'lifestyle_amenities'  => $data['lifestyle_amenities'] ?? null,
                'investment_potential' => $data['investment_potential'] ?? null,
                'payment_plans'        => $data['payment_plans'] ?? null,
                'amenities'            => $data['amenities'] ?? null,
                'mins_from_airport'    => $data['mins_from_airport'] ?? null,
                'mins_from_hospitals'  => $data['mins_from_hospitals'] ?? null,
                'mins_from_downtown'   => $data['mins_from_downtown'] ?? null,
                'mins_from_beach'      => $data['mins_from_beach'] ?? null,
                'location_description' => $data['location_description'] ?? null,
                'map_embed_url'        => $data['map_embed_url'] ?? null,
                'video_url'            => $data['video_url'] ?? null,
                'is_featured'          => $data['is_featured'] ?? false,
                'is_active'            => $data['is_active'] ?? true,
                'badges'                => $this->decodeJsonField($data, 'badges'),
                'offer_discount_percent' => $data['offer_discount_percent'] ?? null,
                'offer_deadline_label'  => $data['offer_deadline_label'] ?? null,
                'residence_highlights'  => $this->decodeJsonField($data, 'residence_highlights'),
                'investment_cards'      => $this->decodeJsonField($data, 'investment_cards'),
                'lifestyle_cards'       => $this->decodeJsonField($data, 'lifestyle_cards'),
                'payment_plan_rows'     => $this->decodeJsonField($data, 'payment_plan_rows'),
                'buyer_journey_steps'   => $this->decodeJsonField($data, 'buyer_journey_steps'),
                'project_faqs'          => $this->decodeJsonField($data, 'project_faqs'),
                'construction_progress' => $this->decodeJsonField($data, 'construction_progress'),
                'travel_distances'      => $this->decodeJsonField($data, 'travel_distances'),
                'master_plan'           => $masterPlan,
                'developer_track_record' => $this->decodeJsonField($data, 'developer_track_record'),
                'unit_types'            => $this->decodeJsonField($data, 'unit_types'),
                'cover_image'          => $coverImage,
                'gallery'              => $gallery,
                'translations'         => AutoTranslationService::translate([
                    'title'                => $data['name'],
                    'overview'             => $data['description'] ?? null,
                    'project_details'      => $data['project_details'] ?? null,
                    'location_description' => $data['location_description'] ?? null,
                    'badges'                => $this->decodeJsonField($data, 'badges'),
                    'residence_highlights'  => $this->decodeJsonField($data, 'residence_highlights'),
                    'unit_types'            => $this->decodeJsonField($data, 'unit_types'),
                    'payment_plan_rows'     => $this->decodeJsonField($data, 'payment_plan_rows'),
                    'lifestyle_cards'       => $this->decodeJsonField($data, 'lifestyle_cards'),
                    'investment_cards'      => $this->decodeJsonField($data, 'investment_cards'),
                    'travel_distances'      => $this->decodeJsonField($data, 'travel_distances'),
                    'developer_track_record' => $this->decodeJsonField($data, 'developer_track_record'),
                    'project_faqs'          => $this->decodeJsonField($data, 'project_faqs'),
                    'offer_deadline_label'  => $data['offer_deadline_label'] ?? null,
                ], Project::$translatableFields),
            ]);

            return response()->json([
                'message' => 'Project created successfully.',
                'project' => $this->formatProject($project->fresh(), $frontendUrl),
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation failed.', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('ProjectController@store: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Failed to create project.', 'error' => config('app.debug') ? $e->getMessage() : 'Server error.'], 500);
        }
    }

    public function update(Request $request, Project $project): JsonResponse
    {
        try {
            $user = $request->user();
            if (!$user || !$user->hasRole('admin')) {
                abort(403, 'Only admins can update projects.');
            }

            if ($request->has('is_featured')) {
                $request->merge(['is_featured' => filter_var($request->input('is_featured'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false]);
            }
            if ($request->has('is_active')) {
                $request->merge(['is_active' => filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? true]);
            }

            $data = $request->validate([
                'name'                  => ['required', 'string', 'max:255'],
                'description'           => ['nullable', 'string'],
                'location'              => ['required', 'string', 'max:255'],
                'district'              => ['nullable', 'string', 'max:255'],
                'delivery_date'         => ['nullable', 'string', 'max:100'],
                'starting_price'        => ['nullable', 'numeric', 'min:0'],
                'currency'              => ['nullable', 'string', 'in:USD,EUR,GBP,EGP'],
                'size_from'             => ['nullable', 'numeric', 'min:0'],
                'size_to'               => ['nullable', 'numeric', 'min:0'],
                'total_units'           => ['nullable', 'integer', 'min:0'],
                'status'                => ['nullable', 'string', 'max:100'],
                'facilities'            => ['nullable', 'string'],
                'investment_highlights' => ['nullable', 'string'],
                'project_details'       => ['nullable', 'string'],
                'location_advantage'    => ['nullable', 'string'],
                'architectural_vision'  => ['nullable', 'string'],
                'lifestyle_amenities'   => ['nullable', 'string'],
                'investment_potential'  => ['nullable', 'string'],
                'payment_plans'         => ['nullable', 'string'],
                'amenities'             => ['nullable', 'string'],
                'mins_from_airport'     => ['nullable', 'integer', 'min:0'],
                'mins_from_hospitals'   => ['nullable', 'integer', 'min:0'],
                'mins_from_downtown'    => ['nullable', 'integer', 'min:0'],
                'mins_from_beach'       => ['nullable', 'integer', 'min:0'],
                'location_description'  => ['nullable', 'string'],
                'map_embed_url'         => ['nullable', 'string'],
                'video_url'             => ['nullable', 'string'],
                'is_featured'           => ['nullable', 'boolean'],
                'is_active'             => ['nullable', 'boolean'],
                'badges'                => ['nullable', 'string'],
                'offer_discount_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
                'offer_deadline_label'  => ['nullable', 'string', 'max:255'],
                'residence_highlights'  => ['nullable', 'string'],
                'investment_cards'      => ['nullable', 'string'],
                'lifestyle_cards'       => ['nullable', 'string'],
                'payment_plan_rows'     => ['nullable', 'string'],
                'buyer_journey_steps'   => ['nullable', 'string'],
                'project_faqs'          => ['nullable', 'string'],
                'construction_progress' => ['nullable', 'string'],
                'travel_distances'      => ['nullable', 'string'],
                'master_plan'           => ['nullable', 'string'],
                'developer_track_record' => ['nullable', 'string'],
                'unit_types'            => ['nullable', 'string'],
                'main_image'            => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:102400'],
                'images'                => ['nullable', 'array'],
                'images.*'              => ['image', 'mimes:jpg,jpeg,png,webp', 'max:102400'],
                'image_captions'        => ['nullable', 'string'],
                'ground_floor_image'    => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:102400'],
                'typical_floors_image'  => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:102400'],
                'remove_main_image'          => ['nullable', 'boolean'],
                'remove_ground_floor_image'  => ['nullable', 'boolean'],
                'remove_typical_floors_image' => ['nullable', 'boolean'],
                'existing_gallery'      => ['nullable', 'string'],
            ]);

            $frontendUrl = rtrim(env('FRONTEND_URLS', config('app.url')), '/');

            $projectData = [
                'title'                => $data['name'],
                'overview'             => $data['description'] ?? null,
                'location'             => $data['location'],
                'delivery_date'        => $data['delivery_date'] ?? null,
                'starting_price'       => $data['starting_price'] ?? null,
                'currency'             => $data['currency'] ?? 'EUR',
                'starting_area'        => $data['size_from'] ?? null,
                'max_area'             => $data['size_to'] ?? null,
                'facilities'           => $data['facilities'] ?? null,
                'investment_info'      => $data['investment_highlights'] ?? null,
                'project_details'      => $data['project_details'] ?? null,
                'location_advantage'   => $data['location_advantage'] ?? null,
                'architectural_vision' => $data['architectural_vision'] ?? null,
                'lifestyle_amenities'  => $data['lifestyle_amenities'] ?? null,
                'investment_potential' => $data['investment_potential'] ?? null,
                'payment_plans'        => $data['payment_plans'] ?? null,
                'amenities'            => $data['amenities'] ?? null,
                'mins_from_airport'    => $data['mins_from_airport'] ?? null,
                'mins_from_hospitals'  => $data['mins_from_hospitals'] ?? null,
                'mins_from_downtown'   => $data['mins_from_downtown'] ?? null,
                'mins_from_beach'      => $data['mins_from_beach'] ?? null,
                'location_description' => $data['location_description'] ?? null,
                'map_embed_url'        => $data['map_embed_url'] ?? null,
                'video_url'            => $data['video_url'] ?? null,
                'is_featured'          => $data['is_featured'] ?? $project->is_featured,
                'is_active'            => $data['is_active'] ?? $project->is_active,
                'badges'                => $this->decodeJsonField($data, 'badges'),
                'offer_discount_percent' => $data['offer_discount_percent'] ?? null,
                'offer_deadline_label'  => $data['offer_deadline_label'] ?? null,
                'residence_highlights'  => $this->decodeJsonField($data, 'residence_highlights'),
                'investment_cards'      => $this->decodeJsonField($data, 'investment_cards'),
                'lifestyle_cards'       => $this->decodeJsonField($data, 'lifestyle_cards'),
                'payment_plan_rows'     => $this->decodeJsonField($data, 'payment_plan_rows'),
                'buyer_journey_steps'   => $this->decodeJsonField($data, 'buyer_journey_steps'),
                'project_faqs'          => $this->decodeJsonField($data, 'project_faqs'),
                'construction_progress' => $this->decodeJsonField($data, 'construction_progress'),
                'travel_distances'      => $this->decodeJsonField($data, 'travel_distances'),
                'developer_track_record' => $this->decodeJsonField($data, 'developer_track_record'),
                'unit_types'            => $this->decodeJsonField($data, 'unit_types'),
            ];

            if ($request->hasFile('main_image')) {
                $path = $request->file('main_image')->store('projects/cover', 'uploads');
                $projectData['cover_image'] = $frontendUrl . '/storage/' . $path;
            } elseif (filter_var($request->input('remove_main_image'), FILTER_VALIDATE_BOOLEAN)) {
                $projectData['cover_image'] = null;
            }

            // Master plan images: preserve any already-saved image not being replaced now.
            $existingMasterPlan = $project->getRawOriginal('master_plan');
            $masterPlan = is_string($existingMasterPlan) ? (json_decode($existingMasterPlan, true) ?? []) : ($existingMasterPlan ?? []);
            $incomingMasterPlan = $this->decodeJsonField($data, 'master_plan');
            if (is_array($incomingMasterPlan)) {
                $masterPlan = array_merge($masterPlan, $incomingMasterPlan);
            }
            if ($request->hasFile('ground_floor_image')) {
                $path = $request->file('ground_floor_image')->store('projects/masterplan', 'uploads');
                $masterPlan['ground_floor_image'] = $frontendUrl . '/storage/' . $path;
            } elseif (filter_var($request->input('remove_ground_floor_image'), FILTER_VALIDATE_BOOLEAN)) {
                $masterPlan['ground_floor_image'] = null;
            }
            if ($request->hasFile('typical_floors_image')) {
                $path = $request->file('typical_floors_image')->store('projects/masterplan', 'uploads');
                $masterPlan['typical_floors_image'] = $frontendUrl . '/storage/' . $path;
            } elseif (filter_var($request->input('remove_typical_floors_image'), FILTER_VALIDATE_BOOLEAN)) {
                $masterPlan['typical_floors_image'] = null;
            }
            $projectData['master_plan'] = $masterPlan;

            // Gallery: if the dashboard sent an explicit list of which existing
            // images to keep, honor deletions; otherwise keep everything as-is.
            $existingGallery = $project->getRawOriginal('gallery');
            $gallery = is_string($existingGallery) ? (json_decode($existingGallery, true) ?? []) : ($existingGallery ?? []);
            if ($request->filled('existing_gallery')) {
                $keep = json_decode($request->input('existing_gallery'), true);
                if (is_array($keep)) {
                    $gallery = array_values($keep);
                }
            }
            if ($request->hasFile('images')) {
                $captions = json_decode($request->input('image_captions', '[]'), true) ?: [];
                foreach ($request->file('images') as $i => $image) {
                    $path = $image->store('projects/gallery', 'uploads');
                    $gallery[] = ['url' => $frontendUrl . '/storage/' . $path, 'caption' => $captions[$i] ?? null];
                }
            }
            $projectData['gallery'] = $gallery;

            // Auto-translate the updated fields into every site language,
            // merging over any existing translations.
            $freshTranslations = AutoTranslationService::translate([
                'title'                => $projectData['title'],
                'overview'             => $projectData['overview'],
                'project_details'      => $projectData['project_details'],
                'location_description' => $projectData['location_description'],
                'badges'                => $projectData['badges'],
                'residence_highlights'  => $projectData['residence_highlights'],
                'unit_types'            => $projectData['unit_types'],
                'payment_plan_rows'     => $projectData['payment_plan_rows'],
                'lifestyle_cards'       => $projectData['lifestyle_cards'],
                'investment_cards'      => $projectData['investment_cards'],
                'travel_distances'      => $projectData['travel_distances'],
                'developer_track_record' => $projectData['developer_track_record'],
                'project_faqs'          => $projectData['project_faqs'],
                'offer_deadline_label'  => $projectData['offer_deadline_label'],
            ], Project::$translatableFields);
            $projectData['translations'] = AutoTranslationService::mergeIntoExisting($project->translations, $freshTranslations);

            $project->update($projectData);

            return response()->json([
                'message' => 'Project updated successfully.',
                'project' => $this->formatProject($project->fresh(), $frontendUrl),
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation failed.', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('ProjectController@update: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Failed to update project.', 'error' => config('app.debug') ? $e->getMessage() : 'Server error.'], 500);
        }
    }

    public function destroy(Project $project): JsonResponse
    {
        $user = request()->user();
        if (!$user || !$user->hasRole('admin')) {
            abort(403, 'Only admins can delete projects.');
        }
        $project->delete();
        return response()->json(['message' => 'Project deleted successfully.']);
    }

    /**
     * Decode a JSON-encoded array field sent from the dashboard (repeater
     * lists like badges, investment cards, payment plan rows...).
     * Returns null when absent so existing values are left untouched.
     */
    private function decodeJsonField(array $data, string $key): ?array
    {
        if (!array_key_exists($key, $data) || $data[$key] === null || $data[$key] === '') {
            return null;
        }
        $decoded = json_decode($data[$key], true);
        return is_array($decoded) ? $decoded : null;
    }

    private function formatProject(Project $project, string $frontendUrl): Project
    {
        if ($project->cover_image && !str_starts_with($project->cover_image, 'http')) {
            $project->cover_image = $frontendUrl . '/storage/' . ltrim($project->cover_image, '/');
        }

        $gallery = $project->getRawOriginal('gallery');
        $items = is_string($gallery) ? json_decode($gallery, true) : $gallery;
        if (is_array($items)) {
            $resolve = function ($url) use ($frontendUrl) {
                if (!$url) return null;
                return str_starts_with($url, 'http') ? $url : $frontendUrl . '/storage/' . ltrim($url, '/');
            };
            $project->gallery = array_values(array_filter(array_map(function ($item) use ($resolve) {
                // Legacy entries are plain URL strings; newer entries carry a caption too.
                if (is_array($item)) {
                    $url = $resolve($item['url'] ?? null);
                    return $url ? ['url' => $url, 'caption' => $item['caption'] ?? null] : null;
                }
                $url = $resolve($item);
                return $url ? ['url' => $url, 'caption' => null] : null;
            }, $items)));
        }

        // Frontend aliases
        $project->name        = $project->title;
        $project->description = $project->overview;
        $project->main_image  = $project->cover_image;
        $project->images      = $project->gallery ?? [];
        $project->size_from   = $project->starting_area;
        $project->size_to     = $project->max_area;

        return $project;
    }
}