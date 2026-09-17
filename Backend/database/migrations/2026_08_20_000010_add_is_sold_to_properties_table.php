<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * is_sold: manual toggle the dashboard user flips when a "For Sale"
     * property has been sold, so the public site can show a "Sold" badge
     * on it (mirrors is_rented for "For Rent" properties).
     */
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->boolean('is_sold')->default(false)->after('is_rented');
        });
    }

    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn('is_sold');
        });
    }
};
