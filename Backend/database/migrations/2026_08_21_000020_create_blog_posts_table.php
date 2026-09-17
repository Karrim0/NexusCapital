<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blog_posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt')->nullable();
            $table->string('cover_image')->nullable();

            // Listing card metadata
            $table->string('category')->nullable();      // e.g. "Buyer Guides", "Payment Plans & ROI"
            $table->json('tags')->nullable();             // e.g. ["Off-plan", "Ready units", "Risk check"]
            $table->string('reading_time_label')->nullable(); // e.g. "10 min read"
            $table->string('card_type_label')->nullable();    // e.g. "Buyer Guide", "Area Comparison"

            // Article hero
            $table->string('hero_eyebrow')->nullable();   // e.g. "HURGHADA NEWS · RED SEA SERVICES"
            $table->string('title_highlight')->nullable(); // substring of `title` to render in gold
            $table->string('primary_cta_label')->nullable();
            $table->string('primary_cta_url')->nullable();
            $table->string('secondary_cta_label')->nullable();
            $table->json('quick_facts')->nullable();      // [{label, value}, ...] the 4-column strip

            // Body content
            $table->json('content_blocks')->nullable();   // [{type: heading|paragraph|quote|callout, text}, ...]
            $table->json('checklist_items')->nullable();  // [string, ...]
            $table->text('disclaimer')->nullable();
            $table->json('benefit_cards')->nullable();    // [{title, description}, ...] numbered cards
            $table->json('gallery')->nullable();           // [{image, caption}, ...] "Photo Story"
            $table->json('faqs')->nullable();              // [{question, answer}, ...]

            $table->boolean('is_published')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->timestamp('published_at')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blog_posts');
    }
};
