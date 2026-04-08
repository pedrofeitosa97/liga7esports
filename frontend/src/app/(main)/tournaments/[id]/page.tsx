'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Trophy, Users, Calendar, DollarSign, Share2, Crown,
  Copy, Check, Zap, LogIn, Play, FileText, GitBranch,
  ChevronLeft, Lock, Gift, Shield, ExternalLink,
} from 'lucide-react';
import { tournamentsApi, matchesApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import TournamentBracket from '@/components/tournament/TournamentBracket';
import { ProfileSkeleton } from '@/components/ui/Skeleton';
import {
  getGameEmoji, getGameName, getTournamentStatusLabel,
  getTournamentFormatLabel, formatDate, formatCurrency,
  getShareUrl, copyToClipboard,
} from '@/lib/utils';
import { cn } from '@/lib/utils';

type Tab = 'overview' | 'players' | 'bracket' | 'matches';

export default function TournamentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [copied, setCopied] = useState(false);
  const [resultModal, setResultModal] = useState<{ matchId: string; p1: string; p2: string } | null>(null);
  const [scores, setScores] = useState({ score1: '', score2: '' });

  const { data: tournament, isLoading } = useQuery({
    queryKey: ['tournament', id],
    queryFn: async () => {
      const res = await tournamentsApi.getById(id);
      return res.data;
    },
  });

  const { data: matches } = useQuery({
    queryKey: ['matches', id],
    queryFn: async () => {
      const res = await matchesApi.getByTournament(id);
      return res.data;
    },
    enabled: !!tournament,
  });

  const { data: regStatus } = useQuery({
    queryKey: ['reg-status', id],
    queryFn: async () => {
      const res = await tournamentsApi.checkRegistration(id);
      return res.data;
    },
    enabled: isAuthenticated,
  });

  const joinMutation = useMutation({
    mutationFn: () => tournamentsApi.join(id),
    onSuccess: () => {
      toast.success('Inscrição realizada com sucesso! 🎉');
      queryClient.invalidateQueries({ queryKey: ['tournament', id] });
      queryClient.invalidateQueries({ queryKey: ['reg-status', id] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Erro ao se inscrever');
    },
  });

  const leaveMutation = useMutation({
    mutationFn: () => tournamentsApi.leave(id),
    onSuccess: () => {
      toast.success('Inscrição cancelada');
      queryClient.invalidateQueries({ queryKey: ['tournament', id] });
      queryClient.invalidateQueries({ queryKey: ['reg-status', id] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Erro ao cancelar inscrição');
    },
  });

  const bracketMutation = useMutation({
    mutationFn: () => tournamentsApi.generateBracket(id),
    onSuccess: () => {
      toast.success('Chaves geradas com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['tournament', id] });
      queryClient.invalidateQueries({ queryKey: ['matches', id] });
      setActiveTab('bracket');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Erro ao gerar chaves');
    },
  });

  const resultMutation = useMutation({
    mutationFn: (data: { matchId: string; score1: number; score2: number }) =>
      matchesApi.submitResult(data),
    onSuccess: () => {
      toast.success('Resultado registrado!');
      queryClient.invalidateQueries({ queryKey: ['matches', id] });
      queryClient.invalidateQueries({ queryKey: ['tournament', id] });
      setResultModal(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Erro ao registrar resultado');
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <ProfileSkeleton />
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="text-center py-20">
        <Trophy className="w-16 h-16 mx-auto mb-4 text-text-muted opacity-20" />
        <h2 className="font-bold text-text-primary text-xl">Campeonato não encontrado</h2>
        <Button className="mt-6" onClick={() => router.push('/')}>Voltar ao início</Button>
      </div>
    );
  }

  const isCreator = user?.id === tournament.creatorId;
  const isRegistered = regStatus?.isRegistered;
  const registrationCount = tournament._count?.registrations ?? tournament.registrations?.length ?? 0;
  const isFull = registrationCount >= tournament.maxPlayers;
  const isOpen = tournament.status === 'ABERTO';

  const handleShare = async () => {
    const url = getShareUrl(id);
    await copyToClipboard(url);
    setCopied(true);
    toast.success('Link copiado!');
    setTimeout(() => setCopied(false), 2000);
  };

  const statusVariants: Record<string, 'success' | 'warning' | 'default'> = {
    ABERTO: 'success',
    EM_ANDAMENTO: 'warning',
    FINALIZADO: 'default',
  };

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'overview', label: 'Visão Geral', icon: Trophy },
    { id: 'players', label: `Jogadores (${registrationCount})`, icon: Users },
    { id: 'bracket', label: 'Chaveamento', icon: GitBranch },
    { id: 'matches', label: 'Partidas', icon: Play },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm font-medium transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Voltar
      </button>

      {/* Hero banner */}
      <div className="relative rounded-ios-xl overflow-hidden bg-gradient-to-br from-brand-900/40 to-background-card border border-surface-border p-6">
        <div className="absolute -right-8 -top-4 text-9xl opacity-10 select-none">
          {getGameEmoji(tournament.game)}
        </div>

        <div className="relative z-10">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant={statusVariants[tournament.status] || 'default'}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {getTournamentStatusLabel(tournament.status)}
            </Badge>
            <Badge variant="default">
              {getTournamentFormatLabel(tournament.format)}
            </Badge>
            {!tournament.entryFee ? (
              <Badge variant="success">Gratuito</Badge>
            ) : (
              <Badge variant="warning">
                <DollarSign className="w-3 h-3" />
                {formatCurrency(tournament.entryFee)}
              </Badge>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary mb-1 tracking-tight">
            {tournament.title}
          </h1>

          <div className="flex items-center gap-1 text-sm text-text-tertiary mb-4">
            <span>{getGameEmoji(tournament.game)}</span>
            <span>{getGameName(tournament.game)}</span>
          </div>

          {tournament.description && (
            <p className="text-sm text-text-secondary mb-4 max-w-lg">{tournament.description}</p>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 text-sm text-text-tertiary mb-5">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              {registrationCount}/{tournament.maxPlayers} jogadores
            </span>
            {tournament.startDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(tournament.startDate)}
              </span>
            )}
            {tournament.prize && (
              <span className="flex items-center gap-1.5 text-accent-yellow">
                <Gift className="w-4 h-4" />
                {tournament.prize}
              </span>
            )}
          </div>

          {/* Creator */}
          {tournament.creator && (
            <div className="flex items-center gap-2 mb-5">
              <Crown className="w-4 h-4 text-accent-yellow" />
              <Avatar src={tournament.creator.avatarUrl} username={tournament.creator.username} size="xs" />
              <span className="text-xs text-text-tertiary">
                Organizado por <span className="text-text-secondary font-semibold">{tournament.creator.username}</span>
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            {/* Join/Leave */}
            {isAuthenticated && isOpen && !isCreator && (
              isRegistered ? (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => leaveMutation.mutate()}
                  loading={leaveMutation.isPending}
                >
                  Cancelar Inscrição
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => joinMutation.mutate()}
                  loading={joinMutation.isPending}
                  disabled={isFull}
                >
                  {isFull ? (
                    <><Lock className="w-4 h-4" /> Lotado</>
                  ) : (
                    <><Zap className="w-4 h-4" /> Participar</>
                  )}
                </Button>
              )
            )}

            {!isAuthenticated && isOpen && (
              <Button variant="primary" size="sm" onClick={() => router.push('/login')}>
                <LogIn className="w-4 h-4" />
                Login para participar
              </Button>
            )}

            {/* Generate bracket (creator) */}
            {isCreator && isOpen && registrationCount >= 2 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => bracketMutation.mutate()}
                loading={bracketMutation.isPending}
              >
                <Play className="w-4 h-4" />
                Iniciar Campeonato
              </Button>
            )}

            {/* Share */}
            <Button variant="secondary" size="sm" onClick={handleShare}>
              {copied ? <Check className="w-4 h-4 text-accent-green" /> : <Share2 className="w-4 h-4" />}
              {copied ? 'Copiado!' : 'Compartilhar'}
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-DEFAULT rounded-ios-lg p-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-ios text-sm font-semibold transition-all whitespace-nowrap',
              activeTab === tab.id
                ? 'bg-background-elevated text-text-primary shadow-ios-sm'
                : 'text-text-tertiary hover:text-text-secondary',
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {tournament.rules && (
              <div className="glass-card p-5">
                <h3 className="font-bold text-text-primary mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-brand-400" />
                  Regras
                </h3>
                <pre className="text-sm text-text-secondary whitespace-pre-wrap font-sans leading-relaxed">
                  {tournament.rules}
                </pre>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Formato', value: getTournamentFormatLabel(tournament.format), icon: GitBranch, color: 'text-brand-400' },
                { label: 'Vagas', value: `${registrationCount}/${tournament.maxPlayers}`, icon: Users, color: 'text-accent-cyan' },
                { label: 'Inscrição', value: tournament.entryFee ? formatCurrency(tournament.entryFee) : 'Gratuito', icon: DollarSign, color: 'text-accent-green' },
                { label: 'Prêmio', value: tournament.prize || '—', icon: Trophy, color: 'text-accent-yellow' },
              ].map((item) => (
                <div key={item.label} className="glass-card p-4 text-center">
                  <item.icon className={`w-5 h-5 ${item.color} mx-auto mb-2`} />
                  <p className="text-xs text-text-muted">{item.label}</p>
                  <p className="text-sm font-bold text-text-primary mt-0.5 truncate">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Players */}
        {activeTab === 'players' && (
          <div className="glass-card p-5">
            <h3 className="font-bold text-text-primary mb-4">
              Jogadores Inscritos ({registrationCount}/{tournament.maxPlayers})
            </h3>

            {/* Progress */}
            <div className="mb-4">
              <div className="h-2 bg-surface-DEFAULT rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-brand rounded-full transition-all"
                  style={{ width: `${(registrationCount / tournament.maxPlayers) * 100}%` }}
                />
              </div>
              <p className="text-xs text-text-muted mt-1">
                {tournament.maxPlayers - registrationCount} vagas restantes
              </p>
            </div>

            {tournament.registrations?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {tournament.registrations.map((reg: any, i: number) => (
                  <div key={reg.id} className="flex items-center gap-3 p-3 rounded-ios bg-surface-DEFAULT hover:bg-surface-hover transition-colors">
                    <span className="text-xs text-text-muted w-6 text-center font-bold">{i + 1}</span>
                    <Avatar src={reg.user?.avatarUrl} username={reg.user?.username || '?'} size="sm" />
                    <span className="text-sm font-semibold text-text-primary">{reg.user?.username}</span>
                    {reg.user?.id === tournament.creatorId && (
                      <Crown className="w-3.5 h-3.5 text-accent-yellow ml-auto" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted text-center py-8">
                Nenhum jogador inscrito ainda.
                {isOpen && ' Seja o primeiro!'}
              </p>
            )}
          </div>
        )}

        {/* Bracket */}
        {activeTab === 'bracket' && (
          <div className="glass-card p-5">
            <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-brand-400" />
              Chaveamento — {getTournamentFormatLabel(tournament.format)}
            </h3>
            <TournamentBracket
              rounds={tournament.rounds || []}
              format={tournament.format}
            />
          </div>
        )}

        {/* Matches */}
        {activeTab === 'matches' && (
          <div className="glass-card p-5">
            <h3 className="font-bold text-text-primary mb-4">Partidas</h3>
            {matches && matches.length > 0 ? (
              <div className="space-y-2">
                {matches.map((match: any) => {
                  const canSubmit =
                    isAuthenticated &&
                    match.status !== 'FINALIZADO' &&
                    (isCreator || match.player1Id === user?.id || match.player2Id === user?.id);

                  return (
                    <div
                      key={match.id}
                      className="flex items-center gap-3 p-3 rounded-ios bg-surface-DEFAULT border border-surface-border"
                    >
                      {/* Player 1 */}
                      <div className="flex-1 flex items-center gap-2 justify-end">
                        {match.player1 ? (
                          <>
                            <span className={cn('text-sm font-semibold truncate max-w-32', match.winnerId === match.player1.id && 'text-brand-400')}>
                              {match.player1.username}
                            </span>
                            <Avatar src={match.player1.avatarUrl} username={match.player1.username} size="xs" />
                          </>
                        ) : (
                          <span className="text-xs text-text-muted italic">TBD</span>
                        )}
                      </div>

                      {/* Score / VS */}
                      <div className="text-center px-3 min-w-16">
                        {match.status === 'FINALIZADO' ? (
                          <span className="text-sm font-bold text-text-primary">
                            {match.score1} - {match.score2}
                          </span>
                        ) : (
                          <span className="text-xs text-text-muted font-medium">VS</span>
                        )}
                      </div>

                      {/* Player 2 */}
                      <div className="flex-1 flex items-center gap-2">
                        {match.player2 ? (
                          <>
                            <Avatar src={match.player2.avatarUrl} username={match.player2.username} size="xs" />
                            <span className={cn('text-sm font-semibold truncate max-w-32', match.winnerId === match.player2.id && 'text-brand-400')}>
                              {match.player2.username}
                            </span>
                          </>
                        ) : (
                          <span className="text-xs text-text-muted italic">TBD</span>
                        )}
                      </div>

                      {/* Submit result */}
                      {canSubmit && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setResultModal({
                              matchId: match.id,
                              p1: match.player1?.username || 'P1',
                              p2: match.player2?.username || 'P2',
                            })
                          }
                        >
                          Resultado
                        </Button>
                      )}

                      {match.status === 'FINALIZADO' && match.winner && (
                        <Trophy className="w-4 h-4 text-accent-yellow flex-shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-text-muted text-center py-8">
                Nenhuma partida ainda. O campeonato precisa ser iniciado.
              </p>
            )}
          </div>
        )}
      </motion.div>

      {/* Submit result modal */}
      <Modal
        open={!!resultModal}
        onClose={() => setResultModal(null)}
        title="Registrar Resultado"
        size="sm"
      >
        {resultModal && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label={resultModal.p1}
                type="number"
                min="0"
                placeholder="0"
                value={scores.score1}
                onChange={(e) => setScores((s) => ({ ...s, score1: e.target.value }))}
              />
              <Input
                label={resultModal.p2}
                type="number"
                min="0"
                placeholder="0"
                value={scores.score2}
                onChange={(e) => setScores((s) => ({ ...s, score2: e.target.value }))}
              />
            </div>
            <Button
              fullWidth
              loading={resultMutation.isPending}
              onClick={() => {
                resultMutation.mutate({
                  matchId: resultModal.matchId,
                  score1: Number(scores.score1),
                  score2: Number(scores.score2),
                });
              }}
            >
              <Check className="w-4 h-4" />
              Confirmar Resultado
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
