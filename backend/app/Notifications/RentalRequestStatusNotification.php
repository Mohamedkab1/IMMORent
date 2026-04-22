<?php

namespace App\Notifications;

use App\Models\RentalRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class RentalRequestStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $rentalRequest;
    public $statusType; // 'created', 'approved', 'rejected', 'cancelled'

    /**
     * Create a new notification instance.
     */
    public function __construct(RentalRequest $rentalRequest, $statusType)
    {
        $this->rentalRequest = $rentalRequest;
        $this->statusType = $statusType;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    private function getMessages()
    {
        $title = 'Demande de location';
        $message = '';

        if ($this->statusType === 'created') {
            $title = 'Nouvelle demande';
            $message = 'Nouvelle demande reçue pour ' . ($this->rentalRequest->property->title ?? 'un bien');
        } elseif ($this->statusType === 'approved') {
            $title = 'Demande acceptée';
            $message = 'Votre demande pour ' . ($this->rentalRequest->property->title ?? 'le bien') . ' a été acceptée.';
        } elseif ($this->statusType === 'rejected') {
            $title = 'Demande refusée';
            $message = 'Votre demande pour ' . ($this->rentalRequest->property->title ?? 'le bien') . ' a été refusée.';
        } elseif ($this->statusType === 'cancelled') {
            $title = 'Demande annulée';
            $message = 'La demande pour ' . ($this->rentalRequest->property->title ?? 'le bien') . ' a été annulée.';
        }

        return ['title' => $title, 'message' => $message];
    }

    /**
     * Get the array representation of the notification.
     */
    public function toDatabase(object $notifiable): array
    {
        $data = $this->getMessages();

        return [
            'request_id' => $this->rentalRequest->id,
            'property_id' => $this->rentalRequest->property_id,
            'title' => $data['title'],
            'message' => $data['message'],
            'status' => $this->statusType,
            'type' => 'rental_request'
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        $data = $this->getMessages();

        return new BroadcastMessage([
            'request_id' => $this->rentalRequest->id,
            'property_id' => $this->rentalRequest->property_id,
            'title' => $data['title'],
            'message' => $data['message'],
            'status' => $this->statusType,
            'type' => 'rental_request'
        ]);
    }
}
