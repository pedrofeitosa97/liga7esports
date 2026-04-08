import { type ElementType, type HTMLAttributes, type ReactNode } from 'react';
import styled, { css } from 'styled-components';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TypographyVariant =
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'body1' | 'body2'
  | 'caption' | 'overline' | 'label';

export type TypographyColor =
  | 'primary' | 'secondary' | 'tertiary' | 'muted' | 'brand' | 'success' | 'warning' | 'danger';

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  color?: TypographyColor;
  as?: ElementType;
  truncate?: boolean;
  children: ReactNode;
}

// ─── Styled ───────────────────────────────────────────────────────────────────

const variantStyles: Record<TypographyVariant, ReturnType<typeof css>> = {
  h1: css`
    font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.extrabold};
    line-height: ${({ theme }) => theme.typography.lineHeight.tight};
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};
  `,
  h2: css`
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    line-height: ${({ theme }) => theme.typography.lineHeight.tight};
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};
  `,
  h3: css`
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    line-height: ${({ theme }) => theme.typography.lineHeight.snug};
  `,
  h4: css`
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    line-height: ${({ theme }) => theme.typography.lineHeight.snug};
  `,
  h5: css`
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    line-height: ${({ theme }) => theme.typography.lineHeight.snug};
  `,
  h6: css`
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  `,
  body1: css`
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
    line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  `,
  body2: css`
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
    line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  `,
  caption: css`
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  `,
  overline: css`
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    line-height: ${({ theme }) => theme.typography.lineHeight.normal};
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.widest};
    text-transform: uppercase;
  `,
  label: css`
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  `,
};

const colorStyles: Record<TypographyColor, ReturnType<typeof css>> = {
  primary: css`color: ${({ theme }) => theme.colors.text.primary};`,
  secondary: css`color: ${({ theme }) => theme.colors.text.secondary};`,
  tertiary: css`color: ${({ theme }) => theme.colors.text.tertiary};`,
  muted: css`color: ${({ theme }) => theme.colors.text.muted};`,
  brand: css`color: ${({ theme }) => theme.colors.brand[400]};`,
  success: css`color: ${({ theme }) => theme.colors.accent.green};`,
  warning: css`color: ${({ theme }) => theme.colors.accent.yellow};`,
  danger: css`color: ${({ theme }) => theme.colors.accent.red};`,
};

interface StyledTextProps {
  $variant: TypographyVariant;
  $color: TypographyColor;
  $truncate: boolean;
}

const StyledText = styled.p<StyledTextProps>`
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};
  margin: 0;

  ${({ $variant }) => variantStyles[$variant]}
  ${({ $color }) => colorStyles[$color]}
  ${({ $truncate }) =>
    $truncate &&
    css`
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `}
`;

// Default HTML tag per variant
const defaultTag: Record<TypographyVariant, ElementType> = {
  h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4', h5: 'h5', h6: 'h6',
  body1: 'p', body2: 'p',
  caption: 'span', overline: 'span', label: 'label',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Typography({
  variant = 'body1',
  color = 'primary',
  as,
  truncate = false,
  children,
  ...props
}: TypographyProps) {
  return (
    <StyledText
      as={as ?? defaultTag[variant]}
      $variant={variant}
      $color={color}
      $truncate={truncate}
      {...props}
    >
      {children}
    </StyledText>
  );
}
