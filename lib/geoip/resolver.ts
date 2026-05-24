import * as geoip from '@maxmind/geoip2-node'
import { join } from 'path'

let dbInstance: Awaited<ReturnType<typeof geoip.Reader.open>> | null = null

export interface GeoIPData {
  city?: string | null
  state?: string | null
  country_code?: string | null
}

async function initializeDb() {
  if (dbInstance) return dbInstance

  const dbPath = join(process.cwd(), 'lib', 'geoip', 'GeoLite2-City.mmdb')

  try {
    dbInstance = await geoip.Reader.open(dbPath)
    return dbInstance
  } catch (error) {
    console.error(`Failed to load MaxMind database at ${dbPath}:`, error)
    throw new Error(`MaxMind database not found at ${dbPath}`)
  }
}

export async function resolveGeoIP(ip: string): Promise<GeoIPData | null> {
  // Skip localhost and private IPs
  if (ip === '127.0.0.1' || ip === '::1' || ip === 'unknown') {
    return null
  }

  try {
    const reader = await initializeDb()
    const response = reader.city(ip)

    return {
      city: response.city?.names?.['en'] || null,
      state: response.subdivisions?.[0]?.names?.['en'] || null,
      country_code: response.country?.isoCode || null,
    }
  } catch (error) {
    // Log error but don't throw - we want graceful degradation
    console.error(`Failed to resolve GeoIP for IP ${ip}:`, error)
    return null
  }
}
