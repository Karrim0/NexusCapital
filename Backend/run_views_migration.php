<?php
/**
 * Migration Runner for Views Column
 *
 * This script adds the 'views' column to the properties table.
 *
 * Usage:
 * 1. Upload this file to your server's root directory (same level as artisan)
 * 2. Access it via browser: https://your-domain.com/run_views_migration.php
 * 3. Or run via command line: php run_views_migration.php
 *
 * Security Note: Delete this file after running the migration!
 */

// Prevent direct access in production (uncomment for security)
// if (!isset($_SERVER['HTTP_HOST']) || $_SERVER['HTTP_HOST'] !== 'localhost') {
//     die('Access denied');
// }

// Set error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Bootstrap Laravel
// The file is in public/ directory, but Laravel root is in parent directory
$basePath = dirname(__DIR__); // Go up from public/ to Laravel root

// Try different paths for vendor/autoload.php
$vendorPaths = [
    $basePath . '/vendor/autoload.php',                 // Laravel root
    __DIR__ . '/../vendor/autoload.php',                // Parent directory (relative)
    __DIR__ . '/vendor/autoload.php',                   // Same directory (if moved)
];

$vendorPath = null;
foreach ($vendorPaths as $path) {
    if (file_exists($path)) {
        $vendorPath = $path;
        break;
    }
}

if (!$vendorPath) {
    echo "<div class='error'>";
    echo "<h3>❌ Error: Could not find vendor/autoload.php</h3>";
    echo "<p>Tried paths:</p><ul>";
    foreach ($vendorPaths as $path) {
        echo "<li>" . htmlspecialchars($path) . " - " . (file_exists($path) ? "✅ Found" : "❌ Not found") . "</li>";
    }
    echo "</ul>";
    echo "<p>Current directory: " . htmlspecialchars(__DIR__) . "</p>";
    echo "<p>Base path: " . htmlspecialchars($basePath) . "</p>";
    echo "</div>";
    die();
}

require $vendorPath;

// Try different paths for bootstrap/app.php
$bootstrapPaths = [
    $basePath . '/bootstrap/app.php',                   // Laravel root
    __DIR__ . '/../bootstrap/app.php',                  // Parent directory (relative)
    __DIR__ . '/bootstrap/app.php',                     // Same directory (if moved)
];

$bootstrapPath = null;
foreach ($bootstrapPaths as $path) {
    if (file_exists($path)) {
        $bootstrapPath = $path;
        break;
    }
}

if (!$bootstrapPath) {
    echo "<div class='error'>";
    echo "<h3>❌ Error: Could not find bootstrap/app.php</h3>";
    echo "<p>Tried paths:</p><ul>";
    foreach ($bootstrapPaths as $path) {
        echo "<li>" . htmlspecialchars($path) . " - " . (file_exists($path) ? "✅ Found" : "❌ Not found") . "</li>";
    }
    echo "</ul>";
    echo "</div>";
    die();
}

$app = require_once $bootstrapPath;
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Schema\Blueprint;

echo "<!DOCTYPE html>
<html>
<head>
    <title>Views Migration Runner</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .success { color: green; background: #d4edda; padding: 15px; border-radius: 5px; margin: 10px 0; }
        .error { color: red; background: #f8d7da; padding: 15px; border-radius: 5px; margin: 10px 0; }
        .info { color: #0c5460; background: #d1ecf1; padding: 15px; border-radius: 5px; margin: 10px 0; }
        .warning { color: #856404; background: #fff3cd; padding: 15px; border-radius: 5px; margin: 10px 0; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
    </style>
</head>
<body>
    <h1>Views Column Migration Runner</h1>";

try {
    echo "<div class='info'>Starting migration process...</div>";

    // Check if column already exists
    $columnExists = Schema::hasColumn('properties', 'views');

    if ($columnExists) {
        echo "<div class='warning'>⚠️ Column 'views' already exists in 'properties' table.</div>";

        // Check current data
        $sample = DB::table('properties')->select('id', 'views')->first();
        if ($sample) {
            echo "<div class='info'>📊 Sample data: Property ID {$sample->id} has {$sample->views} views</div>";
        }

        echo "<div class='success'>✅ Migration already completed. Column exists.</div>";
    } else {
        echo "<div class='info'>📝 Column 'views' does not exist. Creating it now...</div>";

        // Run the migration
        Schema::table('properties', function (Blueprint $table) {
            $table->unsignedInteger('views')->default(0)->after('is_active');
        });

        echo "<div class='success'>✅ Successfully added 'views' column to 'properties' table!</div>";

        // Verify the column was created
        $columnExists = Schema::hasColumn('properties', 'views');
        if ($columnExists) {
            echo "<div class='success'>✅ Verification: Column 'views' confirmed in database.</div>";
        } else {
            echo "<div class='error'>❌ Verification failed: Column 'views' not found after creation.</div>";
        }
    }

    // Show table structure
    echo "<div class='info'><h3>Current Properties Table Structure:</h3>";
    $columns = Schema::getColumnListing('properties');
    echo "<pre>";
    foreach ($columns as $column) {
        $highlight = ($column === 'views') ? ' <strong style="color: green;">← NEW</strong>' : '';
        echo "- {$column}{$highlight}\n";
    }
    echo "</pre></div>";

    // Show sample data
    echo "<div class='info'><h3>Sample Properties Data:</h3>";
    $properties = DB::table('properties')
        ->select('id', 'title', 'views')
        ->limit(10)
        ->get();

    if ($properties->count() > 0) {
        echo "<table border='1' cellpadding='10' style='border-collapse: collapse; width: 100%;'>";
        echo "<tr><th>ID</th><th>Title</th><th>Views</th></tr>";
        foreach ($properties as $property) {
            echo "<tr>";
            echo "<td>{$property->id}</td>";
            echo "<td>" . htmlspecialchars($property->title ?? 'N/A') . "</td>";
            echo "<td><strong>{$property->views}</strong></td>";
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "<p>No properties found in database.</p>";
    }
    echo "</div>";

    echo "<div class='success'><h3>✅ Migration completed successfully!</h3></div>";

} catch (\Exception $e) {
    echo "<div class='error'>";
    echo "<h3>❌ Error occurred:</h3>";
    echo "<p><strong>Message:</strong> " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<p><strong>File:</strong> " . htmlspecialchars($e->getFile()) . "</p>";
    echo "<p><strong>Line:</strong> " . $e->getLine() . "</p>";
    echo "<details><summary>Stack Trace</summary><pre>" . htmlspecialchars($e->getTraceAsString()) . "</pre></details>";
    echo "</div>";
}

echo "<div class='warning'><strong>⚠️ Security Note:</strong> Please delete this file after running the migration!</div>";
echo "</body></html>";

