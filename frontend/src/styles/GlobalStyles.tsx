'use client';
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  html {
    scroll-behavior: smooth;
    -webkit-tap-highlight-color: transparent;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily.sans};
    background-color: ${({ theme }) => theme.colors.background.primary};
    color: ${({ theme }) => theme.colors.text.primary};
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background.secondary};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.surface.borderLight};
    border-radius: ${({ theme }) => theme.radii.full};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.brand[500]};
  }

  ::selection {
    background: rgba(107, 86, 243, 0.3);
    color: ${({ theme }) => theme.colors.text.primary};
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand[500]};
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.radii.sm};
  }
`;

export default GlobalStyles;
