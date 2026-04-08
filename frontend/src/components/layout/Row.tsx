import { type HTMLAttributes, type ElementType, type ReactNode } from 'react';
import styled from 'styled-components';

import { type AppTheme } from '@/styles/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

type SpacingKey = keyof AppTheme['spacing'];
type AlignItems = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
type JustifyContent =
  | 'flex-start' | 'flex-end' | 'center'
  | 'space-between' | 'space-around' | 'space-evenly';

export interface RowProps extends HTMLAttributes<HTMLElement> {
  gap?: SpacingKey;
  align?: AlignItems;
  justify?: JustifyContent;
  wrap?: boolean;
  as?: ElementType;
  children: ReactNode;
}

// ─── Styled ───────────────────────────────────────────────────────────────────

const StyledRow = styled.div<{
  $gap: SpacingKey;
  $align: AlignItems;
  $justify: JustifyContent;
  $wrap: boolean;
}>`
  display: flex;
  flex-direction: row;
  gap: ${({ $gap, theme }) => theme.spacing[$gap]};
  align-items: ${({ $align }) => $align};
  justify-content: ${({ $justify }) => $justify};
  flex-wrap: ${({ $wrap }) => ($wrap ? 'wrap' : 'nowrap')};
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function Row({
  gap = 4,
  align = 'center',
  justify = 'flex-start',
  wrap = false,
  children,
  ...props
}: RowProps) {
  return (
    <StyledRow $gap={gap} $align={align} $justify={justify} $wrap={wrap} {...props}>
      {children}
    </StyledRow>
  );
}
