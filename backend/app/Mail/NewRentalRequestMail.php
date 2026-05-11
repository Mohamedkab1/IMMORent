<?php

namespace App\Mail;

use App\Models\RentalRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewRentalRequestMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $rentalRequest;

    /**
     * Create a new message instance.
     */
    public function __construct(RentalRequest $rentalRequest)
    {
        $this->rentalRequest = $rentalRequest;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '🔔 Nouvelle demande pour : ' . $this->rentalRequest->property->title,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.new_rental_request',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
