"use client"

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Video, X } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'

interface VideoUploadProps {
  projectId: string
  onUploadComplete?: (video: any) => void
}

export function VideoUpload({ projectId, onUploadComplete }: VideoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true)

    for (const file of acceptedFiles) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('projectId', projectId)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Upload failed')
        }

        const { video } = await response.json()
        setUploadedFiles(prev => [...prev, video])

        if (onUploadComplete) {
          onUploadComplete(video)
        }
      } catch (error) {
        console.error('Upload error:', error)
        alert('Failed to upload file')
      }
    }

    setUploading(false)
    setUploadProgress(0)
  }, [projectId, onUploadComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm']
    },
    multiple: true,
  })

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
              transition-colors duration-200
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}
            `}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Upload className="w-8 h-8 text-primary" />
              </div>

              {isDragActive ? (
                <p className="text-lg font-medium">Drop videos here...</p>
              ) : (
                <>
                  <div>
                    <p className="text-lg font-medium mb-1">
                      Drop videos here or click to browse
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supports MP4, MOV, AVI, MKV, WebM
                    </p>
                  </div>
                  <Button type="button" variant="outline">
                    Choose Files
                  </Button>
                </>
              )}
            </div>
          </div>

          {uploading && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Uploading...</span>
                <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium">Uploaded Videos</h3>
          <div className="grid gap-2">
            {uploadedFiles.map((file, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded">
                        <Video className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{file.originalName}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                          {file.duration && ` • ${file.duration.toFixed(1)}s`}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
