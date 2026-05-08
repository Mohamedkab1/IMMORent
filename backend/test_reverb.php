<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $user = App\Models\User::find(7);
    if ($user) {
        $user->notify(new App\Notifications\GeneralNotification(['title'=>'Test','message'=>'Test Msg']));
        echo "SUCCESS: Notification broadcasted.\n";
    } else {
        echo "User not found.\n";
    }
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
