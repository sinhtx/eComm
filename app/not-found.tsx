import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 py-16 bg-neutral-cream">
      <p className="text-sm font-semibold uppercase tracking-wide text-neutral-gray">
        404
      </p>
      <h1 className="text-h2 text-neutral-charcoal mt-2 text-center">
        Page not found
      </h1>
      <p className="text-neutral-gray mt-2 text-center max-w-md">
        That link may be broken or the page was moved. Try the shop or head
        home.
      </p>
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <Link href="/" className="btn-primary inline-block">
          Home
        </Link>
        <Link
          href="/shop"
          className="inline-block px-5 py-3 rounded-lg border-2 border-neutral-charcoal text-neutral-charcoal font-semibold hover:bg-white transition-colors"
        >
          Shop mangoes
        </Link>
      </div>
    </div>
  )
}
