'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, Trophy, Calendar, DollarSign, Lock, Zap } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import {
  getGameEmoji, getGameName, getTournamentStatusLabel,
  getTournamentFormatLabel, formatDateShort, formatCurrency,
} from '@/lib/utils';
import { cn } from '@/lib/utils';

interface TournamentCardProps {
  tournament: {
    id: string;
    title: string;
    game: string;
    description?: string | null;
    format: string;
    status: string;
    maxPlayers: number;
    entryFee?: number | null;
    prize?: string | null;
    startDate?: string | null;
    imageUrl?: string | null;
    creator?: { id: string; username: string; avatarUrl?: string | null };
    _count?: { registrations: number };
  };
  index?: number;
}

const statusVariants = {
  ABERTO: 'success' as const,
  EM_ANDAMENTO: 'warning' as const,
  FINALIZADO: 'default' as const,
};

const gameGradients: Record<string, string> = {
  'ea-fc-26': 'from-green-900/60 to-emerald-900/30',
  'fifa-24': 'from-blue-900/60 to-indigo-900/30',
  fortnite: 'from-purple-900/60 to-violet-900/30',
  valorant: 'from-red-900/60 to-rose-900/30',
  'league-of-legends': 'from-amber-900/60 to-yellow-900/30',
  cs2: 'from-orange-900/60 to-amber-900/30',
  'rocket-league': 'from-sky-900/60 to-blue-900/30',
  default: 'from-brand-900/60 to-brand-800/30',
};

export default function TournamentCard({ tournament, index = 0 }: TournamentCardProps) {
  const router = useRouter();
  const gradient = gameGradients[tournament.game] || gameGradients.default;
  const spotsLeft = tournament.maxPlayers - (tournament._count?.registrations ?? 0);
  const isFull = spotsLeft <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      onClick={() => router.push(`/tournaments/${tournament.id}`)}
      className="tournament-card overflow-hidden group cursor-pointer"
    >
      {/* Banner */}
      <div className={cn('relative h-28 bg-gradient-to-br', gradient, 'overflow-hidden')}>
        {/* Game emoji watermark */}
        <div className="absolute -right-4 -top-2 text-7xl opacity-20 select-none group-hover:opacity-30 transition-opacity">
          {getGameEmoji(tournament.game)}
        </div>

        {/* Status + Format badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant={statusVariants[tournament.status as keyof typeof statusVariants] || 'default'} size="sm">
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {getTournamentStatusLabel(tournament.status)}
          </Badge>
          <Badge variant="default" size="sm">
            {getTournamentFormatLabel(tournament.format)}
          </Badge>
        </div>

        {/* Entry fee */}
        {tournament.entryFee ? (
          <div className="absolute top-3 right-3">
            <Badge variant="warning" size="sm">
              <DollarSign className="w-3 h-3" />
              {formatCurrency(tournament.entryFee)}
            </Badge>
          </div>
        ) : (
          <div className="absolute top-3 right-3">
            <Badge variant="success" size="sm">Gratuito</Badge>
          </div>
        )}

        {/* Game name */}
        <div className="absolute bottom-3 left-3">
          <span className="text-xs font-semibold text-white/70">
            {getGameEmoji(tournament.game)} {getGameName(tournament.game)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-bold text-text-primary text-sm leading-tight line-clamp-2 group-hover:text-brand-400 transition-colors">
          {tournament.title}
        </h3>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-xs text-text-tertiary">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span className={cn(isFull && 'text-accent-red font-semibold')}>
              {tournament._count?.registrations ?? 0}/{tournament.maxPlayers}
            </span>
          </span>

          {tournament.startDate && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDateShort(tournament.startDate)}
            </span>
          )}

          {tournament.prize && (
            <span className="flex items-center gap-1 text-accent-yellow truncate">
              <Trophy className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{tournament.prize}</span>
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="h-1.5 bg-surface-DEFAULT rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                isFull ? 'bg-accent-red' : 'bg-gradient-brand',
              )}
              style={{
                width: `${Math.min(100, ((tournament._count?.registrations ?? 0) / tournament.maxPlayers) * 100)}%`,
              }}
            />
          </div>
          <p className={cn('text-xs', isFull ? 'text-accent-red font-semibold' : 'text-text-muted')}>
            {isFull ? 'Lotado' : `${spotsLeft} vagas disponíveis`}
          </p>
        </div>

        {/* Creator */}
        {tournament.creator && (
          <div className="flex items-center justify-between pt-1 border-t border-surface-border">
            <div className="flex items-center gap-2">
              <Avatar src={tournament.creator.avatarUrl} username={tournament.creator.username} size="xs" />
              <span className="text-xs text-text-tertiary">por <span className="text-text-secondary font-medium">{tournament.creator.username}</span></span>
            </div>
            {tournament.status === 'ABERTO' && !isFull && (
              <span className="text-xs font-semibold text-brand-400 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Participar
              </span>
            )}
            {isFull && (
              <span className="text-xs text-text-muted flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Lotado
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
