<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('home_contents', function (Blueprint $table) {
            // Structure: { "ar": { ...same shape as `data`, partial ok... }, "de": {...}, ... }
            // This single table backs every *ContentController (home, about, buy, rent,
            // lands, services, contact, faq, projects) via the `key` column, so this one
            // migration covers translated content for every page on the site.
            $table->json('translations')->nullable()->after('data');
        });
    }

    public function down(): void
    {
        Schema::table('home_contents', function (Blueprint $table) {
            $table->dropColumn('translations');
        });
    }
};
