<?php

namespace App\Helpers;

use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Client\PendingRequest;

class ImageProviderException extends Exception {}

class ImageHelper
{
    // Neko API
    protected const NEKO_API_URL = 'https://api.nekosapi.com/v4/images/random';
    protected const ALLOWED_RATINGS = ['safe', 'suggestive', 'borderline', 'explicit'];
    
    // TheMealDB API
    protected const MEAL_DB_API_URL = 'https://www.themealdb.com/api/json/v1/1/random.php';
    
        // Track used meal images to ensure uniqueness
    public static array $usedMealUrls = [];

    /**
     * Get a random image URL from Neko API.
     * 
     * @param array $options See randomImage() docblock for details
     * @return string|null Final absolute image URL
     * @throws ImageProviderException
     */
    public static function randomImage(array $options = []): ?string
    {
        $maxAttempts = $options['max_attempts'] ?? 3;
        $ensureUnique = $options['ensure_unique'] ?? false;
        $previouslyUsed = array_merge(
            self::$usedMealUrls,
            $options['previously_used'] ?? []
        );

        $attempt = 0;
        $lastError = null;

        while ($attempt < $maxAttempts) {
            try {
                $url = self::fetchSingleImage($options, $attempt > 0);
                
                if ($ensureUnique && in_array($url, $previouslyUsed, true)) {
                    $attempt++;
                    if ($attempt < $maxAttempts) {
                        usleep(100000);
                        continue;
                    }
                    throw new ImageProviderException(
                        "Failed to get unique image after {$maxAttempts} attempts"
                    );
                }

                self::$usedMealUrls[] = $url;
                return $url;

            } catch (Exception $e) {
                $lastError = $e;
                $attempt++;
                
                if ($attempt < $maxAttempts) {
                    usleep(100000);
                    continue;
                }
            }
        }

        Log::error('Neko API image fetch failed after all attempts', [
            'error' => $lastError?->getMessage(),
            'options' => $options,
            'attempts' => $maxAttempts
        ]);

        if ($options['returnNullOnError'] ?? false) {
            return null;
        }

        throw new ImageProviderException(
            "Failed to get image: " . ($lastError?->getMessage() ?? 'Unknown error'),
            0,
            $lastError
        );
    }

    /**
     * Get a random image URL from Unsplash API based on category query.
     * 
     * WHY PREVIOUS IMPLEMENTATIONS RETURNED SAME IMAGE:
     * - Not using query params to match product category
     * - Caching responses with identical query params
     * - Not extracting final photo URL from JSON
     * - Reusing single fetched URL across multiple products
     * - Factory calling helper once instead of per product
     * - Not using Unsplash's count param to get batch of varied images
     *
     * @param array $options {
     *     @var string $query REQUIRED - Search query (e.g., product category)
     *     @var int $count Number of photos to fetch (default: 1)
     *     @var string $orientation Photo orientation (landscape|portrait|squarish)
     *     @var array|string $collections Collection IDs, comma-delimited
     *     @var array|string $topicIds Topic IDs, comma-delimited
     *     @var string $size URL size to return (raw|full|regular|small|thumb, default: regular)
     *     @var bool $force_unique Add cache-busting param (default: false)
     *     @var bool $ensure_unique Retry until unique URL found (default: false)
     *     @var int $max_attempts Max retry attempts when ensure_unique=true (default: 3)
     *     @var array $previously_used Array of URLs to avoid when ensure_unique=true
     *     @var bool $track_download Call download_location to track (default: false)
     *     @var bool $returnNullOnError Return null instead of throwing (default: false)
     *     @var int $timeout HTTP timeout in seconds (default: 10)
     *     @var PendingRequest|null $httpClient Inject HTTP client for testing
     * }
     * @return string Final absolute image URL
     * @throws ImageProviderException
     */
    public static function randomUnsplashImage(array $options = []): string
    {
        // VALIDATION: query is required
        if (empty($options['query'])) {
            throw new ImageProviderException(
                "The 'query' option is required for Unsplash image search"
            );
        }

        $maxAttempts = $options['max_attempts'] ?? 3;
        $ensureUnique = $options['ensure_unique'] ?? false;
        $previouslyUsed = array_merge(
            self::$usedMealUrls,
            $options['previously_used'] ?? []
        );

        $attempt = 0;
        $lastError = null;

        while ($attempt < $maxAttempts) {
            try {
                $url = self::fetchSingleUnsplashImage($options, $attempt > 0);
                
                // UNIQUENESS CHECK: If ensure_unique enabled, verify URL is unique
                if ($ensureUnique && in_array($url, $previouslyUsed, true)) {
                    $attempt++;
                    if ($attempt < $maxAttempts) {
                        usleep(100000); // 100ms delay between retries
                        continue;
                    }
                    throw new ImageProviderException(
                        "Failed to get unique Unsplash image after {$maxAttempts} attempts"
                    );
                }

                // Track this URL to help prevent duplicates in same run
                self::$usedMealUrls[] = $url;
                
                return $url;

            } catch (Exception $e) {
                $lastError = $e;
                $attempt++;
                
                if ($attempt < $maxAttempts) {
                    usleep(100000);
                    continue;
                }
            }
        }

        // All attempts failed
        Log::error('Unsplash image fetch failed after all attempts', [
            'error' => $lastError?->getMessage(),
            'options' => $options,
            'attempts' => $maxAttempts
        ]);

 

        throw new ImageProviderException(
            "Failed to get Unsplash image: " . ($lastError?->getMessage() ?? 'Unknown error'),
            0,
            $lastError
        );
    }

