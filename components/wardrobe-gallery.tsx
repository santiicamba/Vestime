'use client'

import type { ClothingItem } from '@/lib/types'
import { ClothingCard } from '@/components/clothing-card'

interface WardrobeGalleryProps {
  items?: ClothingItem[]
  onRemoveItem?: (id: string) => void
}

export function WardrobeGallery({ items = [], onRemoveItem }: WardrobeGalleryProps) {
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
              <ClothingCard
                key={item.id}
                image={item.image ?? null}
                tipo={item.tipo}
                color={item.color}
                estilo={item.estilo}
                onRemove={onRemoveItem ? () => onRemoveItem(item.id) : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-foreground text-lg font-light mb-3">
                Tu guardarropa est&aacute; vac&iacute;o
              </p>
              <p className="text-muted-foreground font-light mb-8">
                Comenzá a agregar prendas para empezar
              </p>
              <button
                type="button"
                onClick={() =>
                  document.getElementById('upload-form')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="rounded-full px-8 py-3 text-sm font-light bg-foreground text-background hover:bg-foreground/90 transition-all duration-300"
              >
                Agregar prendas
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
