<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class InvoiceController extends Controller
{
    /**
     * Télécharge le PDF d'une facture.
     */
    public function download(Request $request, $id)
    {
        $invoice = Invoice::findOrFail($id);

        // Vérification des permissions
        if ($invoice->client_id !== auth()->id() && auth()->user()->role->slug !== 'admin') {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        if (!$invoice->pdf_url) {
            return response()->json(['message' => 'Fichier PDF non trouvé.'], 404);
        }

        // Le path de stockage public (ex: invoices/INV-2024-XXXXX.pdf)
        $filename = explode('storage/', $invoice->pdf_url)[1];

        if (!Storage::disk('public')->exists($filename)) {
            return response()->json(['message' => 'Le fichier n\'existe pas sur le serveur.'], 404);
        }

        return Storage::disk('public')->download($filename);
    }
}
