<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';

use App\Models\Payment;
use App\Models\RentalRequest;

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Starting fix for paid requests...\n";

$paidPayments = Payment::where('status', 'paid')->with('contract.rentalRequest')->get();
$count = 0;

foreach ($paidPayments as $payment) {
    if ($payment->contract && $payment->contract->rentalRequest) {
        if ($payment->contract->rentalRequest->status !== 'finalized') {
            $payment->contract->rentalRequest->update(['status' => 'finalized']);
            echo "Updated Request ID {$payment->contract->rental_request_id} to finalized (Linked to Payment {$payment->payment_number})\n";
            $count++;
        }
    }
}

echo "Finished. Updated $count requests.\n";
