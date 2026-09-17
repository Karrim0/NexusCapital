<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\ContactRequestController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\BlogPostController;
use App\Http\Controllers\AgentApprovalController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\AdminReportController;
use App\Http\Controllers\HomeContentController;
use App\Http\Controllers\BuyContentController;
use App\Http\Controllers\ProjectsContentController;
use App\Http\Controllers\ServicesContentController;
use App\Http\Controllers\LegalServicesContentController;
use App\Http\Controllers\RentalServicesContentController;
use App\Http\Controllers\FurnitureContentController;
use App\Http\Controllers\TeamMemberController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\FaqContentController;
use App\Http\Controllers\AboutContentController;
use App\Http\Controllers\ContactContentController;
use App\Http\Controllers\RentContentController;
use App\Http\Controllers\LandsContentController;
use App\Http\Controllers\ContentImageUploadController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('agent-request', [AuthController::class, 'requestAgent']);
    Route::post('login', [AuthController::class, 'login']);

    // /auth/me is public (returns user or null) to avoid 401 spam on SPA boot
    Route::get('me', [AuthController::class, 'me']);

    Route::middleware('auth:web')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::put('profile', [AuthController::class, 'updateProfile']);
    });
});

// Public property endpoints
Route::get('properties', [PropertyController::class, 'index']);
Route::get('properties/{property}', [PropertyController::class, 'show'])
    ->whereNumber('property');

// Public project endpoints
Route::get('projects', [ProjectController::class, 'index']);
Route::get('projects/{project}', [ProjectController::class, 'show'])
    ->whereNumber('project');

// Public blog endpoints
Route::get('blog-posts', [BlogPostController::class, 'index']);
Route::get('blog-posts/{slug}', [BlogPostController::class, 'show'])
    ->where('slug', '[a-z0-9-]+');

// Public contact requests for a specific property (sent from property details page)
Route::post('properties/{property}/contact-requests', [ContactRequestController::class, 'store'])
    ->whereNumber('property');

// Public contact requests for a specific project
Route::post('projects/{project}/contact-requests', function (\Illuminate\Http\Request $request, $project) {
    $data = $request->validate([
        'name'    => ['required', 'string', 'max:255'],
        'email'   => ['nullable', 'email', 'max:255'],
        'phone'   => ['nullable', 'string', 'max:50'],
        'message' => ['nullable', 'string'],
    ]);

    $contact = \App\Models\ContactRequest::create([
        'name'        => $data['name'],
        'email'       => $data['email'] ?? null,
        'phone'       => $data['phone'] ?? null,
        'message'     => $data['message'] ?? "Interested in project ID: {$project}",
        'property_id' => null,
        'status'      => 'new',
    ]);

    return response()->json(['message' => 'Request sent successfully.', 'contact_request' => $contact], 201);
})->whereNumber('project');


// Public general contact requests (not related to a specific property)
Route::post('contact-requests', [ContactRequestController::class, 'storeGeneral']);

// Public: home page content (hero, stats, destinations, services, testimonials, faqs, footer...)
Route::get('home-content', [HomeContentController::class, 'show']);

// Public: buy page content (hero, buyer brief labels, listing section labels)
Route::get('buy-content', [BuyContentController::class, 'show']);

// Public: projects page content
Route::get('projects-content', [ProjectsContentController::class, 'show']);

// Public: services page content
Route::get('services-content', [ServicesContentController::class, 'show']);

// Public: legal services page content
Route::get('legal-services-content', [LegalServicesContentController::class, 'show']);

// Public: rental services page content
Route::get('rental-services-content', [RentalServicesContentController::class, 'show']);

// Public: furniture & furnishing page content
Route::get('furniture-content', [FurnitureContentController::class, 'show']);

// Public: team members listing (Meet Our Team)
Route::get('team-members', [TeamMemberController::class, 'index']);

// Public: AI chatbot widget
Route::post('chatbot', [ChatbotController::class, 'chat']);
Route::get('team-members/{teamMember}', [TeamMemberController::class, 'show']);

// Public: FAQ page content
Route::get('faq-content', [FaqContentController::class, 'show']);

// Public: About page content
Route::get('about-content', [AboutContentController::class, 'show']);

// Public: Contact page content
Route::get('contact-content', [ContactContentController::class, 'show']);

// Public: Rent page content
Route::get('rent-content', [RentContentController::class, 'show']);

// Public: Lands & Buildings page content
Route::get('lands-content', [LandsContentController::class, 'show']);

