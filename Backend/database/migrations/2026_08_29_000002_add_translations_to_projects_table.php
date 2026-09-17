<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            // Structure: { "ar": { "title": "...", "overview": "...", ... }, "de": {...}, "pl": {...}, "cs": {...} }
            // Only translated fields need to be present per locale; anything missing falls back to the English column.
            $table->json('translations')->nullable()->after('unit_types');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn('translations');
        });
    }
};
