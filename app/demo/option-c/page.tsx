'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { MangoVariety, CartItem } from '@/lib/types';
import { getAvailableMangoes } from '@/lib/mangoes';
import { PricingToggle } from '@/components/PricingToggle';

export default function OptionC() {
  const mangoes = getAvailableMangoes();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);

  const selectedMango = mangoes[selectedIndex];

  const handleAddToCart = (quantity: number) => {
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

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Seasonal Fruit Farm</h1>
            <p className="text-sm text-slate-600">Option C: Carousel Layout</p>
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Our Premium Mangoes</h2>
        <p className="text-slate-600 mb-6">Scroll left/right to browse. Click a card to select.</p>

        {/* Horizontal Carousel */}
        <div className="mb-8">
          <div className="relative group">
            {/* Left Scroll Button */}
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-slate-100 rounded-full p-3 shadow-lg transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Scroll left"
            >
              ←
            </button>

            {/* Carousel Container - Fixed width with overflow */}
            <div
              ref={carouselRef}
              className="overflow-x-auto scrollbar-hide scroll-smooth w-full"
            >
              <div className="flex gap-4 pb-2 px-2">
                {mangoes.map((mango, idx) => (
                  <button
                    key={mango.id}
                    onClick={() => setSelectedIndex(idx)}
                    className={`flex-shrink-0 rounded-lg overflow-hidden relative transition-all ${
                      idx === selectedIndex
                        ? 'ring-4 ring-amber-400 shadow-lg'
                        : 'bg-white shadow-md hover:shadow-lg'
                    }`}
                    style={{
                      width: idx === selectedIndex ? '200px' : '160px',
                      height: idx === selectedIndex ? '200px' : '160px',
                    }}
                  >
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
                  </button>
                ))}
              </div>
            </div>

            {/* Right Scroll Button */}
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-slate-100 rounded-full p-3 shadow-lg transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Scroll right"
            >
              →
            </button>
          </div>
        </div>

        {/* Detail Panel Below Carousel */}
        {selectedMango && (
          <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-amber-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left: Large image */}
              <div className="flex flex-col items-center">
                <div className="relative w-full h-80 bg-slate-100 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={selectedMango.imageUrl}
                    alt={selectedMango.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23e2e8f0" width="400" height="400"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23cbd5e1" font-size="20"%3E' +
                        encodeURIComponent(selectedMango.name) +
                        '%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              </div>

              {/* Right: Details and ordering */}
              <div>
                <h3 className="text-3xl font-bold text-slate-900 mb-2">{selectedMango.name}</h3>
                <p className="text-slate-600 text-lg mb-4">{selectedMango.description}</p>

                {selectedMango.inSeason && (
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 mb-4">
                    <p className="font-semibold text-green-900">✓ In Season - Peak Freshness!</p>
                  </div>
                )}

                <div className="bg-amber-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-slate-600 mb-1">Price Per Pound</p>
                  <p className="text-4xl font-bold text-amber-600">${selectedMango.pricePerPound.toFixed(2)}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-slate-600 mb-3">Select Quantity</p>
                  <PricingToggle mangoName={selectedMango.name} pricePerPound={selectedMango.pricePerPound} />
                </div>

                <button
                  onClick={() => handleAddToCart(1)}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Indicator Dots */}
        <div className="flex gap-2 justify-center mt-8">
          {mangoes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`w-3 h-3 rounded-full transition-colors ${
                idx === selectedIndex ? 'bg-amber-600' : 'bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to mango ${idx + 1}`}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <a href="/demo" className="text-slate-600 hover:text-slate-900 underline">
            ← Back to comparison
          </a>
        </div>
      </main>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
