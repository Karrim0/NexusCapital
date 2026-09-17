<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Adds rental-specific fields:
     * - booking_url: external booking link (Booking.com, Airbnb, or the
     *   site's own booking/contact flow) shown on "For Rent" properties.
     * - is_rented: manual toggle the dashboard user flips when a rental
     *   unit is currently taken, so the public site can show a "Rented"
     *   badge on it.
     */
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->text('booking_url')->nullable()->after('map_embed_url');
            $table->boolean('is_rented')->default(false)->after('booking_url');
        });
    }

    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn(['booking_url', 'is_rented']);
        });
    }
};
