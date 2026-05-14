<?php
<<<<<<< HEAD
try {
    $pdo = new PDO('mysql:host=127.0.0.1;port=3306;dbname=immobilier_db_clean', 'root', '');
    echo "Connected OK\n";
    $rows = $pdo->query("SHOW DATABASES;")->fetchAll(PDO::FETCH_COLUMN);
    echo implode(', ', $rows) . "\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
=======
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    \Illuminate\Support\Facades\DB::connection()->getPdo();
    echo "DB OK: " . \Illuminate\Support\Facades\DB::connection()->getDatabaseName() . "\n";
    
    // Check if users table exists and has data
    $count = \Illuminate\Support\Facades\DB::table('users')->count();
    echo "Users count: $count\n";
    
    // Check if personal_access_tokens table exists
    $exists = \Illuminate\Support\Facades\Schema::hasTable('personal_access_tokens');
    echo "personal_access_tokens table exists: " . ($exists ? 'yes' : 'no') . "\n";
    
    // Check if last_login_at column exists
    $hasCol = \Illuminate\Support\Facades\Schema::hasColumn('users', 'last_login_at');
    echo "last_login_at column exists: " . ($hasCol ? 'yes' : 'no') . "\n";
    
    // Try to simulate a login
    $user = \App\Models\User::with('role')->first();
    if ($user) {
        echo "First user: " . $user->email . " (role: " . ($user->role ? $user->role->slug : 'NO ROLE') . ")\n";
    } else {
        echo "No users found in the database\n";
    }
} catch(\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
>>>>>>> 8515e47ed60aa66cf06cbd392658bab5d24045fb
}
