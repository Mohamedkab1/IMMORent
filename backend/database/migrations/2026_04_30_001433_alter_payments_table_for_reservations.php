<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            // Rendre le contract_id nullable car on peut payer une réservation sans contrat
            $table->foreignId('contract_id')->nullable()->change();
            
            // Ajouter la référence au bien
            $table->foreignId('property_id')->nullable()->constrained('properties')->after('tenant_id');
            
            // Ajouter currency et intent ID
            $table->string('currency')->default('MAD')->after('amount');
            $table->string('stripe_payment_intent_id')->nullable()->after('transaction_id');
        });
        
        // Modifier l'enum de 'status' pour inclure 'refunded' ou 'failed'
        DB::statement("ALTER TABLE payments MODIFY COLUMN status ENUM('pending', 'paid', 'late', 'cancelled', 'failed', 'refunded') DEFAULT 'pending'");
        // Modifier l'enum de 'payment_method' pour correspondre à (card | transfer | agency) tout en gardant l'ancien (cash, check)
        DB::statement("ALTER TABLE payments MODIFY COLUMN payment_method ENUM('cash', 'bank_transfer', 'card', 'check', 'transfer', 'agency') NULL DEFAULT NULL");
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropForeign(['property_id']);
            $table->dropColumn(['property_id', 'currency', 'stripe_payment_intent_id']);
        });
    }
};
