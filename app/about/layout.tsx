import type { Metadata } from 'next'
import { BRAND_NAME, pageMetadata } from '@/lib/site'

export const metadata: Metadata = pageMetadata({
  title: `About | ${BRAND_NAME}`,
  description: `The story of ${BRAND_NAME} on Pine Island, Florida. Naturally grown mangoes from a woman-owned farm. Not certified organic.`,
  path: '/about',
})

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
