import { MangoVariety } from './types';

export const mangoes: MangoVariety[] = [
  {
    id: 'carrie',
    name: 'Carrie',
    description: 'Sweet, smooth tropical flavor with minimal fiber. Perfect for first-time mango lovers.',
    imageUrl: '/images/mangoes/carrie.svg',
    available: true,
    inSeason: true,
    pricePerPound: 6.5,
  },
  {
    id: 'mallika',
    name: 'Mallika',
    description: 'Rich, creamy texture with balanced sweetness and slight tang. A customer favorite.',
    imageUrl: '/images/mangoes/mallika.svg',
    available: true,
    inSeason: true,
    pricePerPound: 6.5,
  },
  {
    id: 'nam-dok-mai',
    name: 'Nam Dok Mai',
    description: 'Golden-colored with floral notes and smooth, fiber-free flesh. Premium quality.',
    imageUrl: '/images/mangoes/nam-dok-mai.svg',
    available: true,
    inSeason: false,
    pricePerPound: 7.5,
  },
  {
    id: 'frorigan',
    name: 'Frorigan',
    description: 'Large, vibrant mango with sweet juice and aromatic flavor profile.',
    imageUrl: '/images/mangoes/frorigan.svg',
    available: true,
    inSeason: true,
    pricePerPound: 6.0,
  },
  {
    id: 'kent',
    name: 'Kent',
    description: 'Stringless, creamy flesh with delicate sweetness. Excellent for fresh eating.',
    imageUrl: '/images/mangoes/kent.svg',
    available: true,
    inSeason: true,
    pricePerPound: 6.5,
  },
  {
    id: 'tommy-atkins',
    name: 'Tommy Atkins',
    description: 'Firm texture, good shipping quality, naturally sweet with slight tartness.',
    imageUrl: '/images/mangoes/tommy-atkins.svg',
    available: true,
    inSeason: true,
    pricePerPound: 5.5,
  },
  {
    id: 'ataulfo',
    name: 'Ataulfo',
    description: 'Small but mighty—dense, creamy, and intensely sweet. No fiber.',
    imageUrl: '/images/mangoes/ataulfo.svg',
    available: true,
    inSeason: false,
    pricePerPound: 8.0,
  },
  {
    id: 'alphonso',
    name: 'Alphonso',
    description: 'The King of Mangoes—buttery texture, complex flavor, premium delicacy.',
    imageUrl: '/images/mangoes/alphonso.svg',
    available: true,
    inSeason: false,
    pricePerPound: 9.0,
  },
  {
    id: 'francis',
    name: 'Francis',
    description: 'Unique elongated shape, sweet-tart balance, velvety skin.',
    imageUrl: '/images/mangoes/francis.svg',
    available: false,
    inSeason: false,
    pricePerPound: 7.0,
  },
  {
    id: 'haden',
    name: 'Haden',
    description: 'Classic heritage variety, red-blushed skin, sweet and aromatic.',
    imageUrl: '/images/mangoes/haden.svg',
    available: true,
    inSeason: false,
    pricePerPound: 6.5,
  },
];

export function getAvailableMangoes(): MangoVariety[] {
  return mangoes.filter((m) => m.available);
}

export function getMangoById(id: string): MangoVariety | undefined {
  return mangoes.find((m) => m.id === id);
}
