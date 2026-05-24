'use client';

import Image from 'next/image';
import { MangoVariety } from '@/lib/types';

interface MangoCardProps {
  mango: MangoVariety;
  onClick: (mango: MangoVariety) => void;
  comingSoonDate?: string | null;
}

/**
 * Check if a fruit is coming soon based on its coming_soon_date.
 */
function isComingSoon(comingSoonDate: string | null | undefined): boolean {
  if (!comingSoonDate) return false;
  return new Date(comingSoonDate) > new Date();
}

/**
 * Format a date string for display as "Month Day, Year" (e.g., "June 15, 2026").
 */
function formatComingSoonDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function MangoCard({
  mango,
  onClick,
  comingSoonDate,
}: MangoCardProps) {
  const coming_soon = isComingSoon(comingSoonDate);

  return (
    <button
      onClick={() => (coming_soon ? null : onClick(mango))}
      disabled={coming_soon}
      className={`group relative h-full overflow-hidden rounded-lg bg-white shadow-md transition-all ${
        coming_soon
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:shadow-xl hover:scale-105'
      }`}
    >
      <div className="relative h-64 w-full overflow-hidden bg-slate-100">
        <Image
          src={mango.imageUrl}
          alt={mango.name}
          fill
          className="object-cover"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src =
              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23e2e8f0" width="300" height="300"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23cbd5e1" font-size="16"%3E' +
              encodeURIComponent(mango.name) +
              '%3C/text%3E%3C/svg%3E';
          }}
        />
        {mango.inSeason && !coming_soon && (
          <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            In Season
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-slate-900">{mango.name}</h3>
        <p className="text-sm text-slate-600 mt-2 line-clamp-2">
          {mango.description}
        </p>

        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="text-amber-600 font-semibold">
            ${mango.pricePerPound.toFixed(2)}/lb
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {coming_soon ? 'Coming Soon' : 'Click to order'}
          </div>
        </div>
      </div>

      {/* Coming Soon Overlay */}
      {coming_soon && comingSoonDate && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
          <div className="bg-white/95 px-4 py-3 rounded-lg text-center shadow-lg">
            <p className="text-sm font-semibold text-slate-900">Coming Soon</p>
            <p className="text-xs text-slate-600 mt-1">
              {formatComingSoonDate(comingSoonDate)}
            </p>
          </div>
        </div>
      )}
    </button>
  );
}
