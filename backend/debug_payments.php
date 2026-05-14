<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';

use App\Models\Payment;
use App\Models\RentalRequest;
use App\Models\Contract;

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "DEBUG PAYMENTS:\n";

$paidPayments = Payment::where('status', 'paid')->get();
foreach ($paidPayments as $p) {
    echo "Payment ID: {$p->id}, Number: {$p->payment_number}, Contract ID: " . ($p->contract_id ?? 'NULL') . "\n";
    if ($p->contract_id) {
        $c = Contract::find($p->contract_id);
        echo "  Contract Number: {$c->contract_number}, Req ID: " . ($c->rental_request_id ?? 'NULL') . "\n";
        if ($c->rental_request_id) {
            $r = RentalRequest::find($c->rental_request_id);
            echo "    Request Status: {$r->status}\n";
        }
    }
}
