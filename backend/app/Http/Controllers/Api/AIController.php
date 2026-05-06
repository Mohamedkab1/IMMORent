<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIController extends Controller
{
    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:500',
        ]);

        $userMessage = $request->input('message');
        $apiKey = env('GEMINI_API_KEY');

        if (!$apiKey) {
            return response()->json([
                'success' => false,
                'message' => 'Service temporarily unavailable. Please try again later.'
            ], 500);
        }

        $systemPrompt = "Vous êtes l'assistant IA officiel de la plateforme IMMORent, une application web de gestion immobilière.\n" .
                        "Directives importantes :\n" .
                        "1. Longueur : Vos réponses doivent être de longueur MOYENNE (ni trop courtes, ni trop longues, environ 3 à 5 phrases ou quelques points clairs).\n" .
                        "2. Langue : Répondez exactement dans la langue de l'utilisateur (Darija marocaine, Arabe classique, Français, ou Anglais).\n" .
                        "3. Clarté : Utilisez des listes à puces pour l'organisation. Soyez direct, accueillant et très clair.\n" .
                        "4. Connaissance d'IMMORent : La plateforme permet aux 'Clients' de chercher des biens, envoyer des demandes de location/vente, et suivre leurs contrats/paiements. Elle permet aux 'Agents' d'ajouter des biens, accepter les demandes, et générer des contrats.\n" .
                        "5. Étapes : Si on demande comment faire une action (ex: louer), expliquez brièvement le processus (ex: Créer un compte -> Chercher un bien -> Envoyer une demande -> L'agent valide -> Contrat et paiement).\n" .
                        "6. Hors-sujet : Si on vous pose une question hors de l'immobilier, recadrez poliment vers IMMORent.\n" .
                        "7. Inventaire : Ne donnez pas de prix ou d'annonces inventées. Dites à l'utilisateur de cliquer sur 'Voir les biens' ou d'utiliser la barre de recherche du site.";


        $payload = [
            'systemInstruction' => [
                'parts' => [
                    ['text' => $systemPrompt]
                ]
            ],
            'contents' => [
                [
                    'role' => 'user',
                    'parts' => [
                        ['text' => $userMessage]
                    ]
                ]
            ],
            'generationConfig' => [
                'maxOutputTokens' => 600,
                'temperature' => 0.5,
            ]
        ];

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" . $apiKey, $payload);

            if ($response->successful()) {
                $data = $response->json();
                
                if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
                    $aiResponse = $data['candidates'][0]['content']['parts'][0]['text'];
                    return response()->json([
                        'success' => true,
                        'message' => $aiResponse
                    ]);
                }
            }

            Log::error('Gemini API Error: ' . $response->body());
            
            return response()->json([
                'success' => false,
                'message' => 'Service temporarily unavailable. Please try again later.'
            ], 500);

        } catch (\Exception $e) {
            Log::error('Gemini AI Exception: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Service temporarily unavailable. Please try again later.'
            ], 500);
        }
    }
}
