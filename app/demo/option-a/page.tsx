'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MangoVariety, CartItem } from '@/lib/types';
import { getAvailableMangoes } from '@/lib/mangoes';
import { PricingToggle } from '@/components/PricingToggle';

export default function OptionA() {
  const mangoes = getAvailableMangoes();
  const [selectedMango, setSelectedMango] = useState<MangoVariety | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
    setSelectedMango(null);
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Seasonal Fruit Farm</h1>
            <p className="text-sm text-slate-600">Option A: Compact Cards + Modal</p>
          </div>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            🛒 Cart
            {cartItems.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center -translate-y-2 translate-x-2">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Our Premium Mangoes</h2>
          <p className="text-slate-600">
            Smaller cards = less scrolling. Click any mango to order.
          </p>
        </div>

        {/* Grid with COMPACT h-40 images */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mangoes.map((mango) => (
            <button
              key={mango.id}
              onClick={() => setSelectedMango(mango)}
              className="group relative h-full rounded-lg bg-white shadow-md transition-all hover:shadow-lg hover:scale-105 overflow-hidden"
            >
              {/* COMPACT h-40 instead of h-64 */}
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

              <div className="p-3">
                <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{mango.name}</h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-1">{mango.description}</p>

                <div className="mt-2 pt-2 border-t border-slate-200">
                  <div className="text-amber-600 font-semibold text-sm">${mango.pricePerPound.toFixed(2)}/lb</div>
                  <div className="text-xs text-slate-500 mt-1">Click to order</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <a href="/demo" className="text-slate-600 hover:text-slate-900 underline">
            ← Back to comparison
          </a>
        </div>
      </main>

      {/* Modal Dialog - appears over everything */}
      {selectedMango && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-slate-200 flex items-start justify-between">
              <h3 className="text-2xl font-bold text-slate-900">{selectedMango.name}</h3>
              <button
                onClick={() => setSelectedMango(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-slate-600">{selectedMango.description}</p>

              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600 mb-2">Price Per Pound</p>
                <p className="text-2xl font-bold text-amber-600">${selectedMango.pricePerPound.toFixed(2)}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600 mb-3">Select Quantity</p>
                <PricingToggle mangoName={selectedMango.name} pricePerPound={selectedMango.pricePerPound} />
              </div>

              <button
                onClick={() => handleAddToCart(1)}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simple Cart Display */}
      {isCartOpen && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm z-40">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">Cart ({cartItems.length})</h3>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2 text-sm">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-slate-700">
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span className="font-semibold">${item.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
