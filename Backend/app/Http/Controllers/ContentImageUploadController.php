<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ContentImageUploadController extends Controller
{
    /**
     * Folders this endpoint is allowed to write into. Keeping this as an
     * allow-list (rather than trusting the client-provided value directly)
     * avoids path traversal / writing outside the intended CMS image tree.
     */
    protected const ALLOWED_FOLDERS = [
        'home-destinations',
        'about-destinations',
        'certifications',
    ];

    /**
     * POST /content-images — admin only.
     *
     * Generic single-image upload used by dashboard CMS screens that manage
     * *dynamic* lists (e.g. "Destinations" cards, where admins can add or
     * remove items freely). Unlike the logo / hero-background uploads
     * (which are fixed fields bundled into the page's main save request),
     * list items don't have a stable, predictable field name to bundle a
     * file under — so each image is uploaded on its own the moment it's
     * selected, and the dashboard stores the returned URL directly on that
     * item (e.g. destinations_section.items[i].image).
     *
     * Accepts multipart/form-data with:
     *   - "image"  (required file, image, max 5MB)
     *   - "folder" (required string, one of ALLOWED_FOLDERS)
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user || !$user->hasRole('admin')) {
            abort(403, 'Only admins can upload content images.');
        }

        $request->validate([
            'image'  => ['required', 'image', 'max:5120'],
            'folder' => ['required', 'string', 'in:' . implode(',', self::ALLOWED_FOLDERS)],
        ]);

        try {
            $path = $request->file('image')->store($request->input('folder'), 'uploads');
        } catch (\Exception $e) {
            Log::error('ContentImageUploadController@store: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to upload image.'], 500);
        }

        return response()->json([
            'message' => 'Image uploaded.',
            'path'    => $path,
            'url'     => $this->resolveUrl($path),
        ], 201);
    }

    protected function resolveUrl(?string $path): ?string
    {
        if (!$path) return null;
        // Matches the convention used by HomeContentController / AboutContentController
        // for files stored on the "uploads" disk.
        return rtrim(env('FRONTEND_URLS', config('app.url')), '/') . '/storage/' . ltrim($path, '/');
    }
}
