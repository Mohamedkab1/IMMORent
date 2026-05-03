<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Invoice;
use App\Models\Property;
use App\Mail\InvoicePaidMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use Stripe\StripeClient;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    /**
     * Crée un PaymentIntent Stripe et pré-enregistre le paiement.
     */
    public function createIntent(Request $request)
    {
        $request->validate([
            'propertyId' => 'required|exists:properties,id',
            'amount' => 'required|numeric|min:1',
            'currency' => 'nullable|string',
            'method' => 'required|string|in:card,transfer,agency'
        ]);

        $currency = $request->currency ?? 'MAD';
        
        // Pour un paiement par carte, on initie Stripe
        if ($request->method === 'card') {
            $stripe = new StripeClient(env('STRIPE_SECRET'));
            
            $paymentIntent = $stripe->paymentIntents->create([
                // Stripe demande des centimes pour la plupart des devises (mais attention, MAD = 100 centimes)
                'amount' => (int) ($request->amount * 100),
                'currency' => strtolower($currency),
                'automatic_payment_methods' => [
                    'enabled' => true,
                ],
                'metadata' => [
                    'client_id' => auth()->id(),
                    'property_id' => $request->propertyId,
                ]
            ]);

            $payment = Payment::create([
                'payment_number' => 'PAY-' . strtoupper(uniqid()),
                'tenant_id' => auth()->id(),
                'property_id' => $request->propertyId,
                'amount' => $request->amount,
                'currency' => $currency,
                'payment_date' => now(),
                'status' => 'pending',
                'payment_method' => 'card',
                'stripe_payment_intent_id' => $paymentIntent->id,
                'due_date' => now(),
            ]);

            return response()->json([
                'clientSecret' => $paymentIntent->client_secret,
                'paymentIntentId' => $paymentIntent->id,
                'paymentId' => $payment->id
            ]);
        }

        // Pour les autres méthodes (agence, virement)
        $payment = Payment::create([
            'payment_number' => 'PAY-' . strtoupper(uniqid()),
            'tenant_id' => auth()->id(),
            'property_id' => $request->propertyId,
            'amount' => $request->amount,
            'currency' => $currency,
            'payment_date' => now(),
            'status' => 'pending',
            'payment_method' => $request->method,
            'due_date' => now(),
        ]);

        return response()->json([
            'paymentId' => $payment->id,
            'message' => 'Paiement initié. Veuillez suivre les instructions.'
        ]);
    }

    /**
     * Confirme le paiement et génère la facture.
     */
    public function confirm(Request $request)
    {
        $request->validate([
            'paymentId' => 'required|exists:payments,id',
            'status' => 'required|string|in:paid,failed'
        ]);

        $payment = Payment::where('id', $request->paymentId)
                          ->where('tenant_id', auth()->id())
                          ->firstOrFail();

        $payment->update([
            'status' => $request->status,
            'payment_date' => now()
        ]);

        if ($request->status === 'paid') {
            // Génération de la facture
            $invoiceNumber = 'INV-' . date('Y') . '-' . strtoupper(Str::random(5));
            
            $invoice = Invoice::create([
                'payment_id' => $payment->id,
                'client_id' => auth()->id(),
                'invoice_number' => $invoiceNumber,
                'issued_at' => now(),
                'total_amount' => $payment->amount,
            ]);

            // Génération du PDF
            $pdf = Pdf::loadView('pdf.invoice', ['invoice' => $invoice, 'payment' => $payment]);
            $filename = $invoiceNumber . '.pdf';
            
            // On sauvegarde dans storage/app/public/invoices
            Storage::disk('public')->put('invoices/' . $filename, $pdf->output());

            $pdfUrl = url('storage/invoices/' . $filename);
            
            $invoice->update(['pdf_url' => $pdfUrl]);

            // Envoi de l'email (en asynchrone si file d'attente configurée)
            $pdfPath = storage_path('app/public/invoices/' . $filename);
            Mail::to(auth()->user()->email)->send(new InvoicePaidMail($invoice, $pdfPath));

            return response()->json([
                'success' => true,
                'payment' => $payment,
                'invoice' => $invoice,
                'invoiceUrl' => $pdfUrl
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Paiement échoué ou annulé.'
        ]);
    }

    /**
     * Historique des paiements de l'utilisateur connecté.
     */
    public function history(Request $request)
    {
        $payments = Payment::with(['property', 'invoice'])
                           ->where('tenant_id', auth()->id())
                           ->orderBy('created_at', 'desc')
                           ->get();
                           
        return response()->json(['payments' => $payments]);
    }
}
