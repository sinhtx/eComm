import { render, screen } from '@testing-library/react';

// Mock the server action before importing the component
jest.mock('@/app/actions/logTraffic', () => ({
  logTraffic: jest.fn().mockResolvedValue({ success: true }),
}));

import Home from '@/app/page';

describe('Home Page', () => {
  test('displays page headline for discovering mangoes', () => {
    render(<Home />);

    expect(screen.getByText(/discover our mango collection/i)).toBeInTheDocument();
  });

  test('displays variety and mix box section headers', () => {
    render(<Home />);

    expect(screen.getByText(/individual varieties/i)).toBeInTheDocument();
    expect(screen.getByText(/curated mix boxes/i)).toBeInTheDocument();
  });

  test('displays why choose us section', () => {
    render(<Home />);

    expect(screen.getByText(/why choose us/i)).toBeInTheDocument();
    expect(screen.getByText(/100% Organic/i)).toBeInTheDocument();
    expect(screen.getByText(/Fresh Delivery/i)).toBeInTheDocument();
  });

  test('displays mango variety cards', () => {
    render(<Home />);

    // Check for some of the available mangoes
    expect(screen.getByText('Carrie')).toBeInTheDocument();
    expect(screen.getByText('Mallika')).toBeInTheDocument();
    expect(screen.getByText('Kent')).toBeInTheDocument();
  });

  test('displays mix box options', () => {
    render(<Home />);

    expect(screen.getByText('Small Mix Box')).toBeInTheDocument();
    expect(screen.getByText('Large Mix Box')).toBeInTheDocument();
    expect(screen.getByText('Premium Selection')).toBeInTheDocument();
  });

  test('displays premium organic description', () => {
    render(<Home />);

    expect(screen.getByText(/choose from 10 premium mango varieties/i)).toBeInTheDocument();
  });
});
