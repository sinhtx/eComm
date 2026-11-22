'use client';

import { MangoVariety } from '@/lib/types';
import { MangoImage } from '@/components/MangoImage';
import { SeasonBadge } from '@/components/SeasonBadge';
import { formatDateOnly } from '@/lib/formatDate';
import { VARIETY_IMAGE_SIZES, varietyImageAlt } from '@/lib/mangoImages';

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
        <MangoImage
          src={mango.imageUrl}
          alt={varietyImageAlt(mango.name)}
          fill
          sizes={VARIETY_IMAGE_SIZES}
          className="object-cover"
        />
        {!coming_soon && (
          <div className="absolute top-3 right-3 left-3 flex justify-end">
            <SeasonBadge inSeason={mango.inSeason} />
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
              {formatDateOnly(comingSoonDate)}
            </p>
          </div>
        </div>
      )}
    </button>
  );
}
