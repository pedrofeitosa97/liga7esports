'use client';
import { motion } from 'framer-motion';
import { Trophy, Circle } from 'lucide-react';
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

// ── Layout constants ──────────────────────────────────────────────────────────
const CARD_W = 184;      // px — match card width
const CELL_H = 92;       // px — height of one "cell" in round 0 (card + gap)
const CONN_W = 36;       // px — SVG connector column width
const ARM_W = 18;        // px — horizontal arm within connector

// ── Match Card ────────────────────────────────────────────────────────────────
function MatchCard({ match }: { match: Match }) {
  const isDone = match.status === 'FINALIZADO';
  const isLive = match.status === 'EM_ANDAMENTO';

  const borderClass = isDone
    ? 'border-surface-border-light'
    : isLive
    ? 'border-brand-500/50'
    : 'border-surface-border';

  const renderSlot = (
    player: Player | null | undefined,
    score: number | null | undefined,
    isWinner: boolean,
  ) => (
    <div
      className={cn(
        'flex items-center gap-2 px-3 h-[36px] transition-colors',
        isDone && isWinner && 'bg-brand-500/10',
        isDone && !isWinner && player && 'opacity-40',
      )}
    >
      {player ? (
        <>
          <Avatar src={player.avatarUrl} username={player.username} size="xs" />
          <span
            className={cn(
              'flex-1 text-xs font-semibold truncate',
              isDone && isWinner ? 'text-brand-400' : 'text-text-primary',
            )}
          >
            {player.username}
          </span>
          {isDone && score !== null && score !== undefined && (
            <span
              className={cn(
                'text-xs font-bold tabular-nums',
                isWinner ? 'text-brand-400' : 'text-text-muted',
              )}
            >
              {score}
            </span>
          )}
          {isDone && isWinner && (
            <Trophy className="w-3 h-3 text-brand-400 flex-shrink-0" />
          )}
        </>
      ) : (
        <span className="text-[11px] text-text-muted italic">A definir</span>
      )}
    </div>
  );

  return (
    <div
      className={cn(
        'rounded-ios border overflow-hidden bg-surface-DEFAULT',
        borderClass,
        isLive && 'shadow-[0_0_12px_rgba(249,115,22,0.2)]',
      )}
      style={{ width: CARD_W }}
    >
      {isLive && (
        <div className="flex items-center gap-1.5 px-3 py-1 border-b border-brand-500/30 bg-brand-500/5">
          <Circle className="w-1.5 h-1.5 fill-brand-400 text-brand-400 animate-pulse" />
          <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider">Ao vivo</span>
        </div>
      )}
      {renderSlot(match.player1, match.score1, match.winnerId === match.player1?.id)}
      <div className="border-t border-surface-border/60" />
      {renderSlot(match.player2, match.score2, match.winnerId === match.player2?.id)}
    </div>
  );
}

// ── SVG Connector between rounds ──────────────────────────────────────────────
// Draws horizontal arms + vertical connector for each pair of matches in round n.
function BracketConnector({
  roundIndex,
  numFirstRoundMatches,
  totalHeight,
}: {
  roundIndex: number;
  numFirstRoundMatches: number;
  totalHeight: number;
}) {
  const cellSize = CELL_H * Math.pow(2, roundIndex);
  const numMatchesInRound = numFirstRoundMatches / Math.pow(2, roundIndex);
  const numPairs = Math.floor(numMatchesInRound / 2);
  const color = '#3a3a50'; // surface-border color

  return (
    <svg
      width={CONN_W}
      height={totalHeight}
      style={{ flexShrink: 0, display: 'block' }}
    >
      {Array.from({ length: numPairs }, (_, pairIdx) => {
        const y1 = pairIdx * 2 * cellSize + cellSize / 2;
        const y2 = (pairIdx * 2 + 1) * cellSize + cellSize / 2;
        const mid = (y1 + y2) / 2;

        return (
          <g key={pairIdx}>
            {/* arm from match 1 */}
            <line x1={0} y1={y1} x2={ARM_W} y2={y1} stroke={color} strokeWidth={1.5} />
            {/* arm from match 2 */}
            <line x1={0} y1={y2} x2={ARM_W} y2={y2} stroke={color} strokeWidth={1.5} />
            {/* vertical connector */}
            <line x1={ARM_W} y1={y1} x2={ARM_W} y2={y2} stroke={color} strokeWidth={1.5} />
            {/* arm to next round */}
            <line x1={ARM_W} y1={mid} x2={CONN_W} y2={mid} stroke={color} strokeWidth={1.5} />
          </g>
        );
      })}
    </svg>
  );
}

