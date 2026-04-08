import styled, { keyframes, css } from 'styled-components';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerVariant = 'brand' | 'white' | 'muted';

export interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  label?: string;
  className?: string;
}

// ─── Styled ───────────────────────────────────────────────────────────────────

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const sizeMap: Record<SpinnerSize, string> = {
  xs: '14px',
  sm: '18px',
  md: '24px',
  lg: '32px',
  xl: '48px',
};

const variantMap: Record<SpinnerVariant, ReturnType<typeof css>> = {
  brand: css`
    border-color: rgba(107, 86, 243, 0.2);
    border-top-color: ${({ theme }) => theme.colors.brand[500]};
  `,
  white: css`
    border-color: rgba(255, 255, 255, 0.2);
    border-top-color: white;
  `,
  muted: css`
    border-color: ${({ theme }) => theme.colors.surface.border};
    border-top-color: ${({ theme }) => theme.colors.text.tertiary};
  `,
};

const StyledSpinner = styled.span<{ $size: SpinnerSize; $variant: SpinnerVariant }>`
  display: inline-block;
  border-radius: ${({ theme }) => theme.radii.full};
  border-style: solid;
  border-width: 2px;
  animation: ${spin} 0.7s linear infinite;

  width: ${({ $size }) => sizeMap[$size]};
  height: ${({ $size }) => sizeMap[$size]};
  ${({ $variant }) => variantMap[$variant]}
`;

const Wrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function Spinner({
  size = 'md',
  variant = 'brand',
  label = 'Carregando...',
  className,
}: SpinnerProps) {
  return (
    <Wrapper className={className} role="status" aria-label={label}>
      <StyledSpinner $size={size} $variant={variant} />
    </Wrapper>
  );
}
