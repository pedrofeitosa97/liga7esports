import styled, { keyframes } from 'styled-components';

// ─── Animation ────────────────────────────────────────────────────────────────

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// ─── Styled ───────────────────────────────────────────────────────────────────

export const Skeleton = styled.div`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.surface.default} 25%,
    ${({ theme }) => theme.colors.surface.hover} 50%,
    ${({ theme }) => theme.colors.surface.default} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.8s infinite linear;
  border-radius: ${({ theme }) => theme.radii.md};
`;

// ─── Compound skeletons ───────────────────────────────────────────────────────

const SkeletonRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing[3]};
`;

export function TournamentCardSkeleton() {
  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Skeleton style={{ width: '100%', height: '144px', borderRadius: '12px' }} />
      <SkeletonRow>
        <Skeleton style={{ height: '16px', width: '75%' }} />
        <Skeleton style={{ height: '12px', width: '50%' }} />
      </SkeletonRow>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Skeleton style={{ height: '24px', width: '80px', borderRadius: '9999px' }} />
        <Skeleton style={{ height: '24px', width: '64px', borderRadius: '9999px' }} />
      </div>
      <Skeleton style={{ height: '36px', borderRadius: '9999px' }} />
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Skeleton style={{ width: '80px', height: '80px', borderRadius: '9999px' }} />
        <SkeletonRow style={{ flex: 1 }}>
          <Skeleton style={{ height: '20px', width: '160px' }} />
          <Skeleton style={{ height: '12px', width: '112px' }} />
        </SkeletonRow>
      </div>
      <SkeletonGrid>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} style={{ height: '80px', borderRadius: '16px' }} />
        ))}
      </SkeletonGrid>
    </div>
  );
}
