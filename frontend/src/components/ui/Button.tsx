'use client';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';
import { Loader2 } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

// ─── Styled ───────────────────────────────────────────────────────────────────

interface StyledButtonProps {
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
}

const sizeMap = {
  sm: css`
    padding: 8px 16px;
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
  `,
  md: css`
    padding: 12px 24px;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  `,
  lg: css`
    padding: 16px 32px;
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  `,
};

const variantMap = {
  primary: css`
    background: ${({ theme }) => theme.gradients.brand};
    color: ${({ theme }) => theme.colors.text.primary};
    border: none;
    border-radius: ${({ theme }) => theme.radii.full};
    box-shadow: ${({ theme }) => theme.shadows.brand};

    &:hover:not(:disabled) {
      box-shadow: ${({ theme }) => theme.shadows.brandLg};
      filter: brightness(1.1);
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.surface.default};
    color: ${({ theme }) => theme.colors.text.primary};
    border: 1px solid ${({ theme }) => theme.colors.surface.border};
    border-radius: ${({ theme }) => theme.radii.full};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.surface.hover};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.text.secondary};
    border: none;
    border-radius: ${({ theme }) => theme.radii.md};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.surface.default};
      color: ${({ theme }) => theme.colors.text.primary};
    }
  `,
  danger: css`
    background: rgba(239, 68, 68, 0.1);
    color: ${({ theme }) => theme.colors.accent.red};
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: ${({ theme }) => theme.radii.full};

    &:hover:not(:disabled) {
      background: rgba(239, 68, 68, 0.2);
    }
  `,
  outline: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.brand[400]};
    border: 1px solid rgba(107, 86, 243, 0.5);
    border-radius: ${({ theme }) => theme.radii.full};

    &:hover:not(:disabled) {
      background: rgba(107, 86, 243, 0.1);
    }
  `,
};

const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: 1;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ $size }) => sizeMap[$size]}
  ${({ $variant }) => variantMap[$variant]}
  ${({ $fullWidth }) => $fullWidth && css`width: 100%;`}
`;

// ─── Component ────────────────────────────────────────────────────────────────

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => (
    <StyledButton
      ref={ref}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </StyledButton>
  ),
);

Button.displayName = 'Button';
export default Button;