    /**
     * Fetch a single image from Neko API.
     */
    protected static function fetchSingleImage(array $options, bool $isRetry = false): string
    {
        $query = self::buildNekoQuery($options);

        if (($options['force_unique'] ?? false) || $isRetry) {
            $query['_cb'] = hrtime(true);
        }

        $client = $options['httpClient'] ?? Http::timeout(10)->retry(2, 100);
        $response = $client->get(self::NEKO_API_URL, $query);

        if (!$response->successful()) {
            throw new ImageProviderException(
                "Neko API request failed with status {$response->status()}: {$response->body()}"
            );
        }

        $data = $response->json();
        
        if (!is_array($data) || empty($data)) {
            throw new ImageProviderException(
                "Invalid Neko API response: expected non-empty array"
            );
        }

        $item = $data[0];
        
        if (!isset($item['url'])) {
            throw new ImageProviderException(
                "Invalid Neko API response: missing 'url' field. Keys: " . 
                implode(', ', array_keys($item))
            );
        }

        $imageUrl = $item['url'];
        
        if (!filter_var($imageUrl, FILTER_VALIDATE_URL)) {
            throw new ImageProviderException("Invalid image URL: {$imageUrl}");
        }

        return $imageUrl;
    }

    /**
     * Fetch a single image from Unsplash API.
     * 
     * CRITICAL: Uses /photos/random which returns JSON with photo object(s).
     * Extracts the appropriate 'urls' field and optionally tracks download.
     */
    protected static function fetchSingleUnsplashImage(array $options, bool $isRetry = false): string
    {
        $query = self::buildUnsplashQuery($options);

        // CACHE-BUSTING: Add random param if force_unique enabled or this is a retry
        if (($options['force_unique'] ?? false) || $isRetry) {
            $query['_cb'] = hrtime(true);
        }

        // Get Unsplash access key from config
        $accessKey = config('app.unsplash_acces_key');
        if (empty($accessKey)) {
            throw new ImageProviderException(
                "Unsplash access key not configured. Set 'unsplash_acces_key' in config/app.php"
            );
        }

        // Build HTTP client with Authorization header
        $timeout = $options['timeout'] ?? 10;
        $client = $options['httpClient'] ?? Http::timeout($timeout)
            ->retry(2, 100)
            ->withHeaders([
                'Authorization' => "Client-ID {$accessKey}",
                'Accept' => 'application/json',
            ]);

        $response = $client->get(self::MEAL_DB_API_URL, $query);

        if (!$response->successful()) {
            throw new ImageProviderException(
                "TheMealDB API request failed with status {$response->status()}: {$response->body()}"
            );
        }

        // Parse JSON response
        // If count > 1, API returns array; if count = 1, returns single object
        $data = $response->json();
        
        if (!$data) {
            throw new ImageProviderException("Empty response from Unsplash API");
        }

        // Handle array response (when count > 1)
        if (is_array($data) && isset($data[0])) {
            // Pick a random photo from the array to increase variety
            $photo = $data[array_rand($data)];
        } else {
            // Single photo object
            $photo = $data;
        }

        // Validate photo structure
        if (!isset($photo['urls']) || !is_array($photo['urls'])) {
            throw new ImageProviderException(
                "Invalid Unsplash response: missing 'urls' field"
            );
        }

        // Get the appropriate size URL (default: regular)
        $size = $options['size'] ?? 'regular';
        $validSizes = ['raw', 'full', 'regular', 'small', 'thumb'];
        
        if (!in_array($size, $validSizes, true)) {
            $size = 'regular';
        }

        if (!isset($photo['urls'][$size])) {
            throw new ImageProviderException(
                "Unsplash photo missing '{$size}' URL. Available: " . 
                implode(', ', array_keys($photo['urls']))
            );
        }

        $imageUrl = $photo['urls'][$size];
        
        if (!filter_var($imageUrl, FILTER_VALIDATE_URL)) {
            throw new ImageProviderException("Invalid Unsplash image URL: {$imageUrl}");
        }

        // OPTIONAL: Track download per Unsplash API guidelines
        if (($options['track_download'] ?? false) && isset($photo['links']['download_location'])) {
            try {
                $client->get($photo['links']['download_location']);
            } catch (Exception $e) {
                Log::warning('Failed to track Unsplash download', [
                    'photo_id' => $photo['id'] ?? null,
                    'error' => $e->getMessage()
                ]);
            }
        }

        return $imageUrl;
    }

