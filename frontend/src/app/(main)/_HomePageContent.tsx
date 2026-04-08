'use client';
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Zap, Users, TrendingUp, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { tournamentsApi } from '@/lib/api';
import TournamentCard from '@/components/tournament/TournamentCard';
import TournamentFilters from '@/components/tournament/TournamentFilters';
import { TournamentCardSkeleton } from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

interface Filters {
  search: string;
  game: string;
  status: string;
  free: boolean;
}

const stats = [
  { icon: Trophy, label: 'Campeonatos Ativos', value: '128', color: 'text-brand-400', bg: 'bg-brand-500/10' },
  { icon: Users, label: 'Jogadores', value: '4.2K', color: 'text-accent-cyan', bg: 'bg-accent-cyan/10' },
  { icon: Zap, label: 'Partidas Hoje', value: '312', color: 'text-accent-yellow', bg: 'bg-accent-yellow/10' },
  { icon: TrendingUp, label: 'Em Prêmios', value: 'R$ 28K', color: 'text-accent-green', bg: 'bg-accent-green/10' },
];

export default function HomePageContent() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [filters, setFilters] = useState<Filters>({ search: '', game: '', status: '', free: false });
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['tournaments', filters, page],
    queryFn: async () => {
      const res = await tournamentsApi.getAll({
        search: filters.search || undefined,
        game: filters.game || undefined,
        status: filters.status || undefined,
        free: filters.free || undefined,
        page,
        limit: 12,
      });
      return res.data;
    },
  });

  const handleFilterChange = useCallback((newFilters: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
  }, []);

  const tournaments = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  return (
    <div className="space-y-8">
      {/* Hero section */}
      <section className="relative rounded-ios-2xl overflow-hidden bg-gradient-hero border border-surface-border/40 p-6 sm:p-10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-accent-cyan/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-xl">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-ios-full bg-brand-500/15 border border-brand-500/30 text-brand-400 text-xs font-bold mb-4">
              <Zap className="w-3.5 h-3.5" />
              Plataforma #1 de Campeonatos Online
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary leading-tight tracking-tight mb-3">
              Compita com os{' '}
              <span className="text-gradient-brand">melhores jogadores</span>{' '}
              do Brasil
            </h1>
            <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-6">
              Crie campeonatos, participe de torneios e prove que você é o melhor em EA Sports FC 26, Valorant, Fortnite e muito mais.
            </p>
            <div className="flex flex-wrap gap-3">
              {!isAuthenticated ? (
                <>
                  <Button onClick={() => router.push('/register')} size="lg">
                    <Zap className="w-4 h-4" />Começar Grátis
                  </Button>
                  <Button variant="secondary" onClick={() => router.push('/login')} size="lg">
                    Fazer Login
                  </Button>
                </>
              ) : (
                <Button onClick={() => router.push('/tournaments/create')} size="lg">
                  <Plus className="w-4 h-4" />Criar Campeonato
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass-card p-4 flex items-center gap-3"
          >
            <div className={`w-10 h-10 rounded-ios ${stat.bg} flex items-center justify-center flex-shrink-0`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-lg font-extrabold text-text-primary leading-none">{stat.value}</p>
              <p className="text-xs text-text-tertiary mt-0.5">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Tournaments section */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="section-title">Campeonatos</h2>
            {total > 0 && <p className="text-xs text-text-muted mt-0.5">{total} campeonatos encontrados</p>}
          </div>
          {isAuthenticated && (
            <Button variant="outline" size="sm" onClick={() => router.push('/tournaments/create')}>
              <Plus className="w-4 h-4" />Criar
            </Button>
          )}
        </div>

        <TournamentFilters filters={filters} onChange={handleFilterChange} />

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <TournamentCardSkeleton key={i} />)}
          </div>
        ) : tournaments.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tournaments.map((t: any, i: number) => (
                <TournamentCard key={t.id} tournament={t} index={i} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  Anterior
                </Button>
                <span className="text-sm text-text-secondary font-medium px-3">{page} / {totalPages}</span>
                <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} loading={isFetching && page > 1}>
                  Próximo
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="glass-card p-12 text-center">
            <Trophy className="w-14 h-14 mx-auto mb-4 text-text-muted opacity-30" />
            <h3 className="font-bold text-text-primary mb-2">Nenhum campeonato encontrado</h3>
            <p className="text-sm text-text-muted mb-6">Tente outros filtros ou crie o seu próprio campeonato!</p>
            {isAuthenticated && (
              <Button onClick={() => router.push('/tournaments/create')}>
                <Plus className="w-4 h-4" />Criar Campeonato
              </Button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
