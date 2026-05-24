'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MangoVariety, CartItem } from '@/lib/types';
import { getAvailableMangoes } from '@/lib/mangoes';
import { PricingToggle } from '@/components/PricingToggle';

export default function OptionB() {
  const mangoes = getAvailableMangoes();
  const [selectedMango, setSelectedMango] = useState<MangoVariety | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddToCart = (quantity: number) => {
    if (!selectedMango) return;

    const newItem: CartItem = {
      id: selectedMango.id,
      name: selectedMango.name,
      type: 'mango',
      quantity,
      pricePerUnit: selectedMango.pricePerPound,
      total: quantity * selectedMango.pricePerPound,
    };

    setCartItems([...cartItems, newItem]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Seasonal Fruit Farm</h1>
            <p className="text-sm text-slate-600">Option B: Two-Column Layout</p>
          </div>
          <button className="relative bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
            🛒 Cart
            {cartItems.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center -translate-y-2 translate-x-2">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* LEFT: Grid of cards */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Premium Mangoes</h2>
          <p className="text-slate-600 mb-6">Click any mango to see details on the right →</p>

          {/* Compact grid with h-40 images */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {mangoes.map((mango) => (
              <button
                key={mango.id}
                onClick={() => setSelectedMango(mango)}
                className={`group relative rounded-lg overflow-hidden transition-all ${
                  selectedMango?.id === mango.id
                    ? 'ring-4 ring-amber-400 shadow-lg'
                    : 'bg-white shadow-md hover:shadow-lg hover:scale-105'
                }`}
              >
                <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={mango.imageUrl}
                    alt={mango.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23e2e8f0" width="200" height="200"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23cbd5e1" font-size="12"%3E' +
                        encodeURIComponent(mango.name) +
                        '%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  {mango.inSeason && (
                    <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      In Season
                    </div>
                  )}
                </div>

                <div className="p-3 bg-white">
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{mango.name}</h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-1">{mango.description}</p>
                  <div className="mt-2 pt-2 border-t border-slate-200">
                    <div className="text-amber-600 font-semibold text-sm">${mango.pricePerPound.toFixed(2)}/lb</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Sticky Detail Panel - COMPACT (50% smaller) */}
        {selectedMango ? (
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <div className="bg-white p-3 rounded-lg shadow-lg border-2 border-amber-200">
              <h3 className="text-lg font-bold text-slate-900 mb-1">{selectedMango.name}</h3>
              <p className="text-xs text-slate-600 mb-2 line-clamp-2">{selectedMango.description}</p>

              <div className="bg-amber-50 p-2 rounded-lg mb-2">
                <p className="text-xs text-slate-600">Price/lb</p>
                <p className="text-xl font-bold text-amber-600">${selectedMango.pricePerPound.toFixed(2)}</p>
              </div>

              {selectedMango.inSeason && (
                <div className="bg-green-50 border-l-4 border-green-500 p-2 mb-2">
                  <p className="text-xs font-semibold text-green-900">✓ In Season</p>
                </div>
              )}

              <div className="bg-slate-50 p-2 rounded-lg mb-2">
                <p className="text-xs text-slate-600 mb-2">Quantity</p>
                <PricingToggle mangoName={selectedMango.name} pricePerPound={selectedMango.pricePerPound} />
              </div>

              <button
                onClick={() => handleAddToCart(1)}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors mb-2 text-sm"
              >
                Add to Cart
              </button>

              <button
                onClick={() => setSelectedMango(null)}
                className="w-full bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-1 px-3 rounded-lg transition-colors text-xs"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <div className="bg-slate-200 p-3 rounded-lg text-center text-slate-600">
              <p className="text-sm font-semibold">Select a mango</p>
              <p className="text-xs mt-1">Click left →</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center py-8">
        <a href="/demo" className="text-slate-600 hover:text-slate-900 underline">
          ← Back to comparison
        </a>
      </div>
    </div>
  );
}
