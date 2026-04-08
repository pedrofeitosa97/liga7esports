import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import Badge from '../Badge';
import { theme } from '@/styles/theme';

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('Badge', () => {
  it('renders label', () => {
    renderWithTheme(<Badge>Aberto</Badge>);
    expect(screen.getByText('Aberto')).toBeInTheDocument();
  });

  it.each(['default', 'brand', 'success', 'warning', 'danger', 'info'] as const)(
    'renders %s variant',
    (variant) => {
      renderWithTheme(<Badge variant={variant}>{variant}</Badge>);
      expect(screen.getByText(variant)).toBeInTheDocument();
    },
  );
});
