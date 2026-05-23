import { render, screen } from '@testing-library/react';
import { MixBoxSelector } from '@/components/MixBoxSelector';

describe('MixBoxSelector', () => {
  test('displays all mix boxes from data', () => {
    render(<MixBoxSelector onSelectMixBox={() => {}} />);

    expect(screen.getByText('Small Mix Box')).toBeInTheDocument();
    expect(screen.getByText('Large Mix Box')).toBeInTheDocument();
    expect(screen.getByText('Premium Selection')).toBeInTheDocument();
  });

  test('displays mix box prices', () => {
    render(<MixBoxSelector onSelectMixBox={() => {}} />);

    expect(screen.getByText('$45.00')).toBeInTheDocument();
    expect(screen.getByText('$85.00')).toBeInTheDocument();
    expect(screen.getByText('$75.00')).toBeInTheDocument();
  });

  test('displays mix box weights', () => {
    render(<MixBoxSelector onSelectMixBox={() => {}} />);

    expect(screen.getByText('8 lbs')).toBeInTheDocument();
    expect(screen.getByText('18 lbs')).toBeInTheDocument();
    expect(screen.getByText('10 lbs')).toBeInTheDocument();
  });

  test('calls onSelectMixBox when box is clicked', () => {
    const onSelectMixBox = jest.fn();
    render(<MixBoxSelector onSelectMixBox={onSelectMixBox} />);

    const button = screen.getByRole('button', { name: /small mix box/i });
    button.click();

    expect(onSelectMixBox).toHaveBeenCalled();
  });
});
