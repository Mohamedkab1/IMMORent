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
        // 1. Renommer seulement si l'ancien nom existe encore
        if (Schema::hasColumn('properties', 'transaction_type')) {
            DB::statement("ALTER TABLE properties CHANGE transaction_type listing_type ENUM('rent', 'sale', 'for_rent', 'for_sale') DEFAULT 'rent'");
        } else {
            // Si déjà renommé mais type pas encore mis à jour
            DB::statement("ALTER TABLE properties MODIFY COLUMN listing_type ENUM('rent', 'sale', 'for_rent', 'for_sale') DEFAULT 'rent'");
        }

        // 2. Mettre à jour les valeurs existantes
        DB::table('properties')->where('listing_type', 'rent')->update(['listing_type' => 'for_rent']);
        DB::table('properties')->where('listing_type', 'sale')->update(['listing_type' => 'for_sale']);

        // 3. Finaliser le type enum et la valeur par défaut
        DB::statement("ALTER TABLE properties MODIFY COLUMN listing_type ENUM('for_rent', 'for_sale') DEFAULT 'for_rent'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Chemin inverse
        if (Schema::hasColumn('properties', 'listing_type')) {
             DB::statement("ALTER TABLE properties MODIFY COLUMN listing_type ENUM('rent', 'sale', 'for_rent', 'for_sale') DEFAULT 'for_rent'");
             
             DB::table('properties')->where('listing_type', 'for_rent')->update(['listing_type' => 'rent']);
             DB::table('properties')->where('listing_type', 'for_sale')->update(['listing_type' => 'sale']);
             
             DB::statement("ALTER TABLE properties CHANGE listing_type transaction_type ENUM('rent', 'sale') DEFAULT 'rent'");
        }
    }
};
