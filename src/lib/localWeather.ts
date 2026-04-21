export type LocalWeatherNow = {
  tempC: number
  conditionLabel: string
}

/** Open-Meteo WMO weather code → short label for the header. */
function describeWmoWeatherCode(code: number, isDay: boolean): string {
  if (code === 0) return isDay ? 'Sunny' : 'Clear'
  if (code === 1) return 'Mainly clear'
  if (code === 2) return 'Partly cloudy'
  if (code === 3) return 'Overcast'
  if (code === 45 || code === 48) return 'Foggy'
  if (code === 51 || code === 53 || code === 55) return 'Drizzle'
  if (code === 56 || code === 57) return 'Freezing drizzle'
  if (code === 61 || code === 63 || code === 65) return 'Rain'
  if (code === 66 || code === 67) return 'Freezing rain'
  if (code === 71 || code === 73 || code === 75) return 'Snow'
  if (code === 77) return 'Snow grains'
  if (code === 80 || code === 81 || code === 82) return 'Rain showers'
  if (code === 85 || code === 86) return 'Snow showers'
  if (code === 95) return 'Thunderstorm'
  if (code === 96 || code === 99) return 'Thunderstorm'
  return 'Weather'
}

export async function fetchOpenMeteoCurrent(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<LocalWeatherNow> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,weather_code,is_day',
    timezone: 'auto',
  })
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
    signal,
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(String(res.status))
  const data = (await res.json()) as {
    current?: {
      temperature_2m?: number
      weather_code?: number
      is_day?: number
    }
  }
  const cur = data.current
  if (typeof cur?.temperature_2m !== 'number' || typeof cur?.weather_code !== 'number') {
    throw new Error('bad weather payload')
  }
  const isDay = cur.is_day === undefined ? true : Number(cur.is_day) === 1
  return {
    tempC: Math.round(cur.temperature_2m),
    conditionLabel: describeWmoWeatherCode(cur.weather_code, isDay),
  }
}
