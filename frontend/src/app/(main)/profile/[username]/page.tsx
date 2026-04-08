'use client';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Trophy, Gamepad2, Star, ChevronLeft, Award, TrendingUp,
  Shield, Calendar, X,
} from 'lucide-react';
import { usersApi, badgesApi } from '@/lib/api';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { ProfileSkeleton } from '@/components/ui/Skeleton';
import { getWinRate, timeAgo } from '@/lib/utils';

export default function UserProfilePage() {
  const { username } = useParams<{ username: string }>();
  const router = useRouter();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', username],
    queryFn: async () => {
      const res = await usersApi.getByUsername(username);
      return res.data;
    },
  });

  const { data: badges } = useQuery({
    queryKey: ['badges', profile?.id],
    queryFn: async () => {
      const res = await badgesApi.getUserBadges(profile.id);
      return res.data;
    },
    enabled: !!profile?.id,
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <ProfileSkeleton />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        <Trophy className="w-16 h-16 mx-auto mb-4 text-text-muted opacity-20" />
        <h2 className="font-bold text-text-primary text-xl">Usuário não encontrado</h2>
        <Button className="mt-6" onClick={() => router.push('/')}>Voltar ao início</Button>
      </div>
    );
  }

  const winRate = getWinRate(profile.wins, profile.gamesPlayed);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm font-medium transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Voltar
      </button>

      {/* Profile card */}
      <div className="glass-card-elevated overflow-hidden">
        <div className="h-20 bg-gradient-brand opacity-60" />
        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4">
            <Avatar src={profile.avatarUrl} username={profile.username} size="2xl" ring />
          </div>
          <h1 className="text-2xl font-extrabold text-text-primary">{profile.username}</h1>
          <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Membro {timeAgo(profile.createdAt)}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Partidas', value: profile.gamesPlayed, icon: Gamepad2, color: 'text-brand-400', bg: 'bg-brand-500/10' },
          { label: 'Vitórias', value: profile.wins, icon: Trophy, color: 'text-accent-yellow', bg: 'bg-accent-yellow/10' },
          { label: 'Derrotas', value: profile.losses, icon: X, color: 'text-accent-red', bg: 'bg-accent-red/10' },
          { label: 'Win Rate', value: `${winRate}%`, icon: TrendingUp, color: 'text-accent-green', bg: 'bg-accent-green/10' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass-card p-4 text-center"
          >
            <div className={`w-10 h-10 rounded-ios ${stat.bg} flex items-center justify-center mx-auto mb-2`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-extrabold text-text-primary">{stat.value}</p>
            <p className="text-xs text-text-muted">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Badges */}
      <section>
        <h2 className="section-title mb-3 flex items-center gap-2">
          <Award className="w-5 h-5 text-accent-yellow" />
          Insígnias ({badges?.length || 0})
        </h2>
        <div className="glass-card p-5">
          {badges && badges.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {badges.map((ub: any) => (
                <div key={ub.id} className="flex items-center gap-3 p-3 rounded-ios bg-surface-DEFAULT border border-surface-border">
                  <div className="w-10 h-10 rounded-ios bg-brand-500/15 flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-accent-yellow" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-primary">{ub.badge?.name}</p>
                    <p className="text-xs text-text-muted">{ub.badge?.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-muted text-center py-6">Nenhuma insígnia ainda</p>
          )}
        </div>
      </section>

      {/* Tournament history */}
      {profile.registrations?.length > 0 && (
        <section>
          <h2 className="section-title mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-400" />
            Campeonatos
          </h2>
          <div className="glass-card divide-y divide-surface-border">
            {profile.registrations.map((reg: any) => (
              <div
                key={reg.id}
                className="flex items-center gap-3 p-4 hover:bg-surface-DEFAULT/50 cursor-pointer transition-colors"
                onClick={() => router.push(`/tournaments/${reg.tournament?.id}`)}
              >
                <Trophy className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">{reg.tournament?.title}</p>
                  <p className="text-xs text-text-muted">{reg.tournament?.game}</p>
                </div>
                <Badge
                  variant={reg.tournament?.status === 'ABERTO' ? 'success' : reg.tournament?.status === 'EM_ANDAMENTO' ? 'warning' : 'default'}
                  size="sm"
                >
                  {reg.tournament?.status === 'ABERTO' ? 'Aberto' : reg.tournament?.status === 'EM_ANDAMENTO' ? 'Em Andamento' : 'Finalizado'}
                </Badge>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