// Property management & favorites require authentication
Route::middleware('auth:web')->group(function () {
    Route::post('properties', [PropertyController::class, 'store']);
    Route::put('properties/{property}', [PropertyController::class, 'update'])
        ->whereNumber('property');
    Route::delete('properties/{property}', [PropertyController::class, 'destroy'])
        ->whereNumber('property');

    Route::get('properties/deleted', [PropertyController::class, 'deleted']);
    Route::post('properties/{id}/restore', [PropertyController::class, 'restore'])
        ->whereNumber('id');
    Route::delete('properties/{id}/force', [PropertyController::class, 'forceDestroy'])
        ->whereNumber('id');

    Route::get('favorites', [FavoriteController::class, 'index']);
    Route::post('properties/{property}/favorite', [FavoriteController::class, 'toggle']);

    // Dashboard contact requests listing (admin sees all, agent sees requests on his properties)
    Route::get('contact-requests', [ContactRequestController::class, 'index']);

    // Admin-only: pending agent requests approval
    Route::get('agent-requests', [AgentApprovalController::class, 'index']);
    Route::delete('agent-requests/{id}', [AgentApprovalController::class, 'reject'])
        ->whereNumber('id')
        ->name('agent-requests.reject');
    Route::post('agent-requests/{user}/approve', [AgentApprovalController::class, 'approve'])
        ->whereNumber('user');

    // Admin user management
    Route::get('admin/users', [AdminUserController::class, 'index']);
    Route::post('admin/users', [AdminUserController::class, 'store']);
    Route::get('admin/users/{id}', [AdminUserController::class, 'show'])->whereNumber('id');
    Route::put('admin/users/{id}', [AdminUserController::class, 'update'])->whereNumber('id');
    Route::put('admin/users/{id}/password', [AdminUserController::class, 'changePassword'])->whereNumber('id');
    Route::post('admin/users/{id}/toggle-status', [AdminUserController::class, 'toggleStatus'])->whereNumber('id');
    Route::delete('admin/users/{id}', [AdminUserController::class, 'destroy'])->whereNumber('id');

    // Project management (admin only)
    Route::post('projects', [ProjectController::class, 'store']);
    Route::put('projects/{project}', [ProjectController::class, 'update'])
        ->whereNumber('project');
    Route::delete('projects/{project}', [ProjectController::class, 'destroy'])
        ->whereNumber('project');

    // Blog post management (admin only)
    Route::get('blog-posts-admin', [BlogPostController::class, 'index']); // ?scope=admin, includes unpublished
    Route::get('blog-posts-admin/{blogPost}', [BlogPostController::class, 'adminShow'])
        ->whereNumber('blogPost');
    Route::post('blog-posts', [BlogPostController::class, 'store']);
    Route::put('blog-posts/{blogPost}', [BlogPostController::class, 'update'])
        ->whereNumber('blogPost');
    Route::delete('blog-posts/{blogPost}', [BlogPostController::class, 'destroy'])
        ->whereNumber('blogPost');

    // Invoices (admin & agents)
    Route::get('invoices', [InvoiceController::class, 'index']);
    Route::post('invoices', [InvoiceController::class, 'store']);

    // Admin reports
    Route::get('admin/reports/summary', [AdminReportController::class, 'summary']);

    // Admin-only: generic single-image upload for CMS list fields (e.g.
    // Destinations cards on Home / About) that can't be bundled into the
    // page's main multipart save request.
    Route::post('content-images', [ContentImageUploadController::class, 'store']);

    // Admin-only: edit home page content (multipart, supports logo upload)
    Route::post('home-content', [HomeContentController::class, 'update']);

    // Admin-only: edit buy page content
    Route::post('buy-content', [BuyContentController::class, 'update']);

    // Admin-only: edit projects page content
    Route::post('projects-content', [ProjectsContentController::class, 'update']);

    // Admin-only: edit services page content
    Route::post('services-content', [ServicesContentController::class, 'update']);

    // Admin-only: edit legal services page content
    Route::post('legal-services-content', [LegalServicesContentController::class, 'update']);

    // Admin-only: edit rental services page content
    Route::post('rental-services-content', [RentalServicesContentController::class, 'update']);

    // Admin-only: edit furniture & furnishing page content
    Route::post('furniture-content', [FurnitureContentController::class, 'update']);

    // Admin-only: team members management
    Route::get('admin/team-members', [TeamMemberController::class, 'indexAll']);
    Route::post('team-members', [TeamMemberController::class, 'store']);
    Route::post('team-members/{teamMember}', [TeamMemberController::class, 'update']);
    Route::delete('team-members/{teamMember}', [TeamMemberController::class, 'destroy']);

    // Admin-only: edit FAQ page content
    Route::post('faq-content', [FaqContentController::class, 'update']);

    // Admin-only: edit About page content (multipart, supports 2 image uploads)
    Route::post('about-content', [AboutContentController::class, 'update']);

    // Admin-only: edit Contact page content
    Route::post('contact-content', [ContactContentController::class, 'update']);

    // Admin-only: edit Rent page content
    Route::post('rent-content', [RentContentController::class, 'update']);

    // Admin-only: edit Lands & Buildings page content
    Route::post('lands-content', [LandsContentController::class, 'update']);
});
