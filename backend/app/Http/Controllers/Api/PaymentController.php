<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Contract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    /**
     * Display a listing of payments (Admin/Agent see all relative, Client sees own).
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Payment::with(['contract.property', 'tenant']);

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
}
