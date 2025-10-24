<?php
// Database connection test script
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "<h1>Database Connection Test</h1>";

// Use the actual database.php configuration
require_once __DIR__ . '/config/database.php';

echo "<p style='color:green;'>✓ Database configuration loaded</p>";

// Display credentials (masked password)
$host = DB_HOST;
$user = DB_USER;
$pass = DB_PASS;
$name = DB_NAME;

echo "<h2>Configuration:</h2>";
echo "<ul>";
echo "<li><strong>DB_HOST:</strong> " . htmlspecialchars($host) . "</li>";
echo "<li><strong>DB_USER:</strong> " . htmlspecialchars($user) . "</li>";
echo "<li><strong>DB_PASS:</strong> " . str_repeat('*', strlen($pass)) . " (length: " . strlen($pass) . ")</li>";
echo "<li><strong>DB_NAME:</strong> " . htmlspecialchars($name) . "</li>";
echo "</ul>";

// Test connection
echo "<h2>Connection Test:</h2>";
$conn = new mysqli($host, $user, $pass, $name);

if ($conn->connect_error) {
    echo "<p style='color:red;'><strong>Connection failed:</strong> " . htmlspecialchars($conn->connect_error) . "</p>";
    echo "<p>Error number: " . $conn->connect_errno . "</p>";
} else {
    echo "<p style='color:green;'><strong>✓ Connected successfully!</strong></p>";
    echo "<p>Server info: " . htmlspecialchars($conn->server_info) . "</p>";
    
    // Test table existence
    $result = $conn->query("SHOW TABLES LIKE 'users'");
    if ($result && $result->num_rows > 0) {
        echo "<p style='color:green;'>✓ 'users' table exists</p>";
        
        // Count users
        $countResult = $conn->query("SELECT COUNT(*) as count FROM users");
        if ($countResult) {
            $row = $countResult->fetch_assoc();
            echo "<p>Number of users in database: " . $row['count'] . "</p>";
        }
    } else {
        echo "<p style='color:orange;'>⚠ 'users' table not found. Run setup.sql!</p>";
    }
    
    $conn->close();
}

echo "<hr>";
echo "<p><a href='index.html'>← Back to home</a></p>";
?>