// ── Single-elimination bracket ────────────────────────────────────────────────
function SingleEliminationBracket({ rounds }: { rounds: Round[] }) {
  const numFirstRoundMatches = rounds[0].matches.length;
  const totalHeight = numFirstRoundMatches * CELL_H;

  return (
    <div className="overflow-x-auto pb-4">
      <div style={{ display: 'inline-flex', flexDirection: 'column', minWidth: 'max-content' }}>
        {/* Round headers */}
        <div style={{ display: 'flex', marginBottom: 12 }}>
          {rounds.map((round, idx) => (
            <div
              key={`h-${round.id}`}
              style={{
                width: CARD_W + (idx < rounds.length - 1 ? CONN_W : 0),
                textAlign: 'center',
              }}
            >
              <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-widest">
                {round.name || `Round ${round.roundNumber}`}
              </span>
            </div>
          ))}
        </div>

        {/* Bracket body */}
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          {rounds.map((round, roundIdx) => {
            const cellSize = CELL_H * Math.pow(2, roundIdx);

            return (
              <div key={round.id} style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                {/* Match column */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {round.matches.map((match, matchIdx) => (
                    <motion.div
                      key={match.id}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: roundIdx * 0.08 + matchIdx * 0.04 }}
                      style={{
                        height: cellSize,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <MatchCard match={match} />
                    </motion.div>
                  ))}
                </div>

                {/* Connector to next round */}
                {roundIdx < rounds.length - 1 && (
                  <BracketConnector
                    roundIndex={roundIdx}
                    numFirstRoundMatches={numFirstRoundMatches}
                    totalHeight={totalHeight}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Grupos: standings + match list ────────────────────────────────────────────
function GroupsView({ rounds }: { rounds: Round[] }) {
  return (
    <div className="space-y-6">
      {rounds.map((round) => {
        // Build standings for this group
        const standings: Record<string, { player: Player; w: number; l: number; gf: number; ga: number }> = {};

        for (const m of round.matches) {
          for (const p of [m.player1, m.player2]) {
            if (p && !standings[p.id]) standings[p.id] = { player: p, w: 0, l: 0, gf: 0, ga: 0 };
          }
          if (m.status === 'FINALIZADO' && m.winnerId) {
            if (standings[m.winnerId]) standings[m.winnerId].w++;
            const loserId = m.player1?.id === m.winnerId ? m.player2?.id : m.player1?.id;
            if (loserId && standings[loserId]) standings[loserId].l++;
            if (m.player1?.id && standings[m.player1.id]) {
              standings[m.player1.id].gf += m.score1 ?? 0;
              standings[m.player1.id].ga += m.score2 ?? 0;
            }
            if (m.player2?.id && standings[m.player2.id]) {
              standings[m.player2.id].gf += m.score2 ?? 0;
              standings[m.player2.id].ga += m.score1 ?? 0;
            }
          }
        }

        const sorted = Object.values(standings).sort(
          (a, b) => b.w * 3 - a.w * 3 || b.gf - b.ga - (a.gf - a.ga),
        );

        return (
          <div key={round.id} className="glass-card overflow-hidden">
            {/* Group header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-surface-border bg-surface-DEFAULT/50">
              <span className="w-6 h-6 rounded-ios bg-brand-500/20 flex items-center justify-center text-brand-400 text-xs font-bold">
                {round.roundNumber}
              </span>
              <h4 className="text-sm font-bold text-text-primary">
                {round.name || `Grupo ${round.roundNumber}`}
              </h4>
              <span className="ml-auto text-xs text-text-muted">
                {round.matches.filter((m) => m.status === 'FINALIZADO').length}/{round.matches.length} partidas
              </span>
            </div>

            {/* Standings table */}
            <div className="px-4 pt-3 pb-2">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Classificação</p>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-surface-border/50">
                    <th className="text-left pb-1.5 text-text-muted font-semibold">#</th>
                    <th className="text-left pb-1.5 text-text-muted font-semibold">Jogador</th>
                    <th className="text-center pb-1.5 text-text-muted font-semibold w-8">V</th>
                    <th className="text-center pb-1.5 text-text-muted font-semibold w-8">D</th>
                    <th className="text-center pb-1.5 text-text-muted font-semibold w-8">SG</th>
                    <th className="text-center pb-1.5 text-text-muted font-semibold w-10">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((entry, i) => (
                    <tr
                      key={entry.player.id}
                      className={cn(
                        'border-b border-surface-border/30 last:border-0',
                        i < 2 && 'bg-brand-500/5',
                      )}
                    >
                      <td className="py-2">
                        <span className={cn(
                          'font-bold',
                          i === 0 ? 'text-brand-400' : i === 1 ? 'text-brand-500/70' : 'text-text-muted',
                        )}>
                          {i + 1}
                        </span>
                      </td>
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <Avatar src={entry.player.avatarUrl} username={entry.player.username} size="xs" />
                          <span className="font-semibold text-text-primary truncate max-w-28">
                            {entry.player.username}
                          </span>
                          {i === 0 && <Trophy className="w-3 h-3 text-brand-400" />}
                        </div>
                      </td>
                      <td className="py-2 text-center font-semibold text-accent-green">{entry.w}</td>
                      <td className="py-2 text-center text-accent-red">{entry.l}</td>
                      <td className="py-2 text-center text-text-muted">{entry.gf - entry.ga > 0 ? '+' : ''}{entry.gf - entry.ga}</td>
                      <td className="py-2 text-center font-bold text-text-primary">{entry.w * 3}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Match list */}
            <div className="border-t border-surface-border px-4 py-3 space-y-1.5">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Partidas</p>
              {round.matches.map((match) => {
                const isDone = match.status === 'FINALIZADO';
                const isLive = match.status === 'EM_ANDAMENTO';
                return (
                  <div
                    key={match.id}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-ios',
                      isDone ? 'bg-surface-DEFAULT/40' : isLive ? 'bg-brand-500/5 border border-brand-500/20' : 'bg-surface-DEFAULT',
                    )}
                  >
                    {/* P1 */}
                    <div className="flex-1 flex items-center gap-1.5 justify-end">
                      {match.player1 ? (
                        <>
                          <span className={cn(
                            'text-xs font-semibold truncate max-w-20 text-right',
                            isDone && match.winnerId === match.player1.id && 'text-brand-400',
                          )}>
                            {match.player1.username}
                          </span>
                          <Avatar src={match.player1.avatarUrl} username={match.player1.username} size="xs" />
                        </>
                      ) : <span className="text-[10px] text-text-muted italic">TBD</span>}
                    </div>
                    {/* Score/VS */}
                    <div className="min-w-[52px] text-center">
                      {isDone ? (
                        <span className="text-xs font-bold text-text-primary tabular-nums">
                          {match.score1} — {match.score2}
                        </span>
                      ) : isLive ? (
                        <span className="text-[10px] font-bold text-brand-400 animate-pulse">AO VIVO</span>
                      ) : (
                        <span className="text-[10px] text-text-muted font-medium">vs</span>
                      )}
                    </div>
                    {/* P2 */}
                    <div className="flex-1 flex items-center gap-1.5">
                      {match.player2 ? (
                        <>
                          <Avatar src={match.player2.avatarUrl} username={match.player2.username} size="xs" />
                          <span className={cn(
                            'text-xs font-semibold truncate max-w-20',
                            isDone && match.winnerId === match.player2.id && 'text-brand-400',
                          )}>
                            {match.player2.username}
                          </span>
                        </>
                      ) : <span className="text-[10px] text-text-muted italic">TBD</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Pontos Corridos: standings + rounds ───────────────────────────────────────
function RoundRobinView({ rounds }: { rounds: Round[] }) {
  const allMatches = rounds.flatMap((r) => r.matches);
  const standings: Record<string, { player: Player; w: number; l: number; gf: number; ga: number }> = {};

  for (const m of allMatches) {
    for (const p of [m.player1, m.player2]) {
      if (p && !standings[p.id]) standings[p.id] = { player: p, w: 0, l: 0, gf: 0, ga: 0 };
    }
    if (m.status === 'FINALIZADO' && m.winnerId) {
      if (standings[m.winnerId]) standings[m.winnerId].w++;
      const loserId = m.player1?.id === m.winnerId ? m.player2?.id : m.player1?.id;
      if (loserId && standings[loserId]) standings[loserId].l++;
    }
  }

  const sorted = Object.values(standings).sort((a, b) => b.w - a.w || a.l - b.l);

  return (
    <div className="space-y-5">
      {/* Standings */}
      <div className="glass-card overflow-hidden">
        <div className="px-4 py-3 border-b border-surface-border bg-surface-DEFAULT/50">
          <h4 className="text-sm font-bold text-text-primary">Classificação Geral</h4>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border">
              <th className="text-left py-2 px-4 text-xs font-semibold text-text-muted">#</th>
              <th className="text-left py-2 px-4 text-xs font-semibold text-text-muted">Jogador</th>
              <th className="text-center py-2 px-3 text-xs font-semibold text-text-muted">V</th>
              <th className="text-center py-2 px-3 text-xs font-semibold text-text-muted">D</th>
              <th className="text-center py-2 px-3 text-xs font-semibold text-text-muted">J</th>
              <th className="text-center py-2 px-3 text-xs font-semibold text-text-muted">Pts</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((entry, i) => (
              <tr
                key={entry.player.id}
                className={cn(
                  'border-b border-surface-border/40 last:border-0 hover:bg-surface-DEFAULT/50 transition-colors',
                  i === 0 && 'bg-brand-500/5',
                )}
              >
                <td className="py-3 px-4">
                  <span className={cn(
                    'text-xs font-bold',
                    i === 0 ? 'text-brand-400' : i < 3 ? 'text-text-secondary' : 'text-text-muted',
                  )}>
                    {i + 1}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Avatar src={entry.player.avatarUrl} username={entry.player.username} size="xs" />
                    <span className="text-xs font-semibold text-text-primary">{entry.player.username}</span>
                    {i === 0 && <Trophy className="w-3 h-3 text-brand-400" />}
                  </div>
                </td>
                <td className="py-3 px-3 text-center text-xs font-semibold text-accent-green">{entry.w}</td>
                <td className="py-3 px-3 text-center text-xs text-accent-red">{entry.l}</td>
                <td className="py-3 px-3 text-center text-xs text-text-muted">{entry.w + entry.l}</td>
                <td className="py-3 px-3 text-center text-xs font-bold text-text-primary">{entry.w * 3}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rounds */}
      <div className="space-y-3">
        {rounds.map((round) => {
          const done = round.matches.filter((m) => m.status === 'FINALIZADO').length;
          const total = round.matches.length;
          const allDone = done === total;

          return (
            <div key={round.id} className="glass-card overflow-hidden">
              <div className={cn(
                'flex items-center gap-3 px-4 py-3 border-b border-surface-border',
                allDone ? 'bg-surface-DEFAULT/30' : 'bg-surface-DEFAULT/50',
              )}>
                <span className={cn(
                  'text-xs font-bold w-6 h-6 rounded-ios flex items-center justify-center',
                  allDone ? 'bg-accent-green/15 text-accent-green' : 'bg-brand-500/20 text-brand-400',
                )}>
                  {round.roundNumber}
                </span>
                <span className="text-sm font-bold text-text-primary">
                  {round.name || `Rodada ${round.roundNumber}`}
                </span>
                <span className="ml-auto text-xs text-text-muted">{done}/{total}</span>
              </div>
              <div className="divide-y divide-surface-border/30">
                {round.matches.map((match) => {
                  const isDone = match.status === 'FINALIZADO';
                  return (
                    <div key={match.id} className="flex items-center gap-3 px-4 py-2.5">
                      <div className="flex-1 flex items-center gap-2 justify-end">
                        {match.player1 && (
                          <>
                            <span className={cn(
                              'text-xs font-semibold text-right truncate max-w-24',
                              isDone && match.winnerId === match.player1.id && 'text-brand-400',
                            )}>
                              {match.player1.username}
                            </span>
                            <Avatar src={match.player1.avatarUrl} username={match.player1.username} size="xs" />
                          </>
                        )}
                      </div>
                      <div className="min-w-[48px] text-center">
                        {isDone ? (
                          <span className="text-xs font-bold text-text-primary tabular-nums">
                            {match.score1} — {match.score2}
                          </span>
                        ) : (
                          <span className="text-[10px] text-text-muted">vs</span>
                        )}
                      </div>
                      <div className="flex-1 flex items-center gap-2">
                        {match.player2 && (
                          <>
                            <Avatar src={match.player2.avatarUrl} username={match.player2.username} size="xs" />
                            <span className={cn(
                              'text-xs font-semibold truncate max-w-24',
                              isDone && match.winnerId === match.player2.id && 'text-brand-400',
                            )}>
                              {match.player2.username}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function TournamentBracket({ rounds, format }: TournamentBracketProps) {
  if (!rounds.length) {
    return (
      <div className="text-center py-12 text-text-muted">
        <Trophy className="w-12 h-12 mx-auto mb-3 opacity-20" />
        <p className="text-sm font-medium">Chaves ainda não geradas</p>
        <p className="text-xs mt-1 text-text-muted">O organizador precisa iniciar o campeonato</p>
      </div>
    );
  }

  if (format === 'GRUPOS') return <GroupsView rounds={rounds} />;
  if (format === 'PONTOS_CORRIDOS') return <RoundRobinView rounds={rounds} />;
  return <SingleEliminationBracket rounds={rounds} />;
}
