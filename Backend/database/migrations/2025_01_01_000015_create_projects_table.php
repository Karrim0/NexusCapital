<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->nullable()->unique();
            $table->string('project_code')->nullable();
            $table->string('title');
            $table->string('location')->nullable();
            $table->string('district')->nullable();
            $table->string('language')->nullable();

            $table->decimal('starting_price', 12, 2)->nullable();
            $table->string('currency', 10)->nullable()->default('EUR');
            $table->decimal('starting_area', 10, 2)->nullable();
            $table->decimal('max_area', 10, 2)->nullable();
            $table->unsignedInteger('total_units')->nullable();
            $table->string('status')->nullable();
            $table->string('delivery_date')->nullable();

            $table->text('overview')->nullable();
            $table->longText('project_details')->nullable();
            $table->longText('facilities')->nullable();
            $table->longText('location_advantages')->nullable();
            $table->longText('location_advantage')->nullable();
            $table->longText('architectural_vision')->nullable();
            $table->longText('lifestyle_amenities')->nullable();
            $table->longText('investment_info')->nullable();
            $table->longText('investment_potential')->nullable();
            $table->longText('payment_plans')->nullable();
            $table->longText('amenities')->nullable();

            $table->unsignedInteger('mins_from_airport')->nullable();
            $table->unsignedInteger('mins_from_hospitals')->nullable();
            $table->unsignedInteger('mins_from_downtown')->nullable();
            $table->unsignedInteger('mins_from_beach')->nullable();
            $table->text('location_description')->nullable();
            $table->text('map_embed_url')->nullable();

            $table->string('cover_image')->nullable();
            $table->json('gallery')->nullable();

            $table->decimal('down_payment_percent', 5, 2)->nullable();
            $table->unsignedTinyInteger('installment_years')->nullable();
            $table->decimal('cash_discount_percent', 5, 2)->nullable();
            $table->decimal('maintenance_fee_percent', 5, 2)->nullable();

            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();

            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);

            // Redesigned project details page content (added 2026-08-18)
            $table->json('badges')->nullable();
            $table->decimal('offer_discount_percent', 5, 2)->nullable();
            $table->string('offer_deadline_label')->nullable();
            $table->json('residence_highlights')->nullable();
            $table->json('investment_cards')->nullable();
            $table->json('lifestyle_cards')->nullable();
            $table->json('payment_plan_rows')->nullable();
            $table->json('buyer_journey_steps')->nullable();
            $table->json('project_faqs')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};