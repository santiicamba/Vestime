'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { RefreshCw, Sparkles, ShirtIcon, AlertCircle, CheckCircle2, CloudSun } from 'lucide-react'
import { cn } from '@/lib/utils'

// Sample wardrobe items to send to API
const WARDROBE_ITEMS = [
  { id: '1', tipo: 'Remera', color: 'Negro', estilo: 'Casual', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=700&fit=crop' },
  { id: '2', tipo: 'Pantalón', color: 'Azul Oscuro', estilo: 'Casual', image: 'https://images.unsplash.com/photo-1542272604-787c62bde4f5?w=600&h=700&fit=crop' },
  { id: '3', tipo: 'Zapatillas', color: 'Blanco', estilo: 'Casual', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=500&fit=crop' },
  { id: '4', tipo: 'Buzo', color: 'Gris', estilo: 'Deportivo', image: 'https://images.unsplash.com/photo-1556821552-7f41c5d440db?w=600&h=500&fit=crop' },
  { id: '5', tipo: 'Camisa', color: 'Blanco', estilo: 'Formal', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=700&fit=crop' },
  { id: '6', tipo: 'Chaqueta', color: 'Negro', estilo: 'Elegante', image: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=600&h=700&fit=crop' },
  { id: '7', tipo: 'Vestido', color: 'Negro', estilo: 'Elegante', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=700&fit=crop' },
  { id: '8', tipo: 'Tapado', color: 'Gris', estilo: 'Elegante', image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=700&fit=crop' },
]

const ACCESSORY_ITEMS = [
  { id: 'acc1', tipo: 'Reloj', color: 'Plata', estilo: 'Elegante', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop' },
  { id: 'acc2', tipo: 'Gorra', color: 'Negro', estilo: 'Casual', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop' },
]

// Fallback outfit sets for when API fails
const FALLBACK_OUTFIT_SETS = [
  ['1', '2', '3', '4'],
  ['5', '6', '2', '3'],
  ['7', '8', 'acc1'],
]

type OutfitItem = {
  id: string
  tipo: string
  color: string
  estilo: string
  image: string
  reason?: string
}

type GenerationStatus = 'idle' | 'loading' | 'success' | 'error'

export function OutfitGenerator() {
  const [status, setStatus] = useState<GenerationStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [includeAccs, setIncludeAccs] = useState(false)
  const [includeWeather, setIncludeWeather] = useState(false)
  const [generatedOutfit, setGeneratedOutfit] = useState<OutfitItem[]>([])
  const [outfitPalette, setOutfitPalette] = useState<string>('')
  const [outfitOccasion, setOutfitOccasion] = useState<string>('')
  const [animating, setAnimating] = useState(false)
  const [fallbackIndex, setFallbackIndex] = useState(0)

  const findItemById = (id: string): OutfitItem | undefined => {
    const allItems = [...WARDROBE_ITEMS, ...ACCESSORY_ITEMS]
    const item = allItems.find((i) => i.id === id)
    if (item) return { ...item, image: item.image }
    return undefined
  }

  const generateOutfit = useCallback(async () => {
    setStatus('loading')
    setErrorMessage(null)
    setAnimating(true)

    try {
      const itemsToSend = includeAccs
        ? [...WARDROBE_ITEMS, ...ACCESSORY_ITEMS]
        : WARDROBE_ITEMS

      const response = await fetch('/api/outfit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_preferences: {
            estilo: 'Casual',
          },
          weather_data: includeWeather
            ? { active: true, temp: 18, condition: 'Partly cloudy' }
            : { active: false },
          wardrobe_items: itemsToSend,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate outfit')
      }

      const data = await response.json()

      if (data.success && data.outfit && data.outfit.length > 0) {
        // Map API response to our item structure
        const outfitItems: OutfitItem[] = data.outfit
          .map((apiItem: { id: string; tipo: string; color: string; estilo: string; reason?: string }) => {
            const localItem = findItemById(apiItem.id)
            if (localItem) {
              return { ...localItem, reason: apiItem.reason }
            }
            // For fallback items that don't have images
            return {
              id: apiItem.id,
              tipo: apiItem.tipo,
              color: apiItem.color,
              estilo: apiItem.estilo,
              image: `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop`,
              reason: apiItem.reason,
            }
          })
          .filter(Boolean)

        setGeneratedOutfit(outfitItems)
        setOutfitPalette(data.palette || 'Monochromatic')
        setOutfitOccasion(data.occasion || 'Everyday')
        setStatus('success')
      } else {
        throw new Error('Invalid response from API')
      }
    } catch (error) {
      console.error('[v0] Outfit generation failed:', error)
      
      // Use fallback local generation
      const fallbackIds = FALLBACK_OUTFIT_SETS[fallbackIndex % FALLBACK_OUTFIT_SETS.length]
      const fallbackItems = fallbackIds
        .map((id) => findItemById(id))
        .filter((item): item is OutfitItem => item !== undefined)

      if (includeAccs) {
        fallbackItems.push(...ACCESSORY_ITEMS.map((a) => ({ ...a, image: a.image })))
      }

      setGeneratedOutfit(fallbackItems)
      setOutfitPalette('Monochromatic grayscale')
      setOutfitOccasion('Everyday casual')
      setFallbackIndex((prev) => prev + 1)
      setStatus('error')
      setErrorMessage('AI no disponible - usando combinación local')
    } finally {
      setTimeout(() => setAnimating(false), 100)
    }
  }, [includeAccs, includeWeather, fallbackIndex])

  const handleRetry = () => {
    setFallbackIndex((prev) => prev + 1)
    generateOutfit()
  }

  // Categorize items for grid layout
  const mainItems = generatedOutfit.filter((item) =>
    ['Remera', 'Camisa', 'Pantalón', 'Vestido', 'Chaqueta', 'Tapado', 'Buzo'].includes(item.tipo)
  )
  const smallItems = generatedOutfit.filter((item) =>
    ['Zapatillas', 'Reloj', 'Gorra', 'Bolso', 'Botas'].includes(item.tipo)
  )

  return (
    <section
      id="outfit-generator"
      className="w-full py-20 md:py-28 px-4 md:px-8"
      style={{
        background: 'radial-gradient(ellipse at 20% 50%, #1c1c1c 0%, #0a0a0a 60%)',
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
        <div className="flex flex-col gap-6 mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Primary CTA */}
            <button
              onClick={generateOutfit}
              disabled={status === 'loading'}
              className={cn(
                'group flex items-center gap-3 rounded-full px-8 py-4 text-base font-light transition-all duration-300',
                status === 'loading'
                  ? 'bg-[#1a1a1a] text-[#505050] cursor-wait'
                  : 'bg-foreground text-background hover:bg-foreground/90 active:scale-95'
              )}
              aria-label="Generar outfit del día"
            >
              {status === 'loading' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generando con IA...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12 duration-300" />
                  {generatedOutfit.length > 0 ? 'Regenerar outfit' : '¿Qué me pongo hoy?'}
                </>
              )}
            </button>

            {/* Toggles */}
            <div className="flex flex-wrap items-center gap-6">
              {/* Accessories Toggle */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-light text-[#a0a0a0]">Accesorios</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={includeAccs}
                  onClick={() => setIncludeAccs((v) => !v)}
                  className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 focus-visible:outline-none',
                    includeAccs ? 'bg-foreground border-foreground' : 'bg-transparent border-[#404040]'
                  )}
                >
                  <span
                    className={cn(
                      'pointer-events-none inline-block h-4 w-4 rounded-full shadow-sm transition-transform duration-200 mt-[1px]',
                      includeAccs ? 'translate-x-5 bg-background' : 'translate-x-0.5 bg-[#404040]'
                    )}
                  />
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

              {/* Weather Toggle */}
              <div className="flex items-center gap-3">
                <CloudSun className="w-4 h-4 text-[#a0a0a0]" />
                <span className="text-sm font-light text-[#a0a0a0]">Clima</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={includeWeather}
                  onClick={() => setIncludeWeather((v) => !v)}
                  className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 focus-visible:outline-none',
                    includeWeather ? 'bg-foreground border-foreground' : 'bg-transparent border-[#404040]'
                  )}
                >
                  <span
                    className={cn(
                      'pointer-events-none inline-block h-4 w-4 rounded-full shadow-sm transition-transform duration-200 mt-[1px]',
                      includeWeather ? 'translate-x-5 bg-background' : 'translate-x-0.5 bg-[#404040]'
                    )}
                  />
                </button>
                <span
                  className={cn(
                    'text-xs font-medium tracking-wide transition-colors duration-200',
                    includeWeather ? 'text-foreground' : 'text-[#505050]'
                  )}
                >
                  {includeWeather ? 'Sí' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {status === 'success' && (
            <div className="flex items-center gap-2 text-sm font-light text-green-400 animate-in fade-in duration-300">
              <CheckCircle2 className="w-4 h-4" />
              <span>Outfit generado exitosamente</span>
              {outfitPalette && (
                <span className="text-[#505050] ml-2">• Paleta: {outfitPalette}</span>
              )}
            </div>
          )}

          {status === 'error' && errorMessage && (
            <div className="flex items-center gap-2 text-sm font-light text-amber-400 animate-in fade-in duration-300">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Output — Collage Grid */}
        {status === 'idle' && generatedOutfit.length === 0 && (
          <div className="flex items-center justify-center rounded-2xl border border-dashed border-[#242424] min-h-80 bg-[#0f0f0f]">
            <div className="flex flex-col items-center gap-4 text-center px-8">
              <div className="w-14 h-14 rounded-2xl bg-[#1a1a1a] flex items-center justify-center">
                <ShirtIcon className="w-6 h-6 text-[#404040]" />
              </div>
              <p className="text-[#404040] font-light text-base">
                Presioná el botón para generar tu outfit del día con IA
              </p>
            </div>
          </div>
        )}

        {status === 'loading' && (
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
                La IA está analizando tu guardarropa...
              </p>
            </div>
          </div>
        )}

        {(status === 'success' || status === 'error') && generatedOutfit.length > 0 && (
          <div
            className={cn(
              'transition-opacity duration-500',
              animating ? 'opacity-0' : 'opacity-100'
            )}
          >
            {/* Collage layout — asymmetric Whering-style */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 auto-rows-auto">
              {/* Main items — span taller */}
              {mainItems.slice(0, 2).map((item, i) => (
                <div
                  key={item.id}
                  className="group relative rounded-2xl overflow-hidden bg-[#111111] shadow-lg hover:shadow-2xl hover:shadow-black/60 transition-all duration-400 aspect-[3/4]"
                  style={{
                    gridColumn: i === 0 ? '1' : '2',
                    gridRow: '1 / 3',
                  }}
                >
                  <Image
                    src={item.image}
                    alt={`${item.tipo} ${item.color}`}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  {/* Item label on hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-foreground text-sm font-light">
                      {item.tipo} • {item.color}
                    </p>
                  </div>
                </div>
              ))}

              {/* Small items — stack in third column */}
              {[...mainItems.slice(2), ...smallItems].map((item, i) => (
                <div
                  key={item.id}
                  className="group relative rounded-2xl overflow-hidden bg-[#111111] shadow-md hover:shadow-xl hover:shadow-black/50 transition-all duration-400 aspect-square"
                  style={{
                    gridColumn: '3',
                    gridRow: i + 1,
                  }}
                >
                  <Image
                    src={item.image}
                    alt={`${item.tipo} ${item.color}`}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                </div>
              ))}
            </div>

            {/* Retry + Save row */}
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <button
                onClick={handleRetry}
                disabled={status === 'loading'}
                className="group flex items-center gap-2 rounded-full border border-[#2a2a2a] px-6 py-3 text-sm font-light text-[#a0a0a0] hover:border-[#404040] hover:text-foreground transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Reintentar generación de outfit"
              >
                <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                Reintentar
              </button>

              <button className="flex items-center gap-2 rounded-full border border-[#2a2a2a] px-6 py-3 text-sm font-light text-[#a0a0a0] hover:border-[#404040] hover:text-foreground transition-all duration-200 active:scale-95">
                Guardar outfit
              </button>

              {outfitOccasion && (
                <span className="ml-auto text-xs font-light text-[#404040] tracking-wide">
                  Ocasión: {outfitOccasion}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
