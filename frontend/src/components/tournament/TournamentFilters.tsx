'use client';
import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SUPPORTED_GAMES } from '@/lib/constants';

interface Filters {
  search: string;
  game: string;
  status: string;
  free: boolean;
}

interface TournamentFiltersProps {
  filters: Filters;
  onChange: (filters: Partial<Filters>) => void;
}

const statusOptions = [
  { value: '', label: 'Todos os Status' },
  { value: 'ABERTO', label: '🟢 Abertos' },
  { value: 'EM_ANDAMENTO', label: '🟡 Em Andamento' },
  { value: 'FINALIZADO', label: '⚫ Finalizados' },
];

export default function TournamentFilters({ filters, onChange }: TournamentFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = filters.game || filters.status || filters.free;

  const clearAll = () => {
    onChange({ game: '', status: '', free: false, search: '' });
  };

  return (
    <div className="space-y-3">
      {/* Search + Filter toggle */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Buscar campeonatos..."
            className="w-full pl-10 pr-4 py-2.5 rounded-ios bg-surface-DEFAULT border border-surface-border text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => onChange({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-ios text-sm font-semibold transition-all border',
            showFilters || hasActiveFilters
              ? 'bg-brand-500/15 border-brand-500/40 text-brand-400'
              : 'bg-surface-DEFAULT border-surface-border text-text-secondary hover:text-text-primary hover:bg-surface-hover',
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filtros</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-brand-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Filter pills */}
      {showFilters && (
        <div className="glass-card p-4 space-y-4 animate-fade-in">
          {/* Status */}
          <div>
            <p className="text-xs font-semibold text-text-tertiary mb-2 uppercase tracking-wide">Status</p>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onChange({ status: opt.value })}
                  className={cn(
                    'px-3 py-1.5 rounded-ios-full text-xs font-semibold border transition-all',
                    filters.status === opt.value
                      ? 'bg-brand-500/20 border-brand-500/50 text-brand-400'
                      : 'bg-surface-DEFAULT border-surface-border text-text-secondary hover:border-surface-border-light',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Games */}
          <div>
            <p className="text-xs font-semibold text-text-tertiary mb-2 uppercase tracking-wide">Jogo</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onChange({ game: '' })}
                className={cn(
                  'px-3 py-1.5 rounded-ios-full text-xs font-semibold border transition-all',
                  !filters.game
                    ? 'bg-brand-500/20 border-brand-500/50 text-brand-400'
                    : 'bg-surface-DEFAULT border-surface-border text-text-secondary hover:border-surface-border-light',
                )}
              >
                🎮 Todos
              </button>
              {SUPPORTED_GAMES.slice(0, 8).map((game) => (
                <button
                  key={game.id}
                  onClick={() => onChange({ game: game.id })}
                  className={cn(
                    'px-3 py-1.5 rounded-ios-full text-xs font-semibold border transition-all',
                    filters.game === game.id
                      ? 'bg-brand-500/20 border-brand-500/50 text-brand-400'
                      : 'bg-surface-DEFAULT border-surface-border text-text-secondary hover:border-surface-border-light',
                  )}
                >
                  {game.icon} {game.name}
                </button>
              ))}
            </div>
          </div>

          {/* Entry fee */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-text-primary">Apenas gratuitos</p>
              <p className="text-xs text-text-tertiary">Mostrar somente campeonatos gratuitos</p>
            </div>
            <button
              onClick={() => onChange({ free: !filters.free })}
              className={cn(
                'relative w-12 h-6 rounded-full transition-all duration-200',
                filters.free ? 'bg-brand-500' : 'bg-surface-DEFAULT border border-surface-border',
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200',
                  filters.free ? 'left-6' : 'left-0.5',
                )}
              />
            </button>
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="w-full py-2 text-xs font-semibold text-accent-red hover:bg-accent-red/10 rounded-ios transition-colors"
            >
              Limpar todos os filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
}
