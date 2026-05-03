<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'payment_id', 'client_id', 'invoice_number', 'pdf_url',
        'issued_at', 'due_date', 'total_amount'
    ];

    protected $casts = [
        'issued_at' => 'datetime',
        'due_date' => 'datetime',
        'total_amount' => 'decimal:2',
    ];

    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }
}
