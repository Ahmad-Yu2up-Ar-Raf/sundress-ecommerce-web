import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from "lucide-react"
import { useFileUpload } from "@/hooks/use-file-upload"
import { Button } from "../../shadcn-ui/button"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import MediaItem from "../MediaItem"

interface PictureImageInputProps {
  value?: File | string | null
  onChange?: (file: File | string | null) => void
  disabled?: boolean
  defaultValue?: string | File
  error?: string
}

const PictureImageInput = forwardRef<HTMLInputElement, PictureImageInputProps>(
  ({ value, onChange, disabled, defaultValue, error, ...props }, ref) => {
    const maxSizeMB = 2
    const maxSize = maxSizeMB * 1024 * 1024 // 2MB default
    
    // State untuk track apakah user sudah upload file baru
    const [hasNewFile, setHasNewFile] = useState(false)

    const [
      { files, isDragging, errors },
      {
        handleDragEnter,
        handleDragLeave,
        handleDragOver,
        handleDrop,
        openFileDialog,
        removeFile,
        getInputProps,
      },
    ] = useFileUpload({
      accept: "image/svg+xml,image/png,image/jpeg,image/jpg,image/gif",
      maxSize,
    })

    // Get preview URL
    const previewUrl = (() => {
      // Jika ada file baru yang diupload, prioritaskan itu
      if (files[0]?.preview) {
        return files[0].preview
      }
      
      // Jika value adalah File object (upload baru)
      if (value instanceof File) {
        return URL.createObjectURL(value)
      }
      
      // Jika value adalah string dan belum ada file baru, gunakan value
      if (typeof value === 'string' && value && !hasNewFile) {
        return value
      }
      
      // Fallback ke defaultValue
      if (defaultValue && !hasNewFile) {
        return defaultValue
      }
      
      return null
    })()
    
    const fileName = files[0]?.file.name || 
                    (value instanceof File ? value.name : null) || 
                    null

    // Expose the input element ref
    useImperativeHandle(ref, () => {
      const inputRef = getInputProps()?.ref
      const element = inputRef && 'current' in inputRef ? inputRef.current : null
      if (!element) {
        throw new Error('Input element not found')
      }
      return element
    })

    // Handle file changes and notify parent component
    useEffect(() => {
      if (files.length > 0 && onChange) {
        setHasNewFile(true)
        if (files[0].file instanceof File) {
          onChange(files[0].file)
        }
      }
    }, [files, onChange])

    // Handle remove file
    const handleRemoveFile = () => {
      if (files[0]) {
        removeFile(files[0].id)
      }
      setHasNewFile(true)
      if (onChange) {
        onChange(null)
      }
    }

    // Reset hasNewFile dan files ketika form di-reset atau value berubah dari luar
    useEffect(() => {
      if (value === null || value === undefined) {
        setHasNewFile(false)
        // Clear all files from internal state
        files.forEach(file => removeFile(file.id))
      } else if (typeof value === 'string' && files.length === 0) {
        setHasNewFile(false)
      }
    }, [value, files, removeFile])

    // Display errors from either the hook or parent component
    const displayErrors = [...errors, ...(error ? [error] : [])]

    return (
      <div className="flex flex-col gap-2">
        <div className="relative">
          {/* Drop area */}
          <div
            onDragEnter={disabled ? undefined : handleDragEnter}
            onDragLeave={disabled ? undefined : handleDragLeave}
            onDragOver={disabled ? undefined : handleDragOver}
            onDrop={disabled ? undefined : handleDrop}
            data-dragging={!disabled && (isDragging || undefined)}
            data-disabled={disabled || undefined}
            className="border-input data-[dragging=true]:bg-accent/50 data-[disabled=true]:opacity-50 data-[disabled=true]:cursor-not-allowed has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-[input:focus]:ring-[3px]"
          >
            <input
              {...getInputProps()}
              className="sr-only"
              aria-label="Upload image file"
              disabled={disabled}
              {...props}
            />
            {previewUrl ? (
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <MediaItem
                  webViewLink={`${previewUrl}`}
                 
                  className="mx-auto max-h-full rounded object-contain"
                
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                <div
                  className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                  aria-hidden="true"
                >
                  <ImageIcon className="size-4 opacity-60" />
                </div>
                <p className="mb-1.5 text-sm font-medium">Drop your image here</p>
                <p className="text-muted-foreground text-xs">
                  SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  disabled={disabled}
                  onClick={openFileDialog}
                >
                  <UploadIcon
                    className="-ms-1 size-4 opacity-60"
                    aria-hidden="true"
                  />
                  Select image
                </Button>
              </div>
            )}
          </div>

          {previewUrl && !disabled && (
            <div className="absolute top-4 right-4">
              <Button
                type="button"
                className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
                onClick={handleRemoveFile}
                aria-label="Remove image"
              >
                <XIcon className="size-4" aria-hidden="true" />
              </Button>
            </div>
          )}
        </div>

        {displayErrors.length > 0 && (
          <div
            className="text-destructive flex items-center gap-1 text-xs"
            role="alert"
          >
            <AlertCircleIcon className="size-3 shrink-0" />
            <span>{displayErrors[0]}</span>
          </div>
        )}
        
        {/* Debug info - hapus ini di production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs text-gray-500 sr-only mt-2">
            <div>Value type: {typeof value}</div>
            <div>Has new file: {hasNewFile.toString()}</div>
            <div>Files count: {files.length}</div>
            <div>Preview URL: {previewUrl ? 'exists' : 'null'}</div>
          </div>
        )}
      </div>
    )
  }
)

PictureImageInput.displayName = "PictureImageInput"

export default PictureImageInput