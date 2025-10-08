/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './contexts/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme with WCAG 2.1 AA compliant contrast
        background: '#0a0a0b',
        foreground: '#fafafa',
        white: '#ffffff',
        card: {
          DEFAULT: 'rgba(255, 255, 255, 0.05)',
          hover: 'rgba(255, 255, 255, 0.08)',
        },
        border: 'rgba(255, 255, 255, 0.1)',
        primary: {
          DEFAULT: '#3b82f6',
          foreground: '#fafafa',
        },
        secondary: {
          DEFAULT: 'rgba(255, 255, 255, 0.08)',
          foreground: '#e5e5e5',
        },
        muted: {
          DEFAULT: 'rgba(255, 255, 255, 0.05)',
          foreground: '#a3a3a3',
        },
        accent: {
          DEFAULT: '#6366f1',
          foreground: '#fafafa',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-sm': '0 4px 16px 0 rgba(31, 38, 135, 0.25)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
