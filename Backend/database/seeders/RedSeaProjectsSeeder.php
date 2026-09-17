<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

/**
 * Imports Red Sea development projects (the /projects catalogue), rebranded
 * to Nexus Capital and mapped onto the Project model's rich detail-page schema
 * (residence highlights, payment plan rows, buyer journey, FAQ, etc).
 *
 * This is PROJECT 1 of a 32-project batch — run it, review it on the live
 * /projects/a-marina-blue page, and once approved the remaining 31 projects
 * will be added to this same file and re-uploaded.
 *
 * Usage: php artisan db:seed --class=RedSeaProjectsSeeder
 * Safe to re-run: it upserts by slug, so running it twice will not duplicate projects.
 *
 * NOTE ON IMAGES: cover_image, gallery, and master_plan floor-plan images are
 * intentionally left empty. Upload the real project photos and floor plans
 * from the dashboard (Edit Project) after import — see conversation notes.
 */
class RedSeaProjectsSeeder extends Seeder
{
    public function run(): void
    {
        $projects = [
            [
                'slug'                  => 'a-marina-blue',
                'title'                 => 'A Marina Blue',
                'location'              => 'Al Ahyaa, Hurghada',
                'district'              => 'Al Ahyaa',
                'currency'              => 'EUR',
                'delivery_date'         => '2029',
                'down_payment_percent'  => 15,
                'installment_years'     => 5,
                'maintenance_fee_percent' => 10,
                'is_active'             => true,
                'is_featured'           => false,

                'overview' => 'A Marina Blue is a residential project in Al Ahyaa, positioned beside Ibiza Resort. Buyers can begin with a 15% down payment and continue installments over five years, with delivery scheduled for 2029 and a 10% maintenance fee.',

                'project_details' => "A Marina Blue combines a location beside Ibiza Resort with a straightforward commercial structure: 15% down payment, five years of installments, scheduled delivery in 2029, and a 10% maintenance fee. Prices, available unit sizes, floors, views, and exact installment dates were not included in the supplied summary. Request the current developer availability before selecting a unit.",

                'location_description' => 'The supplied location description places A Marina Blue in Al Ahyaa beside Ibiza Resort. Request the exact project pin from Nexus Capital before arranging a viewing or making a reservation.',

                'badges' => ['15% Down Payment', '5-Year Installments', 'Delivery 2029'],

                'residence_highlights' => [
                    ['badge' => 'Location', 'title' => 'Al Ahyaa location', 'description' => 'Beside Ibiza Resort.', 'cta_label' => 'Ask for Availability'],
                    ['badge' => 'Costs', 'title' => '10% maintenance', 'description' => 'Confirm the calculation basis in the contract.', 'cta_label' => 'Ask for Terms'],
                    ['badge' => 'Plans', 'title' => 'Three supplied plans', 'description' => 'Ground, pool level, and typical floor.', 'cta_label' => 'Request Floor Plans'],
                    ['badge' => 'Stock', 'title' => 'Current availability', 'description' => 'Request live units, sizes, and prices.', 'cta_label' => 'Request Price List'],
                ],

                'payment_plan_rows' => [
                    ['label' => 'Standard Plan', 'down_percent' => '15%', 'duration_label' => '5 Years', 'discount_percent' => 'On request', 'best_for' => 'Buyers who want a straightforward five-year instalment schedule'],
                ],

                'buyer_journey_steps' => [
                    ['title' => 'Request Live Availability', 'description' => 'Receive the current price list, unit sizes, floors, views, and reservation status.'],
                    ['title' => 'Compare Layouts', 'description' => 'Review the project plans and request the exact plan for each shortlisted unit.'],
                    ['title' => 'Confirm Commercial Terms', 'description' => 'Verify the 15% down payment, five-year schedule, maintenance fees, and all related fees.'],
                    ['title' => 'Inspect the Contract', 'description' => 'Check the unit details, specifications, payment milestones, delivery wording, and buyer obligations.'],
                    ['title' => 'Visit or Review Remotely', 'description' => 'Arrange a project visit or request a guided remote presentation before making a decision.'],
                    ['title' => 'Reserve the Selected Unit', 'description' => 'Proceed only after the unit and every commercial term are confirmed in writing.'],
                ],

                'project_faqs' => [
                    ['question' => 'Where is A Marina Blue located?', 'answer' => 'A Marina Blue is in Al Ahyaa, beside Ibiza Resort. Request the exact project pin before arranging a visit.'],
                    ['question' => 'What is the A Marina Blue payment plan?', 'answer' => 'The supplied plan is 15% down payment with instalments over five years. The precise instalment frequency and dates should be confirmed in the developer-issued schedule.'],
                    ['question' => 'When is A Marina Blue scheduled for delivery?', 'answer' => 'Delivery is scheduled for 2029. Confirm the exact contractual handover date and delivery conditions for the selected unit.'],
                    ['question' => 'What is the maintenance fee?', 'answer' => 'The supplied maintenance fee is 10%. Confirm whether it is calculated on the unit price or another basis, when it is due, and what services it covers.'],
                    ['question' => 'What unit sizes and prices are available?', 'answer' => 'Current sizes, unit numbers, floors, views, and prices were not included in the supplied summary. Request the latest availability and price list.'],
                    ['question' => 'Which architectural plans are available?', 'answer' => 'The supplied package contains ground, pool-level, and typical-floor project plans. Request the latest high-resolution drawing and exact unit plan before reservation.'],
                    ['question' => 'Are the gallery images photographs of the completed project?', 'answer' => 'No. The gallery uses developer-supplied architectural visualisations. Final finishes, furniture, landscaping, views, water features, access, and delivered specifications are subject to approved plans and the signed contract.'],
                ],
            ],
            [
                'slug'                  => 'amarina-soul',
                'title'                 => 'AMarina Soul',
                'location'              => 'Magawish, Hurghada',
                'district'              => 'Magawish',
                'currency'              => 'EUR',
                'delivery_date'         => '2029',
                'down_payment_percent'  => 15,
                'installment_years'     => 5,
                'maintenance_fee_percent' => 10,
                'is_active'             => true,
                'is_featured'           => false,

                'overview' => 'AMarina Soul is a residential project in Magawish, beside Jungle Compound. Its warm stone architecture and sculpted arches create a distinctive arrival, supported by a 15% down payment and installments over five years.',

                'project_details' => "AMarina Soul combines its Magawish location with a clear payment structure: 15% down payment, installments over five years, delivery date in 2029, and a 10% maintenance fee. Request current prices, unit sizes, floors, views, and live availability for AMarina Soul.",

                'location_description' => 'AMarina Soul is positioned in Magawish, with Jungle Compound serving as the nearby area reference. Use Jungle Compound as the nearby landmark when planning a visit, and arrange an appointment with Nexus Capital for viewing.',

                'badges' => ['15% Down Payment', '5-Year Installments', 'Delivery Date 2029'],

                'residence_highlights' => [
                    ['badge' => 'Location', 'title' => 'Magawish location', 'description' => 'Beside Jungle Compound.', 'cta_label' => 'Ask for Availability'],
                    ['badge' => 'Payment', 'title' => '15% down payment', 'description' => 'Installments over five years.', 'cta_label' => 'Request Payment Plan'],
                    ['badge' => 'Delivery', 'title' => 'Delivery date', 'description' => '2029.', 'cta_label' => 'Ask for Terms'],
                    ['badge' => 'Costs', 'title' => 'Maintenance fee', 'description' => '10%.', 'cta_label' => 'Ask for Terms'],
                ],

                'payment_plan_rows' => [
                    ['label' => 'Standard Plan', 'down_percent' => '15%', 'duration_label' => '5 Years', 'discount_percent' => 'On request', 'best_for' => 'Buyers who want a straightforward five-year instalment schedule'],
                ],

                'buyer_journey_steps' => [
                    ['title' => 'Request Availability', 'description' => 'Receive the current prices, unit sizes, floors, views, and reservation status.'],
                    ['title' => 'Compare Layouts', 'description' => 'Review the project plans and compare the layouts that suit your needs.'],
                    ['title' => 'Review the Terms', 'description' => 'Understand the 15% down payment, five-year instalments, and 10% maintenance fee.'],
                    ['title' => 'Confirm the Unit', 'description' => 'Choose the unit, floor, view, price, and corresponding floor plan.'],
                    ['title' => 'Visit or Review Remotely', 'description' => 'Arrange a project visit or a guided remote presentation.'],
                    ['title' => 'Reserve', 'description' => 'Complete the reservation steps for the selected AMarina Soul unit.'],
                ],

                'project_faqs' => [
                    ['question' => 'Where is AMarina Soul located?', 'answer' => 'AMarina Soul is in Magawish, beside Jungle Compound.'],
                    ['question' => 'What is the AMarina Soul payment plan?', 'answer' => 'The supplied plan is 15% down payment with instalments over five years.'],
                    ['question' => 'What is the delivery date?', 'answer' => 'The AMarina Soul delivery date is 2029.'],
                    ['question' => 'What is the maintenance fee?', 'answer' => 'The maintenance fee is 10%.'],
                    ['question' => 'How can I receive current prices and availability?', 'answer' => 'Send Nexus Capital your preferred size, view, and budget to receive the latest available options.'],
                    ['question' => 'Which plans are shown on this page?', 'answer' => 'The page includes ground, pool-level, and typical-floor plans.'],
                ],
            ],
            [
                'slug'                  => 'aqua-orgwan-resort',
                'title'                 => 'AQUA ORGWAN Resort',
                'location'              => 'Northern Hurghada, Red Sea, Egypt',
                'district'              => 'Northern Hurghada',
                'currency'              => 'EUR',
                'starting_price'        => 34360,
                'starting_area'         => 30,
                'max_area'              => 137,
                'delivery_date'         => 'July 2028',
                'down_payment_percent'  => 35,
                'installment_years'     => 3,
                'cash_discount_percent' => 40,
                'maintenance_fee_percent' => null,
                'mins_from_airport'     => 20,
                'mins_from_downtown'    => 25,
                'mins_from_beach'       => 6,
                'is_active'             => true,
                'is_featured'           => true,

                'overview' => 'Where modern design, open living, and the Red Sea sun come together. Built on 7,050 sqm with four building blocks, 410 fully finished units, two central swimming pools, landscaped open spaces, and a peaceful location minutes from El Gouna.',

                'project_details' => 'AQUA ORGWAN Resort is a new Red Sea landmark designed around open living: ultra-modern design, airflow, and natural light across 410 fully finished units in 4 building blocks, 2 central swimming pools, and pool, street, and open views. The full collection is open now, so early buyers can choose layout, floor, and view while availability is still wide. Request current prices, updated unit positions, floor plans, and reservation steps before making a decision.',

                'location_description' => 'A peaceful setting minutes from key destinations: El Gouna 5–10 min by car, the beach 5–7 min walk, the international airport around 20 minutes by car, and downtown Hurghada around 25 minutes by car. Quiet residential-resort atmosphere with privacy and open views, easy access to El Gouna\'s restaurants, services, and nightlife, beach access within walking distance for daily Red Sea lifestyle, and suitable for permanent residency, smart investment, and holiday rentals.',

                'badges' => ['Sixth Landmark', 'Hurghada · Red Sea', 'Fully Finished'],

                'unit_types' => [
                    ['type' => 'Studio', 'size_range' => '30–51 sqm', 'price_from' => '€34,360', 'cash_price' => '€20,616', 'monthly' => '€744'],
                    ['type' => 'One Bedroom', 'size_range' => '45–70 sqm', 'price_from' => '€46,344', 'cash_price' => '€27,806', 'monthly' => '€1,004'],
                    ['type' => 'Two Bedroom', 'size_range' => '64–92 sqm', 'price_from' => '€58,250', 'cash_price' => '€34,950', 'monthly' => '€1,262'],
                    ['type' => 'Three Bedroom', 'size_range' => '88–137 sqm', 'price_from' => '€76,981', 'cash_price' => '€46,189', 'monthly' => '€1,668'],
                ],

                'payment_plan_rows' => [
                    ['label' => 'Cash Plan', 'down_percent' => '100%', 'duration_label' => 'One-time payment', 'discount_percent' => '40%', 'best_for' => 'Buyers who want the maximum cash discount'],
                    ['label' => 'Instalment Plan', 'down_percent' => '35%', 'duration_label' => '30 months, 0% interest', 'discount_percent' => '0%', 'best_for' => 'Buyers who want to spread the balance interest-free'],
                ],

                'investment_cards' => [
                    ['title' => 'Permanent Residency', 'description' => 'Fully finished homes with practical layouts and access to pools, open spaces, and nearby services.'],
                    ['title' => 'Smart Investment', 'description' => 'Early access, flexible payment terms, and a location that connects Hurghada with El Gouna.'],
                    ['title' => 'Holiday Rentals', 'description' => 'Suitable for furnished stays and tourist rental planning in a year-round Red Sea destination.'],
                ],

                'construction_progress' => ['concrete' => 85, 'brickwork' => 85, 'finishing' => 40],

                'travel_distances' => [
                    ['destination' => 'El Gouna', 'time' => '5–10 min by car'],
                    ['destination' => 'The Beach', 'time' => '5–7 min walk'],
                    ['destination' => 'International Airport', 'time' => '20 min by car'],
                    ['destination' => 'Downtown Hurghada', 'time' => '25 min by car'],
                ],

                'developer_track_record' => [
                    ['name' => 'Aqua Palms Resort', 'delivered_label' => 'Delivered Dec 2018'],
                    ['name' => 'Aqua Tropical Resort', 'delivered_label' => 'Delivered Dec 2021'],
                    ['name' => 'Aqua Blue Bay', 'delivered_label' => 'Delivered Dec 2023'],
                    ['name' => 'Aqua Infinity', 'delivered_label' => 'Delivered Dec 2024'],
                    ['name' => 'Aqua Almaza Suites', 'delivered_label' => 'Delivered Dec 2025'],
                ],

                'project_faqs' => [
                    ['question' => 'Where is AQUA ORGWAN Resort located?', 'answer' => 'AQUA ORGWAN Resort is located in a peaceful area in Hurghada, Red Sea, Egypt, with El Gouna around 5–10 minutes by car, the beach about 5–7 minutes on foot, the international airport around 20 minutes by car, and downtown around 25 minutes by car.'],
                    ['question' => 'How many units and blocks are planned?', 'answer' => 'The project kit presents AQUA ORGWAN as a 410-unit resort across four building blocks on a 7,050 sqm land area.'],
                    ['question' => 'What facilities are highlighted?', 'answer' => 'The resort highlights two central swimming pools, landscaped open spaces, open views, natural light, fully finished units, and a modern open architectural concept.'],
                    ['question' => 'What unit types are listed?', 'answer' => 'The listed residence mix includes studios from 30–51 sqm, one-bedroom apartments from 45–70 sqm, two-bedroom apartments from 64–92 sqm, and three-bedroom apartments from 88–137 sqm.'],
                    ['question' => 'What is the payment plan?', 'answer' => 'The kit lists a 40% cash discount for full payment, or a 35% down payment with the balance over 30 months interest-free. Confirm the latest official schedule before reservation.'],
                    ['question' => 'When is handover?', 'answer' => 'Handover is listed for July 2028. Construction progress in the supplied text shows concrete structure 85%, brickwork 85%, and finishing works 40% completed.'],
                    ['question' => 'Is it suitable for investment?', 'answer' => 'It is positioned for permanent residence, smart investment, and holiday rental use, supported by resort facilities, fully finished delivery, and access to Hurghada and El Gouna destinations.'],
                ],
            ],
            [
                'slug'                  => 'athena-resort',
                'title'                 => 'ATHENA Resort',
                'location'              => 'Al Ahyaa Road, next to Sunrise Hotels Group, Hurghada',
                'district'              => 'Al Ahyaa',
                'currency'              => 'EUR',
                'starting_price'        => 54000,
                'starting_area'         => 28,
                'delivery_date'         => 'June 2029',
                'down_payment_percent'  => 20,
                'installment_years'     => 3,
                'is_active'             => true,
                'is_featured'           => true,

                'overview' => 'Timeless Greek elegance on the Red Sea. ATHENA Resort introduces a new standard of luxury living in Hurghada with elegant classical design, resort-style amenities, landscaped open spaces, and strong long-term investment potential.',

                'project_details' => 'ATHENA Resort is a premium residential and holiday resort in Hurghada, inspired by classical Greek architecture and designed around holiday living, landscaped spaces, amenities, and investment value. The project covers 15,000 sqm, with only 20% building coverage and 80% landscaped green areas and open spaces, and is planned for 370 elegant Red Sea residences with June 2029 delivery and flexible 3 and 4 year plans.',

                'location_description' => 'ATHENA Resort is located in Al Ahyaa, Hurghada. The project is also presented as being on Al Ahyaa Road next to the Sunrise Hotels Group.',

                'badges' => ['Now Launching', 'From €54,000', 'Greek-Inspired Architecture', 'Green Contract Ownership'],

                'offer_deadline_label' => 'Early Bird pricing for the first 20 units only, valid before the official launch event',

                'residence_highlights' => [
                    ['badge' => 'Master plan', 'title' => '15,000 sqm master plan', 'description' => 'Only 20% building coverage.', 'cta_label' => 'Ask for Master Plan'],
                    ['badge' => 'Green space', 'title' => '80% green areas', 'description' => 'Landscaped gardens and open spaces.', 'cta_label' => 'Ask for Details'],
                    ['badge' => 'Scale', 'title' => '370 units', 'description' => 'Elegant Red Sea residences.', 'cta_label' => 'Request Availability'],
                    ['badge' => 'Delivery', 'title' => 'June 2029 delivery', 'description' => 'Flexible 3 and 4 year plans.', 'cta_label' => 'Ask for Payment Plans'],
                ],

                'unit_types' => [
                    ['type' => 'Studio', 'size_range' => 'From 28 sqm', 'price_from' => '€54,000', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => 'One Bedroom', 'size_range' => 'Up to 65 sqm', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => 'Two Bedroom', 'size_range' => 'Subject to live availability', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                ],

                'payment_plan_rows' => [
                    ['label' => 'Studio — 3 Year Plan', 'down_percent' => '30%', 'duration_label' => '3 years', 'discount_percent' => '—', 'best_for' => 'Holiday use, rentals, entry investment'],
                    ['label' => 'Studio — 4 Year Plan', 'down_percent' => '40%', 'duration_label' => '4 years', 'discount_percent' => '—', 'best_for' => 'Holiday use, rentals, entry investment'],
                    ['label' => 'One Bedroom — 3 Year Plan', 'down_percent' => '20%', 'duration_label' => '3 years', 'discount_percent' => '—', 'best_for' => 'Living, longer stays, rental flexibility'],
                    ['label' => 'One Bedroom — 4 Year Plan', 'down_percent' => '30%', 'duration_label' => '4 years', 'discount_percent' => '—', 'best_for' => 'Living, longer stays, rental flexibility'],
                    ['label' => 'Two Bedroom — 3 Year Plan', 'down_percent' => '20%', 'duration_label' => '3 years', 'discount_percent' => '—', 'best_for' => 'Families, larger stays, resale flexibility'],
                    ['label' => 'Two Bedroom — 4 Year Plan', 'down_percent' => '30%', 'duration_label' => '4 years', 'discount_percent' => '—', 'best_for' => 'Families, larger stays, resale flexibility'],
                ],

                'lifestyle_cards' => [
                    ['title' => '5 Large Swimming Pools', 'description' => 'Multiple pool zones create a true resort atmosphere for residents and holiday guests.'],
                    ['title' => 'Grand Roman Amphitheater', 'description' => 'A signature entertainment feature inspired by Mediterranean resort culture.'],
                    ['title' => 'Rooftop Spa', 'description' => 'A premium rooftop wellness experience with a calm, holiday-focused mood.'],
                    ['title' => 'Beachfront Cafés', 'description' => 'Social spaces for morning coffee, sunset views, and holiday-style dining.'],
                ],

                'buyer_journey_steps' => [
                    ['title' => 'Request Launch Availability', 'description' => 'Ask for the first 20 units, current prices, size options, floor positions, and views.'],
                    ['title' => 'Choose Your Unit Type', 'description' => 'Compare studios, one-bedroom apartments, and any larger apartment releases available at the time.'],
                    ['title' => 'Compare Payment Plans', 'description' => 'Review 20%, 30%, and 40% structures according to the unit category and selected term.'],
                    ['title' => 'Review Ownership Documents', 'description' => 'Request Green Contract details, reservation terms, fees, payment schedule, and delivery confirmation.'],
                    ['title' => 'Reserve During Pre-Launch', 'description' => 'Secure the preferred option with the 15% pre-launch down payment if the offer is still available.'],
                    ['title' => 'Plan Use or Rental', 'description' => 'Discuss furnishing, serviced rental planning, property management, handover, and resale strategy.'],
                ],

                'project_faqs' => [
                    ['question' => 'What is ATHENA Resort?', 'answer' => 'ATHENA Resort is a premium residential and holiday resort in Hurghada, inspired by classical Greek architecture and designed around holiday living, landscaped spaces, amenities, and investment value.'],
                    ['question' => 'Where is ATHENA Resort located?', 'answer' => 'ATHENA Resort is located in Al Ahyaa, Hurghada. The project is also presented as being on Al Ahyaa Road next to the Sunrise Hotels Group.'],
                    ['question' => 'What is the starting price?', 'answer' => 'Selected Early Bird units are presented from €54,000, subject to live availability, unit size, floor, view, payment plan, and official price-list confirmation before reservation.'],
                    ['question' => 'What is the land area and building coverage?', 'answer' => 'The project covers 15,000 sqm, with only 20% building coverage and 80% landscaped green areas and open spaces.'],
                    ['question' => 'What unit types and sizes are available?', 'answer' => 'The residence mix focuses on efficient layouts for Red Sea holidays, personal use, and rental-focused investment. Exact sizes, floors, views, and larger apartment releases should be confirmed from the live availability list.'],
                    ['question' => 'What amenities are included?', 'answer' => 'Planned amenities include five large swimming pools, a heated pool, jacuzzi, rooftop spa, gym, beachfront cafés, a grand Roman amphitheater, landscaped gardens, hotel-managed serviced apartments, 24/7 security and CCTV, property management, and high-end finishes.'],
                    ['question' => 'What are the payment plans?', 'answer' => 'General options include 20% down payment over 3 years or 30% down payment over 4 years. Studio plans are listed as 30% down over 3 years or 40% down over 4 years. One-bedroom and two-bedroom categories are listed as 20% down over 3 years or 30% down over 4 years.'],
                    ['question' => 'What is the exclusive launch offer?', 'answer' => 'The Early Bird offer includes special launch prices for the first 20 units only, with the ability to reserve using 15% down payment during the pre-launch period.'],
                    ['question' => 'When is delivery expected?', 'answer' => 'Delivery is expected in June 2029. Confirm the exact contractual handover date for the selected unit before reservation.'],
                ],
            ],
            [
                'slug'                  => 'atlantis-resort',
                'title'                 => 'Atlantis Resort Red Sea Apartments',
                'location'              => 'Downtown Hurghada, Egypt',
                'district'              => 'Downtown Hurghada',
                'currency'              => 'EUR',
                'starting_price'        => 46516,
                'delivery_date'         => 'Phase 1 in 2027 · Phase 2 in 2028',
                'down_payment_percent'  => 20,
                'installment_years'     => 5,
                'is_active'             => true,
                'is_featured'           => false,

                'overview' => 'Downtown Hurghada project with castle-inspired design, 60% landscaped areas, open spaces and quick access to airport, Mamsha and Sheraton Street.',

                'project_details' => 'Atlantis Resort is a downtown Hurghada project offering studios, 1-bedroom, 2-bedroom, and 3-bedroom apartments depending on availability. Exact stock, size, view, floor, price, and payment plan terms must be confirmed before reservation. Final availability, prices, payment schedule, discounts, maintenance fees, and delivery details must be confirmed with Nexus Capital before reservation.',

                'location_description' => 'Downtown Hurghada lifestyle positioning with quick access to Hurghada airport, Mamsha, and Sheraton Street. Controlled access and project services should be confirmed for the selected unit.',

                'badges' => ['Developer Units', 'Hurghada', 'Investment'],

                'unit_types' => [
                    ['type' => 'Studio', 'size_range' => 'Compact layout', 'price_from' => 'From €46,516', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '1-Bedroom', 'size_range' => 'Comfort layout', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '2-Bedroom', 'size_range' => 'Family layout', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '3-Bedroom', 'size_range' => 'Large layout', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                ],

                'payment_plan_rows' => [
                    ['label' => 'Standard Plan', 'down_percent' => '20%', 'duration_label' => 'Up to 5 years', 'discount_percent' => 'Ask advisor', 'best_for' => 'Buyers who want a standard instalment plan'],
                ],

                'lifestyle_cards' => [
                    ['title' => 'Castle-Inspired Design', 'description' => 'A distinctive architectural concept for stronger project identity.'],
                    ['title' => '60% Landscaped Areas', 'description' => 'Open green areas improve resort atmosphere and owner experience.'],
                    ['title' => 'Swimming Pool', 'description' => 'Resort-style pool areas for residents and guests.'],
                    ['title' => 'Downtown Access', 'description' => 'Quick access to Hurghada airport, Mamsha, and Sheraton Street.'],
                ],

                'project_faqs' => [
                    ['question' => 'Where is Atlantis Resort located?', 'answer' => 'Atlantis Resort is located in Downtown Hurghada.'],
                    ['question' => 'What unit types are available?', 'answer' => 'The current unit mix is studios, 1-bedroom, 2-bedroom, and 3-bedroom apartments depending on availability. Exact availability changes, so request the latest floor plans and price list.'],
                    ['question' => 'What is the starting price?', 'answer' => 'The listed starting price is €46,516. Ask the advisor for exact prices by unit, floor, view, and payment plan.'],
                    ['question' => 'What is the payment plan?', 'answer' => 'The listed payment headline is 20% down, instalments up to 5 years. Confirm the full schedule, discount, maintenance fee, and contract wording before reserving.'],
                    ['question' => 'When is delivery expected?', 'answer' => 'The current delivery/status note is Phase 1 in 2027, Phase 2 in 2028. Always confirm the timeline in writing for the exact unit.'],
                    ['question' => 'Can I request floor plans and a remote viewing?', 'answer' => 'Yes. Use the WhatsApp request form to ask for floor plans, available units, current prices, and remote or in-person viewing options.'],
                ],
            ],
            [
                'slug'                  => 'aurora-palace',
                'title'                 => 'Aurora Palace Red Sea Apartments',
                'location'              => 'Magawish, Hurghada, Egypt',
                'district'              => 'Magawish',
                'currency'              => 'EUR',
                'starting_price'        => 38430,
                'starting_area'         => 53,
                'max_area'              => 217,
                'is_active'             => true,
                'is_featured'           => false,

                'overview' => 'A cinematic full-width project page for Aurora Palace opposite Mercure Hotel, featuring adult pools, children\'s pools, heated pool, spa, gym, restaurant, café, pool bar, and Red Sea lifestyle positioning.',

                'project_details' => 'Aurora Palace is a Magawish project with 133 premium units across a 6,000 sqm project scale, studios to 3-bedroom apartments in a 53–217 sqm size range. Final availability, prices, payment schedule, discounts, maintenance fees, and delivery details must be confirmed with Nexus Capital before reservation.',

                'location_description' => 'Aurora Palace is located in Magawish, Hurghada, opposite Mercure Hotel.',

                'badges' => ['Developer Units', 'Magawish', 'Investment'],

                'unit_types' => [
                    ['type' => 'Studio', 'size_range' => '53–86 sqm', 'price_from' => 'From €38,430', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '1-Bedroom', 'size_range' => '65–120 sqm', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '2-Bedroom', 'size_range' => '94–136 sqm', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '3-Bedroom', 'size_range' => '188–217 sqm', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                ],

                'payment_plan_rows' => [
                    ['label' => 'Standard Plan', 'down_percent' => 'Ask advisor', 'duration_label' => 'Ask advisor', 'discount_percent' => 'Ask advisor', 'best_for' => 'Buyers who want the live payment schedule confirmed before reservation'],
                ],

                'project_faqs' => [
                    ['question' => 'Where is Aurora Palace located?', 'answer' => 'Aurora Palace is located in Magawish, Hurghada, opposite Mercure Hotel.'],
                    ['question' => 'What unit types are available?', 'answer' => 'The listed mix includes studios from 53–86 sqm, 1-bedroom apartments from 65–120 sqm, 2-bedroom apartments from 94–136 sqm, and 3-bedroom apartments from 188–217 sqm.'],
                    ['question' => 'What is the starting price?', 'answer' => 'The listed starting price is €38,430. Ask for exact unit pricing, floor, view, payment plan, and availability before reserving.'],
                    ['question' => 'Can buyers request a remote viewing?', 'answer' => 'Yes. Use the WhatsApp form to request current availability, floor plans, prices, payment plan details, delivery information, and reservation steps.'],
                ],
            ],
            [
                'slug'                  => 'balkan-beach-resort',
                'title'                 => 'Balkan Beach Resort',
                'location'              => 'Al Ahyaa, Hurghada, Egypt',
                'district'              => 'Al Ahyaa',
                'currency'              => 'EUR',
                'starting_price'        => 56000,
                'is_active'             => true,
                'is_featured'           => false,

                'overview' => 'Al Ahyaa residential resort with private beach access, pool, café, restaurant, security, parking, garden, gym, spa and maintenance services.',

                'project_details' => "Balkan Beach Resort is a Red Sea property project in Al Ahyaa, Hurghada. Al Ahyaa residential resort with private beach access, pool, café, restaurant, security, parking, garden, gym, spa and maintenance services. The current unit mix is studios, 1-bedroom, and 2-bedroom apartments. Final prices, available units, payment schedules, discounts, maintenance fees, and delivery terms must be confirmed with Nexus Capital.",

                'location_description' => 'Al Ahyaa, Hurghada gives buyers access to the wider Red Sea lifestyle, daily services, beach areas, restaurants, hotels, and travel routes. Exact travel times and nearby landmarks should be confirmed with the advisor for the selected unit.',

                'badges' => ['Developer Units', 'Al Ahyaa', 'Investment'],

                'unit_types' => [
                    ['type' => 'Studio', 'size_range' => 'Ask advisor', 'price_from' => 'From €56,000', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '1-Bedroom', 'size_range' => 'Ask advisor', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '2-Bedroom', 'size_range' => 'Ask advisor', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                ],

                'payment_plan_rows' => [
                    ['label' => 'Standard Plan', 'down_percent' => '10%', 'duration_label' => 'Ask for current payment schedule', 'discount_percent' => 'Ask advisor', 'best_for' => 'Buyers who want the live payment schedule confirmed before reservation'],
                ],

                'investment_cards' => [
                    ['title' => 'Holiday buyers', 'description' => 'Red Sea use.'],
                    ['title' => 'Investors', 'description' => 'Rental potential.'],
                    ['title' => 'Families', 'description' => 'Comfort layouts.'],
                    ['title' => 'Remote buyers', 'description' => 'Video tour available.'],
                ],

                'project_faqs' => [
                    ['question' => 'Where is Balkan Beach Resort located?', 'answer' => 'Balkan Beach Resort is located in Al Ahyaa, Hurghada.'],
                    ['question' => 'What unit types are available?', 'answer' => 'The current unit mix is studios, 1-bedroom, and 2-bedroom apartments. Exact availability changes, so request the latest floor plans and price list.'],
                    ['question' => 'What is the starting price?', 'answer' => 'The listed starting price is €56,000. Ask the advisor for exact prices by unit, floor, view, and payment plan.'],
                    ['question' => 'What is the payment plan?', 'answer' => 'The listed payment headline is ask for current payment schedule. Confirm the full schedule, discount, maintenance fee, and contract wording before reserving.'],
                    ['question' => 'When is delivery expected?', 'answer' => 'The current delivery/status note is ask advisor. Always confirm the timeline in writing for the exact unit.'],
                    ['question' => 'Can I request floor plans and a video viewing?', 'answer' => 'Yes. Use the WhatsApp request form to ask for floor plans, available units, current prices, and remote or in-person viewing options.'],
                ],
            ],
            [
                'slug'                  => 'blanca-gardens-soma-bay',
                'title'                 => 'Blanca Gardens, Soma Bay',
                'location'              => 'Soma Bay, Egypt',
                'district'              => 'Soma Bay',
                'currency'              => 'EUR',
                'starting_price'        => 142476,
                'is_active'             => true,
                'is_featured'           => false,

                'overview' => 'Peaceful Somabay community near White Beach with sea breezes, open views, marina lifestyle, jetty, dining and resort amenities.',

                'project_details' => 'Blanca Gardens, Soma Bay is a Somabay coastal homes project. The current unit mix is apartments, chalets, and selected premium homes. Exact availability changes, so request the latest floor plans and price list. Final prices, payment schedule, discounts, maintenance fees, and delivery terms must be confirmed with Nexus Capital before reservation.',

                'badges' => ['Developer Units', 'Soma Bay', 'Investment'],

                'unit_types' => [
                    ['type' => 'Apartment', 'size_range' => 'Ask advisor', 'price_from' => 'From €142,476', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => 'Chalet', 'size_range' => 'Ask advisor', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => 'Premium home', 'size_range' => 'Ask advisor', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                ],

                'payment_plan_rows' => [
                    ['label' => 'Standard Plan', 'down_percent' => 'Ask advisor', 'duration_label' => 'Ask for developer payment schedule', 'discount_percent' => 'Ask advisor', 'best_for' => 'Buyers who want the live payment schedule confirmed before reservation'],
                ],

                'buyer_journey_steps' => [
                    ['title' => 'Request Availability', 'description' => 'Ask for current units, prices, views, floors, floor plans, and payment options.'],
                    ['title' => 'Compare Units', 'description' => 'Review unit types based on budget, location, view, delivery, and buying goal.'],
                    ['title' => 'View Remotely or On Site', 'description' => 'Arrange a private viewing, online consultation, or video walkthrough with an advisor.'],
                    ['title' => 'Reserve with Support', 'description' => 'Coordinate documents, reservation steps, payment milestones, and handover planning.'],
                ],

                'project_faqs' => [
                    ['question' => 'Where is Blanca Gardens, Soma Bay located?', 'answer' => 'Blanca Gardens, Soma Bay is located in Soma Bay.'],
                    ['question' => 'What unit types are available?', 'answer' => 'The current unit mix is apartments, chalets, and selected premium homes. Exact availability changes, so request the latest floor plans and price list.'],
                    ['question' => 'What is the starting price?', 'answer' => 'The listed starting price is €142,476. Ask the advisor for exact prices by unit, floor, view, and payment plan.'],
                    ['question' => 'What is the payment plan?', 'answer' => 'The listed payment headline is ask for developer payment schedule. Confirm the full schedule, discount, maintenance fee, and contract wording before reserving.'],
                    ['question' => 'When is delivery expected?', 'answer' => 'The current delivery/status note is ask advisor. Always confirm the timeline in writing for the exact unit.'],
                    ['question' => 'Can I request floor plans and a video viewing?', 'answer' => 'Yes. Use the WhatsApp request form to ask for floor plans, available units, current prices, and remote or in-person viewing options.'],
                ],
            ],
            [
                'slug'                  => 'cala-sahl-hasheesh',
                'title'                 => 'Cala Sahl Hasheesh',
                'location'              => 'Sahl Hasheesh, Egypt',
                'district'              => 'Sahl Hasheesh',
                'currency'              => 'EUR',
                'starting_price'        => 93333,
                'starting_area'         => 55,
                'max_area'              => 150,
                'delivery_date'         => '2027',
                'installment_years'     => 7,
                'cash_discount_percent' => 30,
                'maintenance_fee_percent' => 10,
                'is_active'             => true,
                'is_featured'           => false,

                'overview' => 'Large Sahl Hasheesh coastal community with Red Sea or garden views, resort privacy and long payment-plan options.',

                'project_details' => 'Cala Sahl Hasheesh is a Sahl Hasheesh homes project with 780 homes across studios to 3-bedroom apartments and penthouses, sizes 55–150 sqm. Payment plans run from 5 to 7 years, with a 30% cash discount subject to terms and 10% maintenance subject to contract terms. Final availability, prices, payment schedule, discounts, maintenance fees, and delivery details must be confirmed with Nexus Capital before reservation.',

                'badges' => ['Developer Units', 'Sahl Hasheesh', 'Investment'],

                'unit_types' => [
                    ['type' => 'Studio to 3-Bedroom', 'size_range' => '55–150 sqm', 'price_from' => 'From €93,333', 'cash_price' => '30% discount subject to terms', 'monthly' => 'On request'],
                    ['type' => 'Penthouse', 'size_range' => 'Ask advisor', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                ],

                'payment_plan_rows' => [
                    ['label' => 'Standard Plan', 'down_percent' => '20%', 'duration_label' => '5 to 7 years', 'discount_percent' => '30% cash discount subject to terms', 'best_for' => 'Buyers who want flexible instalment terms up to 7 years'],
                ],

                'project_faqs' => [
                    ['question' => 'Where is Cala Sahl Hasheesh located?', 'answer' => 'Cala Sahl Hasheesh is located in Sahl Hasheesh.'],
                    ['question' => 'What unit types are available?', 'answer' => 'The current unit mix is studios, 1–3 bedroom apartments, and penthouses, sizes 55–150 sqm. Exact availability changes, so request the latest floor plans and price list.'],
                    ['question' => 'What is the starting price?', 'answer' => 'The listed starting price is €93,333. Ask the advisor for exact prices by unit, floor, view, and payment plan.'],
                    ['question' => 'What is the payment plan?', 'answer' => 'The listed payment headline is payment plans from 5 to 7 years. Confirm the full schedule, discount, maintenance fee, and contract wording before reserving.'],
                    ['question' => 'When is delivery expected?', 'answer' => 'The current delivery/status note is 2027. Always confirm the timeline in writing for the exact unit.'],
                    ['question' => 'Can I request floor plans and a remote viewing?', 'answer' => 'Yes. Use the WhatsApp request form to ask for floor plans, available units, current prices, and remote or in-person viewing options.'],
                ],
            ],
            [
                'slug'                  => 'clan-residents-red-sea',
                'title'                 => 'Clan Residents Red Sea',
                'location'              => 'Magawish, Hurghada, Egypt',
                'district'              => 'Magawish',
                'currency'              => 'EUR',
                'starting_price'        => 45122,
                'starting_area'         => 43,
                'max_area'              => 150,
                'delivery_date'         => 'Handover in 2.5 years',
                'down_payment_percent'  => 20,
                'installment_years'     => 5,
                'is_active'             => true,
                'is_featured'           => false,

                'overview' => 'Magawish project beside Pickalbatros Hotels area with 4 temperature-controlled pools, jacuzzis, gym, spa, restaurants, retail and smart gate.',

                'project_details' => 'Clan Residents Red Sea is a Magawish project with 100 m frontage and 360 apartments across studios to 3-bedroom apartments, sizes 43–150 sqm. The payment plan is 20% down, remaining 80% over 5 years, with handover in 2.5 years. Final availability, prices, payment schedule, discounts, maintenance fees, and delivery details must be confirmed with Nexus Capital before reservation.',

                'badges' => ['Developer Units', 'Magawish', 'Investment'],

                'unit_types' => [
                    ['type' => 'Studio to 3-Bedroom', 'size_range' => '43–150 sqm', 'price_from' => 'From €45,122', 'cash_price' => 'On request', 'monthly' => 'On request'],
                ],

                'payment_plan_rows' => [
                    ['label' => 'Standard Plan', 'down_percent' => '20%', 'duration_label' => '5 years', 'discount_percent' => 'On request', 'best_for' => 'Buyers who want a 20% down, 5-year balance schedule'],
                ],

                'buyer_journey_steps' => [
                    ['title' => 'Request Availability', 'description' => 'Ask for current units, prices, views, floors, floor plans, and payment options.'],
                    ['title' => 'Compare Units', 'description' => 'Review unit types based on budget, location, view, delivery, and buying goal.'],
                    ['title' => 'View Remotely or On Site', 'description' => 'Arrange a private viewing, online consultation, or video walkthrough with an advisor.'],
                    ['title' => 'Reserve with Support', 'description' => 'Coordinate documents, reservation steps, payment milestones, and handover planning.'],
                ],

                'project_faqs' => [
                    ['question' => 'Where is Clan Residents Red Sea located?', 'answer' => 'Clan Residents Red Sea is located in Magawish, Hurghada.'],
                    ['question' => 'What unit types are available?', 'answer' => 'The current unit mix is studios to 3-bedroom apartments, sizes 43–150 sqm. Exact availability changes, so request the latest floor plans and price list.'],
                    ['question' => 'What is the starting price?', 'answer' => 'The listed starting price is €45,122. Ask the advisor for exact prices by unit, floor, view, and payment plan.'],
                    ['question' => 'What is the payment plan?', 'answer' => 'The listed payment headline is 20% down, remaining 80% over 5 years. Confirm the full schedule, discount, maintenance fee, and contract wording before reserving.'],
                    ['question' => 'When is delivery expected?', 'answer' => 'The current delivery/status note is handover in 2.5 years. Always confirm the timeline in writing for the exact unit.'],
                    ['question' => 'Can I request floor plans and a video viewing?', 'answer' => 'Yes. Use the WhatsApp request form to ask for floor plans, available units, current prices, and remote or in-person viewing options.'],
                ],
            ],
            [
                'slug'                  => 'edge-view',
                'title'                 => 'Edge View Red Sea Apartments',
                'location'              => 'Old Sheraton, Hurghada, Egypt',
                'district'              => 'Old Sheraton',
                'currency'              => 'EUR',
                'starting_price'        => 134590,
                'delivery_date'         => '2027',
                'down_payment_percent'  => 10,
                'is_active'             => true,
                'is_featured'           => false,

                'overview' => 'Old Sheraton project with 10 pools, private beach access, restaurant, café, football pitch, tennis courts, secure parking and on-site hotel.',

                'project_details' => 'Edge View Red Sea Apartments is a central coastal project in Old Sheraton, Hurghada, with studios, 1-bedroom and 2-bedroom apartments. The payment plan is 10% down, instalments up to 72 months, with delivery in 2027. Final availability, prices, payment schedule, discounts, maintenance fees, and delivery details must be confirmed with Nexus Capital before reservation.',

                'badges' => ['Developer Units', 'Hurghada', 'Investment'],

                'unit_types' => [
                    ['type' => 'Studio', 'size_range' => 'Ask advisor', 'price_from' => 'From €134,590', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '1-Bedroom', 'size_range' => 'Ask advisor', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '2-Bedroom', 'size_range' => 'Ask advisor', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                ],

                'payment_plan_rows' => [
                    ['label' => 'Standard Plan', 'down_percent' => '10%', 'duration_label' => 'Up to 72 months', 'discount_percent' => 'On request', 'best_for' => 'Buyers who want a low down payment with a long instalment term'],
                ],

                'buyer_journey_steps' => [
                    ['title' => 'Request Availability', 'description' => 'Ask for current units, prices, views, floors, floor plans, and payment options.'],
                    ['title' => 'Compare Units', 'description' => 'Review unit types based on budget, location, view, delivery, and buying goal.'],
                    ['title' => 'View Remotely or On Site', 'description' => 'Arrange a private viewing, online consultation, or video walkthrough with an advisor.'],
                    ['title' => 'Reserve with Support', 'description' => 'Coordinate documents, reservation steps, payment milestones, and handover planning.'],
                ],

                'project_faqs' => [
                    ['question' => 'Where is Edge View located?', 'answer' => 'Edge View is located in Old Sheraton, Hurghada.'],
                    ['question' => 'What unit types are available?', 'answer' => 'The current unit mix is studios, 1-bedroom, and 2-bedroom apartments. Exact availability changes, so request the latest floor plans and price list.'],
                    ['question' => 'What is the starting price?', 'answer' => 'The listed starting price is €134,590. Ask the advisor for exact prices by unit, floor, view, and payment plan.'],
                    ['question' => 'What is the payment plan?', 'answer' => 'The listed payment headline is 10% down, instalments up to 72 months. Confirm the full schedule, discount, maintenance fee, and contract wording before reserving.'],
                    ['question' => 'When is delivery expected?', 'answer' => 'The current delivery/status note is 2027. Always confirm the timeline in writing for the exact unit.'],
                    ['question' => 'Can I request floor plans and a video viewing?', 'answer' => 'Yes. Use the WhatsApp request form to ask for floor plans, available units, current prices, and remote or in-person viewing options.'],
                ],
            ],
            [
                'slug'                  => 'florenza-khamsin',
                'title'                 => 'Florenza Khamsin Red Sea Apartments',
                'location'              => 'Arabia District, Hurghada, Egypt',
                'district'              => 'Arabia District',
                'currency'              => 'EUR',
                'starting_price'        => 33269,
                'delivery_date'         => 'Ready to move',
                'down_payment_percent'  => 20,
                'installment_years'     => 5,
                'is_active'             => true,
                'is_featured'           => false,

                'overview' => 'Central Arabia District resort community with three lagoon-style pools, private beach subscription, poolside restaurant, swim-up bar, retail boulevard and management.',

                'project_details' => 'Florenza Khamsin Red Sea Apartments is a 1,300 turnkey-home community in Arabia District, Hurghada, with studios, 1-bedroom, and 2-bedroom apartments. The project is ready to move; confirm the exact unit status with the advisor. Final availability, prices, payment schedule, discounts, maintenance fees, and delivery details must be confirmed with Nexus Capital before reservation.',

                'badges' => ['Ready to Move', 'Hurghada', 'Investment'],

                'unit_types' => [
                    ['type' => 'Studio', 'size_range' => 'Ask advisor', 'price_from' => 'From €33,269', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '1-Bedroom', 'size_range' => 'Ask advisor', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '2-Bedroom', 'size_range' => 'Ask advisor', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                ],

                'payment_plan_rows' => [
                    ['label' => 'Standard Plan', 'down_percent' => '20%', 'duration_label' => 'Ask for current payment schedule', 'discount_percent' => 'Ask advisor', 'best_for' => 'Buyers who want ready-to-move stock with a live payment schedule'],
                ],

                'project_faqs' => [
                    ['question' => 'Where is Florenza Khamsin located?', 'answer' => 'Florenza Khamsin is located in Arabia District, Hurghada.'],
                    ['question' => 'What unit types are available?', 'answer' => 'The current unit mix is studios, 1-bedroom, and 2-bedroom apartments. Exact availability changes, so request the latest floor plans and price list.'],
                    ['question' => 'What is the starting price?', 'answer' => 'The listed starting price is €33,269. Ask the advisor for exact prices by unit, floor, view, and payment plan.'],
                    ['question' => 'What is the payment plan?', 'answer' => 'The listed payment headline is ask for current payment schedule. Confirm the full schedule, discount, maintenance fee, and contract wording before reserving.'],
                    ['question' => 'When is delivery expected?', 'answer' => 'The current delivery/status note is ready to move / ask advisor. Always confirm the timeline in writing for the exact unit.'],
                    ['question' => 'Can I request floor plans and a remote viewing?', 'answer' => 'Yes. Use the WhatsApp request form to ask for floor plans, available units, current prices, and remote or in-person viewing options.'],
                ],
            ],
            [
                'slug'                  => 'hayat-beach-resort',
                'title'                 => 'Hayat Beach Resort Beachfront Apartments',
                'location'              => 'Al Ahyaa, Hurghada, Red Sea',
                'district'              => 'Al Ahyaa',
                'currency'              => 'EUR',
                'starting_price'        => 43167,
                'starting_area'         => 37,
                'delivery_date'         => 'December 2028',
                'down_payment_percent'  => 15,
                'installment_years'     => 5,
                'cash_discount_percent' => 20,
                'maintenance_fee_percent' => 10,
                'is_active'             => true,
                'is_featured'           => true,

                'overview' => 'A beachfront resort community in Al Ahyaa with private sandy beach access, seven swimming pools, aqua park, lifestyle facilities, and flexible 5-year payment terms.',

                'project_details' => 'Hayat Beach Resort Beachfront Apartments is a 580-unit residential community in Al Ahyaa with studios from 37 sqm, 1-bedroom from 58 sqm, and 2-bedroom apartments 76–78 sqm. The payment plan is 15% down, instalments over 5 years, with a 20% cash discount and 10% maintenance fee on delivery, and December 2028 delivery. Final availability, prices, payment schedule, discounts, maintenance fees, and delivery details must be confirmed with Nexus Capital before reservation.',

                'badges' => ['Developer Units', 'Al Ahyaa', 'Investment'],

                'unit_types' => [
                    ['type' => 'Studio', 'size_range' => 'From 37 sqm', 'price_from' => 'From €43,167', 'cash_price' => '20% discount', 'monthly' => 'On request'],
                    ['type' => '1-Bedroom', 'size_range' => 'From 58 sqm', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '2-Bedroom', 'size_range' => '76–78 sqm', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                ],

                'payment_plan_rows' => [
                    ['label' => 'Standard Plan', 'down_percent' => '15%', 'duration_label' => '5 years', 'discount_percent' => '20% cash discount', 'best_for' => 'Buyers who want a low down payment with a five-year schedule'],
                ],

                'project_faqs' => [
                    ['question' => 'Where is Hayat Beach Resort located?', 'answer' => 'Hayat Beach Resort is located in Al Ahyaa, Hurghada.'],
                    ['question' => 'What unit types are available?', 'answer' => 'The current unit mix is studios from 37 sqm, 1-bedroom from 58 sqm, and 2-bedroom 76–78 sqm. Exact availability changes, so request the latest floor plans and price list.'],
                    ['question' => 'What is the starting price?', 'answer' => 'The listed starting price is €43,167. Ask the advisor for exact prices by unit, floor, view, and payment plan.'],
                    ['question' => 'What is the payment plan?', 'answer' => 'The listed payment headline is 15% down, instalments over 5 years. Confirm the full schedule, discount, maintenance fee, and contract wording before reserving.'],
                    ['question' => 'When is delivery expected?', 'answer' => 'The current delivery/status note is December 2028. Always confirm the timeline in writing for the exact unit.'],
                    ['question' => 'Can I request floor plans and a remote viewing?', 'answer' => 'Yes. Use the WhatsApp request form to ask for floor plans, available units, current prices, and remote or in-person viewing options.'],
                ],
            ],
            [
                'slug'                  => 'hurghada-heights',
                'title'                 => 'Hurghada Heights Red Sea Apartments',
                'location'              => 'Hurghada Promenade, Hurghada, Egypt',
                'district'              => 'Hurghada Promenade',
                'currency'              => 'EUR',
                'starting_price'        => 37818,
                'delivery_date'         => 'Phase 1 in 2027 · Phase 2 in 2028',
                'down_payment_percent'  => 20,
                'is_active'             => true,
                'is_featured'           => false,

                'overview' => 'Central promenade project with 350 homes, 5 pools including heated and rooftop pools, reception, security, cafés and retail.',

                'project_details' => 'Hurghada Heights Red Sea Apartments is a Hurghada Promenade project with studios, 1-bedroom, and 2-bedroom apartments. The payment headline is apartments 20% down over 34 months or 30% over 44 months; studios 30% down over 34 months or 40% over 40 months. Final availability, prices, payment schedule, discounts, maintenance fees, and delivery details must be confirmed with Nexus Capital before reservation.',

                'badges' => ['Developer Units', 'Hurghada', 'Investment'],

                'unit_types' => [
                    ['type' => 'Studio', 'size_range' => 'Ask advisor', 'price_from' => 'From €37,818', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '1-Bedroom', 'size_range' => 'Ask advisor', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '2-Bedroom', 'size_range' => 'Ask advisor', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                ],

                'payment_plan_rows' => [
                    ['label' => 'Apartments — Plan 1', 'down_percent' => '20%', 'duration_label' => '34 months', 'discount_percent' => 'Ask advisor', 'best_for' => 'Apartment buyers wanting a shorter schedule'],
                    ['label' => 'Apartments — Plan 2', 'down_percent' => '30%', 'duration_label' => '44 months', 'discount_percent' => 'Ask advisor', 'best_for' => 'Apartment buyers wanting a longer schedule'],
                    ['label' => 'Studios — Plan 1', 'down_percent' => '30%', 'duration_label' => '34 months', 'discount_percent' => 'Ask advisor', 'best_for' => 'Studio buyers wanting a shorter schedule'],
                    ['label' => 'Studios — Plan 2', 'down_percent' => '40%', 'duration_label' => '40 months', 'discount_percent' => 'Ask advisor', 'best_for' => 'Studio buyers wanting a longer schedule'],
                ],

                'project_faqs' => [
                    ['question' => 'Where is Hurghada Heights located?', 'answer' => 'Hurghada Heights is located in Hurghada Promenade, Hurghada.'],
                    ['question' => 'What unit types are available?', 'answer' => 'The current unit mix is studios, 1-bedroom, and 2-bedroom apartments. Exact availability changes, so request the latest floor plans and price list.'],
                    ['question' => 'What is the starting price?', 'answer' => 'The listed starting price is €37,818. Ask the advisor for exact prices by unit, floor, view, and payment plan.'],
                    ['question' => 'What is the payment plan?', 'answer' => 'The listed payment headline is apartments 20%/34 months or 30%/44 months; studios 30%/34 months or 40%/40 months. Confirm the full schedule, discount, maintenance fee, and contract wording before reserving.'],
                    ['question' => 'When is delivery expected?', 'answer' => 'The current delivery/status note is Phase 1 in 2027, Phase 2 in 2028. Always confirm the timeline in writing for the exact unit.'],
                    ['question' => 'Can I request floor plans and a remote viewing?', 'answer' => 'Yes. Use the WhatsApp request form to ask for floor plans, available units, current prices, and remote or in-person viewing options.'],
                ],
            ],
            [
                'slug'                  => 'ibiza-bay',
                'title'                 => 'IBIZA BAY',
                'location'              => 'Al Ahyaa, Hurghada, Red Sea',
                'district'              => 'Al Ahyaa',
                'currency'              => 'EUR',
                'starting_price'        => 40350,
                'delivery_date'         => '2028',
                'down_payment_percent'  => 15,
                'installment_years'     => 4,
                'cash_discount_percent' => 25,
                'is_active'             => true,
                'is_featured'           => true,

                'overview' => "Exclusive coastal living in Al Ahyaa. IBIZA BAY is designed for buyers who want elegance, comfort, modern Smart Look architecture, Red Sea lifestyle value, and a strong investment opportunity in one of Hurghada's fastest-growing areas.",

                'project_details' => 'IBIZA BAY is a luxury coastal residential project in Al Ahyaa, Hurghada, designed around modern Smart Look architecture, premium finishes, Red Sea lifestyle appeal, and investment value. Choose the payment structure that fits your budget: 15% down over 4 years, 30% down over 3 years, 50% down over 2.5 years, or cash payment with the highest discount.',

                'badges' => ['Exclusive Investment Opportunity', 'Starting From EUR 40,350', 'Luxury Coastal Living', 'Delivery 2028'],

                'offer_discount_percent' => 2,
                'offer_deadline_label' => '2% discount until the end of this month, subject to availability and confirmation before reservation',

                'residence_highlights' => [
                    ['badge' => 'From EUR 40,350', 'title' => 'Starting-Price Opportunities', 'description' => "Secure a modern coastal residence in Al Ahyaa at today's prices before future value increases.", 'cta_label' => 'Ask for Availability'],
                    ['badge' => 'Smart Look', 'title' => 'Luxury Coastal Living', 'description' => 'Contemporary design, sophisticated architecture, premium finishes, and a vibrant Red Sea setting.', 'cta_label' => 'Request Floor Plans'],
                    ['badge' => 'Sea Lifestyle', 'title' => 'Sea-View Investment Appeal', 'description' => 'Selected sea-view opportunities offer strong lifestyle value, attractive rental potential, and future resale appeal.', 'cta_label' => 'Ask for Sea Views'],
                ],

                'lifestyle_cards' => [
                    ['title' => 'Breathtaking Sea Views', 'description' => 'Start the morning with open Red Sea scenery and a calm coastal atmosphere.'],
                    ['title' => 'Modern Amenities', 'description' => 'Designed for easy holiday use, relaxed living, and resort-style convenience.'],
                    ['title' => 'Fresh Sea Breeze', 'description' => 'Enjoy open sky, coastal air, and the peaceful rhythm of Al Ahyaa.'],
                    ['title' => 'Smart Look Concept', 'description' => 'Sophisticated architecture and contemporary finishing create a modern coastal identity.'],
                ],

                'payment_plan_rows' => [
                    ['label' => 'Flexible Plan', 'down_percent' => '15%', 'duration_label' => '4 years', 'discount_percent' => '2%', 'best_for' => 'Lowest entry payment and long instalment schedule'],
                    ['label' => 'Balanced Plan', 'down_percent' => '30%', 'duration_label' => '3 years', 'discount_percent' => '5%', 'best_for' => 'Higher discount and shorter repayment period'],
                    ['label' => 'Accelerated Plan', 'down_percent' => '50%', 'duration_label' => '2.5 years', 'discount_percent' => '10%', 'best_for' => 'Strong discount with faster ownership progress'],
                    ['label' => 'Cash Plan', 'down_percent' => '100%', 'duration_label' => 'Cash payment', 'discount_percent' => '25%', 'best_for' => 'Maximum discount for cash buyers'],
                ],

                'project_faqs' => [
                    ['question' => 'What is IBIZA BAY?', 'answer' => 'IBIZA BAY is a luxury coastal residential project in Al Ahyaa, Hurghada, designed around modern Smart Look architecture, premium finishes, Red Sea lifestyle appeal, and investment value.'],
                    ['question' => 'Where is IBIZA BAY located?', 'answer' => "IBIZA BAY is located in Al Ahyaa, one of Hurghada's fastest-growing coastal areas by the Red Sea."],
                    ['question' => 'What is the starting price?', 'answer' => 'The starting price is EUR 40,350 for selected available opportunities, subject to live availability and official confirmation.'],
                    ['question' => 'Is there a limited-time discount?', 'answer' => 'Yes. An exclusive 2% discount is available until the end of this month only, subject to availability and confirmation before reservation.'],
                    ['question' => 'What payment plans are available?', 'answer' => 'Available options include 15% down payment over 4 years with 2% discount, 30% down payment over 3 years with 5% discount, 50% down payment over 2.5 years with 10% discount, and cash payment with 25% discount.'],
                    ['question' => 'When is delivery?', 'answer' => 'The delivery date is 2028.'],
                    ['question' => 'Why is IBIZA BAY positioned as an investment?', 'answer' => "It combines a prime Al Ahyaa location, holiday rental demand, potential long-term capital appreciation, flexible payment plans, and the opportunity to own in a Red Sea coastal project at today's prices."],
                    ['question' => 'Is IBIZA BAY suitable for personal use?', 'answer' => 'Yes. The project is designed for both personal coastal living and investment, with a peaceful atmosphere, fresh sea breeze, modern amenities, and a lifestyle where every day feels like a vacation.'],
                ],
            ],
            [
                'slug'                  => 'iconic-resort',
                'title'                 => 'Iconic Resort Red Sea Apartments',
                'location'              => 'El Hadaba, Hurghada, Egypt',
                'district'              => 'El Hadaba',
                'currency'              => 'EUR',
                'starting_price'        => 48780,
                'delivery_date'         => '2026',
                'down_payment_percent'  => 20,
                'installment_years'     => 5,
                'is_active'             => true,
                'is_featured'           => false,

                'overview' => 'El Hadaba project near Hurghada Museum and Sheraton Street with pool and city views, swimming pool, gym, spa, underground parking, security and shopping area.',

                'project_details' => 'Iconic Resort Red Sea Apartments offers studios, 1-bedroom, 2-bedroom, and 3-bedroom apartments in El Hadaba, Hurghada. The payment headline is 20% to 40% down, instalments up to 5 years, with delivery in 2026. Final availability, prices, payment schedule, discounts, maintenance fees, and delivery details must be confirmed with Nexus Capital before reservation.',

                'badges' => ['Developer Units', 'Hurghada', 'Investment'],

                'unit_types' => [
                    ['type' => 'Studio', 'size_range' => 'Ask advisor', 'price_from' => 'From €48,780', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '1-Bedroom', 'size_range' => 'Ask advisor', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '2-Bedroom', 'size_range' => 'Ask advisor', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '3-Bedroom', 'size_range' => 'Ask advisor', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                ],

                'payment_plan_rows' => [
                    ['label' => 'Standard Plan', 'down_percent' => '20%–40%', 'duration_label' => 'Up to 5 years', 'discount_percent' => 'Ask advisor', 'best_for' => 'Buyers who want a flexible down-payment range'],
                ],

                'project_faqs' => [
                    ['question' => 'Where is Iconic Resort located?', 'answer' => 'Iconic Resort is located in El Hadaba, Hurghada.'],
                    ['question' => 'What unit types are available?', 'answer' => 'The current unit mix is studios, 1-bedroom, 2-bedroom, and 3-bedroom apartments. Exact availability changes, so request the latest floor plans and price list.'],
                    ['question' => 'What is the starting price?', 'answer' => 'The listed starting price is €48,780. Ask the advisor for exact prices by unit, floor, view, and payment plan.'],
                    ['question' => 'What is the payment plan?', 'answer' => 'The listed payment headline is 20% to 40% down, instalments up to 5 years. Confirm the full schedule, discount, maintenance fee, and contract wording before reserving.'],
                    ['question' => 'When is delivery expected?', 'answer' => 'The current delivery/status note is 2026. Always confirm the timeline in writing for the exact unit.'],
                    ['question' => 'Can I request floor plans and a remote viewing?', 'answer' => 'Yes. Use the WhatsApp request form to ask for floor plans, available units, current prices, and remote or in-person viewing options.'],
                ],
            ],
            [
                'slug'                  => 'la-casa-resort',
                'title'                 => 'LA CASA Resort Super Lux Apartments',
                'location'              => 'Intercontinental Area, Hurghada, Egypt',
                'district'              => 'Intercontinental Area',
                'currency'              => 'EUR',
                'starting_price'        => 23836,
                'starting_area'         => 40,
                'max_area'              => 115,
                'delivery_date'         => 'August 2028',
                'down_payment_percent'  => 35,
                'installment_years'     => 2,
                'cash_discount_percent' => 10,
                'maintenance_fee_percent' => 7,
                'is_active'             => true,
                'is_featured'           => false,

                'overview' => 'A boutique residential project by Sama Hurghada Developments with fully finished Super Lux apartments, a central swimming pool, practical unit sizes, and planned delivery in August 2028.',

                'project_details' => 'LA CASA Resort Super Lux Apartments is a compact resort-living project with 88 apartments on a 1,500 sqm land plot, basement + ground + 3 floors. Euro price guide is around €596/sqm for apartments and €886/sqm for shops. Construction is planned to start in May 2026, with delivery planned for August 2028. Euro values are guidance — confirm the final reservation price, live availability, discounts, and contract terms before purchase.',

                'badges' => ['Developer Units', 'For Sale', 'Intercontinental Area'],

                'unit_types' => [
                    ['type' => 'Studio', 'size_range' => '40–47 sqm', 'price_from' => '€23,836–€28,008', 'cash_price' => '10% cash discount', 'monthly' => 'On request'],
                    ['type' => '1 Bedroom', 'size_range' => '45–75 sqm', 'price_from' => '€26,816–€44,693', 'cash_price' => '10% cash discount', 'monthly' => 'On request'],
                    ['type' => '2 Bedroom', 'size_range' => '93–95 sqm', 'price_from' => '€55,420–€56,611', 'cash_price' => '10% cash discount', 'monthly' => 'On request'],
                    ['type' => '3 Bedroom', 'size_range' => '115 sqm', 'price_from' => '€68,530', 'cash_price' => '10% cash discount', 'monthly' => 'On request'],
                    ['type' => 'Shop (commercial)', 'size_range' => '56–61 sqm', 'price_from' => '€49,605–€54,034', 'cash_price' => 'On request', 'monthly' => 'On request'],
                ],

                'payment_plan_rows' => [
                    ['label' => 'Standard Plan', 'down_percent' => '35%', 'duration_label' => 'Up to 2 years', 'discount_percent' => '10% cash discount', 'best_for' => 'Buyers who want fully finished turnkey delivery with a short instalment term'],
                ],

                'lifestyle_cards' => [
                    ['title' => 'Swimming Pool', 'description' => 'The central pool gives the community a relaxed residential-resort atmosphere.'],
                    ['title' => 'Full Super Lux Finishing', 'description' => 'Every apartment is planned for turnkey delivery, reducing post-handover finishing work.'],
                    ['title' => 'Boutique Scale', 'description' => 'The limited-unit structure supports a more private residential atmosphere.'],
                    ['title' => 'Clear Payment Terms', 'description' => 'The plan includes 35% down payment, instalments up to 2 years, and cash discount guidance.'],
                ],

                'project_faqs' => [
                    ['question' => 'Where is LA CASA Resort located?', 'answer' => 'LA CASA Resort is located in the Intercontinental Area, Hurghada.'],
                    ['question' => 'Who is the developer of LA CASA Resort?', 'answer' => 'Sama Hurghada Developments is listed as the developer.'],
                    ['question' => 'How many apartments are in LA CASA Resort?', 'answer' => 'The project is described as a boutique residential development with 88 apartments on a 1,500 sqm land plot.'],
                    ['question' => 'Is LA CASA Resort delivered fully finished?', 'answer' => 'Yes. Apartments are planned to be delivered fully finished with Super Lux turnkey finishing.'],
                    ['question' => 'What unit sizes are listed?', 'answer' => 'The listed mix includes studios from 40 sqm, one-bedroom apartments from 45–75 sqm, and two- and three-bedroom apartments from 93–115 sqm. Shops are listed from 56–61 sqm.'],
                    ['question' => 'What is the payment plan?', 'answer' => 'The listed plan includes 35% down payment, instalments up to 2 years, a 10% cash discount, and a 7% maintenance fee. Confirm the latest official plan before reservation.'],
                    ['question' => 'When are construction and delivery planned?', 'answer' => 'Construction is planned to start in May 2026, and delivery is planned for August 2028. Confirm the latest timeline before reservation.'],
                ],
            ],
            [
                'slug'                  => 'la-gouna-resort',
                'title'                 => 'LA GOUNA RESORT Red Sea Apartments',
                'location'              => 'Al Ahyaa, Hurghada, Egypt',
                'district'              => 'Al Ahyaa',
                'currency'              => 'EUR',
                'starting_price'        => 25833,
                'starting_area'         => 40,
                'max_area'              => 93,
                'delivery_date'         => 'June 2028',
                'is_active'             => true,
                'is_featured'           => false,

                'overview' => "Gated Al Ahyaa community in front of SUNRISE Alora Aqua Park Resort with 4 pools, rooftop infinity pools, kids' zone, shops and concierge.",

                'project_details' => 'LA GOUNA RESORT Red Sea Apartments spans 10,000 sqm with studios from 40 sqm, 1-bedroom, and 2-bedroom apartments up to 93 sqm. Delivery is set for June 2028. Final availability, prices, payment schedule, discounts, maintenance fees, and delivery details must be confirmed with Nexus Capital before reservation.',

                'badges' => ['Developer Units', 'Al Ahyaa', 'Investment'],

                'unit_types' => [
                    ['type' => 'Studio', 'size_range' => 'From 40 sqm', 'price_from' => 'From €25,833', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '1-Bedroom', 'size_range' => 'Ask advisor', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '2-Bedroom', 'size_range' => 'Up to 93 sqm', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                ],

                'payment_plan_rows' => [
                    ['label' => 'Standard Plan', 'down_percent' => 'Ask advisor', 'duration_label' => 'Ask for latest developer schedule', 'discount_percent' => 'Ask advisor', 'best_for' => 'Buyers who want the live payment schedule confirmed before reservation'],
                ],

                'buyer_journey_steps' => [
                    ['title' => 'Request Availability', 'description' => 'Ask for current units, prices, views, floors, floor plans, and payment options.'],
                    ['title' => 'Compare Units', 'description' => 'Review unit types based on budget, location, view, delivery, and buying goal.'],
                    ['title' => 'View Remotely or On Site', 'description' => 'Arrange a private viewing, online consultation, or video walkthrough with an advisor.'],
                    ['title' => 'Reserve with Support', 'description' => 'Coordinate documents, reservation steps, payment milestones, and handover planning.'],
                ],

                'project_faqs' => [
                    ['question' => 'Where is LA GOUNA RESORT located?', 'answer' => 'LA GOUNA RESORT is located in Al Ahyaa, Hurghada.'],
                    ['question' => 'What unit types are available?', 'answer' => 'The current unit mix is studios from 40 sqm, 1-bedroom, and 2-bedroom apartments up to 93 sqm. Exact availability changes, so request the latest floor plans and price list.'],
                    ['question' => 'What is the starting price?', 'answer' => 'The listed starting price is €25,833. Ask the advisor for exact prices by unit, floor, view, and payment plan.'],
                    ['question' => 'What is the payment plan?', 'answer' => 'The listed payment headline is ask for latest developer schedule. Confirm the full schedule, discount, maintenance fee, and contract wording before reserving.'],
                    ['question' => 'When is delivery expected?', 'answer' => 'The current delivery/status note is June 2028. Always confirm the timeline in writing for the exact unit.'],
                    ['question' => 'Can I request floor plans and a video viewing?', 'answer' => 'Yes. Use the WhatsApp request form to ask for floor plans, available units, current prices, and remote or in-person viewing options.'],
                ],
            ],
            [
                'slug'                  => 'lavanda-suites',
                'title'                 => 'LAVANDA SUITES Red Sea Apartments',
                'location'              => 'Al Ahyaa, Hurghada, Egypt',
                'district'              => 'Al Ahyaa',
                'currency'              => 'EUR',
                'delivery_date'         => 'December 2027',
                'is_active'             => true,
                'is_featured'           => false,

                'overview' => 'Beachfront project between Bellagio Beach Resort & Spa and Golden Beach Aqua Park with private beach access and 11 pools.',

                'project_details' => 'LAVANDA SUITES Red Sea Apartments offers studios, 1-bedroom, and 2-bedroom apartments in Al Ahyaa. The payment headline is 15% down over 30 months, 20% down over 40 months, or 30% down over 48 months, with delivery in December 2027. Starting price is on request — ask the advisor for exact prices by unit, floor, view, and payment plan.',

                'badges' => ['Developer Units', 'Al Ahyaa', 'Investment'],

                'unit_types' => [
                    ['type' => 'Studio', 'size_range' => 'Ask advisor', 'price_from' => 'Request latest price', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '1-Bedroom', 'size_range' => 'Ask advisor', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '2-Bedroom', 'size_range' => 'Ask advisor', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                ],

                'payment_plan_rows' => [
                    ['label' => 'Plan 1', 'down_percent' => '15%', 'duration_label' => '30 months', 'discount_percent' => 'Ask advisor', 'best_for' => 'Buyers who want the shortest instalment term'],
                    ['label' => 'Plan 2', 'down_percent' => '20%', 'duration_label' => '40 months', 'discount_percent' => 'Ask advisor', 'best_for' => 'Buyers who want a balanced instalment term'],
                    ['label' => 'Plan 3', 'down_percent' => '30%', 'duration_label' => '48 months', 'discount_percent' => 'Ask advisor', 'best_for' => 'Buyers who want the longest instalment term'],
                ],

                'project_faqs' => [
                    ['question' => 'Where is LAVANDA SUITES located?', 'answer' => 'LAVANDA SUITES is located in Al Ahyaa, Hurghada.'],
                    ['question' => 'What unit types are available?', 'answer' => 'The current unit mix is studios, 1-bedroom, and 2-bedroom apartments. Exact availability changes, so request the latest floor plans and price list.'],
                    ['question' => 'What is the starting price?', 'answer' => 'The listed starting price is request latest price. Ask the advisor for exact prices by unit, floor, view, and payment plan.'],
                    ['question' => 'What is the payment plan?', 'answer' => 'The listed payment headline is 15% down over 30 months, 20% down over 40 months, or 30% down over 48 months. Confirm the full schedule, discount, maintenance fee, and contract wording before reserving.'],
                    ['question' => 'When is delivery expected?', 'answer' => 'The current delivery/status note is December 2027. Always confirm the timeline in writing for the exact unit.'],
                    ['question' => 'Can I request floor plans and a video viewing?', 'answer' => 'Yes. Use the WhatsApp request form to ask for floor plans, available units, current prices, and remote or in-person viewing options.'],
                ],
            ],
            [
                'slug'                  => 'mark-resort',
                'title'                 => 'Mark Resort Red Sea Apartments',
                'location'              => 'Al Kawthar, Hurghada, Egypt',
                'district'              => 'Al Kawthar',
                'currency'              => 'EUR',
                'starting_price'        => 30183,
                'starting_area'         => 30,
                'max_area'              => 150,
                'delivery_date'         => 'Buildings delivered across 2026 and 2027',
                'installment_years'     => 4,
                'cash_discount_percent' => 10,
                'maintenance_fee_percent' => 10,
                'is_active'             => true,
                'is_featured'           => false,

                'overview' => 'Central Al Kawthar location on Airport Road opposite the Tourist Promenade with five pools, mall, gym, spa, shops and security.',

                'project_details' => 'Mark Resort Red Sea Apartments offers studios from 30 sqm, 1-bedroom, 2-bedroom, and 3-bedroom apartments up to 150 sqm. The payment headline is studios from 30% down over 2.5 years, apartments up to 4 years, with a 10% cash discount and 10% maintenance. Buildings are delivered across 2026 and 2027. Final availability, prices, payment schedule, discounts, maintenance fees, and delivery details must be confirmed with Nexus Capital before reservation.',

                'badges' => ['Developer Units', 'Hurghada', 'Investment'],

                'unit_types' => [
                    ['type' => 'Studio', 'size_range' => 'From 30 sqm', 'price_from' => 'From €30,183', 'cash_price' => '10% cash discount', 'monthly' => 'On request'],
                    ['type' => '1-Bedroom', 'size_range' => 'Ask advisor', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '2-Bedroom', 'size_range' => 'Ask advisor', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '3-Bedroom', 'size_range' => 'Up to 150 sqm', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                ],

                'payment_plan_rows' => [
                    ['label' => 'Studio Plan', 'down_percent' => '30%', 'duration_label' => '2.5 years', 'discount_percent' => '10% cash discount', 'best_for' => 'Studio buyers wanting a shorter schedule'],
                    ['label' => 'Apartment Plan', 'down_percent' => 'Ask advisor', 'duration_label' => 'Up to 4 years', 'discount_percent' => '10% cash discount', 'best_for' => '1–3 bedroom buyers wanting a longer schedule'],
                ],

                'project_faqs' => [
                    ['question' => 'Where is Mark Resort located?', 'answer' => 'Mark Resort is located in Al Kawthar, Hurghada.'],
                    ['question' => 'What unit types are available?', 'answer' => 'The current unit mix is studios from 30 sqm, 1-bedroom, 2-bedroom, and 3-bedroom up to 150 sqm. Exact availability changes, so request the latest floor plans and price list.'],
                    ['question' => 'What is the starting price?', 'answer' => 'The listed starting price is €30,183. Ask the advisor for exact prices by unit, floor, view, and payment plan.'],
                    ['question' => 'What is the payment plan?', 'answer' => 'The listed payment headline is studios from 30% down over 2.5 years, apartments up to 4 years. Confirm the full schedule, discount, maintenance fee, and contract wording before reserving.'],
                    ['question' => 'When is delivery expected?', 'answer' => 'The current delivery/status note is buildings delivered across 2026 and 2027. Always confirm the timeline in writing for the exact unit.'],
                    ['question' => 'Can I request floor plans and a remote viewing?', 'answer' => 'Yes. Use the WhatsApp request form to ask for floor plans, available units, current prices, and remote or in-person viewing options.'],
                ],
            ],
            [
                'slug'                  => 'marvento-beach-resort',
                'title'                 => 'Marvento Beach Resort Beachfront Apartments',
                'location'              => 'Al Ahyaa, Hurghada, Egypt',
                'district'              => 'Al Ahyaa',
                'currency'              => 'EUR',
                'starting_price'        => 51436,
                'starting_area'         => 43,
                'max_area'              => 101,
                'delivery_date'         => 'December 2028',
                'down_payment_percent'  => 10,
                'installment_years'     => 4,
                'cash_discount_percent' => 25,
                'maintenance_fee_percent' => 10,
                'is_active'             => true,
                'is_featured'           => true,

                'overview' => "Beachfront project with private sandy beach, Egypt's first sky pool concept, aqua park, sports and leisure features.",

                'project_details' => 'Marvento Beach Resort Beachfront Apartments offers chalets 43–54 sqm, 1-bedroom 48–73 sqm, and 2-bedroom 74–101 sqm. The payment headline is 10% down over 4 years, or 15% or 20% plans over 5 years, with a 25% cash discount and 10% maintenance on delivery, and December 2028 delivery. Final availability, prices, payment schedule, discounts, maintenance fees, and delivery details must be confirmed with Nexus Capital before reservation.',

                'badges' => ['Developer Units', 'Al Ahyaa', 'Investment'],

                'unit_types' => [
                    ['type' => 'Chalet', 'size_range' => '43–54 sqm', 'price_from' => 'From €51,436', 'cash_price' => '25% cash discount', 'monthly' => 'On request'],
                    ['type' => '1-Bedroom', 'size_range' => '48–73 sqm', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '2-Bedroom', 'size_range' => '74–101 sqm', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                ],

                'payment_plan_rows' => [
                    ['label' => 'Plan 1', 'down_percent' => '10%', 'duration_label' => '4 years', 'discount_percent' => '25% cash discount', 'best_for' => 'Buyers who want the lowest down payment'],
                    ['label' => 'Plan 2', 'down_percent' => '15%', 'duration_label' => '5 years', 'discount_percent' => '25% cash discount', 'best_for' => 'Buyers who want a longer schedule'],
                    ['label' => 'Plan 3', 'down_percent' => '20%', 'duration_label' => '5 years', 'discount_percent' => '25% cash discount', 'best_for' => 'Buyers who want a larger down payment'],
                ],

                'project_faqs' => [
                    ['question' => 'Where is Marvento Beach Resort located?', 'answer' => 'Marvento Beach Resort is located in Al Ahyaa, Hurghada.'],
                    ['question' => 'What unit types are available?', 'answer' => 'The current unit mix is chalets 43–54 sqm, 1-bedroom 48–73 sqm, and 2-bedroom 74–101 sqm. Exact availability changes, so request the latest floor plans and price list.'],
                    ['question' => 'What is the starting price?', 'answer' => 'The listed starting price is €51,436. Ask the advisor for exact prices by unit, floor, view, and payment plan.'],
                    ['question' => 'What is the payment plan?', 'answer' => 'The listed payment headline is 10% down over 4 years, or 15% or 20% plans over 5 years. Confirm the full schedule, discount, maintenance fee, and contract wording before reserving.'],
                    ['question' => 'When is delivery expected?', 'answer' => 'The current delivery/status note is December 2028. Always confirm the timeline in writing for the exact unit.'],
                    ['question' => 'Can I request floor plans and a remote viewing?', 'answer' => 'Yes. Use the WhatsApp request form to ask for floor plans, available units, current prices, and remote or in-person viewing options.'],
                ],
            ],
            [
                'slug'                  => 'one-7',
                'title'                 => 'One 7 Red Sea Apartments',
                'location'              => 'Village Road, Km 17, Hurghada, Egypt',
                'district'              => 'Village Road',
                'currency'              => 'EUR',
                'starting_price'        => 93878,
                'delivery_date'         => '2027',
                'down_payment_percent'  => 15,
                'installment_years'     => 6,
                'is_active'             => true,
                'is_featured'           => false,

                'overview' => 'Village Road residence between Hurghada and Sahl Hasheesh with beach and mountain views, private garden/pool villas and varied home types.',

                'project_details' => 'One 7 Red Sea Apartments spans 200 homes with studios, 1–3 bedroom apartments, penthouses, 2–3 bedroom duplexes, and villas. The payment headline is 15% down, quarterly instalments up to 6 years, with delivery in 2027. Final availability, prices, payment schedule, discounts, maintenance fees, and delivery details must be confirmed with Nexus Capital before reservation.',

                'badges' => ['Developer Units', 'Hurghada', 'Investment'],

                'unit_types' => [
                    ['type' => 'Studio', 'size_range' => 'Ask advisor', 'price_from' => 'From €93,878', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '1–3 Bedroom Apartment', 'size_range' => 'Ask advisor', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => 'Penthouse', 'size_range' => 'Ask advisor', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '2–3 Bedroom Duplex / Villa', 'size_range' => 'Ask advisor', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                ],

                'payment_plan_rows' => [
                    ['label' => 'Standard Plan', 'down_percent' => '15%', 'duration_label' => 'Quarterly instalments up to 6 years', 'discount_percent' => 'Ask advisor', 'best_for' => 'Buyers who want a long quarterly instalment schedule'],
                ],

                'project_faqs' => [
                    ['question' => 'Where is One 7 located?', 'answer' => 'One 7 is located in Village Road, Km 17, Hurghada.'],
                    ['question' => 'What unit types are available?', 'answer' => 'The current unit mix is studios, 1–3 bedroom apartments, penthouses, 2–3 bedroom duplexes, and villas. Exact availability changes, so request the latest floor plans and price list.'],
                    ['question' => 'What is the starting price?', 'answer' => 'The listed starting price is €93,878. Ask the advisor for exact prices by unit, floor, view, and payment plan.'],
                    ['question' => 'What is the payment plan?', 'answer' => 'The listed payment headline is 15% down, quarterly instalments up to 6 years. Confirm the full schedule, discount, maintenance fee, and contract wording before reserving.'],
                    ['question' => 'When is delivery expected?', 'answer' => 'The current delivery/status note is 2027. Always confirm the timeline in writing for the exact unit.'],
                    ['question' => 'Can I request floor plans and a video viewing?', 'answer' => 'Yes. Use the WhatsApp request form to ask for floor plans, available units, current prices, and remote or in-person viewing options.'],
                ],
            ],
            [
                'slug'                  => 'oro-beach-resort',
                'title'                 => 'Oro Beach Resort Beachfront Apartments',
                'location'              => 'El Ahyaa Road, North Hurghada, Egypt',
                'district'              => 'Al Ahyaa',
                'currency'              => 'EUR',
                'starting_price'        => 55823,
                'starting_area'         => 39,
                'max_area'              => 241,
                'delivery_date'         => '2026',
                'installment_years'     => 4,
                'maintenance_fee_percent' => 10,
                'is_active'             => true,
                'is_featured'           => false,

                'overview' => 'Modern beachfront project opposite Mubarak 7 Villas with direct sea access, beach, pools, restaurants, cafés, spa, gym and sea activities.',

                'project_details' => 'Oro Beach Resort Beachfront Apartments offers studios 39–78 sqm, 1-bedroom 49–148 sqm, 2-bedroom 86–170 sqm, and 3-bedroom 160–241 sqm. The payment headline is 10% to 30% down, instalments up to 48 months, with 10% maintenance on delivery and 2026 delivery. Final availability, prices, payment schedule, discounts, maintenance fees, and delivery details must be confirmed with Nexus Capital before reservation.',

                'badges' => ['Developer Units', 'Hurghada', 'Investment'],

                'unit_types' => [
                    ['type' => 'Studio', 'size_range' => '39–78 sqm', 'price_from' => 'From €55,823', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '1-Bedroom', 'size_range' => '49–148 sqm', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '2-Bedroom', 'size_range' => '86–170 sqm', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '3-Bedroom', 'size_range' => '160–241 sqm', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                ],

                'payment_plan_rows' => [
                    ['label' => 'Standard Plan', 'down_percent' => '10%–30%', 'duration_label' => 'Up to 48 months', 'discount_percent' => 'Ask advisor', 'best_for' => 'Buyers who want a flexible down-payment range'],
                ],

                'project_faqs' => [
                    ['question' => 'Where is Oro Beach Resort located?', 'answer' => 'Oro Beach Resort is located on El Ahyaa Road, North Hurghada.'],
                    ['question' => 'What unit types are available?', 'answer' => 'The current unit mix is studios 39–78 sqm, 1-bedroom 49–148 sqm, 2-bedroom 86–170 sqm, and 3-bedroom 160–241 sqm. Exact availability changes, so request the latest floor plans and price list.'],
                    ['question' => 'What is the starting price?', 'answer' => 'The listed starting price is €55,823. Ask the advisor for exact prices by unit, floor, view, and payment plan.'],
                    ['question' => 'What is the payment plan?', 'answer' => 'The listed payment headline is 10% to 30% down, instalments up to 48 months. Confirm the full schedule, discount, maintenance fee, and contract wording before reserving.'],
                    ['question' => 'When is delivery expected?', 'answer' => 'The current delivery/status note is 2026. Always confirm the timeline in writing for the exact unit.'],
                    ['question' => 'Can I request floor plans and a remote viewing?', 'answer' => 'Yes. Use the WhatsApp request form to ask for floor plans, available units, current prices, and remote or in-person viewing options.'],
                ],
            ],
            [
                'slug'                  => 'panorama-hills-resort',
                'title'                 => 'Panorama Hills Resort Red Sea Apartments',
                'location'              => 'Hadaba Road, Hurghada, Egypt',
                'district'              => 'El Hadaba',
                'currency'              => 'EUR',
                'starting_price'        => 28380,
                'delivery_date'         => '2027',
                'is_active'             => true,
                'is_featured'           => false,

                'overview' => 'Hadaba Road project near Sheraton Street with underground parking, 4 pools, gym, café, restaurant and city access.',

                'project_details' => 'Panorama Hills Resort Red Sea Apartments spans 5,000 sqm with studios, 1-bedroom, and 2-bedroom apartments depending on availability. The payment headline is 20% down over 3 years, or 30% down over 4 years, with delivery in 2027. Final availability, prices, payment schedule, discounts, maintenance fees, and delivery details must be confirmed with Nexus Capital before reservation.',

                'badges' => ['Developer Units', 'Hurghada', 'Investment'],

                'unit_types' => [
                    ['type' => 'Studio', 'size_range' => 'Ask advisor', 'price_from' => 'From €28,380', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '1-Bedroom', 'size_range' => 'Ask advisor', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '2-Bedroom', 'size_range' => 'Ask advisor', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                ],

                'payment_plan_rows' => [
                    ['label' => 'Plan 1', 'down_percent' => '20%', 'duration_label' => '3 years', 'discount_percent' => 'Ask advisor', 'best_for' => 'Buyers who want a shorter schedule'],
                    ['label' => 'Plan 2', 'down_percent' => '30%', 'duration_label' => '4 years', 'discount_percent' => 'Ask advisor', 'best_for' => 'Buyers who want a longer schedule'],
                ],

                'buyer_journey_steps' => [
                    ['title' => 'Request Availability', 'description' => 'Ask for current units, prices, views, floors, floor plans, and payment options.'],
                    ['title' => 'Compare Units', 'description' => 'Review unit types based on budget, location, view, delivery, and buying goal.'],
                    ['title' => 'View Remotely or On Site', 'description' => 'Arrange a private viewing, online consultation, or video walkthrough with an advisor.'],
                    ['title' => 'Reserve with Support', 'description' => 'Coordinate documents, reservation steps, payment milestones, and handover planning.'],
                ],

                'project_faqs' => [
                    ['question' => 'Where is Panorama Hills Resort located?', 'answer' => 'Panorama Hills Resort is located in Hadaba Road, Hurghada.'],
                    ['question' => 'What unit types are available?', 'answer' => 'The current unit mix is studios, 1-bedroom, and 2-bedroom apartments depending on availability. Exact availability changes, so request the latest floor plans and price list.'],
                    ['question' => 'What is the starting price?', 'answer' => 'The listed starting price is €28,380. Ask the advisor for exact prices by unit, floor, view, and payment plan.'],
                    ['question' => 'What is the payment plan?', 'answer' => 'The listed payment headline is 20% down over 3 years, 30% down over 4 years. Confirm the full schedule, discount, maintenance fee, and contract wording before reserving.'],
                    ['question' => 'When is delivery expected?', 'answer' => 'The current delivery/status note is 2027. Always confirm the timeline in writing for the exact unit.'],
                    ['question' => 'Can I request floor plans and a video viewing?', 'answer' => 'Yes. Use the WhatsApp request form to ask for floor plans, available units, current prices, and remote or in-person viewing options.'],
                ],
            ],
            [
                'slug'                  => 'panorama-magawish',
                'title'                 => 'Panorama Magawish Red Sea Apartments',
                'location'              => 'El Bahga Square, Magawish, Hurghada, Egypt',
                'district'              => 'Magawish',
                'currency'              => 'EUR',
                'starting_price'        => 41165,
                'delivery_date'         => 'December 2026',
                'down_payment_percent'  => 20,
                'installment_years'     => 2,
                'is_active'             => true,
                'is_featured'           => false,

                'overview' => 'Compact Magawish project with swimming pool, 24/7 security, satellite connectivity and simple payment plans.',

                'project_details' => 'Panorama Magawish Red Sea Apartments spans 2,000 sqm with studios, 1-bedroom, and 2-bedroom apartments depending on availability. Plan A is 20% down over 2 years; Plan B is 30% down over 2.5 years, with delivery in December 2026. Final availability, prices, payment schedule, discounts, maintenance fees, and delivery details must be confirmed with Nexus Capital before reservation.',

                'badges' => ['Developer Units', 'Magawish', 'Investment'],

                'unit_types' => [
                    ['type' => 'Studio', 'size_range' => 'Ask advisor', 'price_from' => 'From €41,165', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '1-Bedroom', 'size_range' => 'Ask advisor', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '2-Bedroom', 'size_range' => 'Ask advisor', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                ],

                'payment_plan_rows' => [
                    ['label' => 'Plan A', 'down_percent' => '20%', 'duration_label' => '2 years', 'discount_percent' => 'Ask advisor', 'best_for' => 'Buyers who want the shorter schedule'],
                    ['label' => 'Plan B', 'down_percent' => '30%', 'duration_label' => '2.5 years', 'discount_percent' => 'Ask advisor', 'best_for' => 'Buyers who want a slightly longer schedule'],
                ],

                'buyer_journey_steps' => [
                    ['title' => 'Request Availability', 'description' => 'Ask for current units, prices, views, floors, floor plans, and payment options.'],
                    ['title' => 'Compare Units', 'description' => 'Review unit types based on budget, location, view, delivery, and buying goal.'],
                    ['title' => 'View Remotely or On Site', 'description' => 'Arrange a private viewing, online consultation, or video walkthrough with an advisor.'],
                    ['title' => 'Reserve with Support', 'description' => 'Coordinate documents, reservation steps, payment milestones, and handover planning.'],
                ],

                'project_faqs' => [
                    ['question' => 'Where is Panorama Magawish located?', 'answer' => 'Panorama Magawish is located in El Bahga Square, Magawish, Hurghada.'],
                    ['question' => 'What unit types are available?', 'answer' => 'The current unit mix is studios, 1-bedroom, and 2-bedroom apartments depending on availability. Exact availability changes, so request the latest floor plans and price list.'],
                    ['question' => 'What is the starting price?', 'answer' => 'The listed starting price is €41,165. Ask the advisor for exact prices by unit, floor, view, and payment plan.'],
                    ['question' => 'What is the payment plan?', 'answer' => 'The listed payment headline is Plan A: 20% down over 2 years; Plan B: 30% down over 2.5 years. Confirm the full schedule, discount, maintenance fee, and contract wording before reserving.'],
                    ['question' => 'When is delivery expected?', 'answer' => 'The current delivery/status note is December 2026. Always confirm the timeline in writing for the exact unit.'],
                    ['question' => 'Can I request floor plans and a video viewing?', 'answer' => 'Yes. Use the WhatsApp request form to ask for floor plans, available units, current prices, and remote or in-person viewing options.'],
                ],
            ],
            [
                'slug'                  => 'red-hills-sahl-hasheesh',
                'title'                 => 'Red Hills Sahl Hasheesh',
                'location'              => 'Sahl Hasheesh, Hurghada, Egypt',
                'district'              => 'Sahl Hasheesh',
                'currency'              => 'EUR',
                'starting_price'        => 98500,
                'starting_area'         => 54,
                'max_area'              => 200,
                'delivery_date'         => 'December 2028',
                'down_payment_percent'  => 10,
                'installment_years'     => 6,
                'cash_discount_percent' => 30,
                'is_active'             => true,
                'is_featured'           => true,

                'overview' => "Elevated Sahl Hasheesh community about five minutes' walk to the beach with boutique hotel, clubhouse, gym, spa, padel court and heated pool.",

                'project_details' => 'Red Hills Sahl Hasheesh offers studios 54–60 sqm, 1-bedroom 77–85 sqm, 2-bedroom 118–154 sqm, 3-bedroom 155–200 sqm, and penthouses 190–200 sqm. Selected units start from 10% down, instalments over 6 years, with a 30% cash discount subject to terms and December 2028 delivery. Final availability, prices, payment schedule, discounts, maintenance fees, and delivery details must be confirmed with Nexus Capital before reservation.',

                'badges' => ['Developer Units', 'Sahl Hasheesh', 'Investment'],

                'unit_types' => [
                    ['type' => 'Studio', 'size_range' => '54–60 sqm', 'price_from' => 'From €98,500', 'cash_price' => '30% cash discount', 'monthly' => 'On request'],
                    ['type' => '1-Bedroom', 'size_range' => '77–85 sqm', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '2-Bedroom', 'size_range' => '118–154 sqm', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '3-Bedroom', 'size_range' => '155–200 sqm', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => 'Penthouse', 'size_range' => '190–200 sqm', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                ],

                'payment_plan_rows' => [
                    ['label' => 'Standard Plan', 'down_percent' => '10%', 'duration_label' => '6 years', 'discount_percent' => '30% cash discount subject to terms', 'best_for' => 'Buyers who want a low entry with a long instalment schedule'],
                ],

                'project_faqs' => [
                    ['question' => 'Where is Red Hills Sahl Hasheesh located?', 'answer' => 'Red Hills Sahl Hasheesh is located in Sahl Hasheesh, Hurghada.'],
                    ['question' => 'What unit types are available?', 'answer' => 'The current unit mix is studios 54–60 sqm, 1-bedroom 77–85 sqm, 2-bedroom 118–154 sqm, 3-bedroom 155–200 sqm, and penthouses 190–200 sqm. Exact availability changes, so request the latest floor plans and price list.'],
                    ['question' => 'What is the starting price?', 'answer' => 'The listed starting price is €98,500. Ask the advisor for exact prices by unit, floor, view, and payment plan.'],
                    ['question' => 'What is the payment plan?', 'answer' => 'The listed payment headline is selected units from 10% down, instalments over 6 years. Confirm the full schedule, discount, maintenance fee, and contract wording before reserving.'],
                    ['question' => 'When is delivery expected?', 'answer' => 'The current delivery/status note is December 2028. Always confirm the timeline in writing for the exact unit.'],
                    ['question' => 'Can I request floor plans and a remote viewing?', 'answer' => 'Yes. Use the WhatsApp request form to ask for floor plans, available units, current prices, and remote or in-person viewing options.'],
                ],
            ],
            [
                'slug'                  => 'riva-beach-front',
                'title'                 => 'Riva Beach Front Beachfront Apartments',
                'location'              => 'Hurghada Promenade, Hurghada, Egypt',
                'district'              => 'Hurghada Promenade',
                'currency'              => 'EUR',
                'starting_price'        => 56263,
                'delivery_date'         => '2028',
                'down_payment_percent'  => 15,
                'installment_years'     => 4,
                'cash_discount_percent' => 25,
                'is_active'             => true,
                'is_featured'           => false,

                'overview' => 'Prime promenade address beside SUNRISE Aqua Joy Resort with private beach access, marina access, pools, lagoons and management services.',

                'project_details' => 'Riva Beach Front Beachfront Apartments offers studios, apartments, and selected duplex options depending on availability. The payment headline is 15% down over 4 years, or 20% down over 5 years, with a 25% cash discount and 2028 delivery. Final availability, prices, payment schedule, discounts, maintenance fees, and delivery details must be confirmed with Nexus Capital before reservation.',

                'badges' => ['Developer Units', 'Hurghada', 'Investment'],

                'unit_types' => [
                    ['type' => 'Studio', 'size_range' => 'Ask advisor', 'price_from' => 'From €56,263', 'cash_price' => '25% cash discount', 'monthly' => 'On request'],
                    ['type' => 'Apartment', 'size_range' => 'Ask advisor', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => 'Duplex', 'size_range' => 'Ask advisor', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                ],

                'payment_plan_rows' => [
                    ['label' => 'Plan 1', 'down_percent' => '15%', 'duration_label' => '4 years', 'discount_percent' => '25% cash discount', 'best_for' => 'Buyers who want the lower down payment'],
                    ['label' => 'Plan 2', 'down_percent' => '20%', 'duration_label' => '5 years', 'discount_percent' => '25% cash discount', 'best_for' => 'Buyers who want a longer schedule'],
                ],

                'project_faqs' => [
                    ['question' => 'Where is Riva Beach Front located?', 'answer' => 'Riva Beach Front is located in Hurghada Promenade, Hurghada.'],
                    ['question' => 'What unit types are available?', 'answer' => 'The current unit mix is studios, apartments, and duplex options depending on availability. Exact availability changes, so request the latest floor plans and price list.'],
                    ['question' => 'What is the starting price?', 'answer' => 'The listed starting price is €56,263. Ask the advisor for exact prices by unit, floor, view, and payment plan.'],
                    ['question' => 'What is the payment plan?', 'answer' => 'The listed payment headline is 15% down over 4 years, 20% down over 5 years. Confirm the full schedule, discount, maintenance fee, and contract wording before reserving.'],
                    ['question' => 'When is delivery expected?', 'answer' => 'The current delivery/status note is 2028. Always confirm the timeline in writing for the exact unit.'],
                    ['question' => 'Can I request floor plans and a remote viewing?', 'answer' => 'Yes. Use the WhatsApp request form to ask for floor plans, available units, current prices, and remote or in-person viewing options.'],
                ],
            ],
            [
                'slug'                  => 'scandic-resort',
                'title'                 => 'Scandic Resort Red Sea Apartments',
                'location'              => 'Central Hurghada, Egypt',
                'district'              => 'Central Hurghada',
                'currency'              => 'EUR',
                'starting_price'        => 84637,
                'delivery_date'         => 'Move-in after final payment',
                'down_payment_percent'  => 20,
                'installment_years'     => 5,
                'is_active'             => true,
                'is_featured'           => false,

                'overview' => 'Beachfront central Hurghada project with direct sea access, private sandy beach, 3 pools, poolside restaurant, bar, shops, dining and property management.',

                'project_details' => 'Scandic Resort Red Sea Apartments is a low-rise resort project in Central Hurghada with studios, 1-bedroom, and 2-bedroom apartments depending on availability. Move-in follows final payment; ask for the live availability and payment schedule. Final availability, prices, payment schedule, discounts, maintenance fees, and delivery details must be confirmed with Nexus Capital before reservation.',

                'badges' => ['Developer Units', 'Hurghada', 'Investment'],

                'unit_types' => [
                    ['type' => 'Studio', 'size_range' => 'Ask advisor', 'price_from' => 'From €84,637', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '1-Bedroom', 'size_range' => 'Ask advisor', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => '2-Bedroom', 'size_range' => 'Ask advisor', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                ],

                'payment_plan_rows' => [
                    ['label' => 'Standard Plan', 'down_percent' => 'Ask advisor', 'duration_label' => 'Ask for live availability and payment schedule', 'discount_percent' => 'Ask advisor', 'best_for' => 'Buyers who want the live payment schedule confirmed before reservation'],
                ],

                'project_faqs' => [
                    ['question' => 'Where is Scandic Resort located?', 'answer' => 'Scandic Resort is located in Central Hurghada.'],
                    ['question' => 'What unit types are available?', 'answer' => 'The current unit mix is studios, 1-bedroom, and 2-bedroom apartments depending on availability. Exact availability changes, so request the latest floor plans and price list.'],
                    ['question' => 'What is the starting price?', 'answer' => 'The listed starting price is €84,637. Ask the advisor for exact prices by unit, floor, view, and payment plan.'],
                    ['question' => 'What is the payment plan?', 'answer' => 'The listed payment headline is ask for live availability and payment schedule. Confirm the full schedule, discount, maintenance fee, and contract wording before reserving.'],
                    ['question' => 'When is delivery expected?', 'answer' => 'The current delivery/status note is move-in after final payment. Always confirm the timeline in writing for the exact unit.'],
                    ['question' => 'Can I request floor plans and a remote viewing?', 'answer' => 'Yes. Use the WhatsApp request form to ask for floor plans, available units, current prices, and remote or in-person viewing options.'],
                ],
            ],
            [
                'slug'                  => 'soulferyo-sahl-hasheesh',
                'title'                 => 'Soulferyo Sahl Hasheesh',
                'location'              => "Sahl Hasheesh, Egypt's Red Sea coast",
                'district'              => 'Sahl Hasheesh',
                'currency'              => 'EUR',
                'starting_price'        => 111988,
                'starting_area'         => 77,
                'max_area'              => 251,
                'delivery_date'         => 'Three-year delivery timeline stated in brochure',
                'installment_years'     => 7,
                'cash_discount_percent' => 30,
                'maintenance_fee_percent' => 10,
                'is_active'             => true,
                'is_featured'           => true,

                'overview' => 'A low-density luxury resort near Old Town Sahl Hasheesh, created around open landscapes, water, privacy, and timeless modern architecture. Soulferyo combines refined coastal living with flexible ownership and distinctive rooftop, garden, family, and hospitality concepts.',

                'project_details' => 'Soulferyo is a limited resort community of 250 residences across a 53,000 sqm project land, with 80% open landscape and 34 m elevation above sea. Choose a five, six, or seven-year ownership route, or a 30% cash discount for full payment. Prices are indicative, converted using the supplied 1 July 2026 EUR inventory rate; the guide EUR/EGP rate, maintenance amount, and selected unit price and availability must be confirmed at reservation.',

                'location_description' => "Near Old Town, above the sea and golf landscape, with privacy without isolation: approximately five minutes from Old Town Sahl Hasheesh, approximately 15 minutes from Senzo Mall for wider retail and services, approximately 20 minutes from Hurghada International Airport, and approximately 25 minutes from Hurghada Downtown.",

                'badges' => ['For the Premium Few', 'Starting From EUR988', '250 Limited Residences', 'Relaxed Golf Views'],

                'unit_types' => [
                    ['type' => 'Classic One-Bedroom Apartment', 'size_range' => '77 sqm, 1 bath', 'price_from' => '€111,988', 'cash_price' => '30% cash discount', 'monthly' => 'On request'],
                    ['type' => 'Sky Chic Condo', 'size_range' => '77 sqm, 1 bath', 'price_from' => '€121,734', 'cash_price' => '30% cash discount', 'monthly' => 'On request'],
                    ['type' => 'Modern Maisonette', 'size_range' => '117 sqm, 2 bath', 'price_from' => '€158,061', 'cash_price' => '30% cash discount', 'monthly' => 'On request'],
                    ['type' => 'Spacious Maisonette', 'size_range' => '119 sqm, 2 bath', 'price_from' => '€187,272', 'cash_price' => '30% cash discount', 'monthly' => 'On request'],
                    ['type' => 'Spacious Maisonette Plus', 'size_range' => '133 sqm, 3 bath', 'price_from' => '€177,819', 'cash_price' => '30% cash discount', 'monthly' => 'On request'],
                    ['type' => 'Sky Elegant', 'size_range' => '116 sqm, 3 bath, 2 bed', 'price_from' => '€203,657', 'cash_price' => '30% cash discount', 'monthly' => 'On request'],
                    ['type' => 'Sky Exclusive', 'size_range' => '151 sqm, 3 bed, 3 bath', 'price_from' => '€251,990', 'cash_price' => '30% cash discount', 'monthly' => 'On request'],
                    ['type' => 'Townhouse / Signature Villa', 'size_range' => '251 sqm, 4 bed, 5 bath', 'price_from' => '€394,026', 'cash_price' => '30% cash discount', 'monthly' => 'On request'],
                ],

                'payment_plan_rows' => [
                    ['label' => 'Five-Year Plan', 'down_percent' => '10%', 'duration_label' => 'Up to 5 years', 'discount_percent' => 'None stated', 'best_for' => 'Lowest initial down payment'],
                    ['label' => 'Six-Year Plan', 'down_percent' => '15%', 'duration_label' => 'Up to 6 years', 'discount_percent' => 'None stated', 'best_for' => 'Balanced down payment and duration'],
                    ['label' => 'Seven-Year Plan', 'down_percent' => '20%', 'duration_label' => 'Up to 7 years', 'discount_percent' => 'None stated', 'best_for' => 'Longest instalment schedule'],
                    ['label' => 'Cash Plan', 'down_percent' => '100%', 'duration_label' => 'Cash purchase', 'discount_percent' => '30%', 'best_for' => 'Maximum current purchase discount'],
                ],

                'lifestyle_cards' => [
                    ['title' => 'Sand Lagoon', 'description' => 'A resort-style sand lagoon creates a relaxed waterside lifestyle within the landscape.'],
                    ['title' => 'Pool Collection', 'description' => 'Two swimming pools, two infinity pools, a kids\' pool, a lagoon, and jacuzzi zones.'],
                    ['title' => 'Three Clubhouses', 'description' => 'Community spaces designed around relaxation, social life, BBQ areas, and family activities.'],
                    ['title' => 'Wellness and Fitness', 'description' => 'A fitness centre, spa, yoga space, jogging track, and areas for an active resort routine.'],
                ],

                'travel_distances' => [
                    ['destination' => 'Old Town Sahl Hasheesh', 'time' => 'Approximately 5 minutes'],
                    ['destination' => 'Senzo Mall', 'time' => 'Approximately 15 minutes'],
                    ['destination' => 'Hurghada International Airport', 'time' => 'Approximately 20 minutes'],
                    ['destination' => 'Hurghada Downtown', 'time' => 'Approximately 25 minutes'],
                ],

                'developer_track_record' => [
                    ['name' => 'Ilioka Bay 1 (Hurghada)', 'delivered_label' => 'Referenced Hurghada project'],
                    ['name' => 'Ilioka Bay 2 (Hurghada)', 'delivered_label' => 'Referenced Hurghada project'],
                    ['name' => 'Prime Residence Magawish (Hurghada)', 'delivered_label' => 'Referenced Hurghada project'],
                ],

                'project_faqs' => [
                    ['question' => 'Where is Soulferyo located?', 'answer' => "Soulferyo is in Sahl Hasheesh on Egypt's Red Sea coast, approximately five minutes from Old Town, 15 minutes from Senzo Mall, 20 minutes from Hurghada Airport, and 25 minutes from Hurghada Downtown."],
                    ['question' => 'How large is the project?', 'answer' => 'The supplied 2026 catalogue states a total land area of 53,000 sqm and a limited community of 250 residences.'],
                    ['question' => 'How is the land distributed?', 'answer' => 'Approximately 20% is allocated to the building footprint and 80% to landscapes, water, and open resort space.'],
                    ['question' => 'Which home types are available?', 'answer' => 'The catalogue presents one-bedroom rooftop and garden homes, two-bedroom maisonettes and rooftop homes, a three-bedroom rooftop residence, a four-bedroom townhouse/signature villa, and a boutique villa concept.'],
                    ['question' => 'Which amenities are planned?', 'answer' => 'Project information includes eight water features, three clubhouses, sand lagoon and pool experiences, wellness and fitness spaces, kids\' and community facilities, rooftop and poolside resto-bars, a 1,500 sqm commercial area, jogging routes, eco-friendly transport, and beach access.'],
                    ['question' => 'What is the current starting price?', 'answer' => 'The supplied inventory dated 1 July 2026 converts to an indicative starting price of €111,988 for a 77 sqm one-bedroom apartment. A separate 10% maintenance amount is listed, and the selected unit price, exchange rate, and availability must be confirmed at reservation.'],
                    ['question' => 'What payment plans are currently offered?', 'answer' => 'The supplied commercial terms state 10% down over five years, 15% down over six years, and 20% down over seven years. A 30% cash discount and 10% maintenance deposit are also stated, subject to official confirmation for the selected unit.'],
                    ['question' => 'When is delivery?', 'answer' => 'The brochure states a three-year delivery timeline but does not identify a fixed calendar handover date. The exact contractual delivery date must be confirmed for the selected phase and unit.'],
                    ['question' => 'Are 360-degree tours available?', 'answer' => 'Yes. The supplied catalogue links to virtual tours for Sky Chic, Modern Maisonette, Spacious Maisonette, Sky Elegant, Sky Exclusive, the Boutique Villa, and the Townhouse.'],
                    ['question' => 'Is Soulferyo suitable for investment?', 'answer' => 'The project offers features that may interest lifestyle and rental-focused buyers, including limited density, holiday-market location, rooftop and garden formats, and a hospitality concept. Rental demand, returns, licensing, operating costs, and resale performance are not guaranteed and should be evaluated independently.'],
                ],
            ],
            [
                'slug'                  => 'venecia-resort',
                'title'                 => 'Venecia Resort Red Sea Apartments',
                'location'              => "Hurghada, Egypt's Red Sea coast",
                'district'              => 'Hurghada',
                'currency'              => 'EUR',
                'starting_price'        => 56870,
                'delivery_date'         => 'December 2028',
                'is_active'             => true,
                'is_featured'           => false,

                'overview' => 'A large seaside community in Hurghada with villas, chalets, sea-view homes, a 40,000 sqm commercial mall, swimming pools, jacuzzis, spa, fitness center, business hub, restaurants, and cafés.',

                'project_details' => 'Venecia Resort spans 200,000 sqm with 480 villas and chalets. Payment options are 10% down with the rest over 3 years, 20% down with the rest over 4 years, 25% down with the rest over 5 years, or 30% down with the rest over 6 years, with delivery in December 2028. Always confirm the latest official price list, discounts, service charges, reservation amount, and contract wording with Nexus Capital before reservation.',

                'badges' => ['Developer Units', 'Red Sea Resort', 'Hurghada', 'Investment'],

                'unit_types' => [
                    ['type' => 'Villa', 'size_range' => 'Ask for sizes', 'price_from' => 'From €56,870', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => 'Chalet', 'size_range' => 'Ask for sizes', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => 'Sea-View Home', 'size_range' => 'Ask advisor', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                ],

                'payment_plan_rows' => [
                    ['label' => 'Plan 1', 'down_percent' => '10%', 'duration_label' => '3 years', 'discount_percent' => 'Ask advisor', 'best_for' => 'Buyers who want the lowest down payment'],
                    ['label' => 'Plan 2', 'down_percent' => '20%', 'duration_label' => '4 years', 'discount_percent' => 'Ask advisor', 'best_for' => 'Buyers comparing monthly cash flow'],
                    ['label' => 'Plan 3', 'down_percent' => '25%', 'duration_label' => '5 years', 'discount_percent' => 'Ask advisor', 'best_for' => 'Buyers who want a longer schedule'],
                    ['label' => 'Plan 4', 'down_percent' => '30%', 'duration_label' => '6 years', 'discount_percent' => 'Ask advisor', 'best_for' => 'Buyers who want the longest schedule'],
                ],

                'project_faqs' => [
                    ['question' => 'Where is Venecia Resort located?', 'answer' => "Venecia Resort is located in Hurghada on Egypt's Red Sea coast."],
                    ['question' => 'What unit types are available?', 'answer' => 'The current buyer-facing unit mix includes villas, chalets, and sea-view homes. Exact availability changes, so request the latest floor plans and price list.'],
                    ['question' => 'What is the starting price?', 'answer' => 'The listed starting price is €56,870. Ask the advisor for exact prices by unit, view, size, and selected payment plan.'],
                    ['question' => 'What is the payment plan?', 'answer' => 'The listed payment options are 10% down with the rest over 3 years, 20% down with the rest over 4 years, 25% down with the rest over 5 years, or 30% down with the rest over 6 years.'],
                    ['question' => 'When is delivery expected?', 'answer' => 'The current delivery/status note is December 2028. Always confirm the timeline in writing for the exact unit before reserving.'],
                    ['question' => 'Can I request floor plans and a video viewing?', 'answer' => 'Yes. Use the WhatsApp request form to ask for floor plans, available units, current prices, and remote or in-person viewing options.'],
                ],
            ],
            [
                'slug'                  => 'il-bayou-laguna',
                'title'                 => 'iL Bayou Laguna Sahl Hasheesh Project',
                'location'              => 'Sahl Hasheesh, Egypt',
                'district'              => 'Sahl Hasheesh',
                'currency'              => 'EUR',
                'starting_price'        => 223115,
                'delivery_date'         => '2028',
                'down_payment_percent'  => 20,
                'installment_years'     => 8,
                'is_active'             => true,
                'is_featured'           => false,

                'overview' => "Newest phase at iL Bayou with swimmable sandy beach pool, lagoon lifestyle, kids' pool area and quiet Sahl Hasheesh address.",

                'project_details' => 'iL Bayou Laguna Sahl Hasheesh Project is 121 m from the beach, with chalets, townhouses with private pool, and twin houses with private pool. The payment headline is 20% down, instalments up to 8 years, with delivery in 2028. Final availability, prices, payment schedule, discounts, maintenance fees, and delivery details must be confirmed with Nexus Capital before reservation.',

                'badges' => ['Developer Units', 'Sahl Hasheesh', 'Investment'],

                'unit_types' => [
                    ['type' => 'Chalet', 'size_range' => 'Ask advisor', 'price_from' => 'From €223,115', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => 'Townhouse (private pool)', 'size_range' => 'Ask advisor', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => 'Twin House (private pool)', 'size_range' => 'Ask advisor', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                ],

                'payment_plan_rows' => [
                    ['label' => 'Standard Plan', 'down_percent' => '20%', 'duration_label' => 'Up to 8 years', 'discount_percent' => 'Ask advisor', 'best_for' => 'Buyers who want a long instalment schedule'],
                ],

                'project_faqs' => [
                    ['question' => 'Where is iL Bayou Laguna located?', 'answer' => 'iL Bayou Laguna is located in Sahl Hasheesh.'],
                    ['question' => 'What unit types are available?', 'answer' => 'The current unit mix is chalets, townhouses with private pool, and twin houses with private pool. Exact availability changes, so request the latest floor plans and price list.'],
                    ['question' => 'What is the starting price?', 'answer' => 'The listed starting price is €223,115. Ask the advisor for exact prices by unit, floor, view, and payment plan.'],
                    ['question' => 'What is the payment plan?', 'answer' => 'The listed payment headline is 20% down, instalments up to 8 years. Confirm the full schedule, discount, maintenance fee, and contract wording before reserving.'],
                    ['question' => 'When is delivery expected?', 'answer' => 'The current delivery/status note is 2028. Always confirm the timeline in writing for the exact unit.'],
                    ['question' => 'Can I request floor plans and a video viewing?', 'answer' => 'Yes. Use the WhatsApp request form to ask for floor plans, available units, current prices, and remote or in-person viewing options.'],
                ],
            ],
            [
                'slug'                  => 'il-bayou',
                'title'                 => 'iL Bayou Sahl Hasheesh Project',
                'location'              => 'Sahl Hasheesh, Egypt',
                'district'              => 'Sahl Hasheesh',
                'currency'              => 'EUR',
                'starting_price'        => 149000,
                'delivery_date'         => '2028 / confirm listing details',
                'down_payment_percent'  => 20,
                'installment_years'     => 8,
                'is_active'             => true,
                'is_featured'           => false,

                'overview' => 'Sahl Hasheesh compound with lagoon-style living, swimmable sandy beach pool, private-pool homes, family-friendly features and beach nearby.',

                'project_details' => 'iL Bayou Sahl Hasheesh Project is a fully serviced compound with chalets, townhouses with private pool, and twin houses with private pool. The payment headline is 20% down, instalments up to 8 years, with delivery in 2028 (confirm listing details). Final availability, prices, payment schedule, discounts, maintenance fees, and delivery details must be confirmed with Nexus Capital before reservation.',

                'badges' => ['Developer Units', 'Sahl Hasheesh', 'Investment'],

                'unit_types' => [
                    ['type' => 'Chalet', 'size_range' => 'Ask advisor', 'price_from' => 'From €149,000', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => 'Townhouse (private pool)', 'size_range' => 'Ask advisor', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                    ['type' => 'Twin House (private pool)', 'size_range' => 'Ask advisor', 'price_from' => 'On request', 'cash_price' => 'On request', 'monthly' => 'On request'],
                ],

                'payment_plan_rows' => [
                    ['label' => 'Standard Plan', 'down_percent' => '20%', 'duration_label' => 'Up to 8 years', 'discount_percent' => 'Ask advisor', 'best_for' => 'Buyers who want a long instalment schedule'],
                ],

                'buyer_journey_steps' => [
                    ['title' => 'Request Availability', 'description' => 'Ask for current units, prices, views, floors, floor plans, and payment options.'],
                    ['title' => 'Compare Units', 'description' => 'Review unit types based on budget, location, view, delivery, and buying goal.'],
                    ['title' => 'View Remotely or On Site', 'description' => 'Arrange a private viewing, online consultation, or video walkthrough with an advisor.'],
                    ['title' => 'Reserve with Support', 'description' => 'Coordinate documents, reservation steps, payment milestones, and handover planning.'],
                ],

                'project_faqs' => [
                    ['question' => 'Where is iL Bayou located?', 'answer' => 'iL Bayou is located in Sahl Hasheesh.'],
                    ['question' => 'What unit types are available?', 'answer' => 'The current unit mix is chalets, townhouses with private pool, and twin houses with private pool. Exact availability changes, so request the latest floor plans and price list.'],
                    ['question' => 'What is the starting price?', 'answer' => 'The listed starting price is €149,000. Ask the advisor for exact prices by unit, floor, view, and payment plan.'],
                    ['question' => 'What is the payment plan?', 'answer' => 'The listed payment headline is 20% down, instalments up to 8 years. Confirm the full schedule, discount, maintenance fee, and contract wording before reserving.'],
                    ['question' => 'When is delivery expected?', 'answer' => 'The current delivery/status note is 2028, subject to confirming listing details. Always confirm the timeline in writing for the exact unit.'],
                    ['question' => 'Can I request floor plans and a video viewing?', 'answer' => 'Yes. Use the WhatsApp request form to ask for floor plans, available units, current prices, and remote or in-person viewing options.'],
                ],
            ],
        ];

        foreach ($projects as $project) {
            Project::updateOrCreate(['slug' => $project['slug']], $project);
        }
    }
}
