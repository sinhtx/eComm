import { render, screen, fireEvent } from '@testing-library/react';
import { PricingToggle } from '@/components/PricingToggle';

describe('PricingToggle', () => {
  test('displays three pricing options', () => {
    render(<PricingToggle />);

    expect(screen.getByRole('button', { name: /by the pound/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /small box/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /large box/i })).toBeInTheDocument();
  });

  test('displays prices for each option', () => {
    render(<PricingToggle />);

    expect(screen.getByText(/\$6\.50\/lb/)).toBeInTheDocument();
    expect(screen.getByText(/\$45\.00/)).toBeInTheDocument();
    expect(screen.getByText(/\$85\.00/)).toBeInTheDocument();
  });

  test('selects by the pound option by default', () => {
    render(<PricingToggle />);

    const byPoundButton = screen.getByRole('button', { name: /by the pound/i });
    expect(byPoundButton).toHaveAttribute('data-selected', 'true');
  });

  test('allows selecting small box option', () => {
    render(<PricingToggle />);

    const smallBoxButton = screen.getByRole('button', { name: /small box/i });
    fireEvent.click(smallBoxButton);

    expect(smallBoxButton).toHaveAttribute('data-selected', 'true');
    expect(screen.getByRole('button', { name: /by the pound/i })).toHaveAttribute('data-selected', 'false');
  });

  test('allows selecting large box option', () => {
    render(<PricingToggle />);

    const largeBoxButton = screen.getByRole('button', { name: /large box/i });
    fireEvent.click(largeBoxButton);

    expect(largeBoxButton).toHaveAttribute('data-selected', 'true');
  });

  test('calculates total price based on quantity when by the pound is selected', () => {
    render(<PricingToggle />);

    const quantityInput = screen.getByDisplayValue('1');
    fireEvent.change(quantityInput, { target: { value: '2' } });

    expect(screen.getByText('$13.00')).toBeInTheDocument();
  });

  test('shows total price for small box option', () => {
    render(<PricingToggle />);

    const smallBoxButton = screen.getByRole('button', { name: /small box/i });
    fireEvent.click(smallBoxButton);

    expect(screen.getByText('$45.00')).toBeInTheDocument();
  });

  test('shows total price for large box option', () => {
    render(<PricingToggle />);

    const largeBoxButton = screen.getByRole('button', { name: /large box/i });
    fireEvent.click(largeBoxButton);

    expect(screen.getByText('$85.00')).toBeInTheDocument();
  });

  test('displays weight information for each option', () => {
    const { container } = render(<PricingToggle />);

    const buttons = container.querySelectorAll('button');
    expect(buttons[1]).toHaveTextContent('8 lbs');
    expect(buttons[2]).toHaveTextContent('18 lbs');
  });
});
