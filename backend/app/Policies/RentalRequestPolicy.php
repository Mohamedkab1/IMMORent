<?php

namespace App\Policies;

use App\Models\RentalRequest;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class RentalRequestPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; // Filtered in Controller
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, RentalRequest $rentalRequest): bool
    {
        return $user->isAdmin() 
            || $user->id === $rentalRequest->user_id 
            || $user->id === $rentalRequest->property->user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isClient() || $user->isAdmin();
    }

    /**
     * Determine whether the user can update (process) the model.
     */
    public function update(User $user, RentalRequest $rentalRequest): bool
    {
        // Seul l'agent qui gère le bien ou un admin peut approuver/refuser
        return $user->isAdmin() || $user->id === $rentalRequest->property->user_id;
    }

    /**
     * Determine whether the user can delete (cancel) the model.
     */
    public function delete(User $user, RentalRequest $rentalRequest): bool
    {
        return $user->isAdmin() || $user->id === $rentalRequest->user_id;
    }
}
