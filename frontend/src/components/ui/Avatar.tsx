import Image from 'next/image';
import styled, { css } from 'styled-components';

import { getInitials } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface AvatarProps {
  src?: string | null;
  username: string;
  size?: AvatarSize;
  ring?: boolean;
  className?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const sizeValues: Record<AvatarSize, { px: number; fontSize: string }> = {
  xs: { px: 24, fontSize: '10px' },
  sm: { px: 32, fontSize: '12px' },
  md: { px: 40, fontSize: '14px' },
  lg: { px: 48, fontSize: '16px' },
  xl: { px: 64, fontSize: '20px' },
  '2xl': { px: 96, fontSize: '28px' },
};

// ─── Styled ───────────────────────────────────────────────────────────────────

const ringStyle = css`
  box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.brand[500]};
`;

const AvatarBase = styled.div<{ $size: AvatarSize; $ring: boolean }>`
  border-radius: ${({ theme }) => theme.radii.full};
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
  width: ${({ $size }) => sizeValues[$size].px}px;
  height: ${({ $size }) => sizeValues[$size].px}px;
  ${({ $ring }) => $ring && ringStyle}
`;

const InitialsAvatar = styled(AvatarBase)<{ $colorClass: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: ${({ $size }) => sizeValues[$size].fontSize};
  color: white;
  line-height: 1;
  background: ${({ $colorClass }) => $colorClass};
`;

// ─── Component ────────────────────────────────────────────────────────────────

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #6b56f3, #4c2cca)',
  'linear-gradient(135deg, #7c3aed, #2563eb)',
  'linear-gradient(135deg, #06b6d4, #10b981)',
  'linear-gradient(135deg, #ec4899, #7c3aed)',
  'linear-gradient(135deg, #f59e0b, #ef4444)',
];

function getGradient(username: string): string {
  const index = username.charCodeAt(0) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
}

export default function Avatar({
  src,
  username,
  size = 'md',
  ring = false,
  className,
}: AvatarProps) {
  if (src) {
    return (
      <AvatarBase $size={size} $ring={ring} className={className}>
        <Image src={src} alt={username} fill sizes={`${sizeValues[size].px}px`} className="object-cover" />
      </AvatarBase>
    );
  }

  return (
    <InitialsAvatar
      $size={size}
      $ring={ring}
      $colorClass={getGradient(username)}
      className={className}
      aria-label={username}
    >
      {getInitials(username)}
    </InitialsAvatar>
  );
}
