import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import { MatchesModule } from './matches/matches.module';
import { RegistrationsModule } from './registrations/registrations.module';
import { BadgesModule } from './badges/badges.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    TournamentsModule,
    MatchesModule,
    RegistrationsModule,
    BadgesModule,
  ],
})
export class AppModule {}
