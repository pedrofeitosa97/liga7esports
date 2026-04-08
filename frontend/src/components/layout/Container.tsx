import { type HTMLAttributes, type ReactNode } from 'react';
import styled, { css } from 'styled-components';

import { mq } from '@/styles/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
  /** Remove horizontal padding */
  flush?: boolean;
  children: ReactNode;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const maxWidths: Record<ContainerSize, string> = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  full: '100%',
};

// ─── Styled ───────────────────────────────────────────────────────────────────

const StyledContainer = styled.div<{ $size: ContainerSize; $flush: boolean }>`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  max-width: ${({ $size }) => maxWidths[$size]};

  ${({ $flush, theme }) =>
    !$flush &&
    css`
      padding-left: ${theme.spacing[4]};
      padding-right: ${theme.spacing[4]};

      ${mq.sm} {
        padding-left: ${theme.spacing[6]};
        padding-right: ${theme.spacing[6]};
      }

      ${mq.lg} {
        padding-left: ${theme.spacing[8]};
        padding-right: ${theme.spacing[8]};
      }
    `}
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function Container({
  size = 'xl',
  flush = false,
  children,
  ...props
}: ContainerProps) {
  return (
    <StyledContainer $size={size} $flush={flush} {...props}>
      {children}
    </StyledContainer>
  );
}
