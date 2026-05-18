<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use App\Mail\ContactMail;

class ContactController extends Controller
{
    /**
     * Handle incoming contact requests.
     */
    public function send(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|max:255',
            'company' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'message' => 'required|string|max:5000',
            'subject' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Veuillez vérifier les champs du formulaire.',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $contactData = $request->all();
            
            // Envoyer l'email à l'adresse de l'agence
            Mail::to('info@immorent.com')->send(new ContactMail($contactData));
            
            return response()->json([
                'success' => true,
                'message' => 'Votre message a été envoyé avec succès !'
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Erreur Contact Form: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de l\'envoi du message.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
