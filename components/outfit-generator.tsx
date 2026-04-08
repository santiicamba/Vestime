'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { RefreshCw, Sparkles, ShirtIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

// Curated monochromatic outfit sets — neutrals/grayscale palette
const OUTFIT_SETS = [
  [
    {
      id: 'a1',
      label: 'Remera',
      src: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=700&fit=crop',
      size: 'large',
    },
    {
      id: 'a2',
      label: 'Pantalón',
      src: 'https://images.unsplash.com/photo-1542272604-787c62bde4f5?w=600&h=700&fit=crop',
      size: 'large',
    },
    {
      id: 'a3',
      label: 'Zapatillas',
      src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=500&fit=crop',
      size: 'small',
    },
    {
      id: 'a4',
      label: 'Buzo',
      src: 'https://images.unsplash.com/photo-1556821552-7f41c5d440db?w=600&h=500&fit=crop',
      size: 'small',
    },
  ],
  [
    {
      id: 'b1',
      label: 'Camisa',
      src: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=700&fit=crop',
      size: 'large',
    },
    {
      id: 'b2',
      label: 'Chaqueta',
      src: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=600&h=700&fit=crop',
      size: 'large',
    },
    {
      id: 'b3',
      label: 'Pantalón',
      src: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=500&fit=crop',
      size: 'small',
    },
    {
      id: 'b4',
      label: 'Zapatos',
      src: 'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=600&h=500&fit=crop',
      size: 'small',
    },
  ],
  [
    {
      id: 'c1',
      label: 'Vestido',
      src: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=700&fit=crop',
      size: 'large',
    },
    {
      id: 'c2',
      label: 'Tapado',
      src: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=700&fit=crop',
      size: 'large',
    },
    {
      id: 'c3',
      label: 'Bolso',
      src: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=500&fit=crop',
      size: 'small',
    },
    {
      id: 'c4',
      label: 'Botas',
      src: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&h=500&fit=crop',
      size: 'small',
    },
  ],
]

const ACCESSORY_ITEMS = [
  {
    id: 'acc1',
    label: 'Reloj',
    src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
  },
  {
    id: 'acc2',
    label: 'Gorra',
    src: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop',
  },
]

type OutfitItem = {
  id: string
  label: string
  src: string
  size: string
}

