<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class JsonFileUploadService
{
    private const ALLOWED_IMAGE_TYPES = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    ];

    private const ALLOWED_VIDEO_TYPES = [
        'video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm',
    ];

    private const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    /**
     * Handle multiple file uploads from JSON structure with base64 data
     */
    public function handleJsonFileUploads(array $filesData, string $folder = 'motors'): array
    {
        $uploadedFiles = [];

        foreach ($filesData as $fileData) {
            // HANYA PROSES file yang memiliki base64Data (file baru)
            if (isset($fileData['file']) && isset($fileData['base64Data'])) {
                $result = $this->processBase64File($fileData, $folder);
                if ($result) {
                    $uploadedFiles[] = $result;
                }
            }
            // SKIP file existing yang tidak perlu diupload ulang
        }

        return $uploadedFiles;
    }

    /**
     * Process single file from base64 data
     */
    private function processBase64File(array $fileData, string $folder): ?array
    {
        try {
            $file = $fileData['file'];
            $base64Data = $fileData['base64Data'];

            // Validate file metadata
            if (! $this->isValidJsonFile($file)) {
                Log::warning('Invalid file data', ['file' => $file]);

                return null;
            }

            // Decode base64 data
            $fileContent = base64_decode($base64Data);
            if ($fileContent === false) {
                throw new \Exception('Invalid base64 data');
            }

            // Determine subfolder based on file type
            $subfolder = $this->getSubfolderByType($file['type']);
            $fullFolder = $folder.'/'.$subfolder;

            // Generate unique filename
            $fileName = $this->generateUniqueFileName($file['name']);
            $filePath = $fullFolder.'/'.$fileName;

            // Store file to public storage
            $stored = Storage::disk('public')->put($filePath, $fileContent);

            if (! $stored) {
                throw new \Exception('Failed to store file: '.$filePath);
            }

            Log::info('File uploaded successfully', ['path' => $filePath]);

            return [
                'file' => [
                    'name' => $file['name'],
                    'size' => $file['size'],
                    'type' => $file['type'],
                ],
                'file_path' => $filePath,
                'preview' => Storage::url($filePath),
                'id' => $fileData['id'] ?? Str::random(10),
                'base64Data' => $base64Data,
            ];

        } catch (\Exception $e) {
            Log::error('JSON file processing error: '.$e->getMessage(), [
                'file_data' => $fileData ?? 'null',
            ]);

            return null;
        }
    }

    /**
     * Validate JSON file data
     */
    private function isValidJsonFile(array $fileData): bool
    {
        // Check required fields
        if (! isset($fileData['name'], $fileData['size'], $fileData['type'])) {
            return false;
        }

        $mimeType = $fileData['type'];
        $fileSize = $fileData['size'];

        // Check file size
        if ($fileSize > self::MAX_FILE_SIZE) {
            Log::warning('File too large', ['size' => $fileSize, 'max' => self::MAX_FILE_SIZE]);

            return false;
        }

        // Check file type
        $allowedTypes = array_merge(self::ALLOWED_IMAGE_TYPES, self::ALLOWED_VIDEO_TYPES);

        if (! in_array($mimeType, $allowedTypes)) {
            Log::warning('File type not allowed', ['type' => $mimeType]);

            return false;
        }

        return true;
    }

    /**
     * Get subfolder based on file type
     */
    private function getSubfolderByType(string $mimeType): string
    {
        if (in_array($mimeType, self::ALLOWED_IMAGE_TYPES)) {
            return 'images';
        }

        if (in_array($mimeType, self::ALLOWED_VIDEO_TYPES)) {
            return 'videos';
        }

        return 'others';
    }

    /**
     * Generate unique filename
     */
    private function generateUniqueFileName(string $originalName): string
    {
        $extension = pathinfo($originalName, PATHINFO_EXTENSION);
        $nameWithoutExtension = pathinfo($originalName, PATHINFO_FILENAME);
        $cleanName = Str::slug($nameWithoutExtension);

        return $cleanName.'_'.time().'_'.Str::random(8).'.'.$extension;
    }

    /**
     * Delete multiple files with better error handling
     */
    public function deleteMultipleFiles(array $files): void
    {
        if (empty($files)) {
            Log::info('No files to delete');

            return;
        }

        $deletedCount = 0;
        $failedCount = 0;

        foreach ($files as $file) {
            $success = $this->deleteSingleFile($file);
            if ($success) {
                $deletedCount++;
            } else {
                $failedCount++;
            }
        }

        Log::info('File deletion summary', [
            'deleted' => $deletedCount,
            'failed' => $failedCount,
            'total' => count($files),
        ]);
    }

    /**
     * Delete single file with improved error handling
     * Supports both array and string formats for backward compatibility
     */
    public function deleteSingleFile(array|string|null $fileData): bool
    {
        try {
            // Extract file path from different possible formats
            $filePath = $this->extractFilePath($fileData);

            if (! $filePath) {
                Log::warning('Could not extract file path from data', ['fileData' => $fileData]);

                return false;
            }

            // Normalize the path for storage operations
            $normalizedPath = $this->normalizeFilePath($filePath);

            // Check if file exists before attempting deletion
            if (! Storage::disk('public')->exists($normalizedPath)) {
                Log::warning('File not found for deletion', ['path' => $filePath, 'normalized' => $normalizedPath]);

                return false;
            }

            // Attempt to delete the file
            $deleted = Storage::disk('public')->delete($normalizedPath);

            if ($deleted) {
                Log::info('File deleted successfully', ['path' => $filePath]);

                return true;
            } else {
                Log::error('Failed to delete file', ['path' => $filePath]);

                return false;
            }

        } catch (\Exception $e) {
            Log::error('File deletion error: '.$e->getMessage(), [
                'fileData' => $fileData,
                'trace' => $e->getTraceAsString(),
            ]);

            return false;
        }
    }

    /**
     * Get file URL
     */
    public function getFileUrl(string $filePath): string
    {
        return Storage::url($filePath);
    }

    /**
     * Compare files to determine which ones to delete (IMPROVED)
     */
    public function getFilesToDelete(array $oldFiles, array $newFiles): array
    {
        if (empty($oldFiles)) {
            return [];
        }

        $newFilePaths = [];

        // Ambil file_path dari file baru
        foreach ($newFiles as $newFile) {
            if (isset($newFile['file_path'])) {
                $newFilePaths[] = $newFile['file_path'];
            }
        }

        $filesToDelete = [];

        // Cari file lama yang tidak ada di file baru
        foreach ($oldFiles as $oldFile) {
            if (isset($oldFile['file_path']) && ! in_array($oldFile['file_path'], $newFilePaths)) {
                $filesToDelete[] = $oldFile;
            }
        }

        Log::info('Files comparison', [
            'old_files_count' => count($oldFiles),
            'new_files_count' => count($newFiles),
            'files_to_delete' => count($filesToDelete),
        ]);

        return $filesToDelete;
    }

    /**
     * Debug method untuk cek file existence
     */
    public function checkFilesExistence(array $files): array
    {
        $result = [];

        foreach ($files as $index => $file) {
            if (isset($file['file_path'])) {
                $exists = Storage::disk('public')->exists($file['file_path']);
                $result[] = [
                    'index' => $index,
                    'file_path' => $file['file_path'],
                    'exists' => $exists,
                    'full_path' => storage_path('app/public/'.$file['file_path']),
                ];
            }
        }

        return $result;
    }

    /**
     * Extract file path from various possible input formats
     */
    private function extractFilePath(array|string|null $fileData): ?string
    {
        if (is_null($fileData)) {
            return null;
        }

        if (is_string($fileData)) {
            return trim($fileData);
        }

        if (is_array($fileData)) {
            // Try to get file_path from array
            if (isset($fileData['file_path'])) {
                return trim($fileData['file_path']);
            }

            // Handle specific structure for showcase_images (from model casting/unserialization)
            if (isset($fileData['file'])) {
                // Check if file is fully qualified URL, extract storage path
                $file = $fileData['file'];
                if (is_string($file)) {
                    return $this->extractStoragePath($file);
                }
                if (is_array($file) && isset($file['name'])) {
                    // This might be raw file data without path
                    return null;
                }
            }

            // Check for other common keys
            $possibleKeys = ['path', 'url', 'link', 'src'];
            foreach ($possibleKeys as $key) {
                if (isset($fileData[$key])) {
                    return $this->extractStoragePath($fileData[$key]);
                }
            }

            // Handle JSON-encoded string values within the array
            if (isset($fileData[0]) && is_string($fileData[0])) {
                return $this->extractStoragePath($fileData[0]);
            }
        }

        return null;
    }

    /**
     * Extract storage path from various URL formats
     */
    private function extractStoragePath(string $path): string
    {
        $path = trim($path);

        // If it's a full URL, extract path after /storage/
        if (preg_match('/\/storage\/(.+)$/', $path, $matches)) {
            return $matches[1];
        }

        // Remove storage/ prefix if present
        if (str_starts_with($path, 'storage/')) {
            return substr($path, 8);
        }

        return $path; // Return as-is for relative paths
    }

    /**
     * Normalize file path for storage operations
     */
    private function normalizeFilePath(string $path): string
    {
        $path = trim($path);

        // Remove storage/ prefix if present
        if (str_starts_with($path, 'storage/')) {
            return substr($path, 8);
        }

        return $path;
    }
}
