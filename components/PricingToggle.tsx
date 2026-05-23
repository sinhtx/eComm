'use client';

import { useState } from 'react';

export type PricingOption = 'pound' | 'small_box' | 'large_box';

interface PricingConfig {
  label: string;
  price: number;
  weight?: number;
}

interface PricingToggleProps {
  pricePerPound?: number;
}

const PRICING: Record<PricingOption, PricingConfig> = {
  pound: {
    label: 'By the Pound',
    price: 6.5,
  },
  small_box: {
    label: 'Small Box',
    price: 45.0,
    weight: 8,
  },
  large_box: {
    label: 'Large Box',
    price: 85.0,
    weight: 18,
  },
};

export function PricingToggle({ pricePerPound }: PricingToggleProps) {
  const [selectedOption, setSelectedOption] = useState<PricingOption>('pound');
  const [quantity, setQuantity] = useState(1);

  const config = PRICING[selectedOption];
  const basePrice = pricePerPound || config.price;
  const total = selectedOption === 'pound' ? quantity * basePrice : config.price;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {(Object.entries(PRICING) as [PricingOption, PricingConfig][]).map(([key, option]) => (
          <button
            key={key}
            onClick={() => setSelectedOption(key)}
            data-selected={selectedOption === key}
            className={`w-full p-4 border-2 rounded-lg transition-colors text-left ${
              selectedOption === key
                ? 'border-amber-600 bg-amber-50'
                : 'border-gray-300 bg-white hover:border-amber-400'
            }`}
          >
            <div className="font-semibold text-lg text-gray-900">{option.label}</div>
            <div className="text-sm text-gray-600 mt-1">
              {option.weight && `${option.weight} lbs `}
              ${option.price.toFixed(2)}
              {key === 'pound' && '/lb'}
            </div>
          </button>
        ))}
      </div>

      {selectedOption === 'pound' && (
        <div className="space-y-2">
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            Quantity (lbs)
          </label>
          <input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
          />
        </div>
      )}

      <div className="bg-gray-100 p-4 rounded-lg">
        <div className="text-sm text-gray-600">Total</div>
        <div className="text-3xl font-bold text-gray-900">
          ${total.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
