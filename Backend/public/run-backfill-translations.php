<?php
// run-backfill-translations.php
// One-time browser-runnable script that translates every EXISTING blog post
// and project into all 9 non-English languages (AR/DE/PL/CS/NL/HU/RO/RU/FR),
// using the same AutoTranslationService that now runs automatically on every
// dashboard save (MyMemory — free, no API key or credit card needed). This
// script is only needed for content that was already in the database before
// that automation existed — anything you add or edit from the dashboard from
// now on translates itself.
//
// MyMemory's free tier has a daily word limit per server IP (1,000 words/day,
// or 10,000 words/day if you add MYMEMORY_EMAIL=you@example.com to .env —
// still free, just an email address, no card). If this script runs out of
// quota partway through, it simply stops early — records already done are
// saved, so run it again the next day and it will pick up where it left off
// (already-translated fields are skipped automatically).
//
// 1) Upload this file to Backend/public/ (next to index.php, clear-cache.php).
// 2) Visit: https://nexuscapitalredsea.com/Backend/public/run-backfill-translations.php?key=nexus2026backfill
//    Leave the tab open — this can take a while for 80+ records across 9
//    languages, one string at a time. Progress prints live as it goes.
// 3) DELETE this file from the server right after it finishes — it is not
//    protected by login, only by the secret key below.

$secretKey = 'nexus2026backfill'; // change this to any word you like before uploading

if (($_GET['key'] ?? '') !== $secretKey) {
    http_response_code(403);
    die('Forbidden. Add ?key=YOUR_SECRET_KEY to the URL.');
}

require_once __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

set_time_limit(0);
ignore_user_abort(true);
while (ob_get_level() > 0) {
    ob_end_flush();
}

header('Content-Type: text/plain; charset=utf-8');

function out(string $line): void
{
    echo $line."\n";
    @flush();
}

use App\Models\BlogPost;
use App\Models\Project;
use App\Services\AutoTranslationService;

if (!AutoTranslationService::isConfigured()) {
    out('❌ Auto-translation is disabled (AUTO_TRANSLATE_ENABLED=false in .env) — nothing to do.');
    out('Remove that line (or set it to true) in Backend/.env, then run this script again.');
    exit;
}

out('Starting backfill translation for existing content...');
out('');

// ---- Blog posts ------------------------------------------------------
$posts = BlogPost::all();
out("Blog posts to process: {$posts->count()}");
$i = 0;
$targetLangs = AutoTranslationService::TARGET_LANGUAGES;
foreach ($posts as $post) {
    $i++;
    $done = array_keys($post->translations ?? []);
    if (count(array_intersect($targetLangs, $done)) === count($targetLangs)) {
        out("  [{$i}/{$posts->count()}] ⏭️  {$post->slug} — already fully translated, skipping");
        continue;
    }
    try {
        $data = $post->toArray();
        $fresh = AutoTranslationService::translate($data, BlogPost::$translatableFields);
        $post->translations = AutoTranslationService::mergeIntoExisting($post->translations, $fresh);
        $post->save();
        out("  [{$i}/{$posts->count()}] ✅ {$post->slug}");
    } catch (\Throwable $e) {
        out("  [{$i}/{$posts->count()}] ⚠️  {$post->slug} — skipped: ".$e->getMessage());
    }
}

out('');

// ---- Projects ----------------------------------------------------------
$projects = Project::all();
out("Projects to process: {$projects->count()}");
$j = 0;
foreach ($projects as $project) {
    $j++;
    $done = array_keys($project->translations ?? []);
    if (count(array_intersect($targetLangs, $done)) === count($targetLangs)) {
        out("  [{$j}/{$projects->count()}] ⏭️  {$project->slug} — already fully translated, skipping");
        continue;
    }
    try {
        $data = $project->toArray();
        $fresh = AutoTranslationService::translate($data, Project::$translatableFields);
        $project->translations = AutoTranslationService::mergeIntoExisting($project->translations, $fresh);
        $project->save();
        out("  [{$j}/{$projects->count()}] ✅ {$project->slug}");
    } catch (\Throwable $e) {
        out("  [{$j}/{$projects->count()}] ⚠️  {$project->slug} — skipped: ".$e->getMessage());
    }
}

out('');
out('✅ Done! All blog posts and projects now have translations for AR/DE/PL/CS/NL/HU/RO/RU/FR where the API call succeeded.');
out('Now go delete this file (run-backfill-translations.php) from the server.');
