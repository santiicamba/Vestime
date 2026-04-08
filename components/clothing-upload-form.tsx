'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { X, Plus, Upload, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ClothingItem as SharedClothingItem } from '@/lib/types'

const TIPOS_PRENDA = [
  'Remera',
  'Pantalón',
  'Buzo',
  'Campera',
  'Vestido',
  'Falda',
  'Camisa',
  'Bermuda',
  'Zapatillas',
  'Zapatos',
  'Botas',
  'Accesorio',
]

const ESTILOS = ['Casual', 'Formal', 'Deportivo', 'Elegante']

interface ClothingItem {
  id: string
  tipo: string
  color: string
  estilo: string
  imageFile: File | null
  imagePreview: string | null
}

function createEmptyItem(): ClothingItem {
  return {
    id: crypto.randomUUID(),
    tipo: '',
    color: '',
    estilo: '',
    imageFile: null,
    imagePreview: null,
  }
}

interface ItemCardProps {
  item: ClothingItem
  index: number
  canRemove: boolean
  onChange: (id: string, field: keyof ClothingItem, value: string | File | null) => void
  onRemove: (id: string) => void
}

function ItemCard({ item, index, canRemove, onChange, onRemove }: ItemCardProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return
      const url = URL.createObjectURL(file)
      onChange(item.id, 'imageFile', file)
      onChange(item.id, 'imagePreview', url)
    },
    [item.id, onChange]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const removeImage = () => {
    if (item.imagePreview) URL.revokeObjectURL(item.imagePreview)
    onChange(item.id, 'imageFile', null)
    onChange(item.id, 'imagePreview', null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="relative bg-white rounded-2xl border border-[#e5e5e5] shadow-sm p-6 md:p-8 transition-shadow hover:shadow-md">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-medium tracking-widest text-[#a0a0a0] uppercase">
          Prenda {index + 1}
        </span>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="flex items-center justify-center w-7 h-7 rounded-full text-[#a0a0a0] hover:text-[#0a0a0a] hover:bg-[#f5f5f5] transition-colors"
            aria-label="Eliminar prenda"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Fields */}
        <div className="flex flex-col gap-5">
          {/* Tipo de Prenda */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium tracking-widest text-[#404040] uppercase">
              Tipo de prenda
            </label>
            <select
              value={item.tipo}
              onChange={(e) => onChange(item.id, 'tipo', e.target.value)}
              className="w-full rounded-xl border border-[#e5e5e5] bg-[#fafafa] text-[#0a0a0a] text-sm px-4 py-3 outline-none focus:border-[#0a0a0a] focus:ring-0 transition-colors appearance-none cursor-pointer hover:border-[#c0c0c0]"
            >
              <option value="" disabled>
                Seleccioná un tipo...
              </option>
              {TIPOS_PRENDA.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          {/* Color */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium tracking-widest text-[#404040] uppercase">
              Color
            </label>
            <input
              type="text"
              value={item.color}
              onChange={(e) => onChange(item.id, 'color', e.target.value)}
              placeholder="Ej: Negro, Blanco, Azul marino..."
              className="w-full rounded-xl border border-[#e5e5e5] bg-[#fafafa] text-[#0a0a0a] text-sm px-4 py-3 outline-none focus:border-[#0a0a0a] placeholder:text-[#c0c0c0] transition-colors hover:border-[#c0c0c0]"
            />
          </div>

          {/* Estilo */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium tracking-widest text-[#404040] uppercase">
              Estilo
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ESTILOS.map((estilo) => (
                <button
                  key={estilo}
                  type="button"
                  onClick={() => onChange(item.id, 'estilo', estilo)}
                  className={cn(
                    'rounded-xl border text-sm py-2.5 px-3 font-light transition-all duration-150',
                    item.estilo === estilo
                      ? 'border-[#0a0a0a] bg-[#0a0a0a] text-white'
                      : 'border-[#e5e5e5] text-[#404040] hover:border-[#c0c0c0] hover:bg-[#f5f5f5]'
                  )}
                >
                  {estilo}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Image Upload */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium tracking-widest text-[#404040] uppercase">
            Imagen
          </label>

          {item.imagePreview ? (
            <div className="relative flex-1 rounded-xl overflow-hidden border border-[#e5e5e5] min-h-48 bg-[#fafafa] group">
              <Image
                src={item.imagePreview}
                alt="Preview de la prenda"
                fill
                className="object-contain p-3"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 border border-[#e5e5e5] flex items-center justify-center text-[#404040] hover:text-[#0a0a0a] hover:bg-white opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                aria-label="Eliminar imagen"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-2 right-2 text-xs font-medium px-3 py-1.5 rounded-lg bg-white/90 border border-[#e5e5e5] text-[#404040] hover:text-[#0a0a0a] hover:bg-white opacity-0 group-hover:opacity-100 transition-all shadow-sm"
              >
                Cambiar
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'flex-1 min-h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-150',
                isDragging
                  ? 'border-[#0a0a0a] bg-[#f5f5f5]'
                  : 'border-[#e5e5e5] bg-[#fafafa] hover:border-[#c0c0c0] hover:bg-[#f5f5f5]'
              )}
            >
              <div className="w-10 h-10 rounded-full bg-[#f0f0f0] flex items-center justify-center">
                {isDragging ? (
                  <Upload className="w-5 h-5 text-[#0a0a0a]" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-[#a0a0a0]" />
                )}
              </div>
              <div className="text-center">
                <p className="text-sm text-[#404040] font-light">
                  {isDragging ? 'Soltar imagen aquí' : 'Arrastrá o hacé click'}
                </p>
                <p className="text-xs text-[#a0a0a0] mt-0.5">PNG, JPG, WEBP</p>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            aria-label="Subir imagen de prenda"
          />
        </div>
      </div>
    </div>
  )
}

interface ClothingUploadFormProps {
  onSave?: (items: SharedClothingItem[]) => void
}

export function ClothingUploadForm({ onSave }: ClothingUploadFormProps) {
  const [items, setItems] = useState<ClothingItem[]>([createEmptyItem()])
  const [submitted, setSubmitted] = useState(false)

  const handleChange = useCallback(
    (id: string, field: keyof ClothingItem, value: string | File | null) => {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
      )
    },
    []
  )

  const addItem = () => setItems((prev) => [...prev, createEmptyItem()])

  const removeItem = (id: string) =>
    setItems((prev) => {
      const item = prev.find((i) => i.id === id)
      if (item?.imagePreview) URL.revokeObjectURL(item.imagePreview)
      return prev.filter((i) => i.id !== id)
    })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Map internal items to the shared ClothingItem type and pass to parent
    const saved: SharedClothingItem[] = items
      .filter((item) => item.tipo && item.color && item.estilo)
      .map((item) => ({
        id: item.id,
        tipo: item.tipo,
        color: item.color,
        estilo: item.estilo,
        imagePreview: item.imagePreview,
      }))

    if (saved.length === 0) return

    onSave?.(saved)

    // Reset form and scroll to gallery
    setItems([createEmptyItem()])
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    document.getElementById('wardrobe-gallery')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto px-4 md:px-0">
      {/* Form Header */}
      <div className="mb-8">
        <p className="text-xs font-medium tracking-widest text-[#a0a0a0] uppercase mb-2">
          Mi armario
        </p>
        <h2 className="text-2xl md:text-3xl font-light text-[#0a0a0a] text-balance">
          Agregar prendas
        </h2>
      </div>

      {/* Item Cards */}
      <div className="flex flex-col gap-4">
        {items.map((item, index) => (
          <ItemCard
            key={item.id}
            item={item}
            index={index}
            canRemove={items.length > 1}
            onChange={handleChange}
            onRemove={removeItem}
          />
        ))}
      </div>

      {/* Add Item Button */}
      <button
        type="button"
        onClick={addItem}
        className="mt-4 w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#e5e5e5] py-4 text-sm font-light text-[#a0a0a0] hover:border-[#c0c0c0] hover:text-[#404040] hover:bg-[#fafafa] transition-all duration-150"
      >
        <Plus className="w-4 h-4" />
        Agregar otra prenda
      </button>

      {/* Submit */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto rounded-full px-10 py-6 text-base font-light bg-[#0a0a0a] text-white hover:bg-[#1a1a1a] transition-all duration-300"
        >
          {submitted ? 'Guardado en el armario!' : `Guardar ${items.length > 1 ? `${items.length} prendas` : 'prenda'}`}
        </Button>
        <span className="text-sm text-[#a0a0a0] font-light">
          {items.length} {items.length === 1 ? 'prenda' : 'prendas'} agregadas
        </span>
      </div>
    </form>
  )
}
