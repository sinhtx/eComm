'use client';

import { MixBox } from '@/lib/types';
import { MangoImage } from '@/components/MangoImage';
import { mixBoxes } from '@/lib/mixBoxes';

interface MixBoxSelectorProps {
  onSelectMixBox: (box: MixBox) => void;
}

export function MixBoxSelector({ onSelectMixBox }: MixBoxSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {mixBoxes.map((box) => (
        <button
          key={box.id}
          onClick={() => onSelectMixBox(box)}
          className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-xl hover:scale-105 text-left"
        >
          <div className="relative h-64 w-full overflow-hidden bg-slate-100">
            <MangoImage
              src={box.imageUrl}
              alt={box.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>

          <div className="p-4">
            <h3 className="text-lg font-bold text-slate-900">{box.name}</h3>
            <p className="text-sm text-slate-600 mt-2">{box.description}</p>

            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="flex justify-between items-baseline">
                <div>
                  <div className="text-sm text-slate-500">{box.weight} lbs</div>
                  <div className="text-xl font-bold text-amber-600">
                    ${box.price.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
