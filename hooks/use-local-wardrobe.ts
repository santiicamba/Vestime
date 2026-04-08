'use client'

import { useState, useEffect, useCallback } from 'react'
import type { ClothingItem } from '@/lib/types'

const STORAGE_KEY = 'vestime-wardrobe'

/**
 * Converts a blob: URL to a base64 data URL so it survives page reloads.
 * If the URL is already a data URL or a regular https URL, returns it as-is.
 */
async function toStorableImage(url: string | null): Promise<string | null> {
  if (!url) return null
  if (!url.startsWith('blob:')) return url

  try {
    const response = await fetch(url)
    const blob = await response.blob()
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

function readFromStorage(): ClothingItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeToStorage(items: ClothingItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Storage quota exceeded or unavailable — fail silently
  }
}

export function useLocalWardrobe() {
  const [wardrobe, setWardrobe] = useState<ClothingItem[]>([])

  // Hydrate from localStorage on first mount (client-only)
  useEffect(() => {
    setWardrobe(readFromStorage())
  }, [])

  const addItems = useCallback(async (newItems: ClothingItem[]) => {
    // Convert any blob: previews to base64 before persisting
    const storableItems: ClothingItem[] = await Promise.all(
      newItems.map(async (item) => ({
        ...item,
        imagePreview: await toStorableImage(item.imagePreview),
      }))
    )

    setWardrobe((prev) => {
      const updated = [...prev, ...storableItems]
      writeToStorage(updated)
      return updated
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setWardrobe((prev) => {
      const updated = prev.filter((item) => item.id !== id)
      writeToStorage(updated)
      return updated
    })
  }, [])

  return { wardrobe, addItems, removeItem }
}
