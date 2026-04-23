<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Ajout de 'rented' au statut des biens
        DB::statement("ALTER TABLE properties MODIFY COLUMN status ENUM('available', 'sold', 'rented', 'reserved', 'unavailable') DEFAULT 'available'");
        
        // Ajout de 'finalized' au statut des demandes
        DB::statement("ALTER TABLE rental_requests MODIFY COLUMN status ENUM('pending', 'approved', 'rejected', 'cancelled', 'finalized') DEFAULT 'pending'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Retour aux enums originaux
        DB::statement("ALTER TABLE properties MODIFY COLUMN status ENUM('available', 'sold', 'reserved', 'unavailable') DEFAULT 'available'");
        DB::statement("ALTER TABLE rental_requests MODIFY COLUMN status ENUM('pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending'");
    }
};
