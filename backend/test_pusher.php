<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $pusher = new \Pusher\Pusher(
        env('REVERB_APP_KEY'),
        env('REVERB_APP_SECRET'),
        env('REVERB_APP_ID'),
        [
            'host' => env('REVERB_HOST'),
            'port' => env('REVERB_PORT'),
            'scheme' => env('REVERB_SCHEME', 'http'),
            'useTLS' => env('REVERB_SCHEME') === 'https',
        ]
    );
    $pusher->trigger('private-App.Models.User.7', 'GeneralNotification', [
        'id' => uniqid(),
        'type_notif' => 'info',
        'message' => 'TEST_PUSHER_DIRECT',
        'data' => [
            'title' => 'Test Direct',
            'message' => 'Ceci est un test direct via Pusher'
        ]
    ]);
    echo "Direct Pusher event sent to User 7.\n";
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
