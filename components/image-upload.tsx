'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ImageUploadProps {
  onImageSelected: (file: File) => void
  preview?: string | null
  onPreviewRemove?: () => void
  disabled?: boolean
  className?: string
}

export function ImageUpload({
  onImageSelected,
  preview,
  onPreviewRemove,
  disabled = false,
  className,
}: ImageUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) setIsDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    if (disabled) return

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        onImageSelected(file)
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageSelected(e.target.files[0])
    }
  }

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className={cn('w-full space-y-3', className)}>
      {!preview ? (
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick}
          className={cn(
            'relative w-full aspect-square rounded-lg border-2 border-dashed transition-all duration-300 cursor-pointer flex items-center justify-center',
            isDragActive
              ? 'border-primary bg-primary/10 scale-[1.02]'
              : 'border-border bg-secondary/20 hover:bg-secondary/30 hover:border-muted',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={disabled}
            className="hidden"
            aria-label="Subir imagen de prenda"
          />

          <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
            <Upload className="w-8 h-8 text-muted-foreground transition-transform duration-300 group-hover:scale-110" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Arrastra tu imagen aquí
              </p>
              <p className="text-xs text-muted-foreground">
                o haz clic para seleccionar
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-secondary/20 border border-border group">
          <Image
            src={preview}
            alt="Previsualización"
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              onClick={handleClick}
              disabled={disabled}
              className="p-2 rounded-full bg-blue-500/80 hover:bg-blue-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Cambiar imagen"
            >
              <Upload className="w-5 h-5" />
            </button>
            {onPreviewRemove && (
              <button
                onClick={onPreviewRemove}
                disabled={disabled}
                className="p-2 rounded-full bg-red-500/80 hover:bg-red-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Eliminar imagen"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
