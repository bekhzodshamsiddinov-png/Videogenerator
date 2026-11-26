/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F7F7F5',
        ink: '#111111',
        muted: '#6B6F76',
        line: '#E9E9E5',
        field: '#EFEFEB',
        accent: {
          DEFAULT: '#5B3DF5',
          press: '#4B2EE3',
          tint: '#EEEAFE',
        },
        success: '#12A150',
        warn: {
          DEFAULT: '#8A5A00',
          tint: '#FFEFC2',
        },
        danger: '#D93F45',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(17,17,17,0.04), 0 10px 28px -14px rgba(17,17,17,0.14)',
        accent: '0 12px 24px -12px rgba(91,61,245,0.6)',
        phone: '0 40px 80px -30px rgba(17,17,17,0.28), 0 0 0 1px rgba(17,17,17,0.06)',
      },
      transitionTimingFunction: {
        snappy: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
    },
  },
};
