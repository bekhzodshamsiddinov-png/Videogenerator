/** @type {import('tailwindcss').Config} */
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['"Inter Variable"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'] },
      colors: {
        bg: v('bg'),
        surface: v('surface'),
        sunken: v('sunken'),
        ink: v('ink'),
        muted: v('muted'),
        faint: v('faint'),
        line: v('line'),
        brand: {
          50: v('brand-50'), 100: v('brand-100'), 200: v('brand-200'),
          500: '#6366F1', 600: v('brand-600'), 700: v('brand-700'),
        },
      },
      keyframes: {
        'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } },
        'slide-up': { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'none' } },
        kenburns: { from: { transform: 'scale(1)' }, to: { transform: 'scale(1.08)' } },
      },
      animation: {
        'fade-in': 'fade-in .18s ease-out',
        'slide-up': 'slide-up .22s ease-out',
        kenburns: 'kenburns 3.2s ease-out forwards',
      },
    },
  },
  plugins: [],
}
