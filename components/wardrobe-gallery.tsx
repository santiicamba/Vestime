'use client'

import Image from 'next/image'
import type { ClothingItem } from '@/lib/types'

interface WardrobeGalleryProps {
  items?: ClothingItem[]
}

export function WardrobeGallery({ items = [] }: WardrobeGalleryProps) {
  return (
    <section
      id="wardrobe-gallery"
      className="w-full py-20 md:py-28 px-4 md:px-8 scroll-mt-8"
      style={{
        background:
          'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%), repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.02) 35px, rgba(255,255,255,.02) 70px)',
      }}
      aria-label="Galería de guardarropa"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-foreground mb-4">
            Mi Guardarropa
          </h2>
          <p className="text-lg font-light text-muted-foreground">
            {items.length} items en tu colección
          </p>
        </div>

        {/* Grid */}
        {items.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col overflow-hidden transition-all duration-300 cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative w-full aspect-square bg-card rounded-lg overflow-hidden mb-4 shadow-sm group-hover:shadow-lg transition-all duration-300">
                  {item.imagePreview ? (
                    <Image
                      src={item.imagePreview}
                      alt={`${item.tipo} ${item.color}`}
                      fill
                      crossOrigin="anonymous"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground text-sm font-light">
                        No image
                      </span>
                    </div>
                  )}

                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-foreground text-sm font-light px-3 py-1 bg-black/60 rounded-full">
                      Edit
                    </span>
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex flex-col gap-1">
                  <p className="text-foreground font-light text-sm md:text-base group-hover:text-accent-foreground transition-colors duration-300">
                    {item.tipo} <span className="text-muted-foreground">•</span>{' '}
                    <span className="text-muted-foreground">{item.color}</span>
                  </p>
                  <p className="text-muted-foreground font-light text-xs md:text-sm group-hover:text-foreground transition-colors duration-300">
                    {item.estilo}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-foreground text-lg font-light mb-4">
                Tu guardarropa está vacío
              </p>
              <p className="text-muted-foreground font-light">
                Comienza a agregar prendas para empezar
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
