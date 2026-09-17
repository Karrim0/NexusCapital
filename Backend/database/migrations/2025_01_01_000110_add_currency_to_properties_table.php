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
            // إضافة حقل currency للعملة (USD, EUR, EGP)
            // التحقق من وجود العمود قبل إضافته لتجنب الأخطاء
            if (!Schema::hasColumn('properties', 'currency')) {
                $table->string('currency', 3)->default('USD')->after('price');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn('currency');
        });
    }
};
