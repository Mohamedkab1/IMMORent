<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Contract extends Model
{
    protected $fillable = [
        'contract_number', 'contract_type', 'rental_request_id', 'property_id',
        'buyer_id', 'tenant_id', 'seller_id', 'owner_id', 'agent_id',
        'start_date', 'end_date', 'sale_date', 'monthly_rent', 'sale_price',
        'security_deposit', 'charges', 'status', 'contract_file', 'signed_at'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'sale_date' => 'date',
        'signed_at' => 'datetime',
        'monthly_rent' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'security_deposit' => 'decimal:2',
        'charges' => 'decimal:2',
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($contract) {
            $prefix = $contract->contract_type === 'sale' ? 'SALE' : 'RENT';
            $contract->contract_number = $prefix . '-' . date('Y') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
        });
    }

    public function rentalRequest()
    {
        return $this->belongsTo(RentalRequest::class);
    }

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function tenant()
    {
        return $this->belongsTo(User::class, 'tenant_id');
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function getTotalMonthlyAttribute()
    {
        return $this->monthly_rent + ($this->charges ?? 0);
    }

    public function getTypeLabelAttribute()
    {
        return $this->contract_type === 'sale' ? 'Vente' : 'Location';
    }

    public function getStatusLabelAttribute()
    {
        return match($this->status) {
            'active' => $this->contract_type === 'sale' ? 'En cours' : 'Actif',
            'terminated' => 'Résilié',
            'expired' => 'Expiré',
            'completed' => 'Terminé',
            default => $this->status,
        };
    }
}