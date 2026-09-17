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
        // التحقق من وجود الجدول والعمود قبل التعديل
        if (Schema::hasTable('contact_requests') && Schema::hasColumn('contact_requests', 'property_id')) {
            Schema::table('contact_requests', function (Blueprint $table) {
                // Make property_id nullable to support general contact requests
                // فقط إذا كان العمود موجوداً وغير nullable
                $table->foreignId('property_id')->nullable()->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contact_requests', function (Blueprint $table) {
            // Note: This might fail if there are null values
            // In production, you'd need to handle this more carefully
            $table->foreignId('property_id')->nullable(false)->change();
        });
    }
};
