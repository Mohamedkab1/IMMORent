<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'payment_number', 'contract_id', 'tenant_id', 'amount',
        'payment_date', 'status', 'payment_method', 'transaction_id',
        'due_date', 'notes'
    ];

    protected $casts = [
        'payment_date' => 'date',
        'due_date' => 'date',
        'amount' => 'decimal:2',
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($payment) {
            $payment->payment_number = 'PAY-' . strtoupper(uniqid());
        });
    }

    // Relations
    public function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tenant_id');
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeLate($query)
    {
        return $query->where('status', 'late');
    }

    public function scopePaid($query)
    {
        return $query->where('status', 'paid');
    }

    // Accessors
    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            'pending' => 'En attente',
            'paid' => 'Payé',
            'late' => 'En retard',
            'cancelled' => 'Annulé',
            default => $this->status,
        };
    }

    public function getPaymentMethodLabelAttribute(): string
    {
        return match($this->payment_method) {
            'cash' => 'Espèces',
            'bank_transfer' => 'Virement bancaire',
            'card' => 'Carte bancaire',
            'check' => 'Chèque',
            default => $this->payment_method,
        };
    }

    public function getIsLateAttribute(): bool
    {
        return $this->status === 'late' || ($this->status === 'pending' && $this->due_date < now());
    }
}