export function OutfitGenerator() {
  const [generated, setGenerated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [includeAccs, setIncludeAccs] = useState(false)
  const [outfitIndex, setOutfitIndex] = useState(0)
  const [animating, setAnimating] = useState(false)

  const triggerGenerate = useCallback(
    (nextIndex?: number) => {
      setLoading(true)
      setAnimating(true)
      setTimeout(() => {
        const next =
          nextIndex !== undefined
            ? nextIndex
            : (outfitIndex + 1) % OUTFIT_SETS.length
        setOutfitIndex(next)
        setGenerated(true)
        setLoading(false)
        setTimeout(() => setAnimating(false), 50)
      }, 800)
    },
    [outfitIndex]
  )

  const handleGenerate = () => triggerGenerate(outfitIndex)
  const handleRetry = () => triggerGenerate()

  const currentOutfit: OutfitItem[] = OUTFIT_SETS[outfitIndex]
  const displayItems: OutfitItem[] = includeAccs
    ? [...currentOutfit, ...ACCESSORY_ITEMS]
    : currentOutfit

  const largeItems = displayItems.filter((i) => i.size === 'large')
  const smallItems = displayItems.filter(
    (i) => i.size === 'small' || i.size === undefined
  )

  return (
    <section
      id="outfit-generator"
      className="w-full py-20 md:py-28 px-4 md:px-8"
      style={{
        background:
          'radial-gradient(ellipse at 20% 50%, #1c1c1c 0%, #0a0a0a 60%)',
      }}
      aria-label="Generador de outfits"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <p className="text-xs font-medium tracking-widest text-[#505050] uppercase mb-3">
            AI Styling
          </p>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-foreground text-balance">
            Generador de Outfits
          </h2>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-12">
          {/* Primary CTA */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={cn(
              'group flex items-center gap-3 rounded-full px-8 py-4 text-base font-light transition-all duration-300',
              loading
                ? 'bg-[#1a1a1a] text-[#505050] cursor-wait'
                : 'bg-foreground text-background hover:bg-foreground/90 active:scale-95'
            )}
            aria-label="Generar outfit del día"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12 duration-300" />
                {generated ? 'Regenerar outfit' : '¿Qué me pongo hoy?'}
              </>
            )}
          </button>

          {/* Accessories Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-light text-[#a0a0a0]">
              Incluir accesorios
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={includeAccs}
              onClick={() => setIncludeAccs((v) => !v)}
              className={cn(
                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 focus-visible:outline-none',
                includeAccs
                  ? 'bg-foreground border-foreground'
                  : 'bg-transparent border-[#404040]'
              )}
            >
              <span
                className={cn(
                  'pointer-events-none inline-block h-4 w-4 rounded-full shadow-sm transition-transform duration-200 mt-[1px]',
                  includeAccs
                    ? 'translate-x-5 bg-background'
                    : 'translate-x-0.5 bg-[#404040]'
                )}
              />
              <span className="sr-only">Incluir accesorios</span>
            </button>
            <span
              className={cn(
                'text-xs font-medium tracking-wide transition-colors duration-200',
                includeAccs ? 'text-foreground' : 'text-[#505050]'
              )}
            >
              {includeAccs ? 'Sí' : 'No'}
            </span>
          </div>
        </div>

        {/* Output — Collage Grid */}
        {!generated && !loading && (
          <div className="flex items-center justify-center rounded-2xl border border-dashed border-[#242424] min-h-80 bg-[#0f0f0f]">
            <div className="flex flex-col items-center gap-4 text-center px-8">
              <div className="w-14 h-14 rounded-2xl bg-[#1a1a1a] flex items-center justify-center">
                <ShirtIcon className="w-6 h-6 text-[#404040]" />
              </div>
              <p className="text-[#404040] font-light text-base">
                Presioná el botón para generar tu outfit del día
              </p>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center rounded-2xl border border-dashed border-[#242424] min-h-80 bg-[#0f0f0f]">
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-[#404040] animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
              <p className="text-[#505050] font-light text-sm">
                Combinando prendas...
              </p>
            </div>
          </div>
        )}

        {generated && !loading && (
          <div
            className={cn(
              'transition-opacity duration-500',
              animating ? 'opacity-0' : 'opacity-100'
            )}
          >
            {/* Collage layout — asymmetric Whering-style */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 auto-rows-auto">
              {/* Large items — span taller */}
              {largeItems.map((item, i) => (
                <div
                  key={item.id}
                  className={cn(
                    'group relative rounded-2xl overflow-hidden bg-[#111111] shadow-lg hover:shadow-2xl hover:shadow-black/60 transition-all duration-400',
                    i === 0 ? 'row-span-2' : 'row-span-2',
                    'aspect-[3/4]'
                  )}
                  style={{
                    gridColumn: i === 0 ? '1' : '2',
                    gridRow: '1 / 3',
                  }}
                >
                  <Image
                    src={item.src}
                    alt={item.label}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  {/* Subtle bottom vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>
              ))}

              {/* Small items — stack in third column */}
              {smallItems.map((item, i) => (
                <div
                  key={item.id}
                  className="group relative rounded-2xl overflow-hidden bg-[#111111] shadow-md hover:shadow-xl hover:shadow-black/50 transition-all duration-400 aspect-square"
                  style={{
                    gridColumn: '3',
                    gridRow: i + 1,
                  }}
                >
                  <Image
                    src={item.src}
                    alt={item.label}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                </div>
              ))}
            </div>

            {/* Retry + Save row */}
            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={handleRetry}
                className="group flex items-center gap-2 rounded-full border border-[#2a2a2a] px-6 py-3 text-sm font-light text-[#a0a0a0] hover:border-[#404040] hover:text-foreground transition-all duration-200 active:scale-95"
                aria-label="Reintentar generación de outfit"
              >
                <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                Reintentar
              </button>

              <button className="flex items-center gap-2 rounded-full border border-[#2a2a2a] px-6 py-3 text-sm font-light text-[#a0a0a0] hover:border-[#404040] hover:text-foreground transition-all duration-200 active:scale-95">
                Guardar outfit
              </button>

              <span className="ml-auto text-xs font-light text-[#404040] tracking-wide">
                Combinación #{outfitIndex + 1} de {OUTFIT_SETS.length}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
