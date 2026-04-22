<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Review extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'property_id',
        'rating',
        'comment',
        'status',
    ];

    /**
     * Scope for approved reviews.
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Get the user who left the review.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the property being reviewed.
     */
    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
