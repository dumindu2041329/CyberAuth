<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "<h1>Database.php Diagnostic</h1>";

$dbPhpPath = __DIR__ . '/config/database.php';

echo "<h2>File Check:</h2>";
echo "<p><strong>Looking for:</strong> " . htmlspecialchars($dbPhpPath) . "</p>";

if (file_exists($dbPhpPath)) {
    echo "<p style='color:green;'>✓ database.php exists</p>";
    echo "<p><strong>File size:</strong> " . filesize($dbPhpPath) . " bytes</p>";
    echo "<p><strong>Last modified:</strong> " . date("Y-m-d H:i:s", filemtime($dbPhpPath)) . "</p>";
    
    echo "<h2>Raw Content of database.php:</h2>";
    echo "<pre style='background:#f5f5f5; padding:10px; border:1px solid #ccc; overflow:auto;'>";
    echo htmlspecialchars(file_get_contents($dbPhpPath));
    echo "</pre>";
    
} else {
    echo "<p style='color:red;'>✗ database.php NOT found!</p>";
}

echo "<hr>";
echo "<h2>After Including database.php:</h2>";

// Now include it
require_once $dbPhpPath;

echo "<p style='color:green;'>✓ File included</p>";

echo "<h3>Defined Constants:</h3>";
echo "<ul>";
echo "<li><strong>DB_HOST:</strong> " . (defined('DB_HOST') ? htmlspecialchars(DB_HOST) : 'NOT DEFINED') . "</li>";
echo "<li><strong>DB_USER:</strong> " . (defined('DB_USER') ? htmlspecialchars(DB_USER) : 'NOT DEFINED') . "</li>";
echo "<li><strong>DB_PASS:</strong> " . (defined('DB_PASS') ? str_repeat('*', strlen(DB_PASS)) : 'NOT DEFINED') . "</li>";
echo "<li><strong>DB_NAME:</strong> " . (defined('DB_NAME') ? htmlspecialchars(DB_NAME) : 'NOT DEFINED') . "</li>";
echo "</ul>";

echo "<h3>Environment Variables After Loading:</h3>";
echo "<ul>";
echo "<li><strong>DB_HOST:</strong> " . htmlspecialchars(getenv('DB_HOST') ?: 'not set') . "</li>";
echo "<li><strong>DB_USER:</strong> " . htmlspecialchars(getenv('DB_USER') ?: 'not set') . "</li>";
echo "<li><strong>DB_PASS:</strong> " . (getenv('DB_PASS') ? str_repeat('*', strlen(getenv('DB_PASS'))) : 'not set') . "</li>";
echo "<li><strong>DB_NAME:</strong> " . htmlspecialchars(getenv('DB_NAME') ?: 'not set') . "</li>";
echo "</ul>";

echo "<hr>";
echo "<p><a href='test-db.php'>→ Test Database Connection</a></p>";
echo "<p><a href='check-env.php'>→ Check .env File</a></p>";
?>
