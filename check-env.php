<?php
// Check what's actually in the .env file
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "<h1>Environment File Diagnostic</h1>";

$envPath = __DIR__ . '/.env';

echo "<h2>File Information:</h2>";
echo "<p><strong>Looking for .env at:</strong> " . htmlspecialchars($envPath) . "</p>";

if (file_exists($envPath)) {
    echo "<p style='color:green;'>✓ .env file exists</p>";
    echo "<p><strong>File size:</strong> " . filesize($envPath) . " bytes</p>";
    echo "<p><strong>File permissions:</strong> " . substr(sprintf('%o', fileperms($envPath)), -4) . "</p>";
    
    echo "<h2>Raw File Content:</h2>";
    echo "<pre style='background:#f5f5f5; padding:10px; border:1px solid #ccc;'>";
    echo htmlspecialchars(file_get_contents($envPath));
    echo "</pre>";
    
    echo "<h2>Line-by-Line Analysis:</h2>";
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    echo "<ol>";
    foreach ($lines as $lineNum => $line) {
        $lineNum++;
        echo "<li>";
        echo "Line $lineNum: <code>" . htmlspecialchars($line) . "</code>";
        
        if (strpos(trim($line), '#') === 0) {
            echo " <em>(comment - skipped)</em>";
        } elseif (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            echo " → <strong>Key:</strong> '" . htmlspecialchars(trim($key)) . "' = <strong>Value:</strong> '" . htmlspecialchars(trim($value)) . "'";
        }
        echo "</li>";
    }
    echo "</ol>";
    
} else {
    echo "<p style='color:red;'>✗ .env file NOT found!</p>";
    echo "<p>Current directory: " . htmlspecialchars(__DIR__) . "</p>";
    echo "<p>Files in directory:</p><ul>";
    foreach (scandir(__DIR__) as $file) {
        if ($file !== '.' && $file !== '..') {
            echo "<li>" . htmlspecialchars($file) . "</li>";
        }
    }
    echo "</ul>";
}

echo "<hr>";
echo "<h2>Current Environment Variables:</h2>";
echo "<ul>";
echo "<li><strong>DB_HOST:</strong> " . htmlspecialchars(getenv('DB_HOST') ?: 'not set') . "</li>";
echo "<li><strong>DB_USER:</strong> " . htmlspecialchars(getenv('DB_USER') ?: 'not set') . "</li>";
echo "<li><strong>DB_PASS:</strong> " . (getenv('DB_PASS') ? str_repeat('*', strlen(getenv('DB_PASS'))) : 'not set') . "</li>";
echo "<li><strong>DB_NAME:</strong> " . htmlspecialchars(getenv('DB_NAME') ?: 'not set') . "</li>";
echo "</ul>";

echo "<hr>";
echo "<p><a href='test-db.php'>→ Test Database Connection</a></p>";
echo "<p><a href='index.html'>← Back to home</a></p>";
?>
