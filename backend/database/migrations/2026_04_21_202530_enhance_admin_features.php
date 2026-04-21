<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Update properties table
        Schema::table('properties', function (Blueprint $table) {
            $table->boolean('is_featured')->default(false)->after('status');
            $table->boolean('is_approved')->default(true)->after('is_featured');
            $table->boolean('is_archived')->default(false)->after('is_approved');
        });

        // 2. Create settings table
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('type')->default('string'); // string, integer, boolean, json
            $table->string('group')->default('general'); // general, agency, payment, contact
            $table->string('label')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 3. Insert default settings
        DB::table('settings')->insert([
            [
                'key' => 'agency_fee_percentage',
                'value' => '5',
                'type' => 'integer',
                'group' => 'agency',
                'label' => 'Frais d\'agence (%)',
                'description' => 'Pourcentage prélevé sur les transactions.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'retraction_delay_days',
                'value' => '14',
                'type' => 'integer',
                'group' => 'general',
                'label' => 'Délai de rétractation (jours)',
                'description' => 'Délai légal pour annuler un contrat.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'contact_email',
                'value' => 'contact@immorent.ma',
                'type' => 'string',
                'group' => 'contact',
                'label' => 'Email de contact',
                'description' => 'Email affiché sur le site.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'featured_threshold_price',
                'value' => '10000',
                'type' => 'integer',
                'group' => 'general',
                'label' => 'Seuil de mise en avant (Prix)',
                'description' => 'Prix minimum pour qu\'un bien soit éligible à la mise en avant automatique (optionnel).',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
        
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn(['is_featured', 'is_approved', 'is_archived']);
        });
    }
};
