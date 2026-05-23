import { render, screen } from '@testing-library/react';
import { MangoCard } from '@/components/MangoCard';

const mockMango = {
  id: 'carrie',
  name: 'Carrie',
  description: 'Sweet tropical flavor',
  imageUrl: '/images/mangoes/carrie.jpg',
  available: true,
  inSeason: true,
  pricePerPound: 6.5,
};

describe('MangoCard', () => {
  test('displays mango name', () => {
    render(<MangoCard mango={mockMango} onClick={() => {}} />);
    expect(screen.getByText('Carrie')).toBeInTheDocument();
  });

  test('displays mango description', () => {
    render(<MangoCard mango={mockMango} onClick={() => {}} />);
    expect(screen.getByText('Sweet tropical flavor')).toBeInTheDocument();
  });

  test('displays mango image with alt text', () => {
    render(<MangoCard mango={mockMango} onClick={() => {}} />);
    const img = screen.getByAltText('Carrie');
    expect(img).toBeInTheDocument();
  });

  test('displays in season badge when mango is in season', () => {
    render(<MangoCard mango={mockMango} onClick={() => {}} />);
    expect(screen.getByText(/in season/i)).toBeInTheDocument();
  });

  test('does not display in season badge when mango is not in season', () => {
    const offSeasonMango = { ...mockMango, inSeason: false };
    render(<MangoCard mango={offSeasonMango} onClick={() => {}} />);
    expect(screen.queryByText(/in season/i)).not.toBeInTheDocument();
  });

  test('displays price per pound', () => {
    render(<MangoCard mango={mockMango} onClick={() => {}} />);
    expect(screen.getByText(/\$6\.50\/lb/)).toBeInTheDocument();
  });

  test('is clickable', () => {
    const onClick = jest.fn();
    render(<MangoCard mango={mockMango} onClick={onClick} />);
    const card = screen.getByRole('button');
    card.click();
    expect(onClick).toHaveBeenCalledWith(mockMango);
  });
});
