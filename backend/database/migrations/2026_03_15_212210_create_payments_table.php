<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string('payment_number')->unique();
            $table->foreignId('contract_id')->constrained();
            $table->foreignId('tenant_id')->constrained('users');
            $table->decimal('amount', 10, 2);
            $table->date('payment_date');
            $table->enum('status', ['pending', 'paid', 'late', 'cancelled'])->default('pending');
            $table->enum('payment_method', ['cash', 'bank_transfer', 'card', 'check'])->nullable();
            $table->string('transaction_id')->nullable();
            $table->date('due_date');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};