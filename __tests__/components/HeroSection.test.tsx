import { render, screen } from '@testing-library/react';
import { HeroSection } from '@/components/HeroSection';

describe('HeroSection', () => {
  const defaultProps = {
    backgroundImage: '/images/hero-background.jpg',
    headline: 'Welcome to Mango Tango',
    subheading: 'Experience the finest organic mangoes',
    ctaText: 'Shop Now',
    ctaLink: '/shop',
  };

  test('renders headline text', () => {
    render(<HeroSection {...defaultProps} />);
    expect(screen.getByText('Welcome to Mango Tango')).toBeInTheDocument();
  });

  test('renders subheading text', () => {
    render(<HeroSection {...defaultProps} />);
    expect(
      screen.getByText('Experience the finest organic mangoes')
    ).toBeInTheDocument();
  });

  test('renders CTA button with correct text', () => {
    render(<HeroSection {...defaultProps} />);
    const button = screen.getByRole('link', { name: /shop now/i });
    expect(button).toBeInTheDocument();
  });

  test('CTA button has correct href', () => {
    render(<HeroSection {...defaultProps} />);
    const button = screen.getByRole('link', { name: /shop now/i });
    expect(button).toHaveAttribute('href', '/shop');
  });

  test('renders background image with correct src', () => {
    render(<HeroSection {...defaultProps} />);
    const img = screen.getByAltText('Hero background');
    expect(img).toHaveAttribute('src');
  });

  test('renders with default medium height', () => {
    const { container } = render(<HeroSection {...defaultProps} />);
    const heroDiv = container.firstChild;
    expect(heroDiv).toHaveClass('h-screen');
  });

  test('renders with short height when specified', () => {
    const { container } = render(
      <HeroSection {...defaultProps} height="short" />
    );
    const heroDiv = container.firstChild;
    expect(heroDiv).toHaveClass('h-96');
  });

  test('renders with tall height when specified', () => {
    const { container } = render(
      <HeroSection {...defaultProps} height="tall" />
    );
    const heroDiv = container.firstChild;
    expect(heroDiv).toHaveClass('h-[80vh]');
  });

  test('has correct responsive classes', () => {
    const { container } = render(<HeroSection {...defaultProps} />);
    const heroDiv = container.firstChild;
    expect(heroDiv).toHaveClass('w-full', 'overflow-hidden', 'relative');
  });

  test('renders with correct layout structure', () => {
    const { container } = render(<HeroSection {...defaultProps} />);
    const overlays = container.querySelectorAll('.absolute');
    expect(overlays.length).toBeGreaterThanOrEqual(2); // gradient overlay and content overlay
  });
});
