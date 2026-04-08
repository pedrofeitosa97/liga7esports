import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BadgesService } from './badges.service';

@ApiTags('Badges')
@Controller('badges')
export class BadgesController {
  constructor(private badgesService: BadgesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as badges' })
  findAll() {
    return this.badgesService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Minhas badges' })
  getMyBadges(@Request() req) {
    return this.badgesService.findUserBadges(req.user.id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Badges de um usuário' })
  getUserBadges(@Param('userId') userId: string) {
    return this.badgesService.findUserBadges(userId);
  }
}
