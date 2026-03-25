<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->string('contract_number')->unique();
            $table->string('contract_type')->default('rent'); // rent ou sale
            $table->foreignId('rental_request_id')->nullable()->constrained();
            $table->foreignId('property_id')->constrained();
            $table->foreignId('buyer_id')->nullable()->constrained('users');
            $table->foreignId('tenant_id')->nullable()->constrained('users');
            $table->foreignId('seller_id')->nullable()->constrained('users');
            $table->foreignId('owner_id')->nullable()->constrained('users');
            $table->foreignId('agent_id')->constrained('users');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->date('sale_date')->nullable();
            $table->decimal('monthly_rent', 10, 2)->nullable();
            $table->decimal('sale_price', 10, 2)->nullable();
            $table->decimal('security_deposit', 10, 2)->nullable();
            $table->decimal('charges', 10, 2)->nullable();
            $table->enum('status', ['active', 'terminated', 'expired', 'completed'])->default('active');
            $table->string('contract_file')->nullable();
            $table->date('signed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};