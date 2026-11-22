import type { Metadata } from 'next'
import { BRAND_NAME, pageMetadata } from '@/lib/site'

export const metadata: Metadata = pageMetadata({
  title: `Shop | ${BRAND_NAME}`,
  description: `Shop naturally grown Florida mangoes by the pound. Seasonal varieties from ${BRAND_NAME} on Pine Island.`,
  path: '/shop',
})

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children
}
