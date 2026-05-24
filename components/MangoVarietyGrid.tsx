'use client';

import { useEffect, useState } from 'react';
import { MangoVariety } from '@/lib/types';
import { MangoCard } from './MangoCard';
import { getAvailableMangoes } from '@/lib/mangoes';

interface MangoVarietyGridProps {
  onSelectMango: (mango: MangoVariety) => void;
}

export function MangoVarietyGrid({ onSelectMango }: MangoVarietyGridProps) {
  const [mangoes, setMangoes] = useState<MangoVariety[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMangoes = async () => {
      try {
        setLoading(true);
        const data = await getAvailableMangoes();
        setMangoes(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load mangoes:', err);
        setError('Failed to load mangoes. Please try again later.');
        setMangoes([]);
      } finally {
        setLoading(false);
      }
    };

    loadMangoes();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Loading mangoes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (mangoes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">No mangoes available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      {mangoes.map((mango) => (
        <MangoCard key={mango.id} mango={mango} onClick={onSelectMango} />
      ))}
    </div>
  );
}
