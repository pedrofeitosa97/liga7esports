// Supported games (mirrors shared/src/types/index.ts)
export const SUPPORTED_GAMES = [
  { id: 'ea-fc-26', name: 'EA Sports FC 26', icon: '⚽' },
  { id: 'fifa-24', name: 'FIFA 24', icon: '⚽' },
  { id: 'fortnite', name: 'Fortnite', icon: '🏗️' },
  { id: 'valorant', name: 'Valorant', icon: '🎯' },
  { id: 'league-of-legends', name: 'League of Legends', icon: '⚔️' },
  { id: 'cs2', name: 'Counter-Strike 2', icon: '🔫' },
  { id: 'rocket-league', name: 'Rocket League', icon: '🚀' },
  { id: 'apex-legends', name: 'Apex Legends', icon: '💥' },
  { id: 'overwatch-2', name: 'Overwatch 2', icon: '🦸' },
  { id: 'call-of-duty', name: 'Call of Duty', icon: '🪖' },
  { id: 'outros', name: 'Outros', icon: '🎮' },
] as const;

export type GameId = typeof SUPPORTED_GAMES[number]['id'];

export enum TournamentFormat {
  MATA_MATA = 'MATA_MATA',
  GRUPOS = 'GRUPOS',
  PONTOS_CORRIDOS = 'PONTOS_CORRIDOS',
}

export enum TournamentStatus {
  ABERTO = 'ABERTO',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  FINALIZADO = 'FINALIZADO',
}
