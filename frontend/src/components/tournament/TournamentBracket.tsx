'use client';
import { motion } from 'framer-motion';
import { Trophy, ChevronRight } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';

interface Player {
  id: string;
  username: string;
  avatarUrl?: string | null;
}

interface Match {
  id: string;
  player1?: Player | null;
  player2?: Player | null;
  score1?: number | null;
  score2?: number | null;
  winnerId?: string | null;
  status: string;
}

interface Round {
  id: string;
  roundNumber: number;
  name?: string | null;
  matches: Match[];
}

interface TournamentBracketProps {
  rounds: Round[];
  format: string;
}

function MatchCard({ match }: { match: Match }) {
  const isFinished = match.status === 'FINALIZADO';

  const renderPlayer = (player: Player | null | undefined, score: number | null | undefined, isWinner: boolean) => (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-2 transition-all',
        isFinished && isWinner && 'bg-brand-500/10',
        isFinished && !isWinner && player && 'opacity-50',
      )}
    >
      {player ? (
        <>
          <Avatar src={player.avatarUrl} username={player.username} size="xs" />
          <span className={cn(
            'flex-1 text-xs font-semibold truncate',
            isFinished && isWinner ? 'text-brand-400' : 'text-text-primary',
          )}>
            {player.username}
          </span>
          {isFinished && score !== null && score !== undefined && (
            <span className={cn(
              'text-xs font-bold min-w-4 text-right',
              isWinner ? 'text-brand-400' : 'text-text-muted',
            )}>
              {score}
            </span>
          )}
          {isFinished && isWinner && <Trophy className="w-3 h-3 text-accent-yellow flex-shrink-0" />}
        </>
      ) : (
        <span className="text-xs text-text-muted italic flex-1">TBD</span>
      )}
    </div>
  );

  return (
    <div className={cn(
      'rounded-ios border overflow-hidden w-44',
      isFinished ? 'border-surface-border-light' : 'border-surface-border',
      !isFinished && match.player1 && match.player2 && 'border-brand-500/30',
    )}>
      <div className="bg-surface-DEFAULT">
        {renderPlayer(match.player1, match.score1, match.winnerId === match.player1?.id)}
      </div>
      <div className="border-t border-surface-border">
        {renderPlayer(match.player2, match.score2, match.winnerId === match.player2?.id)}
      </div>
    </div>
  );
}

