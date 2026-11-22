import type { Metadata } from 'next'
import { BRAND_NAME, pageMetadata } from '@/lib/site'

export const metadata: Metadata = pageMetadata({
  title: `Terms of Service | ${BRAND_NAME}`,
  description: `Terms for using the ${BRAND_NAME} website and buying naturally grown Florida mangoes.`,
  path: '/terms',
})

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children
}
