<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Services\AutoTranslationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class BlogPostController extends Controller
{
    /**
     * Public listing. Only published posts, unless ?scope=admin (dashboard).
     */
    public function index(Request $request): JsonResponse
    {
        $query = BlogPost::query();

        $scope = $request->query('scope', 'public');
        if ($scope === 'public') {
            $query->where('is_published', true);
        } else {
            $user = $request->user();
            if (!$user || !$user->hasRole('admin')) {
                abort(403, 'Only admins can view unpublished posts.');
            }
        }

        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }

        $posts = $query->latest('published_at')->latest()->get();

        $lang = $request->query('lang', 'en');
        $data = $posts->map(fn (BlogPost $post) => $post->toLocalizedArray($lang, $post->toArray()));

        return response()->json(['data' => $data]);
    }

    /**
     * Public single post by slug.
     */
    public function show(Request $request, string $slug): JsonResponse
    {
        $post = BlogPost::where('slug', $slug)->where('is_published', true)->first();
        if (!$post) {
            return response()->json(['message' => 'Not found.'], 404);
        }
        $lang = $request->query('lang', 'en');
        return response()->json(['data' => $post->toLocalizedArray($lang, $post->toArray())]);
    }

    /**
     * Admin single post by id (used by Edit Blog Post view).
     */
    public function adminShow(Request $request, BlogPost $blogPost): JsonResponse
    {
        $user = $request->user();
        if (!$user || !$user->hasRole('admin')) {
            abort(403, 'Only admins can view this.');
        }
        return response()->json(['data' => $blogPost]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user || !$user->hasRole('admin')) {
            abort(403, 'Only admins can create blog posts.');
        }

        $request->merge([
            'is_published' => filter_var($request->input('is_published'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? true,
            'is_featured'  => filter_var($request->input('is_featured'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false,
        ]);

        $data = $request->validate([
            'title'               => ['required', 'string', 'max:255'],
            'slug'                => ['nullable', 'string', 'max:255', 'unique:blog_posts,slug'],
            'excerpt'             => ['nullable', 'string'],
            'category'            => ['nullable', 'string', 'max:255'],
            'tags'                => ['nullable', 'string'],
            'reading_time_label'  => ['nullable', 'string', 'max:100'],
            'card_type_label'     => ['nullable', 'string', 'max:100'],
            'hero_eyebrow'        => ['nullable', 'string', 'max:255'],
            'title_highlight'     => ['nullable', 'string', 'max:255'],
            'primary_cta_label'   => ['nullable', 'string', 'max:100'],
            'primary_cta_url'     => ['nullable', 'string', 'max:500'],
            'secondary_cta_label' => ['nullable', 'string', 'max:100'],
            'quick_facts'         => ['nullable', 'string'],
            'content_blocks'      => ['nullable', 'string'],
            'checklist_items'     => ['nullable', 'string'],
            'disclaimer'          => ['nullable', 'string'],
            'benefit_cards'       => ['nullable', 'string'],
            'gallery_captions'    => ['nullable', 'string'],
            'faqs'                => ['nullable', 'string'],
            'is_published'        => ['nullable', 'boolean'],
            'is_featured'         => ['nullable', 'boolean'],
            'cover_image'         => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:102400'],
            'gallery_images'      => ['nullable', 'array'],
            'gallery_images.*'    => ['image', 'mimes:jpg,jpeg,png,webp', 'max:102400'],
        ]);

        $frontendUrl = env('FRONTEND_URLS', config('app.url'));

        $slug = $data['slug'] ?: Str::slug($data['title']);
        $slug = $this->uniqueSlug($slug);

        $coverImage = null;
        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('blog/cover', 'uploads');
            $coverImage = $frontendUrl . '/storage/' . $path;
        }

        $gallery = $this->buildGallery($request, $data);

        $createData = [
            'title'               => $data['title'],
            'slug'                => $slug,
            'excerpt'             => $data['excerpt'] ?? null,
            'cover_image'         => $coverImage,
            'category'            => $data['category'] ?? null,
            'tags'                => $this->decodeJsonField($data, 'tags'),
            'reading_time_label'  => $data['reading_time_label'] ?? null,
            'card_type_label'     => $data['card_type_label'] ?? null,
            'hero_eyebrow'        => $data['hero_eyebrow'] ?? null,
            'title_highlight'     => $data['title_highlight'] ?? null,
            'primary_cta_label'   => $data['primary_cta_label'] ?? null,
            'primary_cta_url'     => $data['primary_cta_url'] ?? null,
            'secondary_cta_label' => $data['secondary_cta_label'] ?? null,
            'quick_facts'         => $this->decodeJsonField($data, 'quick_facts'),
            'content_blocks'      => $this->decodeJsonField($data, 'content_blocks'),
            'checklist_items'     => $this->decodeJsonField($data, 'checklist_items'),
            'disclaimer'          => $data['disclaimer'] ?? null,
            'benefit_cards'       => $this->decodeJsonField($data, 'benefit_cards'),
            'gallery'             => $gallery,
            'faqs'                => $this->decodeJsonField($data, 'faqs'),
            'is_published'        => $data['is_published'] ?? true,
            'is_featured'         => $data['is_featured'] ?? false,
            'published_at'        => ($data['is_published'] ?? true) ? now() : null,
        ];

        // Auto-translate the new post into every site language. Silently
        // skipped if no translation API key is configured — the post still
        // saves normally and simply falls back to English elsewhere.
        $createData['translations'] = AutoTranslationService::translate($createData, BlogPost::$translatableFields);

        try {
            $post = BlogPost::create($createData);
        } catch (\Exception $e) {
            Log::error('BlogPostController@store: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to create blog post.'], 500);
        }

        return response()->json(['message' => 'Blog post created.', 'data' => $post], 201);
    }

    public function update(Request $request, BlogPost $blogPost): JsonResponse
    {
        $user = $request->user();
        if (!$user || !$user->hasRole('admin')) {
            abort(403, 'Only admins can edit blog posts.');
        }

        $request->merge([
            'is_published' => filter_var($request->input('is_published'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? true,
            'is_featured'  => filter_var($request->input('is_featured'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false,
        ]);

        $data = $request->validate([
            'title'               => ['required', 'string', 'max:255'],
            'slug'                => ['nullable', 'string', 'max:255', 'unique:blog_posts,slug,' . $blogPost->id],
            'excerpt'             => ['nullable', 'string'],
            'category'            => ['nullable', 'string', 'max:255'],
            'tags'                => ['nullable', 'string'],
            'reading_time_label'  => ['nullable', 'string', 'max:100'],
            'card_type_label'     => ['nullable', 'string', 'max:100'],
            'hero_eyebrow'        => ['nullable', 'string', 'max:255'],
            'title_highlight'     => ['nullable', 'string', 'max:255'],
            'primary_cta_label'   => ['nullable', 'string', 'max:100'],
            'primary_cta_url'     => ['nullable', 'string', 'max:500'],
            'secondary_cta_label' => ['nullable', 'string', 'max:100'],
            'quick_facts'         => ['nullable', 'string'],
            'content_blocks'      => ['nullable', 'string'],
            'checklist_items'     => ['nullable', 'string'],
            'disclaimer'          => ['nullable', 'string'],
            'benefit_cards'       => ['nullable', 'string'],
            'gallery_captions'    => ['nullable', 'string'],
            'existing_gallery'    => ['nullable', 'string'],
            'faqs'                => ['nullable', 'string'],
            'is_published'        => ['nullable', 'boolean'],
            'is_featured'         => ['nullable', 'boolean'],
            'cover_image'         => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:102400'],
            'gallery_images'      => ['nullable', 'array'],
            'gallery_images.*'    => ['image', 'mimes:jpg,jpeg,png,webp', 'max:102400'],
        ]);

        $frontendUrl = env('FRONTEND_URLS', config('app.url'));

        $slug = $data['slug'] ?: Str::slug($data['title']);
        if ($slug !== $blogPost->slug) {
            $slug = $this->uniqueSlug($slug, $blogPost->id);
        }

        $postData = [
            'title'               => $data['title'],
            'slug'                => $slug,
            'excerpt'             => $data['excerpt'] ?? null,
            'category'            => $data['category'] ?? null,
            'tags'                => $this->decodeJsonField($data, 'tags'),
            'reading_time_label'  => $data['reading_time_label'] ?? null,
            'card_type_label'     => $data['card_type_label'] ?? null,
            'hero_eyebrow'        => $data['hero_eyebrow'] ?? null,
            'title_highlight'     => $data['title_highlight'] ?? null,
            'primary_cta_label'   => $data['primary_cta_label'] ?? null,
            'primary_cta_url'     => $data['primary_cta_url'] ?? null,
            'secondary_cta_label' => $data['secondary_cta_label'] ?? null,
            'quick_facts'         => $this->decodeJsonField($data, 'quick_facts'),
            'content_blocks'      => $this->decodeJsonField($data, 'content_blocks'),
            'checklist_items'     => $this->decodeJsonField($data, 'checklist_items'),
            'disclaimer'          => $data['disclaimer'] ?? null,
            'benefit_cards'       => $this->decodeJsonField($data, 'benefit_cards'),
            'faqs'                => $this->decodeJsonField($data, 'faqs'),
            'is_published'        => $data['is_published'] ?? true,
            'is_featured'         => $data['is_featured'] ?? false,
        ];

        if (($data['is_published'] ?? true) && !$blogPost->published_at) {
            $postData['published_at'] = now();
        }

        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('blog/cover', 'uploads');
            $postData['cover_image'] = $frontendUrl . '/storage/' . $path;
        }

        $postData['gallery'] = $this->buildGallery($request, $data, $blogPost);

        // Auto-translate the updated fields into every site language, merging
        // over any existing translations so unrelated languages/fields that
        // may have been manually refined are preserved.
        $fresh = AutoTranslationService::translate($postData, BlogPost::$translatableFields);
        $postData['translations'] = AutoTranslationService::mergeIntoExisting($blogPost->translations, $fresh);

        try {
            $blogPost->update($postData);
        } catch (\Exception $e) {
            Log::error('BlogPostController@update: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to update blog post.'], 500);
        }

        return response()->json(['message' => 'Blog post updated.', 'data' => $blogPost->fresh()]);
    }

    public function destroy(Request $request, BlogPost $blogPost): JsonResponse
    {
        $user = $request->user();
        if (!$user || !$user->hasRole('admin')) {
            abort(403, 'Only admins can delete blog posts.');
        }
        $blogPost->delete();
        return response()->json(['message' => 'Blog post deleted.']);
    }

    private function uniqueSlug(string $base, ?int $ignoreId = null): string
    {
        $slug = $base;
        $i = 1;
        while (
            BlogPost::where('slug', $slug)
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = $base . '-' . (++$i);
        }
        return $slug;
    }

    /**
     * New gallery uploads are appended to any preserved existing gallery
     * items (identified via `existing_gallery`, a JSON array of
     * {image, caption} the frontend still wants to keep). Captions for
     * newly uploaded files come from `gallery_captions` (JSON array of
     * strings, same order as the uploaded files).
     */
    private function buildGallery(Request $request, array $data, ?BlogPost $existing = null): array
    {
        $gallery = [];

        if ($existing) {
            $keep = $this->decodeJsonField($data, 'existing_gallery');
            if (is_array($keep)) {
                $gallery = $keep;
            } elseif ($existing->gallery) {
                $gallery = $existing->gallery;
            }
        }

        if ($request->hasFile('gallery_images')) {
            $captions = $this->decodeJsonField($data, 'gallery_captions') ?? [];
            $frontendUrl = env('FRONTEND_URLS', config('app.url'));
            foreach ($request->file('gallery_images') as $i => $image) {
                $path = $image->store('blog/gallery', 'uploads');
                $gallery[] = [
                    'image'   => $frontendUrl . '/storage/' . $path,
                    'caption' => $captions[$i] ?? '',
                ];
            }
        }

        return $gallery;
    }

    private function decodeJsonField(array $data, string $key): ?array
    {
        if (!array_key_exists($key, $data) || $data[$key] === null || $data[$key] === '') {
            return null;
        }
        $decoded = json_decode($data[$key], true);
        return is_array($decoded) ? $decoded : null;
    }
}
