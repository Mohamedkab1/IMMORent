<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name', 'email', 'password', 'role_id', 'phone', 'address',
        'profile_photo', 'is_active', 'last_login_at'
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
        'last_login_at' => 'datetime',
    ];

    // Relations
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function properties(): HasMany
    {
        return $this->hasMany(Property::class, 'user_id');
    }

    public function ownedProperties(): HasMany
    {
        return $this->hasMany(Property::class, 'owner_id');
    }

    public function rentalRequests(): HasMany
    {
        return $this->hasMany(RentalRequest::class);
    }

    public function contractsAsTenant(): HasMany
    {
        return $this->hasMany(Contract::class, 'tenant_id');
    }

    public function contractsAsOwner(): HasMany
    {
        return $this->hasMany(Contract::class, 'owner_id');
    }

    public function contractsAsAgent(): HasMany
    {
        return $this->hasMany(Contract::class, 'agent_id');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class, 'tenant_id');
    }

    // Helpers
    public function isAdmin()
    {
        return $this->role && $this->role->slug === 'admin';
    }

    public function isAgent()
    {
        return $this->role && $this->role->slug === 'agent';
    }

    public function isClient()
    {
        return $this->role && $this->role->slug === 'client';
    }

    public function getProfilePhotoUrlAttribute(): string
    {
        return $this->profile_photo 
            ? asset('storage/' . $this->profile_photo)
            : 'https://ui-avatars.com/api/?name=' . urlencode($this->name) . '&color=7F9CF5&background=EBF4FF';
    }
}