<?php

namespace Database\Factories;

use App\Enums\CategoryProductsStatus;
use App\Helpers\ImageHelper;
use App\Models\Products;
use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ProductsFactory extends Factory
{
    protected $model = Products::class;

    public function definition(): array
    {
        static $index = 0;
        $index++;

        $faker = \Faker\Factory::create();
        $price = $faker->randomFloat(2, 10, 1000);
        
        // Get random category
        $category = $faker->randomElement(CategoryProductsStatus::cases());
        $categoryName = $category->value; // e.g., 'Food', 'Electronics', 'Clothing'

        // Add small delay every 10 products to avoid rate limiting
        if ($index > 1 && $index % 10 === 0) {
            usleep(500000); // 500ms delay
        }

        return [
            'vendor_id' => User::factory(),
            'name' => $faker->unique()->name(),
            'description' => $faker->paragraph(),
            'free_shipping' => $faker->boolean(),
            'status' => $faker->randomElement(['available', 'not_available']),
            'category' => $category,
            'price' => number_format($price, 4, '.', ''),
            'currency' => 'USD',
            'province' => $faker->city(),
            'country' => $faker->country(),
            'stock' => $faker->numberBetween(0, 100),

            // Use TheMealDB API for all product images with uniqueness tracking
            'cover_image' => Cache::remember(
                'product_image_' . $index . '_cover_' . uniqid(),
                3600,
                function () {
                    try {
                        $maxRetries = 3;
                        $attempt = 0;
                        
                        while ($attempt < $maxRetries) {
                            try {
                                $response = Http::timeout(15)
                                    ->get('https://www.themealdb.com/api/json/v1/1/random.php');
                                
                                if (!$response->successful()) {
                                    throw new Exception("TheMealDB API request failed: " . $response->status());
                                }
                                
                                $data = $response->json();
                                
                                // Validate response structure
                                if (!is_array($data) || 
                                    !isset($data['meals']) || 
                                    !is_array($data['meals']) || 
                                    empty($data['meals']) ||
                                    !isset($data['meals'][0]['strMealThumb'])) {
                                    throw new Exception("Invalid response structure from TheMealDB API");
                                }
                                
                                $imageUrl = $data['meals'][0]['strMealThumb'];
                                
                                // Validate URL
                                if (!filter_var($imageUrl, FILTER_VALIDATE_URL)) {
                                    throw new Exception("Invalid image URL received from TheMealDB API");
                                }
                                
                                // Track used URLs to ensure uniqueness
                                if (!isset(ImageHelper::$usedMealUrls)) {
                                    ImageHelper::$usedMealUrls = [];
                                }
                                
                                // Check if URL is already used
                                if (in_array($imageUrl, ImageHelper::$usedMealUrls)) {
                                    throw new Exception("Duplicate image URL encountered");
                                }
                                
                                ImageHelper::$usedMealUrls[] = $imageUrl;
                                return $imageUrl;
                                
                            } catch (Exception $e) {
                                $attempt++;
                                if ($attempt >= $maxRetries) {
                                    throw $e;
                                }
                                sleep(1); // Wait 1 second before retrying
                            }
                        }
                        
                        throw new Exception("Failed to get valid image after {$maxRetries} attempts");
                    } catch (Exception $e) {
                        Log::warning("Failed to fetch meal image: " . $e->getMessage());
                        throw $e; // Re-throw to trigger a retry
                    }
                }
            ),

            'showcase_images' => [
                Cache::remember(
                    'product_image_' . $index . '_showcase_1_' . uniqid(),
                    3600,
                    function () {
                        try {
                            $maxRetries = 3;
                            $attempt = 0;
                            
                            while ($attempt < $maxRetries) {
                                try {
                                    $response = Http::timeout(15)
                                        ->get('https://www.themealdb.com/api/json/v1/1/random.php');
                                    
                                    if (!$response->successful()) {
                                        throw new Exception("TheMealDB API request failed: " . $response->status());
                                    }
                                    
                                    $data = $response->json();
                                    
                                    // Validate response structure
                                    if (!is_array($data) || 
                                        !isset($data['meals']) || 
                                        !is_array($data['meals']) || 
                                        empty($data['meals']) ||
                                        !isset($data['meals'][0]['strMealThumb'])) {
                                        throw new Exception("Invalid response structure from TheMealDB API");
                                    }
                                    
                                    $imageUrl = $data['meals'][0]['strMealThumb'];
                                    
                                    // Validate URL
                                    if (!filter_var($imageUrl, FILTER_VALIDATE_URL)) {
                                        throw new Exception("Invalid image URL received from TheMealDB API");
                                    }
                                    
                                    // Track used URLs to ensure uniqueness
                                    if (!isset(ImageHelper::$usedMealUrls)) {
                                        ImageHelper::$usedMealUrls = [];
                                    }
                                    
                                    // Check if URL is already used
                                    if (in_array($imageUrl, ImageHelper::$usedMealUrls)) {
                                        throw new Exception("Duplicate image URL encountered");
                                    }
                                    
                                    ImageHelper::$usedMealUrls[] = $imageUrl;
                                    return $imageUrl;
                                    
                                } catch (Exception $e) {
                                    $attempt++;
                                    if ($attempt >= $maxRetries) {
                                        throw $e;
                                    }
                                    sleep(1); // Wait 1 second before retrying
                                }
                            }
                            
                            throw new Exception("Failed to get valid image after {$maxRetries} attempts");
                        } catch (Exception $e) {
                            Log::warning("Failed to fetch meal image: " . $e->getMessage());
                            throw $e; // Re-throw to trigger a retry
                        }
                    }
                ),
            ],

            /* OPTION 2: Use Neko API (anime-style images)
            'cover_image' => ImageHelper::randomImage([
                'rating' => ['explicit'],
                'tags' => ["girl", "boy"],
                'force_unique' => true,
                'returnNullOnError' => false,
            ]) ?: 'https://via.placeholder.com/800x600',

            'showcase_images' => array_filter([
                ImageHelper::randomImage([
                    'rating' => ['explicit'],
                    'tags' => ["girl"],
                    'force_unique' => true,
                    'returnNullOnError' => true,
                ]),
                ImageHelper::randomImage([
                    'rating' => ['explicit'],
                    'tags' => ["boy"],
                    'force_unique' => true,
                    'returnNullOnError' => true,
                ]),
            ]),
            */

            /* OPTION 3: Use Unsplash with count param for efficiency
            // Fetch 4 images at once, use first for cover, rest for showcase
            // This reduces API calls but requires custom logic
            'cover_image' => ImageHelper::randomUnsplashImage([
                'query' => $categoryName,
                'count' => 1,
                'size' => 'regular',
                'ensure_unique' => true,
                'max_attempts' => 3,
            ]),
            */

            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    public function available()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'available',
                'stock' => $this->faker->numberBetween(1, 100),
            ];
        });
    }
}