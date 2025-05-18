// Theme constants for the application
export const COLORS = {
  // Primary palette
  primary: {
    50: '#E6F3FF',
    100: '#CCE7FF',
    200: '#99CFFF',
    300: '#66B8FF',
    400: '#33A0FF',
    500: '#0078D4', // Main primary color
    600: '#0064B0',
    700: '#004E8C',
    800: '#003968',
    900: '#002548',
  },
  
  // Secondary palette (teal)
  secondary: {
    50: '#E6F9F9',
    100: '#CCF4F4',
    200: '#99E9E9',
    300: '#66DEDE',
    400: '#33D4D4',
    500: '#028484', // Main secondary color
    600: '#026E6E',
    700: '#015858',
    800: '#014242',
    900: '#012C2C',
  },
  
  // Accent (gold/yellow)
  accent: {
    50: '#FFF8E6',
    100: '#FFF2CC',
    200: '#FFE699',
    300: '#FFD966',
    400: '#FFCC33',
    500: '#FFB900', // Main accent color
    600: '#D49C00',
    700: '#AA7D00',
    800: '#805E00',
    900: '#553F00',
  },
  
  // Success states
  success: {
    50: '#E6F7EF',
    100: '#CCEFDF',
    200: '#99DFBE',
    300: '#66CF9E',
    400: '#33BF7D',
    500: '#00AB5E',
    600: '#008C4D',
    700: '#006E3D',
    800: '#00502E',
    900: '#00321E',
  },
  
  // Warning states
  warning: {
    50: '#FFF6E6',
    100: '#FFEDCC',
    200: '#FFDB99',
    300: '#FFC966',
    400: '#FFB733',
    500: '#FF9800',
    600: '#D47D00',
    700: '#AA6400',
    800: '#804B00',
    900: '#553200',
  },
  
  // Error states
  error: {
    50: '#FDEBEB',
    100: '#FBD7D7',
    200: '#F7B0B0',
    300: '#F48888',
    400: '#F06161',
    500: '#E74C3C',
    600: '#C0392B',
    700: '#962D22',
    800: '#6D2018',
    900: '#45140F',
  },
};

export const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const SPACING = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
};

export const FONT = {
  family: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  size: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  weight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const ANIMATION = {
  default: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  fast: '100ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
};