// Supported games (mirrors shared/src/types/index.ts)
export const SUPPORTED_GAMES = [
  { id: 'ea-fc-26',       name: 'EA Sports FC 26', icon: '⚽' },
  { id: 'ea-fc-25',       name: 'EA Sports FC 25', icon: '⚽' },
  { id: 'ea-fc-24',       name: 'EA Sports FC 24', icon: '⚽' },
  { id: 'fifa-23',        name: 'FIFA 23',          icon: '⚽' },
  { id: 'efootball-2025', name: 'eFootball 2025',   icon: '⚽' },
  { id: 'efootball-2024', name: 'eFootball 2024',   icon: '⚽' },
  { id: 'efootball-2023', name: 'eFootball 2023',   icon: '⚽' },
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
