<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/run-migrations', function () {
    try {
        // أمر بناء الجداول
        Artisan::call('migrate', ["--force" => true]);

        // (اختياري) أمر بناء الكاش عشان نسرع الموقع
        Artisan::call('config:cache');
        Artisan::call('route:cache');

        return "<h1>✅ تم بناء الجداول بنجاح!</h1><pre>" . Artisan::output() . "</pre>";
    } catch (\Exception $e) {
        return "<h1 style='color:red'>خطأ:</h1>" . $e->getMessage();
    }
});

// Fallback route for storage files if storage:link doesn't work
Route::get('/storage/{path}', function ($path) {
    $filePath = storage_path('app/public/' . $path);

    if (!file_exists($filePath)) {
        abort(404);
    }

    $mimeType = mime_content_type($filePath);
    $headers = [
        'Content-Type' => $mimeType,
        'Cache-Control' => 'public, max-age=31536000',
    ];

    return response()->file($filePath, $headers);
})->where('path', '.*');

Route::get('/clear-cache', function() {
    Artisan::call('config:clear');
    Artisan::call('cache:clear');
    return "Cache Cleared Successfully!";
});

Route::get('/reset-database', function () {
    try {
        // الأمر ده بيمسح كل الجداول وينشئها من جديد
        // --seed عشان لو عندك داتا تجريبية يضيفها
        Artisan::call('migrate:refresh --seed');
        
        return "✅ تم حذف وإعادة إنشاء قاعدة البيانات بنجاح (Database Refreshed).";
    } catch (\Exception $e) {
        return "❌ حدث خطأ: " . $e->getMessage();
    }
});
