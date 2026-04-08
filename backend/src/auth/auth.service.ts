import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { username: dto.username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === dto.email) {
        throw new ConflictException('Este e-mail já está em uso');
      }
      throw new ConflictException('Este username já está em uso');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        gamesPlayed: true,
        wins: true,
        losses: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const token = this.generateToken(user.id, user.email, user.username);
    return { accessToken: token, user };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = this.generateToken(user.id, user.email, user.username);
    return { accessToken: token, user: userWithoutPassword };
  }

  private generateToken(userId: string, email: string, username: string): string {
    return this.jwtService.sign(
      { sub: userId, email, username },
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
    );
  }
}
