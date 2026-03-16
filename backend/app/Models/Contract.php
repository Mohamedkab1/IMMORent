<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Contract extends Model
{
    protected $fillable = [
        'contract_number', 'rental_request_id', 'property_id',
        'tenant_id', 'owner_id', 'agent_id', 'start_date', 'end_date',
        'monthly_rent', 'security_deposit', 'charges', 'status',
        'contract_file', 'signed_at'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'signed_at' => 'datetime',
        'monthly_rent' => 'decimal:2',
        'security_deposit' => 'decimal:2',
        'charges' => 'decimal:2',
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($contract) {
            $contract->contract_number = 'CTR-' . date('Y') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
        });
    }

    // Relations
    public function rentalRequest(): BelongsTo
    {
        return $this->belongsTo(RentalRequest::class);
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tenant_id');
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function agent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    // Accessors
    public function getTotalMonthlyAttribute(): float
    {
        return $this->monthly_rent + ($this->charges ?? 0);
    }

    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            'active' => 'Actif',
            'terminated' => 'Résilié',
            'expired' => 'Expiré',
            default => $this->status,
        };
    }

    public function getIsActiveAttribute(): bool
    {
        return $this->status === 'active';
    }
}