export const theme = {
  colors: {
    background: {
      primary: '#0a0a0f',
      secondary: '#111118',
      tertiary: '#1a1a24',
      card: '#16161f',
      elevated: '#1e1e2a',
    },
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
    },
    accent: {
      purple: '#7c3aed',
      blue: '#2563eb',
      cyan: '#06b6d4',
      green: '#10b981',
      yellow: '#f59e0b',
      red: '#ef4444',
      pink: '#ec4899',
    },
    surface: {
      default: '#1a1a24',
      hover: '#222232',
      active: '#2a2a3c',
      border: '#2a2a3c',
      borderLight: '#3a3a50',
    },
    text: {
      primary: '#f8f8fc',
      secondary: '#a0a0b8',
      tertiary: '#6a6a82',
      muted: '#4a4a60',
      inverse: '#0a0a0f',
    },
  },

  spacing: {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    7: '28px',
    8: '32px',
    10: '40px',
    12: '48px',
    14: '56px',
    16: '64px',
    20: '80px',
    24: '96px',
    32: '128px',
  },

  typography: {
    fontFamily: {
      sans: "'Manrope', system-ui, -apple-system, sans-serif",
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
      '5xl': '48px',
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },

  radii: {
    none: '0',
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '28px',
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 8px rgba(0, 0, 0, 0.3)',
    md: '0 2px 20px rgba(0, 0, 0, 0.4)',
    lg: '0 8px 40px rgba(0, 0, 0, 0.5)',
    card: '0 2px 16px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
    glass: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4)',
    brand: '0 4px 24px rgba(107, 86, 243, 0.4)',
    brandLg: '0 8px 40px rgba(107, 86, 243, 0.5)',
    brandSm: '0 0 15px rgba(107, 86, 243, 0.2)',
  },

  gradients: {
    brand: 'linear-gradient(135deg, #6b56f3 0%, #4c2cca 100%)',
    hero: 'linear-gradient(135deg, #0a0a0f 0%, #16102a 50%, #0a0a0f 100%)',
    card: 'linear-gradient(145deg, #1e1e2a 0%, #16161f 100%)',
    cardElevated: 'linear-gradient(145deg, rgba(40, 40, 56, 0.95), rgba(28, 28, 40, 0.98))',
    purpleBlue: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
    green: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
    fire: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  },

  breakpoints: {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  transitions: {
    fast: '150ms ease',
    normal: '200ms ease',
    slow: '300ms ease',
    spring: '300ms cubic-bezier(0.32, 0.72, 0, 1)',
  },

  zIndex: {
    hide: -1,
    base: 0,
    raised: 10,
    dropdown: 100,
    sticky: 200,
    overlay: 300,
    modal: 400,
    toast: 500,
    tooltip: 600,
  },
} as const;

export type AppTheme = typeof theme;

// Helper: responsive media query builder
export const mq = {
  sm: `@media (min-width: ${theme.breakpoints.sm})`,
  md: `@media (min-width: ${theme.breakpoints.md})`,
  lg: `@media (min-width: ${theme.breakpoints.lg})`,
  xl: `@media (min-width: ${theme.breakpoints.xl})`,
};
