<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Adds four optional project-detail-page enrichment fields, each
     * stored as JSON so the dashboard can manage flexible, repeatable
     * lists without further migrations:
     *
     * - construction_progress: {concrete: 0-100, brickwork: 0-100, finishing: 0-100}
     * - travel_distances: [{destination, time}, ...]
     * - master_plan: {ground_floor_image, typical_floors_image, legend_note}
     * - developer_track_record: [{name, delivered_label}, ...]
     * - unit_types: [{type, size_range, price_from, cash_price, monthly}, ...]
     */
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->json('construction_progress')->nullable();
            $table->json('travel_distances')->nullable();
            $table->json('master_plan')->nullable();
            $table->json('developer_track_record')->nullable();
            $table->json('unit_types')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['construction_progress', 'travel_distances', 'master_plan', 'developer_track_record', 'unit_types']);
        });
    }
};
