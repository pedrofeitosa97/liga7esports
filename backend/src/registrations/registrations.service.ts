import {
  Injectable, NotFoundException, ConflictException, BadRequestException,
} from '@nestjs/common';
import { TournamentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RegistrationsService {
  constructor(private prisma: PrismaService) {}

  async join(userId: string, tournamentId: string) {
    const tournament = await this.prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: { _count: { select: { registrations: true } } },
    });

    if (!tournament) throw new NotFoundException('Campeonato não encontrado');
    if (tournament.status !== TournamentStatus.ABERTO) {
      throw new BadRequestException('Este campeonato não está aceitando inscrições');
    }
    if (tournament._count.registrations >= tournament.maxPlayers) {
      throw new BadRequestException('Campeonato lotado');
    }

    const existing = await this.prisma.registration.findUnique({
      where: { userId_tournamentId: { userId, tournamentId } },
    });
    if (existing) throw new ConflictException('Você já está inscrito neste campeonato');

    return this.prisma.registration.create({
      data: { userId, tournamentId },
      include: {
        tournament: { select: { id: true, title: true, game: true } },
        user: { select: { id: true, username: true, avatarUrl: true } },
      },
    });
  }

  async leave(userId: string, tournamentId: string) {
    const tournament = await this.prisma.tournament.findUnique({
      where: { id: tournamentId },
    });
    if (!tournament) throw new NotFoundException('Campeonato não encontrado');
    if (tournament.status !== TournamentStatus.ABERTO) {
      throw new BadRequestException('Não é possível sair de um campeonato em andamento');
    }

    const reg = await this.prisma.registration.findUnique({
      where: { userId_tournamentId: { userId, tournamentId } },
    });
    if (!reg) throw new NotFoundException('Você não está inscrito neste campeonato');

    await this.prisma.registration.delete({
      where: { userId_tournamentId: { userId, tournamentId } },
    });

    return { message: 'Inscrição cancelada com sucesso' };
  }

  async getUserRegistrations(userId: string) {
    return this.prisma.registration.findMany({
      where: { userId },
      include: {
        tournament: {
          select: {
            id: true, title: true, game: true, status: true,
            imageUrl: true, format: true, entryFee: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async checkRegistration(userId: string, tournamentId: string) {
    const reg = await this.prisma.registration.findUnique({
      where: { userId_tournamentId: { userId, tournamentId } },
    });
    return { isRegistered: !!reg };
  }
}
