import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { Controller } from "react-hook-form" 
import {
  AlertCircleIcon,
  FileArchiveIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HeadphonesIcon,
  ImageIcon,
  LoaderCircle,
  LoaderIcon,
  Trash2Icon,
  UploadIcon,
  VideoIcon,
  XIcon,
} from "lucide-react"

import {
  FileMetadata,
  formatBytes,
  useFileUpload,
  type FileWithPreview,
} from "@/hooks/use-files-upload"
import { Button } from "../../shadcn-ui/button"
import { cn } from "@/lib/utils"

import { Progress } from "@/components/ui/fragments/shadcn-ui/progress"

// Type for tracking upload progress
type UploadProgress = {
  fileId: string
  progress: number
  completed: boolean
}

const getFileIcon = (file: { file: File | { type: string; name: string } }) => {
  const fileType = file.file instanceof File ? file.file.type : file.file.type
  const fileName = file.file instanceof File ? file.file.name : file.file.name

  const iconMap = {
    pdf: {
      icon: FileTextIcon,
      conditions: (type: string, name: string) =>
        type.includes("pdf") ||
        name.endsWith(".pdf") ||
        type.includes("word") ||
        name.endsWith(".doc") ||
        name.endsWith(".docx"),
    },
    archive: {
      icon: FileArchiveIcon,
      conditions: (type: string, name: string) =>
        type.includes("zip") ||
        type.includes("archive") ||
        name.endsWith(".zip") ||
        name.endsWith(".rar"),
    },
    excel: {
      icon: FileSpreadsheetIcon,
      conditions: (type: string, name: string) =>
        type.includes("excel") ||
        name.endsWith(".xls") ||
        name.endsWith(".xlsx"),
    },
    video: {
      icon: VideoIcon,
      conditions: (type: string) => type.includes("video/"),
    },
    audio: {
      icon: HeadphonesIcon,
      conditions: (type: string) => type.includes("audio/"),
    },
    image: {
      icon: ImageIcon,
      conditions: (type: string) => type.startsWith("image/"),
    },
  }

  for (const { icon: Icon, conditions } of Object.values(iconMap)) {
    if (conditions(fileType, fileName)) {
      return <Icon className="size-5 opacity-60" />
    }
  }

  return <FileIcon className="size-5 opacity-60" />
}

// Function to simulate file upload with more realistic timing and progress
const simulateUpload = (
  totalBytes: number,
  onProgress: (progress: number) => void,
  onComplete: () => void
) => {
  let timeoutId: NodeJS.Timeout
  let uploadedBytes = 0
  let lastProgressReport = 0

  const simulateChunk = () => {
    const chunkSize = Math.floor(Math.random() * 300000) + 2000
    uploadedBytes = Math.min(totalBytes, uploadedBytes + chunkSize)

    const progressPercent = Math.floor((uploadedBytes / totalBytes) * 100)

    if (progressPercent > lastProgressReport) {
      lastProgressReport = progressPercent
      onProgress(progressPercent)
    }

    if (uploadedBytes < totalBytes) {
      const delay = Math.floor(Math.random() * 450) + 50
      const extraDelay = Math.random() < 0.05 ? 500 : 0

      timeoutId = setTimeout(simulateChunk, delay + extraDelay)
    } else {
      onComplete()
    }
  }

  timeoutId = setTimeout(simulateChunk, 100)

  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }
}

// Helper function untuk convert existing file URLs ke base64 (untuk update)
const urlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        const base64 = result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error('Error converting URL to base64:', error)
    throw error
  }
}

// Define props for our FormFileUpload component
interface FormFileUploadProps {
  control: any // react-hook-form control
  name: string // field name
  label?: string
  description?: string
  maxSizeMB?: number
  maxFiles?: number
  isLoading?: boolean
  isPending?: boolean
  initialFiles?: FileWithPreview[]
}

// Export interface for ref methods
export interface FileUploadRef {
  clearFiles: () => void;
}




const FormFileUpload = forwardRef<FileUploadRef, FormFileUploadProps>(({
  control,
  name,
  isLoading,
  isPending,
  initialFiles = [],
  label = "Files",
  description,
  maxSizeMB = 5,
  maxFiles = 6,
}, ref) => {
  const maxSize = maxSizeMB * 1024 * 1024
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([])
  const [processedInitialFiles, setProcessedInitialFiles] = useState<FileWithPreview[]>(initialFiles)

  // Process initial files untuk menambahkan base64Data jika belum ada
 


console.log(initialFiles[0])

  const handleFilesAdded = (addedFiles: FileWithPreview[]) => {
    const newProgressItems = addedFiles.map((file) => ({
      fileId: file.id,
      progress: 0,
      completed: false,
    }))

    setUploadProgress((prev) => [...prev, ...newProgressItems])
    const cleanupFunctions: Array<() => void> = []

    addedFiles.forEach((file) => {
      const fileSize =
        file.file instanceof File ? file.file.size : file.file.size

      const cleanup = simulateUpload(
        fileSize,
        (progress) => {
          setUploadProgress((prev) =>
            prev.map((item) =>
              item.fileId === file.id ? { ...item, progress } : item
            )
          )
        },
        () => {
          setUploadProgress((prev) =>
            prev.map((item) =>
              item.fileId === file.id ? { ...item, completed: true } : item
            )
          )
        }
      )

      cleanupFunctions.push(cleanup)
    })

    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup())
    }
  }

  const handleFileRemoved = (fileId: string) => {
    setUploadProgress((prev) => prev.filter((item) => item.fileId !== fileId))
  }
