import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return format(new Date(date), "d 'de' MMMM 'de' yyyy", { locale: ptBR });
}

export function formatDateShort(date: string | Date) {
  return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
}

export function timeAgo(date: string | Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR });
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function getWinRate(wins: number, gamesPlayed: number) {
  if (gamesPlayed === 0) return 0;
  return Math.round((wins / gamesPlayed) * 100);
}

export function getTournamentStatusLabel(status: string) {
  const labels: Record<string, string> = {
    ABERTO: 'Aberto',
    EM_ANDAMENTO: 'Em Andamento',
    FINALIZADO: 'Finalizado',
  };
  return labels[status] || status;
}

export function getTournamentFormatLabel(format: string) {
  const labels: Record<string, string> = {
    MATA_MATA: 'Mata-Mata',
    GRUPOS: 'Grupos',
    PONTOS_CORRIDOS: 'Pontos Corridos',
  };
  return labels[format] || format;
}

export function getGameEmoji(gameId: string) {
  const emojis: Record<string, string> = {
    'ea-fc-26': '⚽',
    'fifa-24': '⚽',
    fortnite: '🏗️',
    valorant: '🎯',
    'league-of-legends': '⚔️',
    cs2: '🔫',
    'rocket-league': '🚀',
    'apex-legends': '💥',
    'overwatch-2': '🦸',
    'call-of-duty': '🪖',
    outros: '🎮',
  };
  return emojis[gameId] || '🎮';
}

export function getGameName(gameId: string) {
  const names: Record<string, string> = {
    'ea-fc-26': 'EA Sports FC 26',
    'fifa-24': 'FIFA 24',
    fortnite: 'Fortnite',
    valorant: 'Valorant',
    'league-of-legends': 'League of Legends',
    cs2: 'Counter-Strike 2',
    'rocket-league': 'Rocket League',
    'apex-legends': 'Apex Legends',
    'overwatch-2': 'Overwatch 2',
    'call-of-duty': 'Call of Duty',
    outros: 'Outros',
  };
  return names[gameId] || gameId;
}

export function getShareUrl(tournamentId: string) {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/tournaments/${tournamentId}`;
  }
  return `/tournaments/${tournamentId}`;
}

export async function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  } else {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getAvatarColor(username: string) {
  const colors = [
    'from-brand-500 to-brand-700',
    'from-accent-purple to-accent-blue',
    'from-accent-cyan to-accent-green',
    'from-accent-pink to-accent-purple',
    'from-accent-yellow to-accent-red',
  ];
  const index = username.charCodeAt(0) % colors.length;
  return colors[index];
}
