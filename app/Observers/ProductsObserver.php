<?php

namespace App\Observers;

use App\Models\Products;
use App\Services\FileUploadService;
use App\Services\JsonFileUploadService;
use Illuminate\Support\Facades\Log;

class ProductsObserver
{
    protected $fileUploadService;
    protected $jsonFileUploadService;
    
    // Flag untuk prevent double execution
    protected static $isProcessingFiles = false;

    public function __construct(
        FileUploadService $fileUploadService,
        JsonFileUploadService $jsonFileUploadService
    ) {
        $this->fileUploadService = $fileUploadService;
        $this->jsonFileUploadService = $jsonFileUploadService;
    }

    /**
     * Handle the Products "created" event.
     */
    public function created(Products $product): void
    {
        // Prevent double execution
        if (self::$isProcessingFiles) {
            return;
        }

        if (request()->hasFile('showcase_images') || (request()->has('showcase_images') && is_array(request('showcase_images')))) {
            self::$isProcessingFiles = true;
            
            try {
                $uploadedFiles = $this->handleFileUploads();
                
                if (empty($uploadedFiles)) {
                    throw new \Exception('Gagal mengupload file. Pastikan file valid.');
                }
                
                // UPDATE TANPA TRIGGER OBSERVER LAGI
                $product->updateQuietly(['showcase_images' => $uploadedFiles]);
                
                Log::info("Files uploaded on create", [
                    'product_id' => $product->id,
                    'showcase_images_count' => count($uploadedFiles)
                ]);
                
            } catch (\Exception $e) {
                Log::error('File upload error on create: ' . $e->getMessage());
                throw $e;
            } finally {
                self::$isProcessingFiles = false;
            }
        }
    }

    /**
     * Handle file updates with proper logic to avoid duplicate uploads
     */
    public function updating(Products $product)
    {
        // Prevent double execution
        if (self::$isProcessingFiles) {
            return;
        }

        // Cek apakah ada perubahan pada showcase_images
        if (!request()->has('showcase_images')) {
            return; // Tidak ada showcase_images dalam request, skip
        }

        self::$isProcessingFiles = true;
        
        try {
            $requestFiles = request('showcase_images', []);
            $oldFiles = $product->getOriginal('showcase_images') ?? [];

            Log::info("Processing file update", [
                'product_id' => $product->id,
                'old_showcase_images_count' => count($oldFiles),
                'request_showcase_images_count' => count($requestFiles)
            ]);

            // Jika showcase_images kosong, hapus semua file lama
            if (empty($requestFiles)) {
                if (!empty($oldFiles)) {
                    $this->jsonFileUploadService->deleteMultipleFiles($oldFiles);
                }
                $product->showcase_images = [];
                return;
            }

            // Pisahkan showcase_images menjadi existing dan new showcase_images
            $existingFiles = [];
            $newFilesData = [];

            foreach ($requestFiles as $fileData) {
                if (isset($fileData['file_path']) && !isset($fileData['base64Data'])) {
                    // File existing (sudah ada di storage)
                    $existingFiles[] = $fileData;
                } elseif (isset($fileData['base64Data']) && isset($fileData['file'])) {
                    // File baru dengan base64 data
                    $newFilesData[] = $fileData;
                }
            }

            Log::info("File categorization", [
                'existing_showcase_images' => count($existingFiles),
                'new_showcase_images' => count($newFilesData)
            ]);

            // Upload file-file baru saja
            $newUploadedFiles = [];
            if (!empty($newFilesData)) {
                $newUploadedFiles = $this->jsonFileUploadService->handleJsonFileUploads(
                    $newFilesData,
                    'product'
                );

                if (count($newUploadedFiles) !== count($newFilesData)) {
                    throw new \Exception('Gagal mengupload beberapa file baru.');
                }
            }

            // Gabungkan existing showcase_images dengan newly uploaded showcase_images
            $finalFiles = array_merge($existingFiles, $newUploadedFiles);

            // Tentukan file mana yang harus dihapus
            $showcase_imagesToDelete = $this->getFilesToDelete($oldFiles, $finalFiles);
            
            // Hapus file yang tidak digunakan lagi
            if (!empty($showcase_imagesToDelete)) {
                $this->jsonFileUploadService->deleteMultipleFiles($showcase_imagesToDelete);
                Log::info('Deleted unused showcase_images', [
                    'product_id' => $product->id,
                    'deleted_count' => count($showcase_imagesToDelete)
                ]);
            }

            // Update showcase_images
            $product->showcase_images = $finalFiles;
            
            Log::info("File update completed", [
                'product_id' => $product->id,
                'final_showcase_images_count' => count($finalFiles)
            ]);

        } catch (\Exception $e) {
            Log::error('File update error: ' . $e->getMessage());
            throw $e;
        } finally {
            self::$isProcessingFiles = false;
        }
    }

