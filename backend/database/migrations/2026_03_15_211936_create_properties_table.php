<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->string('address');
            $table->string('city');
            $table->string('postal_code');
            $table->decimal('surface', 8, 2);
            $table->integer('rooms')->nullable();
            $table->integer('bedrooms')->nullable();
            $table->integer('bathrooms')->nullable();
            
            // Type de transaction (location ou vente)
            $table->enum('transaction_type', ['rent', 'sale'])->default('rent');
            $table->enum('status', ['available', 'sold', 'reserved', 'unavailable'])->default('available');
            $table->enum('type', ['apartment', 'house', 'villa', 'office', 'commercial', 'land', 'studio']);
            
            $table->json('features')->nullable();
            $table->json('images')->nullable();
            $table->foreignId('user_id')->constrained(); // Agent qui gère
            $table->foreignId('category_id')->constrained();
            $table->foreignId('owner_id')->nullable()->constrained('users'); // Propriétaire
            $table->timestamps();
            $table->softDeletes();
 
            // Index pour la performance SaaS
            $table->index(['city', 'status']);
            $table->index('price');
            $table->index('transaction_type');
        });
    }

    public function down()
    {
        Schema::dropIfExists('properties');
    }
};