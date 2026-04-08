import { type ReactNode } from 'react';
import styled, { css } from 'styled-components';

// ─── Types ────────────────────────────────────────────────────────────────────

export type BadgeVariant = 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

// ─── Styled ───────────────────────────────────────────────────────────────────

const variantMap = {
  default: css`
    background: ${({ theme }) => theme.colors.surface.default};
    border-color: ${({ theme }) => theme.colors.surface.border};
    color: ${({ theme }) => theme.colors.text.secondary};
  `,
  brand: css`
    background: rgba(107, 86, 243, 0.15);
    border-color: rgba(107, 86, 243, 0.3);
    color: ${({ theme }) => theme.colors.brand[400]};
  `,
  success: css`
    background: rgba(16, 185, 129, 0.15);
    border-color: rgba(16, 185, 129, 0.25);
    color: ${({ theme }) => theme.colors.accent.green};
  `,
  warning: css`
    background: rgba(245, 158, 11, 0.15);
    border-color: rgba(245, 158, 11, 0.25);
    color: ${({ theme }) => theme.colors.accent.yellow};
  `,
  danger: css`
    background: rgba(239, 68, 68, 0.15);
    border-color: rgba(239, 68, 68, 0.25);
    color: ${({ theme }) => theme.colors.accent.red};
  `,
  info: css`
    background: rgba(6, 182, 212, 0.15);
    border-color: rgba(6, 182, 212, 0.25);
    color: ${({ theme }) => theme.colors.accent.cyan};
  `,
};

const StyledBadge = styled.span<{ $variant: BadgeVariant; $size: BadgeSize }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radii.full};
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  line-height: 1;

  ${({ $size, theme }) =>
    $size === 'sm'
      ? css`padding: 2px ${theme.spacing[2]};`
      : css`padding: 4px 10px;`}

  ${({ $variant }) => variantMap[$variant]}
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
}: BadgeProps) {
  return (
    <StyledBadge $variant={variant} $size={size} className={className}>
      {children}
    </StyledBadge>
  );
}
