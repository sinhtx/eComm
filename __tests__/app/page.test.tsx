import { render, screen, waitFor } from '@testing-library/react';

jest.mock('@/app/actions/logTraffic', () => ({
  logTraffic: jest.fn().mockResolvedValue({ success: true }),
}));

jest.mock('@/components/TrafficLogger', () => ({
  TrafficLogger: () => null,
}));

import Home from '@/app/page';

describe('Home Page', () => {
  test('shows hero headline from Pine Island', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /Fresh Mangoes from Pine Island/i })
      ).toBeInTheDocument();
    });
  });

  test('renders featured mango grid section after load', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/Our Premium Mangoes/i)).toBeInTheDocument();
    });
  });

  test('shows value proposition titles', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/Why Choose Our Mangoes/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/Organic Philosophy/i)).toBeInTheDocument();
    });
  });

  test('shows variety names from fallback or database catalog', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Carrie')).toBeInTheDocument();
    });
    expect(await screen.findByText('Kent')).toBeInTheDocument();
  });

  test('links Shop CTA', async () => {
    render(<Home />);

    await waitFor(() => {
      const shopLinks = screen.getAllByRole('link', { name: /shop now/i });
      expect(shopLinks.length).toBeGreaterThanOrEqual(1);
    });
  });

  test('shows link to shop for all varieties', async () => {
    render(<Home />);

    const viewAll = await screen.findByRole('link', { name: /View All Varieties/i });
    expect(viewAll).toHaveAttribute('href', '/shop');
  });
});
