import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

const USER_SELECT = {
  id: true,
  username: true,
  email: true,
  avatarUrl: true,
  gamesPlayed: true,
  wins: true,
  losses: true,
  createdAt: true,
  updatedAt: true,
  badges: {
    include: { badge: true },
  },
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        select: USER_SELECT,
        orderBy: { wins: 'desc' },
      }),
      this.prisma.user.count(),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        ...USER_SELECT,
        registrations: {
          include: {
            tournament: {
              select: { id: true, title: true, game: true, status: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        ...USER_SELECT,
        registrations: {
          include: {
            tournament: {
              select: { id: true, title: true, game: true, status: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    if (dto.username) {
      const existing = await this.prisma.user.findFirst({
        where: { username: dto.username, NOT: { id } },
      });
      if (existing) throw new ConflictException('Username já em uso');
    }

    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: USER_SELECT,
    });
  }

  async updateAvatar(id: string, avatarUrl: string) {
    return this.prisma.user.update({
      where: { id },
      data: { avatarUrl },
      select: USER_SELECT,
    });
  }

  async getRanking(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          username: true,
          avatarUrl: true,
          gamesPlayed: true,
          wins: true,
          losses: true,
        },
        orderBy: [{ wins: 'desc' }, { gamesPlayed: 'asc' }],
      }),
      this.prisma.user.count(),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
