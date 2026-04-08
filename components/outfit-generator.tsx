'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import {
  RefreshCw,
  Sparkles,
  ShirtIcon,
  AlertCircle,
  CheckCircle2,
  CloudSun,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  Snowflake,
  CloudMoon,
  Wind,
  Droplets,
  Thermometer,
  MapPin,
  Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ClothingItem as WardrobeItem } from '@/lib/types'

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

type WeatherData = {
  location: string
  region: string
  temp: number
  feelsLike: number
  humidity: number
  wind: number
  condition: string
  conditionCode: number
  isDay: boolean
  icon: string
}

// Weather icon component
function WeatherIcon({ icon, className }: { icon: string; className?: string }) {
  const iconProps = { className: cn('w-6 h-6', className) }
  
  switch (icon) {
    case 'sun':
      return <Sun {...iconProps} />
    case 'moon':
      return <Moon {...iconProps} />
    case 'cloud':
      return <Cloud {...iconProps} />
    case 'cloud-sun':
      return <CloudSun {...iconProps} />
    case 'cloud-moon':
      return <CloudMoon {...iconProps} />
    case 'cloud-rain':
      return <CloudRain {...iconProps} />
    case 'cloud-drizzle':
      return <CloudDrizzle {...iconProps} />
    case 'cloud-fog':
      return <CloudFog {...iconProps} />
    case 'cloud-lightning':
      return <CloudLightning {...iconProps} />
    case 'snowflake':
      return <Snowflake {...iconProps} />
    default:
      return <Cloud {...iconProps} />
  }
}

interface OutfitGeneratorProps {
  wardrobe?: WardrobeItem[]
}

