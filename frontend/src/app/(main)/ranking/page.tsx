'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Medal, Crown, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usersApi } from '@/lib/api';
import Avatar from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import { getWinRate } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function RankingPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['ranking', page],
    queryFn: async () => {
      const res = await usersApi.getRanking(page, 20);
      return res.data;
    },
  });

  const users = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const getRankIcon = (position: number) => {
    if (position === 0) return <Crown className="w-5 h-5 text-accent-yellow" />;
    if (position === 1) return <Medal className="w-5 h-5 text-text-secondary" />;
    if (position === 2) return <Medal className="w-5 h-5 text-amber-600" />;
    return null;
  };

  const getRankBg = (position: number) => {
    if (position === 0) return 'bg-accent-yellow/5 border-accent-yellow/20';
    if (position === 1) return 'bg-text-muted/5 border-text-muted/20';
    if (position === 2) return 'bg-amber-600/5 border-amber-600/20';
    return 'bg-surface-DEFAULT border-surface-border';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-ios-xl bg-brand-500/15 border border-brand-500/30 mb-4">
          <Trophy className="w-8 h-8 text-brand-400" />
        </div>
        <h1 className="text-2xl font-extrabold text-text-primary">Ranking Global</h1>
        <p className="text-sm text-text-tertiary mt-1">{total} jogadores ranqueados</p>
      </div>

      {/* Top 3 podium */}
      {!isLoading && users.length >= 3 && (
        <div className="flex items-end justify-center gap-4 py-4">
          {/* 2nd place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center gap-2"
          >
            <Avatar src={users[1]?.avatarUrl} username={users[1]?.username || '?'} size="lg" ring />
            <div className="w-20 h-16 bg-text-muted/20 rounded-t-ios flex items-end justify-center pb-2">
              <span className="text-2xl font-extrabold text-text-secondary">2</span>
            </div>
            <p className="text-xs font-bold text-text-secondary text-center truncate w-20">
              {users[1]?.username}
            </p>
          </motion.div>

          {/* 1st place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-2 -mt-4"
          >
            <Crown className="w-6 h-6 text-accent-yellow" />
            <Avatar src={users[0]?.avatarUrl} username={users[0]?.username || '?'} size="xl" ring />
            <div className="w-24 h-24 bg-gradient-brand rounded-t-ios flex items-end justify-center pb-2">
              <span className="text-3xl font-extrabold text-white">1</span>
            </div>
            <p className="text-xs font-bold text-text-primary text-center truncate w-24">
              {users[0]?.username}
            </p>
          </motion.div>

          {/* 3rd place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-2"
          >
            <Avatar src={users[2]?.avatarUrl} username={users[2]?.username || '?'} size="lg" ring />
            <div className="w-20 h-12 bg-amber-600/20 rounded-t-ios flex items-end justify-center pb-2">
              <span className="text-2xl font-extrabold text-amber-600">3</span>
            </div>
            <p className="text-xs font-bold text-amber-600 text-center truncate w-20">
              {users[2]?.username}
            </p>
          </motion.div>
        </div>
      )}

      {/* Full leaderboard */}
      <div className="glass-card p-0 overflow-hidden">
        <div className="px-5 py-3 border-b border-surface-border flex items-center justify-between">
          <h2 className="text-sm font-bold text-text-primary">Classificação Completa</h2>
          <TrendingUp className="w-4 h-4 text-brand-400" />
        </div>

        {isLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="flex-1 h-4" />
                <Skeleton className="w-16 h-4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-surface-border/50">
            {users.map((u: any, i: number) => {
              const globalPosition = (page - 1) * 20 + i;
              const winRate = getWinRate(u.wins, u.gamesPlayed);

              return (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => router.push(`/profile/${u.username}`)}
                  className={cn(
                    'flex items-center gap-3 px-5 py-3.5 cursor-pointer hover:bg-surface-DEFAULT/50 transition-all',
                    globalPosition < 3 && 'bg-accent-yellow/3',
                  )}
                >
                  {/* Rank number */}
                  <div className="w-8 flex items-center justify-center flex-shrink-0">
                    {getRankIcon(globalPosition) || (
                      <span className="text-sm font-bold text-text-muted">{globalPosition + 1}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <Avatar src={u.avatarUrl} username={u.username} size="sm" />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-text-primary truncate">{u.username}</p>
                    <p className="text-xs text-text-muted">{u.gamesPlayed} partidas</p>
                  </div>

                  {/* Stats */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-extrabold text-accent-green">{u.wins}V</p>
                    <p className="text-xs text-text-muted">{winRate}%</p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-text-muted flex-shrink-0" />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Anterior
          </Button>
          <span className="text-sm text-text-secondary font-medium px-3">{page} / {totalPages}</span>
          <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Próximo
          </Button>
        </div>
      )}
    </div>
  );
}
