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
        Schema::table('properties', function (Blueprint $table) {
            // إضافة حقل listing_type للتمييز بين Primary و Resale
            // null = لم يُحدد، 'primary' = بيع أساسي، 'resale' = إعادة بيع
            // التحقق من وجود العمود قبل إضافته لتجنب الأخطاء
            if (!Schema::hasColumn('properties', 'listing_type')) {
                $table->enum('listing_type', ['primary', 'resale'])->nullable()->after('deal_type');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn('listing_type');
        });
    }
};
