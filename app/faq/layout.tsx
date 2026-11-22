import type { Metadata } from 'next'
import { BRAND_NAME, pageMetadata } from '@/lib/site'

export const metadata: Metadata = pageMetadata({
  title: `FAQ | ${BRAND_NAME}`,
  description: `Answers about mango season, shipping, orders, and how ${BRAND_NAME} grows Florida mangoes.`,
  path: '/faq',
})

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children
}
