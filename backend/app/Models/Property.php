<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Property extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title', 'description', 'price', 'address', 'city', 'postal_code',
        'surface', 'rooms', 'bedrooms', 'bathrooms', 'status', 'type',
        'listing_type', 'features', 'images', 'user_id', 'category_id', 'owner_id'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'surface' => 'decimal:2',
        'features' => 'array',
        'images' => 'array',
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

    public function purchaseRequests()
    {
        return $this->hasMany(PurchaseRequest::class);
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
        return $query->where('listing_type', 'for_rent');
    }

    public function scopeForSale($query)
    {
        return $query->where('listing_type', 'for_sale');
    }

    public function scopeInCity($query, $city)
    {
        return $query->where('city', 'like', "%{$city}%");
    }

    public function scopePriceRange($query, $min, $max)
    {
        return $query->whereBetween('price', [$min, $max]);
    }

    // Accesseurs
    public function getFullAddressAttribute()
    {
        return "{$this->address}, {$this->city} {$this->postal_code}";
    }

    public function getStatusLabelAttribute()
    {
        $labels = [
            'available' => 'Disponible',
            'sold' => 'Vendu',
            'reserved' => 'Réservé',
            'unavailable' => 'Indisponible'
        ];
        return $labels[$this->status] ?? $this->status;
    }

    public function getListingTypeLabelAttribute()
    {
        return $this->listing_type === 'for_rent' ? 'À louer' : 'À vendre';
    }
}