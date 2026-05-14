<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';

use App\Models\Payment;
use App\Models\RentalRequest;

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Manual fix for Request 8 and Payment 8...\n";

$req = RentalRequest::find(8);
if ($req) {
    $req->update(['status' => 'finalized']);
    echo "Request 8 finalized.\n";
}

$pay = Payment::find(8);
if ($pay) {
    $pay->update(['contract_id' => 14]);
    echo "Payment 8 linked to Contract 14.\n";
}

echo "Done.\n";
