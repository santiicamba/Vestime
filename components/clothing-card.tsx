'use client'

import Image from 'next/image'
import { X } from 'lucide-react'

export interface ClothingCardProps {
  image: string | null
  tipo: string
  color: string
  estilo: string
  onRemove?: () => void
}

export function ClothingCard({
  image,
  tipo,
  color,
  estilo,
  onRemove,
}: ClothingCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-card border border-border transition-all duration-300 hover:shadow-lg hover:border-muted">
      {/* Image Container */}
      <div className="relative aspect-square w-full bg-muted overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={`${tipo} ${color}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted/50">
            <svg
              className="w-12 h-12 text-muted-foreground/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Hover Overlay with Remove Button */}
        {onRemove && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              onClick={onRemove}
              className="p-2 rounded-full bg-red-500/80 hover:bg-red-600 text-white transition-colors"
              aria-label="Eliminar prenda"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Text Information */}
      <div className="p-4 space-y-2">
        <div className="flex flex-wrap gap-2">
          <span className="px-2.5 py-1 rounded-full bg-secondary/50 text-secondary-foreground text-xs font-medium">
            {tipo}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-secondary/50 text-secondary-foreground text-xs font-medium">
            {color}
          </span>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium">ESTILO</p>
          <p className="text-sm font-medium text-foreground capitalize">{estilo}</p>
        </div>
      </div>
    </div>
  )
}
