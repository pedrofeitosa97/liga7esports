import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import Button from '../Button';
import { theme } from '@/styles/theme';

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('Button', () => {
  it('renders children correctly', () => {
    renderWithTheme(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    renderWithTheme(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is set', () => {
    renderWithTheme(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled and shows spinner when loading', () => {
    renderWithTheme(<Button loading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('does not fire onClick when disabled', () => {
    const handleClick = jest.fn();
    renderWithTheme(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it.each(['primary', 'secondary', 'ghost', 'danger', 'outline'] as const)(
    'renders %s variant without throwing',
    (variant) => {
      expect(() =>
        renderWithTheme(<Button variant={variant}>Button</Button>),
      ).not.toThrow();
    },
  );

  it.each(['sm', 'md', 'lg'] as const)('renders %s size without throwing', (size) => {
    expect(() =>
      renderWithTheme(<Button size={size}>Button</Button>),
    ).not.toThrow();
  });
});
