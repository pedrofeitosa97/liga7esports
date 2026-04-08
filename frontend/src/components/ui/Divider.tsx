import { type ReactNode } from 'react';
import styled, { css } from 'styled-components';

// ─── Types ────────────────────────────────────────────────────────────────────

export type DividerOrientation = 'horizontal' | 'vertical';

export interface DividerProps {
  orientation?: DividerOrientation;
  label?: ReactNode;
  spacing?: keyof typeof import('@/styles/theme').theme.spacing;
  className?: string;
}

// ─── Styled ───────────────────────────────────────────────────────────────────

const Line = styled.div<{ $orientation: DividerOrientation }>`
  background: ${({ theme }) => theme.colors.surface.border};
  flex-shrink: 0;

  ${({ $orientation }) =>
    $orientation === 'horizontal'
      ? css`
          width: 100%;
          height: 1px;
        `
      : css`
          width: 1px;
          height: 100%;
          align-self: stretch;
        `}
`;

const LabeledWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  width: 100%;
`;

const LabelText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.tertiary};
  white-space: nowrap;
  flex-shrink: 0;
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function Divider({
  orientation = 'horizontal',
  label,
  className,
}: DividerProps) {
  if (label && orientation === 'horizontal') {
    return (
      <LabeledWrapper className={className} role="separator">
        <Line $orientation="horizontal" />
        <LabelText>{label}</LabelText>
        <Line $orientation="horizontal" />
      </LabeledWrapper>
    );
  }

  return <Line $orientation={orientation} className={className} role="separator" />;
}
