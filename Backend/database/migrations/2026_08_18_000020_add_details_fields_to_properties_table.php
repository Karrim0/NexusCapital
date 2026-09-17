<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Optional extra fields used by the redesigned property details page:
     * floor / view / delivery / contract badges, an indicative payment
     * plan, and optional video + map embeds. All nullable so existing
     * properties keep working unchanged.
     */
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->string('floor')->nullable()->after('garage');
            $table->string('view_category')->nullable()->after('floor');
            $table->string('delivery_date')->nullable()->after('view_category');
            $table->string('contract_type')->nullable()->after('delivery_date');
            $table->string('project_name')->nullable()->after('contract_type');
            $table->decimal('down_payment_percent', 5, 2)->nullable()->after('project_name');
            $table->unsignedTinyInteger('installment_years_max')->nullable()->after('down_payment_percent');
            $table->decimal('cash_discount_percent', 5, 2)->nullable()->after('installment_years_max');
            $table->string('video_url')->nullable()->after('cash_discount_percent');
            $table->text('map_embed_url')->nullable()->after('video_url');
        });
    }

    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn([
                'floor',
                'view_category',
                'delivery_date',
                'contract_type',
                'project_name',
                'down_payment_percent',
                'installment_years_max',
                'cash_discount_percent',
                'video_url',
                'map_embed_url',
            ]);
        });
    }
};
