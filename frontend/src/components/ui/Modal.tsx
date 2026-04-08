'use client';
import { type ReactNode, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

import { mq } from '@/styles/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: ModalSize;
  className?: string;
}

// ─── Styled ───────────────────────────────────────────────────────────────────

const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${({ theme }) => theme.zIndex.modal};
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0;

  ${mq.sm} {
    align-items: center;
    padding: ${({ theme }) => theme.spacing[4]};
  }
`;

const sizeMaxWidth: Record<ModalSize, string> = {
  sm: '384px',
  md: '448px',
  lg: '512px',
  xl: '672px',
};

const ModalPanel = styled(motion.div)<{ $size: ModalSize }>`
  position: relative;
  width: 100%;
  max-width: ${({ $size }) => sizeMaxWidth[$size]};
  z-index: 1;
  background: linear-gradient(145deg, rgba(40, 40, 56, 0.98), rgba(28, 28, 40, 0.99));
  border: 1px solid ${({ theme }) => theme.colors.surface.borderLight};
  border-radius: ${({ theme }) => theme.radii['2xl']} ${({ theme }) => theme.radii['2xl']} 0 0;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing[6]};

  ${mq.sm} {
    border-radius: ${({ theme }) => theme.radii['2xl']};
  }
`;

const HandleBar = styled.div`
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 48px;
  height: 4px;
  background: ${({ theme }) => theme.colors.surface.borderLight};
  border-radius: ${({ theme }) => theme.radii.full};

  ${mq.sm} {
    display: none;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[5]};
`;

const ModalTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.surface.default};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.tertiary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  flex-shrink: 0;

  &:hover {
    background: ${({ theme }) => theme.colors.surface.hover};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const FloatingClose = styled(CloseButton)`
  position: absolute;
  top: ${({ theme }) => theme.spacing[4]};
  right: ${({ theme }) => theme.spacing[4]};
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',
  className,
}: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <Overlay>
          <Backdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <ModalPanel
            $size={size}
            className={className}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
          >
            <HandleBar />
            {title ? (
              <ModalHeader>
                <ModalTitle>{title}</ModalTitle>
                <CloseButton onClick={onClose} aria-label="Fechar">
                  <X size={16} />
                </CloseButton>
              </ModalHeader>
            ) : (
              <FloatingClose onClick={onClose} aria-label="Fechar">
                <X size={16} />
              </FloatingClose>
            )}
            {children}
          </ModalPanel>
        </Overlay>
      )}
    </AnimatePresence>
  );
}
