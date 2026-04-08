'use client';
import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Trophy, Gamepad2, Star, Edit3, Camera, Check, X,
  TrendingUp, Award, Calendar, Shield,
} from 'lucide-react';
import { usersApi, badgesApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { ProfileSkeleton } from '@/components/ui/Skeleton';
import { getWinRate, timeAgo } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', 'me'],
    queryFn: async () => {
      const res = await usersApi.getMe();
      return res.data;
    },
    enabled: isAuthenticated,
  });

  const { data: badges } = useQuery({
    queryKey: ['badges', 'me'],
    queryFn: async () => {
      const res = await badgesApi.getMyBadges();
      return res.data;
    },
    enabled: isAuthenticated,
  });

  const updateMutation = useMutation({
    mutationFn: (data: { username: string }) => usersApi.update(data),
    onSuccess: (res) => {
      updateUser({ username: res.data.username });
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
      toast.success('Perfil atualizado!');
      setEditing(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Erro ao atualizar');
    },
  });

  const avatarMutation = useMutation({
    mutationFn: (file: File) => usersApi.uploadAvatar(file),
    onSuccess: (res) => {
      updateUser({ avatarUrl: res.data.avatarUrl });
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
      toast.success('Avatar atualizado!');
    },
    onError: () => toast.error('Erro ao fazer upload'),
  });

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  if (isLoading) return <ProfileSkeleton />;

  const data = profile || user;
  if (!data) return null;

  const winRate = getWinRate(data.wins, data.gamesPlayed);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile header card */}
      <Card elevated className="p-0 overflow-hidden">
        {/* Banner */}
        <div className="h-24 bg-gradient-brand relative">
          <div className="absolute inset-0 opacity-30 bg-noise" />
        </div>

        {/* Info */}
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            {/* Avatar with upload */}
            <div className="relative">
              <Avatar
                src={data.avatarUrl}
                username={data.username}
                size="2xl"
                ring
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarMutation.isPending}
                className="absolute bottom-1 right-1 w-7 h-7 bg-brand-500 rounded-full flex items-center justify-center shadow-brand hover:bg-brand-600 transition-colors"
              >
                {avatarMutation.isPending ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Camera className="w-3.5 h-3.5 text-white" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) avatarMutation.mutate(file);
                }}
              />
            </div>

            {/* Edit button */}
            {!editing ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setUsername(data.username);
                  setEditing(true);
                }}
              >
                <Edit3 className="w-3.5 h-3.5" />
                Editar Perfil
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  loading={updateMutation.isPending}
                  onClick={() => updateMutation.mutate({ username })}
                >
                  <Check className="w-3.5 h-3.5" />
                  Salvar
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
          </div>

          {editing ? (
            <div className="max-w-xs">
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                label="Username"
                placeholder="Seu username"
              />
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-extrabold text-text-primary">{data.username}</h1>
              <p className="text-sm text-text-tertiary mt-0.5">{data.email}</p>
              <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Membro {timeAgo(data.createdAt)}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Stats */}
      <section>
        <h2 className="section-title mb-3">Estatísticas</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Partidas', value: data.gamesPlayed, icon: Gamepad2, color: 'text-brand-400', bg: 'bg-brand-500/10' },
            { label: 'Vitórias', value: data.wins, icon: Trophy, color: 'text-accent-yellow', bg: 'bg-accent-yellow/10' },
            { label: 'Derrotas', value: data.losses, icon: X, color: 'text-accent-red', bg: 'bg-accent-red/10' },
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

        {/* Win rate bar */}
        {data.gamesPlayed > 0 && (
          <div className="glass-card p-4 mt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-text-primary">Taxa de Vitória</span>
              <span className="text-sm font-bold text-accent-green">{winRate}%</span>
            </div>
            <div className="h-2.5 bg-surface-DEFAULT rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${winRate}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-accent-green to-accent-cyan rounded-full"
              />
            </div>
            <div className="flex justify-between text-xs text-text-muted mt-1">
              <span>{data.wins}V</span>
              <span>{data.losses}D</span>
            </div>
          </div>
        )}
      </section>

      {/* Badges */}
      <section>
        <h2 className="section-title mb-3 flex items-center gap-2">
          <Award className="w-5 h-5 text-accent-yellow" />
          Insígnias ({badges?.length || 0})
        </h2>
        <div className="glass-card p-5">
          {badges && badges.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {badges.map((ub: any, i: number) => (
                <motion.div
                  key={ub.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-ios bg-surface-DEFAULT border border-surface-border"
                >
                  <div className="w-10 h-10 rounded-ios bg-brand-500/15 flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-accent-yellow" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-primary">{ub.badge?.name}</p>
                    <p className="text-xs text-text-muted">{ub.badge?.description}</p>
                    <p className="text-xs text-text-muted mt-0.5">{timeAgo(ub.earnedAt)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="w-12 h-12 mx-auto mb-3 text-text-muted opacity-20" />
              <p className="text-sm text-text-muted">Nenhuma insígnia ainda</p>
              <p className="text-xs text-text-muted mt-1">Participe de campeonatos para ganhar insígnias!</p>
            </div>
          )}
        </div>
      </section>

      {/* Match history */}
      {profile?.registrations && profile.registrations.length > 0 && (
        <section>
          <h2 className="section-title mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-400" />
            Campeonatos
          </h2>
          <div className="glass-card divide-y divide-surface-border">
            {profile.registrations.map((reg: any) => (
              <div
                key={reg.id}
                className="flex items-center gap-3 p-4 hover:bg-surface-DEFAULT/50 transition-colors cursor-pointer"
                onClick={() => router.push(`/tournaments/${reg.tournament?.id}`)}
              >
                <div className="w-10 h-10 rounded-ios bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-5 h-5 text-brand-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">{reg.tournament?.title}</p>
                  <p className="text-xs text-text-muted">{reg.tournament?.game}</p>
                </div>
                <Badge
                  variant={
                    reg.tournament?.status === 'ABERTO'
                      ? 'success'
                      : reg.tournament?.status === 'EM_ANDAMENTO'
                      ? 'warning'
                      : 'default'
                  }
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
