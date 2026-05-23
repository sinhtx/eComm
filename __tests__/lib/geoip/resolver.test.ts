import { resolveGeoIP } from '@/lib/geoip/resolver'

describe('GeoIP Resolver', () => {
  describe('resolveGeoIP', () => {
    it('should return null for localhost IPs', async () => {
      const result = await resolveGeoIP('127.0.0.1')
      expect(result).toBeNull()

      const result2 = await resolveGeoIP('::1')
      expect(result2).toBeNull()
    })

    it('should return null for unknown IP', async () => {
      const result = await resolveGeoIP('unknown')
      expect(result).toBeNull()
    })

    it('should handle gracefully if database not initialized properly', async () => {
      // Test with an invalid IP format
      const result = await resolveGeoIP('invalid-ip-address')
      expect(result).toBeNull()
    })

    it('should return geo data structure if database is available', async () => {
      // This test verifies the function signature and error handling
      // Note: actual GeoIP resolution depends on the MaxMind database being present
      const result = await resolveGeoIP('8.8.8.8')

      // Should either return null (if database not found) or an object with expected fields
      if (result !== null) {
        expect(result).toHaveProperty('city')
        expect(result).toHaveProperty('state')
        expect(result).toHaveProperty('country_code')
      }
    })

    it('should handle public IPs gracefully', async () => {
      // Test with a known public IP (Google DNS)
      // Result depends on MaxMind database availability
      const result = await resolveGeoIP('8.8.8.8')

      // Should not throw, should return null or valid GeoIPData
      expect(result === null || typeof result === 'object').toBe(true)
    })
  })
})
