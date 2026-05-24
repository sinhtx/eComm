'use client';

import Link from 'next/link';

export default function DemoHub() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-4xl font-bold text-slate-900">UI Layout Options</h1>
          <p className="text-slate-600 mt-2">Compare three different designs for the mango storefront</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Option A */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-32 flex items-center justify-center">
              <span className="text-4xl text-white font-bold">A</span>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Compact Cards + Modal</h2>
              <p className="text-slate-600 mb-4">
                Smaller card images (h-40 instead of h-64). Click to open a centered modal dialog for ordering.
              </p>
              <ul className="space-y-2 text-sm text-slate-700 mb-6">
                <li>✓ 30% less page height</li>
                <li>✓ Order form pops up instantly</li>
                <li>✓ No scrolling needed</li>
                <li>✓ Mobile-friendly</li>
              </ul>
              <a
                href="/demo/option-a"
                className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Try Option A
              </a>
            </div>
          </div>

          {/* Option B */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-r from-green-500 to-green-600 h-32 flex items-center justify-center">
              <span className="text-4xl text-white font-bold">B</span>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Two-Column Layout</h2>
              <p className="text-slate-600 mb-4">
                Left: compact grid. Right: sticky detail panel that follows you while browsing.
              </p>
              <ul className="space-y-2 text-sm text-slate-700 mb-6">
                <li>✓ See details while browsing</li>
                <li>✓ Sticky sidebar on desktop</li>
                <li>✓ Natural workflow</li>
                <li>✓ Responsive on mobile</li>
              </ul>
              <a
                href="/demo/option-b"
                className="block text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Try Option B
              </a>
            </div>
          </div>

          {/* Option C */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-32 flex items-center justify-center">
              <span className="text-4xl text-white font-bold">C</span>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Carousel Layout</h2>
              <p className="text-slate-600 mb-4">
                Horizontal carousel of mango cards. Scroll left/right to browse. Details below.
              </p>
              <ul className="space-y-2 text-sm text-slate-700 mb-6">
                <li>✓ Modern, compact feel</li>
                <li>✓ Focus on one mango at a time</li>
                <li>✓ Less vertical scrolling</li>
                <li>✓ Touch-friendly swipe</li>
              </ul>
              <a
                href="/demo/option-c"
                className="block text-center bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Try Option C
              </a>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-16 bg-amber-50 border-2 border-amber-200 rounded-lg p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-4">How to Compare:</h3>
          <ol className="space-y-2 text-slate-700 list-decimal list-inside">
            <li>Click &quot;Try Option&quot; to visit each demo</li>
            <li>Click on a mango card to see the ordering experience</li>
            <li>Try adding items to the cart</li>
            <li>Resize your browser to see mobile behavior (DevTools F12)</li>
            <li>Notice page height, scrolling, and how the layout feels</li>
          </ol>
        </div>

        {/* Return Link */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-slate-600 hover:text-slate-900 underline">
            ← Back to main storefront
          </Link>
        </div>
      </main>
    </div>
  );
}
