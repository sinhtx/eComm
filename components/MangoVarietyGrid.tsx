'use client';

import { MangoVariety } from '@/lib/types';
import { MangoCard } from './MangoCard';
import { getAvailableMangoes } from '@/lib/mangoes';

interface MangoVarietyGridProps {
  onSelectMango: (mango: MangoVariety) => void;
}

export function MangoVarietyGrid({ onSelectMango }: MangoVarietyGridProps) {
  const availableMangoes = getAvailableMangoes();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      {availableMangoes.map((mango) => (
        <MangoCard key={mango.id} mango={mango} onClick={onSelectMango} />
      ))}
    </div>
  );
}
