<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RentalRequest extends Model
{
    protected $table = 'rental_requests';
    
    protected $fillable = [
        'request_number','user_id', 'property_id', 'start_date', 'end_date',
        'status', 'message', 'rejection_reason', 'processed_at', 'processed_by'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'processed_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($request) {
            $prefix = $request->type === 'sale' ? 'SALE' : 'RENT';
            $request->request_number = $prefix . '-' . strtoupper(uniqid());
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function processor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    public function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }

    public function getTypeLabelAttribute(): string
    {
        return $this->type === 'sale' ? 'Achat' : 'Location';
    }

    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            'pending' => 'En attente',
            'approved' => 'Approuvée',
            'rejected' => 'Refusée',
            'cancelled' => 'Annulée',
            default => $this->status,
        };
    }
}