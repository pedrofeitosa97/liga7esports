import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
      },
      colors: {
        // Dark theme base
        background: {
          DEFAULT: '#0a0a0f',
          secondary: '#111118',
          tertiary: '#1a1a24',
          card: '#16161f',
          elevated: '#1e1e2a',
        },
        // Brand colors
        brand: {
          50: '#f0f0ff',
          100: '#e4e4ff',
          200: '#cdcbfe',
          300: '#ada9fd',
          400: '#8b7ff9',
          500: '#6b56f3',
          600: '#5a3be8',
          700: '#4c2cca',
          800: '#3f26a5',
          900: '#362485',
          950: '#200f5c',
        },
        // Accent colors
        accent: {
          purple: '#7c3aed',
          blue: '#2563eb',
          cyan: '#06b6d4',
          green: '#10b981',
          yellow: '#f59e0b',
          red: '#ef4444',
          pink: '#ec4899',
        },
        // Surface
        surface: {
          DEFAULT: '#1a1a24',
          hover: '#222232',
          active: '#2a2a3c',
          border: '#2a2a3c',
          'border-light': '#3a3a50',
        },
        // Text
        text: {
          primary: '#f8f8fc',
          secondary: '#a0a0b8',
          tertiary: '#6a6a82',
          muted: '#4a4a60',
          inverse: '#0a0a0f',
        },
      },
      borderRadius: {
        ios: '12px',
        'ios-lg': '16px',
        'ios-xl': '20px',
        'ios-2xl': '28px',
        'ios-full': '9999px',
      },
      boxShadow: {
        ios: '0 2px 20px rgba(0, 0, 0, 0.4)',
        'ios-sm': '0 1px 8px rgba(0, 0, 0, 0.3)',
        'ios-lg': '0 8px 40px rgba(0, 0, 0, 0.5)',
        'ios-glow': '0 0 30px rgba(107, 86, 243, 0.3)',
        'ios-glow-sm': '0 0 15px rgba(107, 86, 243, 0.2)',
        brand: '0 4px 24px rgba(107, 86, 243, 0.4)',
        'brand-lg': '0 8px 40px rgba(107, 86, 243, 0.5)',
        card: '0 2px 16px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
        glass: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #6b56f3 0%, #4c2cca 100%)',
        'gradient-hero': 'linear-gradient(135deg, #0a0a0f 0%, #16102a 50%, #0a0a0f 100%)',
        'gradient-card': 'linear-gradient(145deg, #1e1e2a 0%, #16161f 100%)',
        'gradient-purple-blue': 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
        'gradient-green': 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
        'gradient-fire': 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-scale': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(107, 86, 243, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(107, 86, 243, 0.6)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-in-scale': 'fade-in-scale 0.3s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        shimmer: 'shimmer 2s infinite linear',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
