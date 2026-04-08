import { type HTMLAttributes, type ReactNode } from 'react';
import styled, { css } from 'styled-components';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  elevated?: boolean;
  noPadding?: boolean;
}

export interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

// ─── Styled ───────────────────────────────────────────────────────────────────

const StyledCard = styled.div<{ $elevated: boolean; $noPadding: boolean }>`
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.surface.border};
  backdrop-filter: blur(4px);
  transition: border-color ${({ theme }) => theme.transitions.normal};

  ${({ $elevated, theme }) =>
    $elevated
      ? css`
          background: ${theme.gradients.cardElevated};
          border-color: ${theme.colors.surface.borderLight};
          border-radius: ${theme.radii.xl};
          box-shadow: ${theme.shadows.lg};
        `
      : css`
          background: linear-gradient(145deg, rgba(30, 30, 42, 0.9), rgba(22, 22, 31, 0.95));
          box-shadow: ${theme.shadows.card};
        `}

  ${({ $noPadding, theme }) =>
    !$noPadding &&
    css`
      padding: ${theme.spacing[5]};
    `}
`;

const StyledCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const CardHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const CardIconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: rgba(107, 86, 243, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.brand[400]};
  flex-shrink: 0;
`;

const CardTitle = styled.h3`
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const CardSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin-top: 2px;
`;

// ─── Components ───────────────────────────────────────────────────────────────

export function Card({ children, elevated = false, noPadding = false, ...props }: CardProps) {
  return (
    <StyledCard $elevated={elevated} $noPadding={noPadding} {...props}>
      {children}
    </StyledCard>
  );
}

export function CardHeader({ title, subtitle, action, icon }: CardHeaderProps) {
  return (
    <StyledCardHeader>
      <CardHeaderLeft>
        {icon && <CardIconWrapper>{icon}</CardIconWrapper>}
        <div>
          <CardTitle>{title}</CardTitle>
          {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
        </div>
      </CardHeaderLeft>
      {action}
    </StyledCardHeader>
  );
}
