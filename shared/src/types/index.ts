// ─── Enums ────────────────────────────────────────────────────────────────────

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

export enum MatchStatus {
  PENDENTE = 'PENDENTE',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  FINALIZADO = 'FINALIZADO',
  WO = 'WO',
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface IUser {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string | null;
  gamesPlayed: number;
  wins: number;
  losses: number;
  createdAt: string;
  updatedAt: string;
  badges?: IUserBadge[];
}

export interface IUserStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
}

// ─── Tournament ────────────────────────────────────────────────────────────────

export interface ITournament {
  id: string;
  title: string;
  game: string;
  description?: string | null;
  creatorId: string;
  entryFee?: number | null;
  rules?: string | null;
  format: TournamentFormat;
  status: TournamentStatus;
  maxPlayers: number;
  startDate?: string | null;
  imageUrl?: string | null;
  prize?: string | null;
  createdAt: string;
  updatedAt: string;
  creator?: Pick<IUser, 'id' | 'username' | 'avatarUrl'>;
  registrations?: IRegistration[];
  _count?: { registrations: number };
}

// ─── Match ─────────────────────────────────────────────────────────────────────

export interface IMatch {
  id: string;
  tournamentId: string;
  roundId?: string | null;
  player1Id?: string | null;
  player2Id?: string | null;
  score1?: number | null;
  score2?: number | null;
  winnerId?: string | null;
  status: MatchStatus;
  scheduledAt?: string | null;
  createdAt: string;
  updatedAt: string;
  player1?: Pick<IUser, 'id' | 'username' | 'avatarUrl'> | null;
  player2?: Pick<IUser, 'id' | 'username' | 'avatarUrl'> | null;
  winner?: Pick<IUser, 'id' | 'username' | 'avatarUrl'> | null;
  round?: IRound | null;
}

// ─── Round ────────────────────────────────────────────────────────────────────

export interface IRound {
  id: string;
  tournamentId: string;
  roundNumber: number;
  name?: string | null;
  matches?: IMatch[];
}

// ─── Registration ─────────────────────────────────────────────────────────────

export interface IRegistration {
  id: string;
  userId: string;
  tournamentId: string;
  createdAt: string;
  user?: Pick<IUser, 'id' | 'username' | 'avatarUrl'>;
  tournament?: Pick<ITournament, 'id' | 'title' | 'game'>;
}

// ─── Badge ─────────────────────────────────────────────────────────────────────

export interface IBadge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  condition: string;
}

export interface IUserBadge {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: string;
  badge?: IBadge;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface IAuthPayload {
  sub: string;
  email: string;
  username: string;
}

export interface ILoginResponse {
  accessToken: string;
  user: IUser;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

// ─── Games ────────────────────────────────────────────────────────────────────

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
