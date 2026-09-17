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
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            // Owner of the property (typically agent or admin)
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('property_type')->nullable();
            // "For Sale" / "For Rent"
            $table->string('deal_type')->nullable();
            $table->string('listing_type')->nullable();
            $table->decimal('price', 15, 2)->nullable();
            $table->unsignedInteger('area')->nullable();
            $table->unsignedTinyInteger('bedrooms')->nullable();
            $table->unsignedTinyInteger('bathrooms')->nullable();
            $table->unsignedTinyInteger('garage')->nullable();
            $table->string('location');
            $table->string('city')->nullable();
            $table->string('address')->nullable();
            $table->string('badge')->nullable();
            $table->string('main_image_url')->nullable();
            $table->json('images')->nullable();
            $table->json('features')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
