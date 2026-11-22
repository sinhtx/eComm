import type { Metadata } from 'next'
import { BRAND_NAME, pageMetadata } from '@/lib/site'

export const metadata: Metadata = pageMetadata({
  title: `Contact | ${BRAND_NAME}`,
  description: `Contact ${BRAND_NAME} on Pine Island, Florida about orders, farm visits, and wholesale.`,
  path: '/contact',
})

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
