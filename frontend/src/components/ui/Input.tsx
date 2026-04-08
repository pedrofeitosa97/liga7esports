'use client';
import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import styled, { css } from 'styled-components';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightElement?: ReactNode;
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

const InputWrapper = styled.div`
  position: relative;
`;

const IconSlot = styled.span<{ $position: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text.tertiary};

  ${({ $position }) =>
    $position === 'left'
      ? css`left: 14px;`
      : css`right: 14px;`}
`;

const StyledInput = styled.input<{ $hasError: boolean; $hasLeftIcon: boolean; $hasRightElement: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface.default};
  border: 1px solid ${({ $hasError, theme }) =>
    $hasError ? 'rgba(239, 68, 68, 0.5)' : theme.colors.surface.border};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: all ${({ theme }) => theme.transitions.normal};

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }

  &:focus {
    outline: none;
    border-color: ${({ $hasError, theme }) =>
      $hasError ? theme.colors.accent.red : theme.colors.brand[500]};
    box-shadow: 0 0 0 3px ${({ $hasError }) =>
      $hasError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(107, 86, 243, 0.15)'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ $hasLeftIcon }) => $hasLeftIcon && css`padding-left: 40px;`}
  ${({ $hasRightElement }) => $hasRightElement && css`padding-right: 44px;`}
`;

const HintText = styled.p<{ $isError?: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ $isError, theme }) =>
    $isError ? theme.colors.accent.red : theme.colors.text.muted};
`;

// ─── Component ────────────────────────────────────────────────────────────────

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightElement, id, ...props }, ref) => (
    <Wrapper>
      {label && <Label htmlFor={id}>{label}</Label>}
      <InputWrapper>
        {leftIcon && <IconSlot $position="left">{leftIcon}</IconSlot>}
        <StyledInput
          ref={ref}
          id={id}
          $hasError={!!error}
          $hasLeftIcon={!!leftIcon}
          $hasRightElement={!!rightElement}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          {...props}
        />
        {rightElement && <IconSlot $position="right">{rightElement}</IconSlot>}
      </InputWrapper>
      {error && (
        <HintText $isError id={`${id}-error`} role="alert">
          {error}
        </HintText>
      )}
      {hint && !error && <HintText id={`${id}-hint`}>{hint}</HintText>}
    </Wrapper>
  ),
);

Input.displayName = 'Input';
export default Input;