    /**
     * Build query parameters for Neko API.
     */
    protected static function buildNekoQuery(array $options): array
    {
        $query = [];

        if (empty($options['rating'])) {
            $query['rating'] = 'explicit';
        } else {
            $ratings = is_array($options['rating']) 
                ? $options['rating'] 
                : array_map('trim', explode(',', $options['rating']));
            
            $ratings = array_intersect($ratings, self::ALLOWED_RATINGS);
            $query['rating'] = empty($ratings) ? 'explicit' : implode(',', $ratings);
        }

        if (!empty($options['artist'])) {
            $artists = is_array($options['artist']) 
                ? $options['artist'] 
                : explode(',', $options['artist']);
            
            $artists = array_filter(array_map('intval', $artists), fn($id) => $id > 0);
            
            if (!empty($artists)) {
                $query['artist'] = implode(',', $artists);
            }
        }

        if (!empty($options['tags'])) {
            $tags = is_array($options['tags']) 
                ? $options['tags'] 
                : explode(',', $options['tags']);
            
            $tags = array_filter(array_map('trim', $tags), fn($tag) => $tag !== '');
            
            if (!empty($tags)) {
                $query['tags'] = implode(',', $tags);
            }
        }

        if (!empty($options['without_tags'])) {
            $withoutTags = is_array($options['without_tags']) 
                ? $options['without_tags'] 
                : explode(',', $options['without_tags']);
            
            $withoutTags = array_filter(array_map('trim', $withoutTags), fn($tag) => $tag !== '');
            
            if (!empty($withoutTags)) {
                $query['without_tags'] = implode(',', $withoutTags);
            }
        }

        return $query;
    }

    /**
     * Build query parameters for Unsplash API.
     * Normalizes all inputs and ensures only valid values are sent.
     */
    protected static function buildUnsplashQuery(array $options): array
    {
        $query = [];

        // QUERY: Required search term (e.g., product category)
        $query['query'] = trim($options['query']);

        // COUNT: Number of photos to fetch (1-30, default 1)
        $count = $options['count'] ?? 1;
        $query['count'] = max(1, min(30, (int)$count));

        // ORIENTATION: landscape, portrait, or squarish
        if (!empty($options['orientation'])) {
            $validOrientations = ['landscape', 'portrait', 'squarish'];
            if (in_array($options['orientation'], $validOrientations, true)) {
                $query['orientation'] = $options['orientation'];
            }
        }

        // COLLECTIONS: Array of collection IDs
        if (!empty($options['collections'])) {
            $collections = is_array($options['collections']) 
                ? $options['collections'] 
                : explode(',', $options['collections']);
            
            $collections = array_filter(array_map('trim', $collections), fn($c) => $c !== '');
            
            if (!empty($collections)) {
                $query['collections'] = implode(',', $collections);
            }
        }

        // TOPIC IDS: Array of topic IDs
        if (!empty($options['topicIds'])) {
            $topicIds = is_array($options['topicIds']) 
                ? $options['topicIds'] 
                : explode(',', $options['topicIds']);
            
            $topicIds = array_filter(array_map('trim', $topicIds), fn($t) => $t !== '');
            
            if (!empty($topicIds)) {
                $query['topics'] = implode(',', $topicIds);
            }
        }

        return $query;
    }

    /**
     * Clear tracked URLs (useful between seeding batches)
     */
    public static function clearUsedUrls(): void
    {
        self::$usedMealUrls = [];
    }

    /**
     * Legacy method for Neko API backward compatibility
     */
    public static function random(array $options = []): ?string
    {
        return self::randomImage($options);
    }
}