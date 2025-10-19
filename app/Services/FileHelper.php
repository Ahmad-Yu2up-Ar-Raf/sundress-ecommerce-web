<?php
namespace App\Helpers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class FileHelper
{
    /**
     * Normalizes many possible stored path formats into a relative path on the public disk.
     *
     * Accepts:
     * - 'product/abc.jpg'
     * - 'storage/product/abc.jpg'
     * - '/storage/product/abc.jpg'
     * - 'http://domain.test/storage/product/abc.jpg'
     * - 'https://.../storage/...'
     *
     * Returns null if empty or cannot normalize.
     */
    public static function normalizePublicPath(?string $path): ?string
    {
        if (!$path) return null;

        // If full URL contains '/storage/', strip scheme+host up to '/storage/'
        $path = preg_replace('#^https?://[^/]+/storage/#', '', $path);

        // Strip leading '/storage/' or 'storage/'
        $path = preg_replace('#^/storage/#', '', $path);
        $path = preg_replace('#^storage/#', '', $path);

        // Remove leading slash
        $path = ltrim($path, '/');

        return $path ?: null;
    }

    /**
     * Delete a public disk file safely (idempotent).
     * Returns true if deleted, false if not found / cannot delete.
     */
    public static function deletePublicFile(?string $path): bool
    {
        $relative = self::normalizePublicPath($path);
        if (!$relative) {
            Log::warning("FileHelper::deletePublicFile called with empty path", ['path' => $path]);
            return false;
        }

        try {
            if (Storage::disk('public')->exists($relative)) {
                return Storage::disk('public')->delete($relative);
            } else {
                Log::info("File not found on public disk (skip): {$relative}");
                return false;
            }
        } catch (\Throwable $e) {
            Log::error("Failed to delete file {$relative}: " . $e->getMessage(), ['exception' => $e]);
            return false;
        }
    }
}
