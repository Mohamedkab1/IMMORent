<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

foreach (\App\Models\Invoice::all() as $invoice) {
    $payment = $invoice->payment;
    if ($payment) {
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.invoice', ['invoice' => $invoice, 'payment' => $payment]);
        $filename = explode('storage/invoices/', $invoice->pdf_url)[1] ?? $invoice->invoice_number . '.pdf';
        \Illuminate\Support\Facades\Storage::disk('public')->put('invoices/' . $filename, $pdf->output());
        echo "Updated $filename\n";
    }
}
echo "Done.\n";
