<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Property extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title', 'description', 'price', 'transaction_type', 'address', 'city', 'postal_code',
        'surface', 'rooms', 'bedrooms', 'bathrooms', 'status', 'type',
        'features', 'images', 'user_id', 'category_id', 'owner_id',
        'latitude', 'longitude'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'surface' => 'decimal:2',
        'features' => 'array',
        'images' => 'array',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function rentalRequests()
    {
        return $this->hasMany(RentalRequest::class);
    }

    public function contracts()
    {
        return $this->hasMany(Contract::class);
    }


    // Scopes
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }

    public function scopeForRent($query)
    {
        return $query->where('transaction_type', 'rent');
    }

    public function scopeForSale($query)
    {
        return $query->where('transaction_type', 'sale');
    }

    // Accesseurs
    public function getFullAddressAttribute()
    {
        return "{$this->address}, {$this->city} {$this->postal_code}";
    }

    public function getStatusLabelAttribute()
    {
        return match($this->status) {
            'available' => 'Disponible',
            'rented' => 'Loué',
            'reserved' => 'Réservé',
            'unavailable' => 'Indisponible',
            'sold' => 'Vendu',
            default => $this->status,
        };
    }

    public function getTransactionTypeLabelAttribute()
    {
        return match($this->transaction_type) {
            'rent' => 'Location',
            'sale' => 'Vente',
            default => $this->transaction_type,
        };
    }

    public function getTypeLabelAttribute()
    {
        return match($this->type) {
            'apartment' => 'Appartement',
            'house' => 'Maison',
            'commercial' => 'Local commercial',
            'land' => 'Terrain',
            'studio' => 'Studio',
            default => $this->type,
        };
    }

    public function getMainImageAttribute()
    {
        return $this->images[0] ?? null;
    }

    public function getPriceDisplayAttribute()
    {
        if ($this->transaction_type === 'rent') {
            return number_format($this->price, 0, ',', ' ') . ' € / mois';
        }
        return number_format($this->price, 0, ',', ' ') . ' €';
    }
}