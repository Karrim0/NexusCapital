<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('team_members', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('title')->nullable();          // Job title / position
            $table->string('photo')->nullable();
            $table->text('bio')->nullable();
            $table->string('department')->default('Sales Team'); // Sales Team, Rental Team, Marketing Team, Management, Customer Service
            $table->string('years_of_experience')->nullable();
            $table->string('specialization')->nullable();
            $table->string('location')->nullable();        // Areas covered
            $table->json('expertise')->nullable();         // list of strings
            $table->json('languages')->nullable();         // list of strings
            $table->string('phone')->nullable();
            $table->string('whatsapp')->nullable();
            $table->string('email')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->json('translations')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('team_members');
    }
};