function RoundRobinTable({ rounds }: { rounds: Round[] }) {
  const allMatches = rounds.flatMap((r) => r.matches);

  // Build standings
  const standings: Record<string, { player: Player; wins: number; losses: number; gf: number; ga: number }> = {};
  for (const match of allMatches) {
    if (match.player1) {
      if (!standings[match.player1.id]) {
        standings[match.player1.id] = { player: match.player1, wins: 0, losses: 0, gf: 0, ga: 0 };
      }
    }
    if (match.player2) {
      if (!standings[match.player2.id]) {
        standings[match.player2.id] = { player: match.player2, wins: 0, losses: 0, gf: 0, ga: 0 };
      }
    }
    if (match.status === 'FINALIZADO' && match.winnerId) {
      if (standings[match.winnerId]) standings[match.winnerId].wins++;
      const loserId = match.player1?.id === match.winnerId ? match.player2?.id : match.player1?.id;
      if (loserId && standings[loserId]) standings[loserId].losses++;
    }
  }

  const sorted = Object.values(standings).sort((a, b) => b.wins - a.wins || a.losses - b.losses);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-surface-border">
            <th className="text-left py-2 px-3 text-xs font-semibold text-text-tertiary">#</th>
            <th className="text-left py-2 px-3 text-xs font-semibold text-text-tertiary">Jogador</th>
            <th className="text-center py-2 px-3 text-xs font-semibold text-text-tertiary">V</th>
            <th className="text-center py-2 px-3 text-xs font-semibold text-text-tertiary">D</th>
            <th className="text-center py-2 px-3 text-xs font-semibold text-text-tertiary">Pts</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((entry, i) => (
            <tr key={entry.player.id} className="border-b border-surface-border/50 hover:bg-surface-DEFAULT/50">
              <td className="py-2.5 px-3">
                <span className={cn(
                  'text-xs font-bold',
                  i === 0 ? 'text-accent-yellow' : i < 3 ? 'text-brand-400' : 'text-text-muted',
                )}>
                  {i + 1}
                </span>
              </td>
              <td className="py-2.5 px-3">
                <div className="flex items-center gap-2">
                  <Avatar src={entry.player.avatarUrl} username={entry.player.username} size="xs" />
                  <span className="text-xs font-semibold text-text-primary">{entry.player.username}</span>
                  {i === 0 && <Trophy className="w-3 h-3 text-accent-yellow" />}
                </div>
              </td>
              <td className="py-2.5 px-3 text-center text-xs font-semibold text-accent-green">{entry.wins}</td>
              <td className="py-2.5 px-3 text-center text-xs text-accent-red">{entry.losses}</td>
              <td className="py-2.5 px-3 text-center text-xs font-bold text-text-primary">{entry.wins * 3}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function TournamentBracket({ rounds, format }: TournamentBracketProps) {
  if (!rounds.length) {
    return (
      <div className="text-center py-12 text-text-muted">
        <Trophy className="w-12 h-12 mx-auto mb-3 opacity-20" />
        <p className="text-sm font-medium">Chaves ainda não geradas</p>
        <p className="text-xs mt-1">O organizador precisa iniciar o campeonato</p>
      </div>
    );
  }

  if (format === 'PONTOS_CORRIDOS' || format === 'GRUPOS') {
    return (
      <div className="space-y-6">
        {format === 'GRUPOS' && (
          <div className="space-y-6">
            {rounds.map((round) => (
              <div key={round.id}>
                <h4 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-ios bg-brand-500/20 flex items-center justify-center text-brand-400 text-xs font-bold">
                    {round.roundNumber}
                  </span>
                  {round.name || `Grupo ${round.roundNumber}`}
                </h4>
                <div className="space-y-2">
                  {round.matches.map((match) => (
                    <div key={match.id} className="glass-card p-3 flex items-center gap-3">
                      <div className="flex-1 flex items-center gap-2 justify-end">
                        {match.player1 && (
                          <>
                            <span className="text-xs font-semibold text-text-primary truncate max-w-24 text-right">{match.player1.username}</span>
                            <Avatar src={match.player1.avatarUrl} username={match.player1.username} size="xs" />
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2 px-2">
                        {match.status === 'FINALIZADO' ? (
                          <span className="text-sm font-bold text-text-primary">{match.score1} - {match.score2}</span>
                        ) : (
                          <span className="text-xs text-text-muted font-medium">vs</span>
                        )}
                      </div>
                      <div className="flex-1 flex items-center gap-2">
                        {match.player2 && (
                          <>
                            <Avatar src={match.player2.avatarUrl} username={match.player2.username} size="xs" />
                            <span className="text-xs font-semibold text-text-primary truncate max-w-24">{match.player2.username}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {format === 'PONTOS_CORRIDOS' && (
          <div className="glass-card overflow-hidden">
            <RoundRobinTable rounds={rounds} />
          </div>
        )}
      </div>
    );
  }

  // Single elimination bracket
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-6 min-w-max items-start">
        {rounds.map((round, roundIdx) => (
          <motion.div
            key={round.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: roundIdx * 0.1 }}
            className="flex flex-col gap-4"
          >
            {/* Round label */}
            <div className="text-center">
              <span className="text-xs font-bold text-text-tertiary uppercase tracking-wider">
                {round.name || `Round ${round.roundNumber}`}
              </span>
            </div>

            {/* Matches */}
            <div
              className="flex flex-col justify-around gap-6"
              style={{ gap: `${Math.pow(2, roundIdx) * 48}px` }}
            >
              {round.matches.map((match) => (
                <div key={match.id} className="flex items-center gap-2">
                  <MatchCard match={match} />
                  {roundIdx < rounds.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-text-muted flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
