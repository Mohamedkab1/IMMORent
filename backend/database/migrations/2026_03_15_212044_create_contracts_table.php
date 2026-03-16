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
            $table->foreignId('rental_request_id')->constrained();
            $table->foreignId('property_id')->constrained();
            $table->foreignId('tenant_id')->constrained('users');
            $table->foreignId('owner_id')->constrained('users');
            $table->foreignId('agent_id')->constrained('users');
            $table->date('start_date');
            $table->date('end_date');
            $table->decimal('monthly_rent', 10, 2);
            $table->decimal('security_deposit', 10, 2);
            $table->decimal('charges', 10, 2)->default(0);
            $table->enum('status', ['active', 'terminated', 'expired'])->default('active');
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