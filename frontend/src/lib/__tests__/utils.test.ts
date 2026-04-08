import {
  getInitials,
  getWinRate,
  getTournamentStatusLabel,
  getTournamentFormatLabel,
  formatCurrency,
} from '../utils';

describe('getInitials', () => {
  it('returns first character for a single word', () => {
    expect(getInitials('Pedro')).toBe('P');
  });

  it('returns initials from two words', () => {
    expect(getInitials('Pedro Silva')).toBe('PS');
  });

  it('caps at 2 characters for long names', () => {
    expect(getInitials('Ana Maria Costa')).toBe('AM');
  });

  it('handles a single character', () => {
    expect(getInitials('X')).toBe('X');
  });
});

describe('getWinRate', () => {
  it('returns 0 when no games played', () => {
    expect(getWinRate(5, 0)).toBe(0);
  });

  it('calculates correct win rate', () => {
    expect(getWinRate(7, 10)).toBe(70);
  });

  it('rounds to nearest integer', () => {
    expect(getWinRate(1, 3)).toBe(33);
  });
});

describe('getTournamentStatusLabel', () => {
  it('maps ABERTO correctly', () => {
    expect(getTournamentStatusLabel('ABERTO')).toBe('Aberto');
  });

  it('maps EM_ANDAMENTO correctly', () => {
    expect(getTournamentStatusLabel('EM_ANDAMENTO')).toBe('Em Andamento');
  });

  it('returns raw value for unknown status', () => {
    expect(getTournamentStatusLabel('UNKNOWN')).toBe('UNKNOWN');
  });
});

describe('getTournamentFormatLabel', () => {
  it('maps MATA_MATA correctly', () => {
    expect(getTournamentFormatLabel('MATA_MATA')).toBe('Mata-Mata');
  });

  it('returns raw value for unknown format', () => {
    expect(getTournamentFormatLabel('UNKNOWN')).toBe('UNKNOWN');
  });
});

describe('formatCurrency', () => {
  it('formats BRL currency', () => {
    const result = formatCurrency(100);
    expect(result).toContain('100');
  });
});
