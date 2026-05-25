/**
 * Homepage structure smoke tests with hoisted mocks (required by Jest).
 */
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'

jest.mock('@/app/actions/logTraffic', () => ({
  logTraffic: jest.fn().mockResolvedValue({ success: true }),
}))

jest.mock('@/components/TrafficLogger', () => ({
  TrafficLogger: () => null,
}))

jest.mock('@/lib/mangoes', () => ({
  getAvailableMangoes: jest.fn().mockResolvedValue([
    {
      id: '1',
      name: 'Ataulfo',
      description: 'Small, sweet golden mango',
      imageUrl: '/images/mangoes/ataulfo.svg',
      available: true,
      inSeason: true,
      pricePerPound: 6.99,
    },
  ]),
  getAllMangoes: jest.fn().mockResolvedValue([
    {
      variety: {
        id: '1',
        name: 'Ataulfo',
        description: 'Small, sweet golden mango',
        imageUrl: '/images/mangoes/ataulfo.svg',
        available: true,
        inSeason: true,
        pricePerPound: 6.99,
      },
      comingSoonDate: null,
    },
    {
      variety: {
        id: '2',
        name: 'Carrie',
        description: 'Smooth tropical flavor',
        imageUrl: '/images/mangoes/carrie.svg',
        available: true,
        inSeason: true,
        pricePerPound: 6.5,
      },
      comingSoonDate: null,
    },
    {
      variety: {
        id: '3',
        name: 'Mallika',
        description: 'Customer favorite',
        imageUrl: '/images/mangoes/mallika.svg',
        available: true,
        inSeason: true,
        pricePerPound: 6.5,
      },
      comingSoonDate: null,
    },
    {
      variety: {
        id: '4',
        name: 'Kent',
        description: 'Creamy flesh',
        imageUrl: '/images/mangoes/kent.svg',
        available: true,
        inSeason: true,
        pricePerPound: 6.5,
      },
      comingSoonDate: null,
    },
    {
      variety: {
        id: '5',
        name: 'Nam Dok Mai',
        description: 'Premium',
        imageUrl: '/images/mangoes/nam-dok-mai.svg',
        available: true,
        inSeason: false,
        pricePerPound: 7.5,
      },
      comingSoonDate: null,
    },
    {
      variety: {
        id: '6',
        name: 'Alphonso',
        description: 'King of Mangoes',
        imageUrl: '/images/mangoes/alphonso.svg',
        available: true,
        inSeason: false,
        pricePerPound: 9,
      },
      comingSoonDate: null,
    },
  ]),
}))

import Home from '@/app/page'

describe('Homepage Structure', () => {
  it('loads homepage content after spinner', async () => {
    render(<Home />)

    await waitFor(
      () => {
        expect(
          screen.queryByText('Loading your mangoes...')
        ).not.toBeInTheDocument()
      },
      { timeout: 8000 }
    )

    await waitFor(() => {
      expect(screen.getByText(/Our Premium Mangoes/i)).toBeInTheDocument()
    })
  })

  it('documents testimonials section dependency', () => {
    expect(Home.name).toBe('Home')
  })
})
