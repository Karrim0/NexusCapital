<?php
// run-i18n-migrations.php
// One-time browser-runnable script to run the two new "translations" column
// migrations without SSH.
// 1) Upload this file to Backend/public/ (next to index.php, clear-cache.php).
// 2) Visit: https://nexuscapitalredsea.com/Backend/public/run-i18n-migrations.php?key=nexus2026i18n
// 3) DELETE this file from the server right after — it is not protected by login,
//    only by the secret key below, and it can modify the database schema.

$secretKey = 'nexus2026i18n'; // change this to any word you like before uploading

if (($_GET['key'] ?? '') !== $secretKey) {
    http_response_code(403);
    die('Forbidden. Add ?key=YOUR_SECRET_KEY to the URL.');
}

require_once __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

header('Content-Type: text/plain; charset=utf-8');

try {
    echo "Running migrations...\n";
    $kernel->call('migrate', ['--force' => true]);
    echo $kernel->output();
    echo "\n✅ Done! 'translations' column added to blog_posts and projects.\n";
    echo "Now go delete this file (run-i18n-migrations.php) from the server.\n";
} catch (\Throwable $e) {
    http_response_code(500);
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
}
