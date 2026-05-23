import { render, screen } from '@testing-library/react';
import { MangoVarietyGrid } from '@/components/MangoVarietyGrid';

describe('MangoVarietyGrid', () => {
  test('displays available mangoes from data', () => {
    render(<MangoVarietyGrid onSelectMango={() => {}} />);

    // Check for mangoes that are marked as available in lib/mangoes.ts
    expect(screen.getByText('Carrie')).toBeInTheDocument();
    expect(screen.getByText('Mallika')).toBeInTheDocument();
    expect(screen.getByText('Kent')).toBeInTheDocument();
  });

  test('does not display unavailable mangoes', () => {
    render(<MangoVarietyGrid onSelectMango={() => {}} />);

    // Francis is marked as available: false in lib/mangoes.ts
    expect(screen.queryByText('Francis')).not.toBeInTheDocument();
  });

  test('calls onSelectMango when card is clicked', () => {
    const onSelectMango = jest.fn();
    render(<MangoVarietyGrid onSelectMango={onSelectMango} />);

    const carrieButton = screen.getByRole('button', { name: /carrie/i });
    carrieButton.click();

    expect(onSelectMango).toHaveBeenCalled();
  });

  test('displays multiple mango cards in grid', () => {
    render(<MangoVarietyGrid onSelectMango={() => {}} />);

    const buttons = screen.getAllByRole('button');
    // Should have at least the available mangoes (currently 9 out of 10)
    expect(buttons.length).toBeGreaterThan(5);
  });
});
