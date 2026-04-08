'use client';
import { forwardRef, type ReactNode, type SelectHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';
import { ChevronDown } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  leftIcon?: ReactNode;
}

// ─── Styled ───────────────────────────────────────────────────────────────────

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SelectWrapper = styled.div`
  position: relative;
`;

const LeftIconSlot = styled.span`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text.tertiary};
  pointer-events: none;
`;

const StyledSelect = styled.select<{ $hasError: boolean; $hasLeftIcon: boolean }>`
  width: 100%;
  padding: 12px 40px 12px 16px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface.default};
  border: 1px solid
    ${({ $hasError, theme }) =>
      $hasError ? 'rgba(239, 68, 68, 0.5)' : theme.colors.surface.border};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  appearance: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.brand[500]};
    box-shadow: 0 0 0 3px rgba(107, 86, 243, 0.15);
  }

  option {
    background: ${({ theme }) => theme.colors.background.secondary};
  }

  ${({ $hasLeftIcon }) => $hasLeftIcon && css`padding-left: 40px;`}
`;

const ChevronIcon = styled(ChevronDown)`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  pointer-events: none;
`;

const ErrorText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.accent.red};
`;

// ─── Component ────────────────────────────────────────────────────────────────

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, leftIcon, id, ...props }, ref) => (
    <Wrapper>
      {label && <Label htmlFor={id}>{label}</Label>}
      <SelectWrapper>
        {leftIcon && <LeftIconSlot>{leftIcon}</LeftIconSlot>}
        <StyledSelect
          ref={ref}
          id={id}
          $hasError={!!error}
          $hasLeftIcon={!!leftIcon}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </StyledSelect>
        <ChevronIcon />
      </SelectWrapper>
      {error && <ErrorText role="alert">{error}</ErrorText>}
    </Wrapper>
  ),
);

Select.displayName = 'Select';
export default Select;
