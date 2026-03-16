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
        'title', 'description', 'price', 'address', 'city', 'postal_code',
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
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function rentalRequests(): HasMany
    {
        return $this->hasMany(RentalRequest::class);
    }

    public function contracts(): HasMany
    {
        return $this->hasMany(Contract::class);
    }

    // Scopes
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }

    public function scopeInCity($query, string $city)
    {
        return $query->where('city', 'like', "%{$city}%");
    }

    public function scopePriceRange($query, float $min, float $max)
    {
        return $query->whereBetween('price', [$min, $max]);
    }

    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }

    // Accessors
    public function getFullAddressAttribute(): string
    {
        return "{$this->address}, {$this->city} {$this->postal_code}";
    }

    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            'available' => 'Disponible',
            'rented' => 'Loué',
            'reserved' => 'Réservé',
            'unavailable' => 'Indisponible',
            default => $this->status,
        };
    }

    public function getTypeLabelAttribute(): string
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

    public function getMainImageAttribute(): ?string
    {
        return $this->images[0] ?? null;
    }
}