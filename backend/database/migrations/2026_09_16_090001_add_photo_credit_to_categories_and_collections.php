<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        foreach (['categories', 'collections'] as $table) {
            Schema::table($table, function (Blueprint $blueprint) {
                // Populated only when the image came from Unsplash, so the
                // frontend can show "Photo by X on Unsplash" per API terms.
                $blueprint->string('photo_credit_name')->nullable();
                $blueprint->string('photo_credit_url')->nullable();
            });
        }
    }

    public function down(): void
    {
        foreach (['categories', 'collections'] as $table) {
            Schema::table($table, function (Blueprint $blueprint) {
                $blueprint->dropColumn(['photo_credit_name', 'photo_credit_url']);
            });
        }
    }
};
