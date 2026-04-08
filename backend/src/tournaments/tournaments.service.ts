import {
  Injectable, NotFoundException, ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { TournamentStatus, TournamentFormat } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';

const TOURNAMENT_SELECT = {
  id: true,
  title: true,
  game: true,
  description: true,
  creatorId: true,
  entryFee: true,
  rules: true,
  format: true,
  status: true,
  maxPlayers: true,
  startDate: true,
  imageUrl: true,
  prize: true,
  createdAt: true,
  updatedAt: true,
  creator: {
    select: { id: true, username: true, avatarUrl: true },
  },
  _count: { select: { registrations: true } },
};

@Injectable()
export class TournamentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateTournamentDto) {
    const tournament = await this.prisma.tournament.create({
      data: {
        ...dto,
        creatorId: userId,
        maxPlayers: dto.maxPlayers ?? 16,
      },
      select: TOURNAMENT_SELECT,
    });

    // Award badge for creating first tournament
    await this.checkAndAwardBadge(userId, 'FIRST_TOURNAMENT');

    return tournament;
  }

  async findAll(filters?: {
    game?: string;
    status?: TournamentStatus;
    free?: boolean;
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 12;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters?.game) where.game = filters.game;
    if (filters?.status) where.status = filters.status;
    if (filters?.free === true) where.entryFee = null;
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { game: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.tournament.findMany({
        where,
        skip,
        take: limit,
        select: TOURNAMENT_SELECT,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.tournament.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const tournament = await this.prisma.tournament.findUnique({
      where: { id },
      select: {
        ...TOURNAMENT_SELECT,
        registrations: {
          include: {
            user: { select: { id: true, username: true, avatarUrl: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
        rounds: {
          include: {
            matches: {
              include: {
                player1: { select: { id: true, username: true, avatarUrl: true } },
                player2: { select: { id: true, username: true, avatarUrl: true } },
                winner: { select: { id: true, username: true, avatarUrl: true } },
              },
            },
          },
          orderBy: { roundNumber: 'asc' },
        },
      },
    });

    if (!tournament) throw new NotFoundException('Campeonato não encontrado');
    return tournament;
  }

  async update(id: string, userId: string, dto: UpdateTournamentDto) {
    const tournament = await this.prisma.tournament.findUnique({ where: { id } });
    if (!tournament) throw new NotFoundException('Campeonato não encontrado');
    if (tournament.creatorId !== userId) throw new ForbiddenException('Sem permissão');

    return this.prisma.tournament.update({
      where: { id },
      data: dto,
      select: TOURNAMENT_SELECT,
    });
  }

  async remove(id: string, userId: string) {
    const tournament = await this.prisma.tournament.findUnique({ where: { id } });
    if (!tournament) throw new NotFoundException('Campeonato não encontrado');
    if (tournament.creatorId !== userId) throw new ForbiddenException('Sem permissão');
    if (tournament.status === TournamentStatus.EM_ANDAMENTO) {
      throw new BadRequestException('Não é possível excluir um campeonato em andamento');
    }

    await this.prisma.tournament.delete({ where: { id } });
    return { message: 'Campeonato excluído com sucesso' };
  }

  async generateBracket(id: string, userId: string) {
    const tournament = await this.prisma.tournament.findUnique({
      where: { id },
      include: { registrations: true },
    });

    if (!tournament) throw new NotFoundException('Campeonato não encontrado');
    if (tournament.creatorId !== userId) throw new ForbiddenException('Sem permissão');
    if (tournament.status !== TournamentStatus.ABERTO) {
      throw new BadRequestException('O campeonato não está aberto para geração de chaves');
    }

    const playerIds = tournament.registrations.map((r) => r.userId);
    if (playerIds.length < 2) {
      throw new BadRequestException('São necessários pelo menos 2 jogadores');
    }

    // Shuffle players
    const shuffled = [...playerIds].sort(() => Math.random() - 0.5);

    if (tournament.format === TournamentFormat.MATA_MATA) {
      await this.generateSingleElimination(id, shuffled);
    } else if (tournament.format === TournamentFormat.GRUPOS) {
      await this.generateGroups(id, shuffled);
    } else {
      await this.generateRoundRobin(id, shuffled);
    }

    // Update status
    await this.prisma.tournament.update({
      where: { id },
      data: { status: TournamentStatus.EM_ANDAMENTO },
    });

    return this.findOne(id);
  }

  private async generateSingleElimination(tournamentId: string, playerIds: string[]) {
    // Pad to power of 2
    let size = 1;
    while (size < playerIds.length) size *= 2;
    const padded = [...playerIds, ...Array(size - playerIds.length).fill(null)];

    let round = 1;
    const pairs: Array<[string | null, string | null]> = [];
    for (let i = 0; i < padded.length; i += 2) {
      pairs.push([padded[i], padded[i + 1]]);
    }

    const roundRecord = await this.prisma.round.create({
      data: { tournamentId, roundNumber: round, name: `Round ${round}` },
    });

    for (const [p1, p2] of pairs) {
      await this.prisma.match.create({
        data: {
          tournamentId,
          roundId: roundRecord.id,
          player1Id: p1,
          player2Id: p2,
          status: p2 === null ? 'FINALIZADO' : 'PENDENTE',
          winnerId: p2 === null ? p1 : undefined,
        },
      });
    }
  }

  private async generateGroups(tournamentId: string, playerIds: string[]) {
    const groupSize = 4;
    const groups = Math.ceil(playerIds.length / groupSize);

    for (let g = 0; g < groups; g++) {
      const groupPlayers = playerIds.slice(g * groupSize, (g + 1) * groupSize);
      const roundRecord = await this.prisma.round.create({
        data: { tournamentId, roundNumber: g + 1, name: `Grupo ${String.fromCharCode(65 + g)}` },
      });

      for (let i = 0; i < groupPlayers.length; i++) {
        for (let j = i + 1; j < groupPlayers.length; j++) {
          await this.prisma.match.create({
            data: {
              tournamentId,
              roundId: roundRecord.id,
              player1Id: groupPlayers[i],
              player2Id: groupPlayers[j],
              status: 'PENDENTE',
            },
          });
        }
      }
    }
  }

  private async generateRoundRobin(tournamentId: string, playerIds: string[]) {
    const roundRecord = await this.prisma.round.create({
      data: { tournamentId, roundNumber: 1, name: 'Pontos Corridos' },
    });

    for (let i = 0; i < playerIds.length; i++) {
      for (let j = i + 1; j < playerIds.length; j++) {
        await this.prisma.match.create({
          data: {
            tournamentId,
            roundId: roundRecord.id,
            player1Id: playerIds[i],
            player2Id: playerIds[j],
            status: 'PENDENTE',
          },
        });
      }
    }
  }

  private async checkAndAwardBadge(userId: string, condition: string) {
    try {
      const badge = await this.prisma.badge.findFirst({ where: { condition } });
      if (!badge) return;
      await this.prisma.userBadge.create({
        data: { userId, badgeId: badge.id },
      });
    } catch {}
  }
}
