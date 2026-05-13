<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Contract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use App\Notifications\GeneralNotification;
use App\Models\Invoice;
use App\Mail\InvoicePaidMail;
use Barryvdh\DomPDF\Facade\Pdf;
use Stripe\StripeClient;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    /**
     * Display a listing of payments (Admin/Agent see all relative, Client sees own).
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Payment::with(['contract.property', 'property', 'tenant', 'invoice']);

        if ($user->isAdmin()) {
            // All payments
        } elseif ($user->isAgent()) {
            // Payments for contracts managed by this agent
            $query->whereHas('contract', function($q) use ($user) {
                $q->where('agent_id', $user->id);
            });
        } else {
            // Own payments
            $query->where('tenant_id', $user->id);
        }

        $payments = $query->latest()->paginate($request->get('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $payments
        ]);
    }

    /**
     * Crée un PaymentIntent Stripe et pré-enregistre le paiement.
     */
    public function createIntent(Request $request)
    {
        $request->validate([
            'propertyId' => 'required|exists:properties,id',
            'contractId' => 'nullable|exists:contracts,id',
            'amount' => 'required|numeric|min:1',
            'currency' => 'nullable|string',
            'method' => 'required|string|in:card,transfer,agency',
            'transferCode' => 'nullable|string|max:100'
        ]);

        $currency = $request->currency ?? 'MAD';
        
        if ($request->method === 'card') {
            $stripe = new StripeClient(env('STRIPE_SECRET'));
            
            $paymentIntent = $stripe->paymentIntents->create([
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
                'contract_id' => $request->contractId,
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

        $payment = Payment::create([
            'payment_number' => 'PAY-' . strtoupper(uniqid()),
            'tenant_id' => auth()->id(),
            'property_id' => $request->propertyId,
            'contract_id' => $request->contractId,
            'amount' => $request->amount,
            'currency' => $currency,
            'payment_date' => now(),
            'status' => 'pending',
            'payment_method' => $request->method,
            'transaction_id' => $request->transferCode,
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

        $payment = Payment::with(['contract', 'property'])
                          ->where('id', $request->paymentId)
                          ->where('tenant_id', auth()->id())
                          ->firstOrFail();

        $payment->update([
            'status' => $request->status,
            'payment_date' => now()
        ]);

        if ($request->status === 'paid') {
            // Pas de facture générée automatiquement pour les paiements en agence
            if ($payment->payment_method === 'agency') {
                // On met quand même à jour les statuts
                $this->updateRelatedStatuses($payment);
                
                return response()->json([
                    'success' => true,
                    'message' => 'Réservation enregistrée. Veuillez passer à l\'agence pour le paiement.',
                    'payment' => $payment
                ]);
            }

            $invoiceNumber = 'INV-' . date('Y') . '-' . strtoupper(Str::random(5));
            
            $invoice = Invoice::create([
                'payment_id' => $payment->id,
                'client_id' => auth()->id(),
                'invoice_number' => $invoiceNumber,
                'issued_at' => now(),
                'total_amount' => $payment->amount,
            ]);

            $pdf = Pdf::loadView('pdf.invoice', ['invoice' => $invoice, 'payment' => $payment]);
            $filename = $invoiceNumber . '.pdf';
            
            Storage::disk('public')->put('invoices/' . $filename, $pdf->output());

            $pdfUrl = url('storage/invoices/' . $filename);
            
            $invoice->update(['pdf_url' => $pdfUrl]);

            $pdfPath = storage_path('app/public/invoices/' . $filename);
            try {
                Mail::to(auth()->user()->email)->send(new InvoicePaidMail($invoice, $pdfPath));
            } catch (\Exception $e) {
                Log::error('Erreur lors de l\'envoi de l\'email de facture: ' . $e->getMessage());
            }

            // Mettre à jour le statut du bien (Loué ou Vendu)
            if ($payment->property) {
                $newStatus = $payment->property->transaction_type === 'sale' ? 'sold' : 'rented';
                $payment->property->update(['status' => $newStatus]);
                Log::info("Bien ID {$payment->property_id} mis à jour vers le statut: {$newStatus}");
            }

            }

            $this->updateRelatedStatuses($payment);

            // Notifier l'agent que le paiement a été reçu
            $agent = $payment->contract ? $payment->contract->agent : ($payment->property ? $payment->property->user : null);
            if ($agent) {
                $notifData = [
                    'title' => 'Paiement reçu',
                    'message' => "Un paiement de {$payment->amount} DH a été reçu pour le bien : " . ($payment->property ? $payment->property->title : 'Bien inconnu'),
                    'type' => 'payment_received',
                    'link' => '/dashboard/agent',
                    'icon' => 'currency-dollar'
                ];
                $agent->notify(new GeneralNotification($notifData));
                try {
                    event(new \App\Events\RealTimeNotification($agent->id, $notifData));
                } catch (\Exception $e) {
                    Log::warning('Erreur RealTimeNotification (payment) dans PaymentController: ' . $e->getMessage());
                }
            }

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
     * Store a new payment record.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user->isAgent() && !$user->isAdmin()) {
            return response()->json(['success' => false, 'message' => 'Non autorisé'], 403);
        }

        $validator = Validator::make($request->all(), [
            'contract_id' => 'required|exists:contracts,id',
            'amount' => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'payment_method' => 'required|in:cash,bank_transfer,card,check',
            'transaction_id' => 'nullable|string|max:255',
            'status' => 'required|in:pending,paid,late,cancelled',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $contract = Contract::find($request->contract_id);
        
        // Sécurité : Vérifier que l'agent gère bien ce contrat
        if (!$user->isAdmin() && $contract->agent_id !== $user->id) {
            return response()->json(['success' => false, 'message' => 'Non autorisé : vous ne gérez pas ce contrat'], 403);
        }
        
        $payment = Payment::create([
            'contract_id' => $request->contract_id,
            'tenant_id' => $contract->tenant_id ?? $contract->buyer_id,
            'amount' => $request->amount,
            'payment_date' => $request->payment_date,
            'payment_method' => $request->payment_method,
            'transaction_id' => $request->transaction_id,
            'status' => $request->status,
            'notes' => $request->notes,
            'due_date' => $request->due_date ?? now(),
        ]);
        
        // Notify the tenant/buyer about the payment record
        $targetUser = $payment->tenant;
        if ($targetUser) {
            $targetUser->notify(new GeneralNotification([
                'title' => 'Nouveau paiement enregistré',
                'message' => "Un paiement de {$payment->amount} DH a été enregistré pour votre contrat.",
                'type' => 'payment',
                'link' => "/dashboard/client",
            ]));
        }

        return response()->json([
            'success' => true,
            'message' => 'Paiement enregistré avec succès',
            'data' => $payment->load('contract')
        ], 201);
    }

    /**
     * Display the specified payment.
     */
    public function show($id)
    {
        $payment = Payment::with(['contract.property', 'tenant'])->find($id);

        if (!$payment) {
            return response()->json(['success' => false, 'message' => 'Paiement non trouvé'], 404);
        }

        $this->authorize('view', $payment);

        return response()->json([
            'success' => true,
            'data' => $payment
        ]);
    }

    /**
     * Update the payment status.
     */
    public function updateStatus(Request $request, $id)
    {
        $user = $request->user();
        if (!$user->isAgent() && !$user->isAdmin()) {
            return response()->json(['success' => false, 'message' => 'Non autorisé'], 403);
        }

        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json(['success' => false, 'message' => 'Paiement non trouvé'], 404);
        }

        $this->authorize('update', $payment);

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,paid,late,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $payment->update(['status' => $request->status]);

        // Notify the tenant about status update
        if ($payment->tenant) {
            $statusLabel = $request->status === 'paid' ? 'reçu' : ($request->status === 'late' ? 'en retard' : 'en attente');
            $payment->tenant->notify(new GeneralNotification([
                'title' => 'Mise à jour paiement',
                'message' => "Le statut de votre paiement de {$payment->amount} DH est désormais : {$statusLabel}.",
                'type' => 'payment',
                'link' => "/dashboard/client",
            ]));
        }

        return response()->json([
            'success' => true,
            'message' => 'Statut du paiement mis à jour',
            'data' => $payment
        ]);
    }

    /**
     * My payments history (Client).
     */
    public function myPayments(Request $request)
    {
        $payments = Payment::with(['contract.property'])
            ->where('tenant_id', $request->user()->id)
            ->latest()
            ->paginate($request->get('per_page', 10));

        return response()->json([
            'success' => true,
            'data' => $payments
        ]);
    }

    /**
     * Delete a payment (Admin only).
     */
    public function destroy(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['success' => false, 'message' => 'Non autorisé'], 403);
        }

        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json(['success' => false, 'message' => 'Paiement non trouvé'], 404);
        }

        $payment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Paiement supprimé avec succès'
        ]);
    }

    /**
     * Helper pour mettre à jour les statuts liés
     */
    private function updateRelatedStatuses($payment)
    {
        // Mettre à jour le statut du bien (Loué ou Vendu)
        if ($payment->property) {
            $newStatus = $payment->property->transaction_type === 'sale' ? 'sold' : 'rented';
            $payment->property->update(['status' => $newStatus]);
            Log::info("Bien ID {$payment->property_id} mis à jour vers le statut: {$newStatus}");
        }

        // Mettre à jour le statut de la demande de location liée au contrat
        if ($payment->contract && $payment->contract->rental_request_id) {
            $rentalRequest = \App\Models\RentalRequest::find($payment->contract->rental_request_id);
            if ($rentalRequest) {
                $rentalRequest->update(['status' => 'finalized']);
                Log::info("Demande ID {$rentalRequest->id} mise à jour vers le statut: finalized");
            }
        }
    }
}
