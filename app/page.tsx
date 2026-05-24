'use client';

import { useState, useEffect } from 'react';
import { MangoVariety, MixBox, CartItem } from '@/lib/types';
import { MangoVarietyGrid } from '@/components/MangoVarietyGrid';
import { MixBoxSelector } from '@/components/MixBoxSelector';
import { PricingToggle } from '@/components/PricingToggle';
import { CartSidebar } from '@/components/CartSidebar';
import { logTraffic } from '@/app/actions/logTraffic';

export default function Home() {
  const [selectedMango, setSelectedMango] = useState<MangoVariety | null>(null);
  const [selectedMixBox, setSelectedMixBox] = useState<MixBox | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<{
    orderId: string;
    paymentMethod: 'zelle' | 'stripe';
  } | null>(null);

  useEffect(() => {
    logTraffic({ pagePath: '/' }).catch(e => console.error('Failed to log traffic:', e));
  }, []);

  // Add mango to cart from detail panel
  const handleAddMangoToCart = (quantity: number, sizeOption: 'by-pound' | 'small-box' | 'large-box') => {
    if (!selectedMango) return;

    let pricePerUnit = selectedMango.pricePerPound;
    const name = selectedMango.name;
    const type: 'mango' | 'mixbox' = 'mango';

    // Map size option to price (these are example prices; adjust as needed)
    if (sizeOption === 'small-box') {
      pricePerUnit = selectedMango.pricePerPound * 5; // 5 lbs
    } else if (sizeOption === 'large-box') {
      pricePerUnit = selectedMango.pricePerPound * 10; // 10 lbs
    }

    const newItem: CartItem = {
      id: selectedMango.id,
      name,
      type,
      quantity,
      pricePerUnit,
      total: quantity * pricePerUnit,
    };

    setCartItems([...cartItems, newItem]);
    setSelectedMango(null);
    setIsCartOpen(true);
  };

  // Add mix box to cart from detail panel
  const handleAddMixBoxToCart = (quantity: number) => {
    if (!selectedMixBox) return;

    const newItem: CartItem = {
      id: selectedMixBox.id,
      name: selectedMixBox.name,
      type: 'mixbox',
      quantity,
      pricePerUnit: selectedMixBox.price,
      total: quantity * selectedMixBox.price,
    };

    setCartItems([...cartItems, newItem]);
    setSelectedMixBox(null);
    setIsCartOpen(true);
  };

  const handleRemoveCartItem = (itemId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const handleUpdateCartQuantity = (itemId: string, quantity: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity, total: quantity * item.pricePerUnit }
          : item
      )
    );
  };

  const handleCheckoutComplete = (orderId: string, paymentMethod: 'zelle' | 'stripe') => {
    setOrderConfirmation({ orderId, paymentMethod });
    setCartItems([]);
  };

  // Show confirmation after successful checkout
  if (orderConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-4xl font-bold text-slate-900">Seasonal Fruit Farm</h1>
            <p className="text-slate-600 mt-2">Handpicked Premium Organic Mangoes</p>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-green-900 mb-4">Order Confirmed! 🎉</h2>
            <p className="text-lg text-green-800 mb-6">Order ID: <strong>{orderConfirmation.orderId}</strong></p>

            {orderConfirmation.paymentMethod === 'zelle' ? (
              <div className="bg-white p-6 rounded-lg mb-6 text-left">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Payment Instructions</h3>
                <p className="text-slate-700 mb-2">Please transfer the order amount via Zelle to:</p>
                <div className="bg-slate-100 p-4 rounded text-slate-900 font-mono">
                  <p>Account: Seasonal Fruit Farm</p>
                  <p>Email: orders@seasonalfruitfarm.com</p>
                </div>
                <p className="text-slate-600 mt-4 text-sm">Our manager will review your order and confirm shipment within 1-2 business days.</p>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg mb-6">
                <p className="text-slate-700">Your payment is being processed. You&apos;ll receive a confirmation email shortly.</p>
              </div>
            )}

            <button
              onClick={() => setOrderConfirmation(null)}
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Seasonal Fruit Farm</h1>
            <p className="text-slate-600 mt-2">Handpicked Premium Organic Mangoes</p>
          </div>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            aria-label="Open shopping cart"
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Hero Section */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-slate-900">Discover Our Mango Collection</h2>
          <p className="text-lg text-slate-600 max-w-2xl">
            Choose from 10 premium mango varieties, handpicked from our sustainable orchards.
            Each variety offers unique flavors and characteristics&mdash;from smooth and creamy to
            sweet and aromatic.
          </p>
        </div>

        {/* Mango Variety Grid */}
        <div>
          <h3 className="text-2xl font-bold text-slate-900 mb-8">Individual Varieties</h3>
          <MangoVarietyGrid onSelectMango={setSelectedMango} />
        </div>

        {/* Mix Box Selector */}
        <div>
          <h3 className="text-2xl font-bold text-slate-900 mb-8">Curated Mix Boxes</h3>
          <MixBoxSelector onSelectMixBox={setSelectedMixBox} />
        </div>

        {/* Selected Mango Detail */}
        {selectedMango && (
          <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-amber-200">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-3xl font-bold text-slate-900">{selectedMango.name}</h3>
                <p className="text-slate-600 mt-2">{selectedMango.description}</p>
              </div>
              <button
                onClick={() => setSelectedMango(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-6 rounded-lg mb-6">
              <p className="text-sm text-slate-600 mb-2">Select Your Order</p>
              <PricingToggle pricePerPound={selectedMango.pricePerPound} />
            </div>

            <button
              onClick={() => handleAddMangoToCart(1, 'by-pound')}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 text-lg"
              aria-label="Add to cart"
            >
              Add to Cart
            </button>
          </div>
        )}

        {/* Selected Mix Box Detail */}
        {selectedMixBox && (
          <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-amber-200">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-3xl font-bold text-slate-900">{selectedMixBox.name}</h3>
                <p className="text-slate-600 mt-2">{selectedMixBox.description}</p>
              </div>
              <button
                onClick={() => setSelectedMixBox(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-6 rounded-lg mb-6 space-y-4">
              <div>
                <p className="text-sm text-slate-600 mb-2">Weight</p>
                <p className="text-2xl font-bold text-slate-900">{selectedMixBox.weight} lbs</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-2">Price</p>
                <p className="text-3xl font-bold text-amber-600">${selectedMixBox.price.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-2">Varieties Included</p>
                <p className="text-slate-700">{selectedMixBox.varieties.join(', ')}</p>
              </div>
            </div>

            <button
              onClick={() => handleAddMixBoxToCart(1)}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 text-lg"
              aria-label="Add to cart"
            >
              Add to Cart
            </button>
          </div>
        )}

        {/* Why Choose Us */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Why Choose Us?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-5xl mb-2">🌱</p>
              <p className="font-semibold text-slate-900">100% Organic</p>
              <p className="text-slate-600 text-sm mt-2">
                Sustainably grown without synthetic pesticides or chemicals
              </p>
            </div>
            <div>
              <p className="text-5xl mb-2">📦</p>
              <p className="font-semibold text-slate-900">Fresh Delivery</p>
              <p className="text-slate-600 text-sm mt-2">
                Harvested fresh and delivered to your door within 48 hours
              </p>
            </div>
            <div>
              <p className="text-5xl mb-2">🌍</p>
              <p className="font-semibold text-slate-900">Seasonal Excellence</p>
              <p className="text-slate-600 text-sm mt-2">
                Only the best varieties available at peak ripeness
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onCheckoutComplete={handleCheckoutComplete}
      />
    </div>
  );
}
