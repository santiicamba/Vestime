import { generateText, Output } from 'ai'
import { z } from 'zod'

// Schema for outfit generation response
const OutfitSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      tipo: z.string(),
      color: z.string(),
      estilo: z.string(),
      reason: z.string().nullable(),
    })
  ),
  palette: z.string().nullable(),
  occasion: z.string().nullable(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      user_preferences,
      weather_data,
      wardrobe_items,
    }: {
      user_preferences?: {
        estilo?: string
        color?: string
        tipo?: string
      }
      weather_data?: {
        active: boolean
        temp?: number
        condition?: string
      }
      wardrobe_items?: Array<{
        id: string
        tipo: string
        color: string
        estilo: string
        image?: string
      }>
    } = body

    // Build prompt based on user preferences and wardrobe
    const items = wardrobe_items || []
    const itemsDescription = items
      .map((item) => `- ${item.tipo} (${item.color}, ${item.estilo}) [id: ${item.id}]`)
      .join('\n')

    let contextPrompt = `You are an AI fashion stylist. Generate a cohesive outfit from the following wardrobe items.

Available wardrobe items:
${itemsDescription || 'No items provided - suggest a general outfit structure.'}

`

    if (user_preferences?.estilo) {
      contextPrompt += `\nPreferred style: ${user_preferences.estilo}`
    }
    if (user_preferences?.color) {
      contextPrompt += `\nPreferred color palette: ${user_preferences.color}`
    }

    if (weather_data?.active && weather_data.temp !== undefined) {
      contextPrompt += `\n\nWeather conditions:
- Temperature: ${weather_data.temp}°C
- Condition: ${weather_data.condition || 'Clear'}
Consider weather-appropriate clothing.`
    }

    contextPrompt += `

Select 3-5 items that work well together. Focus on:
1. Color coordination (monochromatic or complementary)
2. Style consistency
3. Appropriate layering

Return the selected items with their IDs from the wardrobe.`

    const result = await generateText({
      model: 'openai/gpt-4o-mini',
      prompt: contextPrompt,
      output: Output.object({ schema: OutfitSchema }),
      maxOutputTokens: 500,
    })

    const outfit = result.output

    return Response.json({
      success: true,
      outfit: outfit?.items || [],
      palette: outfit?.palette || 'Monochromatic neutrals',
      occasion: outfit?.occasion || 'Everyday casual',
      generated_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[v0] Outfit generation error:', error)

    // Fallback: return a curated outfit if AI fails
    return Response.json({
      success: true,
      outfit: [
        { id: 'fallback-1', tipo: 'Remera', color: 'Negro', estilo: 'Casual', reason: 'Base layer' },
        { id: 'fallback-2', tipo: 'Pantalón', color: 'Gris', estilo: 'Casual', reason: 'Neutral bottom' },
        { id: 'fallback-3', tipo: 'Zapatillas', color: 'Blanco', estilo: 'Casual', reason: 'Clean footwear' },
        { id: 'fallback-4', tipo: 'Buzo', color: 'Gris', estilo: 'Casual', reason: 'Layering piece' },
      ],
      palette: 'Monochromatic grayscale',
      occasion: 'Everyday casual',
      fallback: true,
      generated_at: new Date().toISOString(),
    })
  }
}
