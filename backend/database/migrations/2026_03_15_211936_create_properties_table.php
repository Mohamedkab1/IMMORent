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
            
            // Modifier l'enum pour ajouter 'for_sale' et 'for_rent'
            $table->enum('listing_type', ['for_rent', 'for_sale'])->default('for_rent');
            $table->enum('status', ['available', 'sold', 'reserved', 'unavailable'])->default('available');
            $table->enum('type', ['apartment', 'house', 'commercial', 'land', 'studio']);
            
            $table->json('features')->nullable();
            $table->json('images')->nullable();
            $table->foreignId('user_id')->constrained(); // Agent qui gère
            $table->foreignId('category_id')->constrained();
            $table->foreignId('owner_id')->nullable()->constrained('users'); // Propriétaire
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('properties');
    }
};