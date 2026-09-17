<?php
// run-project-translations-seeder.php
// One-time browser-runnable script that runs ProjectTranslationsSeeder —
// applies the 6 hand-written, fully accurate translations (A Marina Blue,
// AMarina Soul, AQUA ORGWAN Resort, ATHENA Resort, Atlantis Resort, Aurora
// Palace) to the database.
//
// IMPORTANT ORDER: run THIS script first, then run
// run-backfill-translations.php. That way the automatic (MyMemory) pass
// will see these 6 projects already have all 9 languages and skip them,
// leaving your hand-written translations untouched, while it auto-translates
// the remaining 26 projects and all blog posts.
//
// 1) Upload this file to Backend/public/ (next to index.php, clear-cache.php).
// 2) Visit: https://nexuscapitalredsea.com/Backend/public/run-project-translations-seeder.php?key=nexus2026projtrans
// 3) DELETE this file from the server right after — it is not protected by
//    login, only by the secret key below.

$secretKey = 'nexus2026projtrans'; // change this to any word you like before uploading

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
    echo "Running ProjectTranslationsSeeder...\n";
    (new \Database\Seeders\ProjectTranslationsSeeder())->run();
    echo "✅ Done! 6 projects now have hand-written translations in all 9 languages:\n";
    echo "   a-marina-blue, amarina-soul, aqua-orgwan-resort, athena-resort, atlantis-resort, aurora-palace\n\n";
    echo "Next: delete this file, then run run-backfill-translations.php to auto-translate everything else.\n";
} catch (\Throwable $e) {
    http_response_code(500);
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
}
