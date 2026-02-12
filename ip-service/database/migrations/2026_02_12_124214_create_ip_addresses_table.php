<?php

declare(strict_types=1);

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
        Schema::create('ip_addresses', function (Blueprint $table): void {
            $table->id();
            $table->string('value')->unique();
            $table->string('label');
            $table->text('comment')->nullable();
            $table->unsignedBigInteger('created_by');
            $table->timestamps();

            $table->index('created_by');
            $table->index('value');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ip_addresses');
    }
};