    /**
     * Handle the Products "updated" event.
     */
    public function updated(Products $product): void
    {
        //
    }

    /**
     * Handle file deletion before product is deleted
     */
    public function deleting(Products $product)
    {
        // Prevent double execution
        if (self::$isProcessingFiles) {
            return;
        }

        if (!empty($product->showcase_images)) {
            self::$isProcessingFiles = true;
            
            try {
                // Refresh model to get latest data
                $product->refresh();
                
                Log::info("Attempting to delete showcase_images for product deletion", [
                    'product_id' => $product->id,
                    'showcase_images_count' => count($product->showcase_images)
                ]);
                
                $this->jsonFileUploadService->deleteMultipleFiles($product->showcase_images);
                
                Log::info("Files deleted successfully for product ID: {$product->id}");
                
            } catch (\Exception $e) {
                Log::error("Failed to delete showcase_images for product ID: {$product->id}. Error: " . $e->getMessage());
               
            } finally {
                self::$isProcessingFiles = false;
            }
        }
    }

    /**
     * Handle the Products "deleted" event.
     */
    public function deleted(Products $product): void
    {
        //
    }

    /**
     * Handle the Products "restored" event.
     */
    public function restored(Products $product): void
    {
        //
    }

    /**
     * Handle the Products "force deleted" event.
     */
    public function forceDeleted(Products $product): void
    {
        //
    }

    /**
     * Handle file uploads untuk create
     */
    private function handleFileUploads(): array
    {
        $uploadedFiles = [];

        try {
            // Check if showcase_images are UploadedFile objects or JSON data
            if (request()->hasFile('showcase_images')) {
                // Traditional file upload
                $uploadedFiles = $this->fileUploadService->handleMultipleUploads(
                    request()->file('showcase_images'),
                    'product'
                );
                
                Log::info('Traditional file upload completed', [
                    'uploaded_count' => count($uploadedFiles)
                ]);
                
            } elseif (request()->has('showcase_images') && is_array(request('showcase_images'))) {
                // JSON file data upload
                $uploadedFiles = $this->jsonFileUploadService->handleJsonFileUploads(
                    request('showcase_images'),
                    'product'
                );
                
                Log::info('JSON file upload completed', [
                    'uploaded_count' => count($uploadedFiles)
                ]);
            }

            return $uploadedFiles;

        } catch (\Exception $e) {
            Log::error('File upload error in observer: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Determine which showcase_images should be deleted
     */
    private function getFilesToDelete(array $oldFiles, array $newFiles): array
    {
        $newFilePaths = [];
        
        // Ambil semua file_path dari file baru
        foreach ($newFiles as $newFile) {
            if (isset($newFile['file_path'])) {
                $newFilePaths[] = $newFile['file_path'];
            }
        }

        $showcase_imagesToDelete = [];
        
        // Cari file lama yang tidak ada lagi di file baru
        foreach ($oldFiles as $oldFile) {
            if (isset($oldFile['file_path']) && !in_array($oldFile['file_path'], $newFilePaths)) {
                $showcase_imagesToDelete[] = $oldFile;
            }
        }

        return $showcase_imagesToDelete;
    }
}