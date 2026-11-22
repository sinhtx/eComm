import type { Metadata } from 'next'
import { BRAND_NAME, pageMetadata } from '@/lib/site'

export const metadata: Metadata = pageMetadata({
  title: `Privacy Policy | ${BRAND_NAME}`,
  description: `How ${BRAND_NAME} collects, uses, and protects personal information.`,
  path: '/privacy',
})

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children
}
