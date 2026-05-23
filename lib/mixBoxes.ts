import { MixBox } from './types';

export const mixBoxes: MixBox[] = [
  {
    id: 'small-mix',
    name: 'Small Mix Box',
    varieties: ['carrie', 'mallika', 'kent'],
    weight: 8,
    price: 45.0,
    imageUrl: '/images/mangoes/mix-box-small.svg',
    description: 'A curated selection of 3 premium varieties. Perfect for sampling.',
  },
  {
    id: 'large-mix',
    name: 'Large Mix Box',
    varieties: ['carrie', 'mallika', 'kent', 'frorigan', 'tommy-atkins'],
    weight: 18,
    price: 85.0,
    imageUrl: '/images/mangoes/mix-box-large.svg',
    description: 'Our signature assortment featuring 5 varieties for a complete tasting experience.',
  },
  {
    id: 'premium-mix',
    name: 'Premium Selection',
    varieties: ['alphonso', 'ataulfo', 'nam-dok-mai', 'carrie'],
    weight: 10,
    price: 75.0,
    imageUrl: '/images/mangoes/mix-box-premium.svg',
    description: 'Our most luxurious selection featuring rare and premium varieties.',
  },
];

export function getMixBoxById(id: string): MixBox | undefined {
  return mixBoxes.find((b) => b.id === id);
}
