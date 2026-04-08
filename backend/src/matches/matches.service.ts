import {
  Injectable, NotFoundException, ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { MatchStatus, TournamentFormat } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitResultDto } from './dto/submit-result.dto';

@Injectable()
export class MatchesService {
  constructor(private prisma: PrismaService) {}

  async findByTournament(tournamentId: string) {
    return this.prisma.match.findMany({
      where: { tournamentId },
      include: {
        player1: { select: { id: true, username: true, avatarUrl: true } },
        player2: { select: { id: true, username: true, avatarUrl: true } },
        winner: { select: { id: true, username: true, avatarUrl: true } },
        round: true,
      },
      orderBy: [{ round: { roundNumber: 'asc' } }, { createdAt: 'asc' }],
    });
  }

  async submitResult(userId: string, dto: SubmitResultDto) {
    const match = await this.prisma.match.findUnique({
      where: { id: dto.matchId },
      include: { tournament: true },
    });

    if (!match) throw new NotFoundException('Partida não encontrada');
    if (match.status === MatchStatus.FINALIZADO) {
      throw new BadRequestException('Esta partida já foi finalizada');
    }

    // Only tournament creator or players can submit
    const isCreator = match.tournament.creatorId === userId;
    const isPlayer = match.player1Id === userId || match.player2Id === userId;
    if (!isCreator && !isPlayer) {
      throw new ForbiddenException('Sem permissão para registrar resultado');
    }

    // Determine winner
    let winnerId = dto.winnerId;
    if (!winnerId) {
      if (dto.score1 > dto.score2) winnerId = match.player1Id;
      else if (dto.score2 > dto.score1) winnerId = match.player2Id;
    }

    const updated = await this.prisma.match.update({
      where: { id: dto.matchId },
      data: {
        score1: dto.score1,
        score2: dto.score2,
        winnerId,
        status: MatchStatus.FINALIZADO,
      },
      include: {
        player1: { select: { id: true, username: true, avatarUrl: true } },
        player2: { select: { id: true, username: true, avatarUrl: true } },
        winner: { select: { id: true, username: true, avatarUrl: true } },
      },
    });

    // Update player stats
    if (updated.player1Id) {
      await this.prisma.user.update({
        where: { id: updated.player1Id },
        data: {
          gamesPlayed: { increment: 1 },
          wins: winnerId === updated.player1Id ? { increment: 1 } : undefined,
          losses: winnerId !== updated.player1Id ? { increment: 1 } : undefined,
        },
      });
    }
    if (updated.player2Id) {
      await this.prisma.user.update({
        where: { id: updated.player2Id },
        data: {
          gamesPlayed: { increment: 1 },
          wins: winnerId === updated.player2Id ? { increment: 1 } : undefined,
          losses: winnerId !== updated.player2Id ? { increment: 1 } : undefined,
        },
      });
    }

    // Advance bracket for MATA_MATA
    if (match.tournament.format === TournamentFormat.MATA_MATA) {
      await this.advanceSingleElimination(match.tournamentId, match.roundId);
    }

    // Check if tournament is complete
    await this.checkTournamentCompletion(match.tournamentId);

    return updated;
  }

  private async advanceSingleElimination(tournamentId: string, roundId: string) {
    const roundMatches = await this.prisma.match.findMany({
      where: { tournamentId, roundId },
    });

    const allDone = roundMatches.every((m) => m.status === MatchStatus.FINALIZADO);
    if (!allDone) return;

    const winners = roundMatches
      .filter((m) => m.winnerId)
      .map((m) => m.winnerId as string);

    if (winners.length < 2) return;

    const currentRound = await this.prisma.round.findUnique({ where: { id: roundId } });
    if (!currentRound) return;

    const nextRoundNumber = currentRound.roundNumber + 1;
    const roundNames = ['Final', 'Semifinal', 'Quartas de Final', 'Oitavas de Final'];
    const matchCount = Math.floor(winners.length / 2);
    const name = roundNames[Math.floor(Math.log2(matchCount))] ?? `Round ${nextRoundNumber}`;

    const nextRound = await this.prisma.round.create({
      data: { tournamentId, roundNumber: nextRoundNumber, name },
    });

    for (let i = 0; i < winners.length; i += 2) {
      await this.prisma.match.create({
        data: {
          tournamentId,
          roundId: nextRound.id,
          player1Id: winners[i],
          player2Id: winners[i + 1] ?? null,
          status: winners[i + 1] ? MatchStatus.PENDENTE : MatchStatus.FINALIZADO,
          winnerId: winners[i + 1] ? undefined : winners[i],
        },
      });
    }
  }

  private async checkTournamentCompletion(tournamentId: string) {
    const pending = await this.prisma.match.count({
      where: { tournamentId, status: { not: MatchStatus.FINALIZADO } },
    });
    if (pending === 0) {
      await this.prisma.tournament.update({
        where: { id: tournamentId },
        data: { status: 'FINALIZADO' },
      });
    }
  }
}
