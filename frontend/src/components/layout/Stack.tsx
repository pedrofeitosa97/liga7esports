import { type HTMLAttributes, type ElementType, type ReactNode } from 'react';
import styled from 'styled-components';

import { type AppTheme } from '@/styles/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

type SpacingKey = keyof AppTheme['spacing'];
type AlignItems = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
type JustifyContent =
  | 'flex-start' | 'flex-end' | 'center'
  | 'space-between' | 'space-around' | 'space-evenly';

export interface StackProps extends HTMLAttributes<HTMLElement> {
  /** Spacing between children using the theme spacing scale */
  gap?: SpacingKey;
  align?: AlignItems;
  justify?: JustifyContent;
  /** Render as a different HTML element */
  as?: ElementType;
  children: ReactNode;
}

// ─── Styled ───────────────────────────────────────────────────────────────────

const StyledStack = styled.div<{
  $gap: SpacingKey;
  $align: AlignItems;
  $justify: JustifyContent;
}>`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap, theme }) => theme.spacing[$gap]};
  align-items: ${({ $align }) => $align};
  justify-content: ${({ $justify }) => $justify};
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function Stack({
  gap = 4,
  align = 'stretch',
  justify = 'flex-start',
  children,
  ...props
}: StackProps) {
  return (
    <StyledStack $gap={gap} $align={align} $justify={justify} {...props}>
      {children}
    </StyledStack>
  );
}
