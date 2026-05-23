'use server'

import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'
import { resolveGeoIP } from '@/lib/geoip/resolver'

export interface LogTrafficResponse {
  success: boolean
  error?: string
}

export async function logTraffic(pageData?: {
  pagePath?: string
}): Promise<LogTrafficResponse> {
  try {
    const headersList = await headers()
    const ip =
      headersList.get('x-forwarded-for')?.split(',')[0].trim() ||
      headersList.get('x-real-ip') ||
      headersList.get('x-visitor-ip') ||
      'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'
    const pagePath = pageData?.pagePath || '/'

    // Resolve geolocation data
    const geo = await resolveGeoIP(ip)

    // Create Supabase client with secret key (server-side only)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SECRET_KEY || ''
    )

    // Insert into site_traffic table
    const { error } = await supabase.from('site_traffic').insert({
      ip_address: ip,
      user_agent: userAgent,
      city: geo?.city || null,
      state: geo?.state || null,
      country_code: geo?.country_code || null,
      page_path: pagePath,
      referrer: headersList.get('referer') || null,
    })

    if (error) {
      console.error('Traffic logging error:', error)
      return {
        success: false,
        error: error.message,
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to log traffic:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
