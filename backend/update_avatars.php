<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$users = App\Models\User::all();
foreach($users as $u) {
    if (isset($u->profile_photo_path) && strpos($u->profile_photo_path, 'http') === false) {
        $u->profile_photo_path = 'https://ui-avatars.com/api/?name=' . urlencode($u->name);
        $u->save();
    }
    if (isset($u->avatar) && strpos($u->avatar, 'http') === false) {
        $u->avatar = 'https://ui-avatars.com/api/?name=' . urlencode($u->name);
        $u->save();
    }
}
echo 'User avatars updated successfully!';
