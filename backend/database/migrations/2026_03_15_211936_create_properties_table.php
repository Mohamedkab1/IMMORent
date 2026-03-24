<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->enum('transaction_type', ['rent', 'sale'])->default('rent');
            $table->string('address');
            $table->string('city');
            $table->string('postal_code', 10);
            $table->decimal('surface', 8, 2);
            $table->integer('rooms')->nullable();
            $table->integer('bedrooms')->nullable();
            $table->integer('bathrooms')->nullable();
            $table->enum('status', ['available', 'rented', 'reserved', 'unavailable', 'sold'])->default('available');
            $table->enum('type', ['apartment', 'house', 'commercial', 'land', 'studio']);
            $table->json('features')->nullable();
            $table->json('images')->nullable();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('category_id')->constrained();
            $table->foreignId('owner_id')->nullable()->constrained('users');
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};