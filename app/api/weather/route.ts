// Weather API route using weatherapi.com
// Falls back to mock data if API key not available

const WEATHER_API_KEY = process.env.WEATHER_API_KEY

interface WeatherResponse {
  location: {
    name: string
    region: string
    country: string
    localtime: string
  }
  current: {
    temp_c: number
    temp_f: number
    condition: {
      text: string
      icon: string
      code: number
    }
    humidity: number
    feelslike_c: number
    wind_kph: number
    is_day: number
  }
}

// Map weather conditions to outfit recommendations
function getOutfitRecommendation(temp: number, condition: string, humidity: number): string[] {
  const recommendations: string[] = []
  const conditionLower = condition.toLowerCase()

  // Temperature-based recommendations
  if (temp < 10) {
    recommendations.push('Tapado', 'Buzo grueso', 'Campera de abrigo')
  } else if (temp < 18) {
    recommendations.push('Buzo', 'Chaqueta liviana', 'Campera')
  } else if (temp < 25) {
    recommendations.push('Remera manga larga', 'Camisa', 'Cárdigan')
  } else {
    recommendations.push('Remera', 'Musculosa', 'Short')
  }

  // Condition-based recommendations
  if (conditionLower.includes('rain') || conditionLower.includes('lluvia') || conditionLower.includes('drizzle')) {
    recommendations.push('Piloto', 'Impermeable', 'Paraguas')
  }
  if (conditionLower.includes('snow') || conditionLower.includes('nieve')) {
    recommendations.push('Botas impermeables', 'Gorro de lana', 'Guantes')
  }
  if (conditionLower.includes('sun') || conditionLower.includes('clear') || conditionLower.includes('despejado')) {
    recommendations.push('Gorra', 'Lentes de sol')
  }
  if (conditionLower.includes('wind') || conditionLower.includes('viento')) {
    recommendations.push('Cortaviento', 'Bufanda')
  }

  // Humidity-based
  if (humidity > 80) {
    recommendations.push('Telas livianas', 'Algodón')
  }

  return [...new Set(recommendations)] // Remove duplicates
}

// Get weather icon based on condition code
function getWeatherIcon(code: number, isDay: number): string {
  // Sunny/Clear
  if (code === 1000) return isDay ? 'sun' : 'moon'
  // Partly cloudy
  if (code === 1003) return isDay ? 'cloud-sun' : 'cloud-moon'
  // Cloudy
  if ([1006, 1009].includes(code)) return 'cloud'
  // Mist/Fog
  if ([1030, 1135, 1147].includes(code)) return 'cloud-fog'
  // Rain
  if ([1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(code)) return 'cloud-rain'
  // Drizzle/Light rain
  if ([1168, 1171].includes(code)) return 'cloud-drizzle'
  // Snow
  if ([1066, 1069, 1072, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264].includes(code)) return 'snowflake'
  // Thunder
  if ([1087, 1273, 1276, 1279, 1282].includes(code)) return 'cloud-lightning'
  
  return 'cloud'
}

// Mock weather data for when API key is not available
function getMockWeather(location: string): WeatherResponse {
  const hour = new Date().getHours()
  const isDay = hour >= 6 && hour < 20 ? 1 : 0
  
  // Simulate different weather based on time of day
  const mockConditions = [
    { text: 'Parcialmente nublado', code: 1003 },
    { text: 'Soleado', code: 1000 },
    { text: 'Nublado', code: 1006 },
    { text: 'Lluvia ligera', code: 1183 },
  ]
  
  const condition = mockConditions[Math.floor(Date.now() / 3600000) % mockConditions.length]
  const baseTemp = 18 + Math.sin(hour / 24 * Math.PI * 2) * 8

  return {
    location: {
      name: location || 'Buenos Aires',
      region: 'Ciudad Autónoma de Buenos Aires',
      country: 'Argentina',
      localtime: new Date().toISOString(),
    },
    current: {
      temp_c: Math.round(baseTemp),
      temp_f: Math.round(baseTemp * 9/5 + 32),
      condition: {
        text: condition.text,
        icon: '',
        code: condition.code,
      },
      humidity: 65 + Math.floor(Math.random() * 20),
      feelslike_c: Math.round(baseTemp - 2),
      wind_kph: 10 + Math.floor(Math.random() * 15),
      is_day: isDay,
    },
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const location = searchParams.get('q') || 'Buenos Aires'

  try {
    // Try real API if key is available
    if (WEATHER_API_KEY) {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(location)}&lang=es`,
        { next: { revalidate: 1800 } } // Cache for 30 minutes
      )

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`)
      }

      const data: WeatherResponse = await response.json()
      const recommendations = getOutfitRecommendation(
        data.current.temp_c,
        data.current.condition.text,
        data.current.humidity
      )
      const icon = getWeatherIcon(data.current.condition.code, data.current.is_day)

      return Response.json({
        success: true,
        weather: {
          location: data.location.name,
          region: data.location.region,
          temp: data.current.temp_c,
          feelsLike: data.current.feelslike_c,
          humidity: data.current.humidity,
          wind: data.current.wind_kph,
          condition: data.current.condition.text,
          conditionCode: data.current.condition.code,
          isDay: data.current.is_day === 1,
          icon,
        },
        recommendations,
        source: 'api',
      })
    }

    // Fall back to mock data
    const mockData = getMockWeather(location)
    const recommendations = getOutfitRecommendation(
      mockData.current.temp_c,
      mockData.current.condition.text,
      mockData.current.humidity
    )
    const icon = getWeatherIcon(mockData.current.condition.code, mockData.current.is_day)

    return Response.json({
      success: true,
      weather: {
        location: mockData.location.name,
        region: mockData.location.region,
        temp: mockData.current.temp_c,
        feelsLike: mockData.current.feelslike_c,
        humidity: mockData.current.humidity,
        wind: mockData.current.wind_kph,
        condition: mockData.current.condition.text,
        conditionCode: mockData.current.condition.code,
        isDay: mockData.current.is_day === 1,
        icon,
      },
      recommendations,
      source: 'mock',
    })
  } catch (error) {
    console.error('[v0] Weather fetch error:', error)

    // Return fallback data on error
    const fallbackData = getMockWeather(location)
    const recommendations = getOutfitRecommendation(
      fallbackData.current.temp_c,
      fallbackData.current.condition.text,
      fallbackData.current.humidity
    )
    const icon = getWeatherIcon(fallbackData.current.condition.code, fallbackData.current.is_day)

    return Response.json({
      success: true,
      weather: {
        location: fallbackData.location.name,
        region: fallbackData.location.region,
        temp: fallbackData.current.temp_c,
        feelsLike: fallbackData.current.feelslike_c,
        humidity: fallbackData.current.humidity,
        wind: fallbackData.current.wind_kph,
        condition: fallbackData.current.condition.text,
        conditionCode: fallbackData.current.condition.code,
        isDay: fallbackData.current.is_day === 1,
        icon,
      },
      recommendations,
      source: 'fallback',
    })
  }
}
