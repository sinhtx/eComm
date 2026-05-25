'use client'

import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-cream flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-neutral-charcoal">
          Something went wrong
        </h1>
        <p className="text-neutral-gray mt-2 text-center max-w-md">
          Please try again. If the problem continues, contact support from the
          contact page.
        </p>
        {process.env.NODE_ENV === 'development' ? (
          <pre className="mt-4 max-w-full overflow-auto text-xs bg-white p-4 rounded border border-slate-200">
            {error.message}
          </pre>
        ) : null}
        <div className="mt-8 flex gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className="btn-primary"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center px-5 py-3 rounded-lg border-2 border-neutral-charcoal text-neutral-charcoal font-semibold"
          >
            Home
          </Link>
        </div>
      </body>
    </html>
  )
}
