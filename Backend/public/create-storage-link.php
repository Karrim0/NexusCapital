<?php
/**
 * Script to create storage link manually
 * Upload this file to public folder and access it via browser
 * Example: https://api.nexuscapital.com/create-storage-link.php
 *
 * IMPORTANT: Delete this file after use for security!
 */

// Security check - only allow from localhost or specific IP
$allowedIPs = ['127.0.0.1', '::1']; // Add your IP here if needed
$clientIP = $_SERVER['REMOTE_ADDR'] ?? '';

// Uncomment the line below to restrict access
// if (!in_array($clientIP, $allowedIPs) && $clientIP !== 'YOUR_IP_HERE') {
//     die('Access denied');
// }

$publicPath = __DIR__;
$storagePath = dirname($publicPath) . '/storage/app/public';
$linkPath = $publicPath . '/storage';

echo "<h1>Storage Link Creator</h1>";
echo "<pre>";

// Check if storage directory exists
if (!is_dir($storagePath)) {
    echo "❌ Storage directory not found: $storagePath\n";
    echo "Creating directory...\n";
    if (!mkdir($storagePath, 0755, true)) {
        die("Failed to create storage directory!");
    }
    echo "✅ Storage directory created!\n";
}

// Check if link already exists
if (is_link($linkPath)) {
    echo "⚠️  Link already exists: $linkPath\n";
    echo "Target: " . readlink($linkPath) . "\n";

    // Check if it's correct
    if (readlink($linkPath) === $storagePath) {
        echo "✅ Link is correct!\n";
    } else {
        echo "❌ Link points to wrong location. Removing old link...\n";
        unlink($linkPath);
    }
}

// Create the link if it doesn't exist
if (!file_exists($linkPath)) {
    // Try to create symbolic link
    if (function_exists('symlink')) {
        if (@symlink($storagePath, $linkPath)) {
            echo "✅ Symbolic link created successfully!\n";
            echo "Link: $linkPath\n";
            echo "Target: $storagePath\n";
        } else {
            echo "❌ Failed to create symbolic link!\n";
            echo "Error: " . error_get_last()['message'] . "\n";
            echo "\n";
            echo "⚠️  Alternative: Create the link manually via File Manager:\n";
            echo "1. Go to cPanel File Manager\n";
            echo "2. Navigate to: public/storage\n";
            echo "3. Create symbolic link pointing to: ../storage/app/public\n";
        }
    } else {
        echo "❌ symlink() function is disabled on this server!\n";
        echo "\n";
        echo "⚠️  You need to create the link manually:\n";
        echo "1. Go to cPanel File Manager\n";
        echo "2. Navigate to: public/\n";
        echo "3. Create symbolic link named 'storage' pointing to: ../storage/app/public\n";
    }
} else {
    echo "✅ Link already exists!\n";
}

// Create required directories
$requiredDirs = [
    'properties/main',
    'properties/gallery',
];

foreach ($requiredDirs as $dir) {
    $fullPath = $storagePath . '/' . $dir;
    if (!is_dir($fullPath)) {
        if (mkdir($fullPath, 0755, true)) {
            echo "✅ Created directory: $dir\n";
        } else {
            echo "⚠️  Failed to create directory: $dir\n";
        }
    } else {
        echo "✅ Directory exists: $dir\n";
    }
}

// Set permissions
if (is_dir($storagePath)) {
    chmod($storagePath, 0755);
    echo "✅ Set permissions on storage directory\n";
}

echo "\n";
echo "========================================\n";
echo "✅ Done!\n";
echo "========================================\n";
echo "\n";
echo "⚠️  IMPORTANT: Delete this file (create-storage-link.php) after use!\n";
echo "\n";
echo "Test the link:\n";
echo "<a href='/storage/properties/main/'>/storage/properties/main/</a>\n";
echo "</pre>";
