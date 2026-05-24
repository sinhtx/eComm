import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Warm
        'primary-yellow': '#F4A020',
        'primary-orange': '#FF6B35',
        // Secondary
        'secondary-green': '#2D5016',
        // Accent
        'accent-pink': '#FF6B9D',
        // Neutral Light
        'neutral-cream': '#FFFEF7',
        'neutral-off-white': '#F9F7F4',
        // Neutral Dark
        'neutral-charcoal': '#2C2C2C',
        'neutral-gray': '#666666',
        // Text
        'text-dark': '#2C2C2C',
        'text-medium': '#666666',
      },
      fontFamily: {
        poppins: ['var(--font-poppins)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
        georgia: ['Georgia', 'serif'],
      },
      fontSize: {
        'h1': ['48px', { lineHeight: '1.3', fontWeight: '700' }],
        'h2': ['36px', { lineHeight: '1.3', fontWeight: '700' }],
        'h3': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'small': ['14px', { lineHeight: '1.6', fontWeight: '400' }],
        'accent': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
      },
      spacing: {
        // 8px baseline grid
        0: '0px',
        1: '8px',
        2: '16px',
        3: '24px',
        4: '32px',
        5: '40px',
        6: '48px',
        7: '56px',
        8: '64px',
        9: '72px',
        10: '80px',
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'full': '50%',
      },
      boxShadow: {
        'subtle': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'medium': '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
};

export default config;