export function OutfitGenerator({ wardrobe = [] }: OutfitGeneratorProps) {
  // Use real wardrobe if available, fall back to demo items
  const activeWardrobe = wardrobe.length > 0
    ? wardrobe.map((item) => ({
        id: item.id,
        tipo: item.tipo,
        color: item.color,
        estilo: item.estilo,
        image: item.image ?? `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop`,
      }))
    : WARDROBE_ITEMS
  const [status, setStatus] = useState<GenerationStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [includeAccs, setIncludeAccs] = useState(false)
  const [includeWeather, setIncludeWeather] = useState(false)
  const [generatedOutfit, setGeneratedOutfit] = useState<OutfitItem[]>([])
  const [outfitPalette, setOutfitPalette] = useState<string>('')
  const [outfitOccasion, setOutfitOccasion] = useState<string>('')
  const [animating, setAnimating] = useState(false)
  const [fallbackIndex, setFallbackIndex] = useState(0)
  
  // Pinned items from previous outfit
  const [previousOutfit, setPreviousOutfit] = useState<OutfitItem[]>([])
  const [pinnedItems, setPinnedItems] = useState<string[]>([])

  // Weather state
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [weatherRecommendations, setWeatherRecommendations] = useState<string[]>([])

  // Fetch weather data when toggle is enabled
  useEffect(() => {
    if (includeWeather && !weather) {
      fetchWeather()
    }
  }, [includeWeather])

  const fetchWeather = async (location = 'Buenos Aires') => {
    setWeatherLoading(true)
    try {
      const response = await fetch(`/api/weather?q=${encodeURIComponent(location)}`)
      if (!response.ok) throw new Error('Weather fetch failed')
      
      const data = await response.json()
      if (data.success) {
        setWeather(data.weather)
        setWeatherRecommendations(data.recommendations || [])
      }
    } catch (error) {
      console.error('[v0] Weather fetch error:', error)
      // Set fallback weather
      setWeather({
        location: 'Buenos Aires',
        region: 'CABA',
        temp: 20,
        feelsLike: 18,
        humidity: 65,
        wind: 12,
        condition: 'Parcialmente nublado',
        conditionCode: 1003,
        isDay: true,
        icon: 'cloud-sun',
      })
      setWeatherRecommendations(['Buzo', 'Remera manga larga'])
    } finally {
      setWeatherLoading(false)
    }
  }

  const findItemById = (id: string): OutfitItem | undefined => {
    const allItems = [...activeWardrobe, ...ACCESSORY_ITEMS]
    const item = allItems.find((i) => i.id === id)
    if (item) return { ...item }
    return undefined
  }

  const generateOutfit = useCallback(async () => {
    setStatus('loading')
    setErrorMessage(null)
    setAnimating(true)

    try {
      const itemsToSend = includeAccs
        ? [...activeWardrobe, ...ACCESSORY_ITEMS]
        : activeWardrobe

      // Build weather data for API if enabled
      const weatherPayload = includeWeather && weather
        ? {
            active: true,
            temp: weather.temp,
            condition: weather.condition,
            humidity: weather.humidity,
            wind: weather.wind,
            recommendations: weatherRecommendations,
          }
        : { active: false }

      const response = await fetch('/api/outfit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_preferences: {
            estilo: 'Casual',
          },
          weather_data: weatherPayload,
          wardrobe_items: itemsToSend,
          pinned_item_ids: pinnedItems,
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
        setPreviousOutfit(outfitItems)
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
      setPinnedItems([])
      setTimeout(() => setAnimating(false), 100)
    }
  }, [includeAccs, includeWeather, weather, weatherRecommendations, fallbackIndex, pinnedItems, activeWardrobe])

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

        {/* Weather Card - Shows when toggle is enabled */}
        {includeWeather && (
          <div
            className={cn(
              'mb-8 rounded-2xl border border-[#1a1a1a] bg-[#0f0f0f] p-6 transition-all duration-500',
              weatherLoading ? 'opacity-60' : 'opacity-100'
            )}
          >
            {weatherLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1a1a1a] animate-pulse" />
                <div className="flex flex-col gap-2">
                  <div className="w-32 h-4 rounded bg-[#1a1a1a] animate-pulse" />
                  <div className="w-48 h-3 rounded bg-[#1a1a1a] animate-pulse" />
                </div>
              </div>
            ) : weather ? (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Main weather info */}
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      'flex items-center justify-center w-14 h-14 rounded-2xl',
                      weather.isDay ? 'bg-amber-500/10' : 'bg-indigo-500/10'
                    )}
                  >
                    <WeatherIcon
                      icon={weather.icon}
                      className={cn(
                        'w-7 h-7',
                        weather.isDay ? 'text-amber-400' : 'text-indigo-400'
                      )}
                    />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-light text-foreground">
                        {weather.temp}°
                      </span>
                      <span className="text-sm text-[#606060]">
                        Sensación {weather.feelsLike}°
                      </span>
                    </div>
                    <p className="text-sm text-[#808080] font-light">
                      {weather.condition}
                    </p>
                  </div>
                </div>

                {/* Weather details */}
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2 text-[#606060]">
                    <MapPin className="w-4 h-4" />
                    <span>{weather.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#606060]">
                    <Droplets className="w-4 h-4" />
                    <span>{weather.humidity}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#606060]">
                    <Wind className="w-4 h-4" />
                    <span>{weather.wind} km/h</span>
                  </div>
                </div>

                {/* Recommendations pills */}
                {weatherRecommendations.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {weatherRecommendations.slice(0, 4).map((rec, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs font-light bg-[#1a1a1a] text-[#808080] border border-[#252525]"
                      >
                        {rec}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}

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
                <Thermometer className="w-4 h-4 text-[#a0a0a0]" />
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

          {/* Pinned items from previous outfit */}
          {previousOutfit.length > 0 && (
            <div className="flex flex-col gap-3 animate-in fade-in duration-500">
              <span className="text-sm font-light text-[#a0a0a0]">
                ¿Repetir prenda del outfit anterior?
              </span>
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
                {previousOutfit.map((item) => {
                  const isPinned = pinnedItems.includes(item.id)
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setPinnedItems((prev) =>
                          isPinned ? prev.filter((id) => id !== item.id) : [...prev, item.id]
                        )
                      }
                      className={cn(
                        'relative flex-shrink-0 flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground',
                        isPinned
                          ? 'border-foreground bg-[#1a1a1a]'
                          : 'border-[#2a2a2a] bg-[#0f0f0f] hover:border-[#404040]'
                      )}
                      aria-pressed={isPinned}
                      aria-label={`${isPinned ? 'Deseleccionar' : 'Seleccionar'} ${item.tipo} ${item.color}`}
                    >
                      {/* Thumbnail */}
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#1a1a1a] flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={`${item.tipo} ${item.color}`}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                        {/* Check overlay */}
                        {isPinned && (
                          <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" strokeWidth={3} />
                          </div>
                        )}
                      </div>
                      {/* Label */}
                      <div className="text-center">
                        <p
                          className={cn(
                            'text-[10px] font-light leading-tight transition-colors duration-200 whitespace-nowrap',
                            isPinned ? 'text-foreground' : 'text-[#606060]'
                          )}
                        >
                          {item.tipo}
                        </p>
                        <p className="text-[10px] text-[#404040] leading-tight">
                          {item.color}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
              {pinnedItems.length > 0 && (
                <p className="text-xs font-light text-[#505050]">
                  {pinnedItems.length} prenda{pinnedItems.length > 1 ? 's' : ''} fijada{pinnedItems.length > 1 ? 's' : ''} — aparecerá en el próximo outfit
                </p>
              )}
            </div>
          )}

          {/* Status Messages */}
          {status === 'success' && (
            <div className="flex items-center gap-2 text-sm font-light text-green-400 animate-in fade-in duration-300">
              <CheckCircle2 className="w-4 h-4" />
              <span>Outfit generado exitosamente</span>
              {outfitPalette && (
                <span className="text-[#505050] ml-2">• Paleta: {outfitPalette}</span>
              )}
              {includeWeather && weather && (
                <span className="text-[#505050] ml-2">• Adaptado para {weather.temp}°C</span>
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
              {includeWeather && weather && (
                <p className="text-[#505050] font-light text-sm">
                  El clima actual ({weather.temp}°C, {weather.condition}) será considerado
                </p>
              )}
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
                {includeWeather
                  ? 'Analizando tu guardarropa y el clima actual...'
                  : 'La IA está analizando tu guardarropa...'}
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
                    {item.reason && (
                      <p className="text-[#808080] text-xs mt-1">{item.reason}</p>
                    )}
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