console.log(initialFiles)
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const [
          { files, isDragging, errors: fileErrors },
          {
            handleDragEnter,
            handleDragLeave,
            handleDragOver,
            handleDrop,
            openFileDialog,
            removeFile,
            clearFiles,
            getInputProps,
          },
        ] = useFileUpload({
          multiple: true,
          maxFiles,
          maxSize,
          onFilesAdded: (newFiles) => {
            handleFilesAdded(newFiles)
            // Update the form field value when files change
            field.onChange(newFiles)
            return () => {} // cleanup function
          },
          initialFiles: processedInitialFiles, // Gunakan processed initial files
        })

        // Expose clearFiles through ref
        useImperativeHandle(ref, () => ({
          clearFiles: () => {
            setUploadProgress([])
            clearFiles()
            field.onChange([]) // Clear the form value
          }
        }))

        // Update form value when files change
        useEffect(() => {
          field.onChange(files)
        }, [files])

        return (
          <div className={cn("flex flex-col gap-2",
            isLoading || isPending && " opacity-60"
          )}>
            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              data-dragging={isDragging || undefined}
              data-files={files.length > 0 || undefined}
              className={cn("border-input w-full data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]",
                fieldState.error && " ring-2 ring-red-500/20 dark:border-red-900 "
              )}
            >
              <input
                {...getInputProps()}
                className="sr-only"
                aria-label="Upload image file"
              />
              {files.length > 0 ? (
                <div className="flex w-full flex-col gap-3 ">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate text-sm font-medium">
                      Files ({files.length})
                    </h3>
                    <div className="flex gap-2">
                      <Button type="button" disabled={isLoading || isPending} variant="outline" size="sm" onClick={openFileDialog}>
                      {(isLoading || isPending ) ? (
                         <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                       ) : (
                        <UploadIcon
                        className="-ms-0.5 size-3.5 opacity-60"
                        aria-hidden="true"
                      />
                       ) }
                        Add files
                      </Button>
                      <Button
                      disabled={isLoading || isPending} 
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setUploadProgress([])
                          clearFiles()
                          field.onChange([]) // Clear the form value
                        }}
                      >
                             {(isLoading || isPending ) ? (
                                <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                               ) : (
                                <Trash2Icon
                                className="-ms-0.5 size-3.5 opacity-60"
                                aria-hidden="true"
                              />
                               ) }
                        Remove all
                      </Button>
                    </div>
                  </div>

                  <div className="w-full space-y-2">
                    {files.map((file) => {
                      const fileProgress = uploadProgress.find(
                        (p) => p.fileId === file.id
                      )
                      const isUploading = fileProgress && !fileProgress.completed

                      return (
                        <div
                          key={file.id}
                          data-uploading={isUploading || undefined}
                          className="bg-background max-w-full overflow-x-hidden flex flex-col gap-1 rounded-xl border p-2 pe-3 transition-opacity duration-300"
                        >
                          <div className={cn("flex items-center justify-between gap-2 " ,  isLoading || isPending && " opacity-55 ")}>
                            <div className="flex flex-wrap items-center gap-3 overflow-hidden in-data-[uploading=true]:opacity-50">
                              <div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded border">
                                {getFileIcon(file)}
                              </div>
                              <div className="flex min-w-0 flex-col gap-0.5">
                                <p className="truncate text-[13px] font-medium">
                                  {`${file.file.name.substring(0, 20)}...`
                                    }
                                </p>
                                <p className="text-muted-foreground text-xs">
                                  {formatBytes(
                                    file.file instanceof File
                                      ? file.file.size
                                      : file.file.size
                                  )}
                                </p>
                                {/* Debug info - hapus di production */}
                                <p className="text-xs sr-only text-blue-500">
                                  Base64: {file.base64Data ? 'Available' : 'Missing'}
                                </p>
                              </div>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-muted-foreground/80 sticky hover:text-foreground -me-2 size-8 hover:bg-transparent"
                              onClick={() => {
                                handleFileRemoved(file.id)
                                removeFile(file.id)
                              }}
                              disabled={isLoading || isPending}
                              aria-label="Remove file"
                            >
                              <XIcon className="size-4" aria-hidden="true" />
                            </Button>
                          </div>

                          {fileProgress &&
                            (() => {
                              const progress = fileProgress.progress || 0
                              const completed = fileProgress.completed || false

                              if (completed) return null

                              return (
                                <div className="mt-1 flex items-center gap-2">
                                  <Progress value={progress} className="h-1 w-full" />
                                  <span className="text-muted-foreground w-10 text-xs tabular-nums">
                                    {progress}%
                                  </span>
                                </div>
                              )
                            })()}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                  <div
                    className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                    aria-hidden="true"
                  >
                    <ImageIcon className="size-4 opacity-60" />
                  </div>
                  <p className="mb-1.5 text-sm font-medium">Drop your files here</p>
                  <p className="text-muted-foreground text-xs">
                    Max {maxFiles} files ∙ Up to {maxSizeMB}MB
                  </p>
                  <Button type="button" variant="outline" className="mt-4" onClick={openFileDialog}>
                    <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
                    Select files
                  </Button>
                </div>
              )}
            </div>

            {fileErrors.length > 0 && (
              <div
                className="dark:text-red-500 text-red-900 flex items-center gap-1 text-sm"
                role="alert"
              >
                <AlertCircleIcon className="size-3 shrink-0" />
                <span>{fileErrors[0]}</span>
              </div>
            )}

            {/* Display form validation errors */}
            {fieldState.error && (
              <div
                className="dark:text-red-500 text-red-900 flex items-center gap-1 text-sm"
                role="alert"
              >
                <AlertCircleIcon className="size-3 shrink-0" />
                <span>{fieldState.error.message}</span>
              </div>
            )}
          </div>
        )
      }}
    />
  )
})

FormFileUpload.displayName = "FormFileUpload"

export default FormFileUpload