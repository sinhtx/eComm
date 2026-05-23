'use client';

import Image from 'next/image';
import { MangoVariety } from '@/lib/types';

interface MangoCardProps {
  mango: MangoVariety;
  onClick: (mango: MangoVariety) => void;
}

export function MangoCard({ mango, onClick }: MangoCardProps) {
  return (
    <button
      onClick={() => onClick(mango)}
      className="group relative h-full overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-xl hover:scale-105"
    >
      <div className="relative h-64 w-full overflow-hidden bg-slate-100">
        <Image
          src={mango.imageUrl}
          alt={mango.name}
          fill
          className="object-cover"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23e2e8f0" width="300" height="300"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23cbd5e1" font-size="16"%3E' + encodeURIComponent(mango.name) + '%3C/text%3E%3C/svg%3E';
          }}
        />
        {mango.inSeason && (
          <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            In Season
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-slate-900">{mango.name}</h3>
        <p className="text-sm text-slate-600 mt-2 line-clamp-2">{mango.description}</p>

        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="text-amber-600 font-semibold">
            ${mango.pricePerPound.toFixed(2)}/lb
          </div>
          <div className="text-xs text-slate-500 mt-1">Click to order</div>
        </div>
      </div>
    </button>
  );
}
