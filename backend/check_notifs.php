<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$notifications = DB::table('notifications')->latest()->limit(5)->get();
echo json_encode($notifications, JSON_PRETTY_PRINT);
