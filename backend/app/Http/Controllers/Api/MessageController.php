<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Notifications\GeneralNotification;

class MessageController extends Controller
{
    /**
     * Get all conversations for the authenticated user.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $conversations = Conversation::with(['userOne', 'userTwo', 'property'])
            ->where('user_one_id', $user->id)
            ->orWhere('user_two_id', $user->id)
            ->orderBy('last_message_at', 'desc')
            ->paginate(15);

        // Transformation pour identifier "l'autre utilisateur" plus facilement en frontend
        $conversations->getCollection()->transform(function ($conversation) use ($user) {
            $otherUser = $conversation->user_one_id === $user->id 
                ? $conversation->userTwo 
                : $conversation->userOne;
            
            $conversation->other_user = $otherUser;
            $conversation->unread_count = $conversation->messages()
                ->where('sender_id', '!=', $user->id)
                ->whereNull('read_at')
                ->count();
            
            return $conversation;
        });

        return response()->json([
            'success' => true,
            'data' => $conversations
        ]);
    }

    /**
     * Get messages for a specific conversation.
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();
        $conversation = Conversation::with(['userOne', 'userTwo', 'property'])->findOrFail($id);

        // Vérification de l'accès
        if ($conversation->user_one_id !== $user->id && $conversation->user_two_id !== $user->id) {
            return response()->json(['success' => false, 'message' => 'Non autorisé'], 403);
        }

        $messages = $conversation->messages()->with('sender')->paginate(50);

        // Marquer comme lu
        $conversation->messages()
            ->where('sender_id', '!=', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json([
            'success' => true,
            'data' => $messages,
            'conversation' => $conversation
        ]);
    }

    /**
     * Send a message.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'receiver_id' => 'required|exists:users,id',
            'property_id' => 'nullable|exists:properties,id',
            'body' => 'required|string|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $user = $request->user();
        $receiverId = $request->receiver_id;

        // Empêcher de s'envoyer un message à soi-même
        if ($user->id == $receiverId) {
            return response()->json(['success' => false, 'message' => 'Action impossible'], 400);
        }

        try {
            $message = DB::transaction(function () use ($user, $receiverId, $request) {
                // Trouver ou créer la conversation
                $conversation = Conversation::where(function ($q) use ($user, $receiverId) {
                        $q->where('user_one_id', $user->id)->where('user_two_id', $receiverId);
                    })
                    ->orWhere(function ($q) use ($user, $receiverId) {
                        $q->where('user_one_id', $receiverId)->where('user_two_id', $user->id);
                    })
                    ->first();

                if (!$conversation) {
                    $conversation = Conversation::create([
                        'user_one_id' => $user->id,
                        'user_two_id' => $receiverId,
                        'property_id' => $request->property_id,
                        'last_message_at' => now()
                    ]);
                } else {
                    $conversation->update(['last_message_at' => now()]);
                }

                return Message::create([
                    'conversation_id' => $conversation->id,
                    'sender_id' => $user->id,
                    'body' => $request->body
                ]);
            });

            // Déclencher les notifications et événements APRÈS que la réponse soit envoyée au client
            $receiver = User::find($receiverId);
            if ($receiver) {
                $notifData = [
                    'title' => 'Nouveau message',
                    'message' => "Vous avez reçu un message de {$user->name}",
                    'type' => 'message',
                    'link' => '/messages',
                    'icon' => 'chat'
                ];

                // Utiliser afterResponse pour libérer le client immédiatement
                dispatch(function () use ($receiver, $notifData) {
                    try {
                        $receiver->notify(new GeneralNotification($notifData));
                    } catch (\Exception $e) {
                        \Illuminate\Support\Facades\Log::warning('After-response notification failed: ' . $e->getMessage());
                    }
                    
                    try {
                        event(new \App\Events\RealTimeNotification($receiver->id, $notifData));
                    } catch (\Exception $e) {
                        \Illuminate\Support\Facades\Log::warning('After-response real-time event failed: ' . $e->getMessage());
                    }
                })->afterResponse();
            }

            return response()->json([
                'success' => true,
                'data' => $message->load('sender')
            ], 201);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Erreur MessageController.store: ' . $e->getMessage(), [
                'exception' => $e,
                'user_id' => $user->id ?? 'unknown',
                'request' => $request->all()
            ]);
            return response()->json(['success' => false, 'message' => 'Erreur lors de l\'envoi'], 500);
        }
    }
}
