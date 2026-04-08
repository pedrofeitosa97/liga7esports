import { Controller, Get, Post, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MatchesService } from './matches.service';
import { SubmitResultDto } from './dto/submit-result.dto';

@ApiTags('Matches')
@Controller()
export class MatchesController {
  constructor(private matchesService: MatchesService) {}

  @Get('tournaments/:id/matches')
  @ApiOperation({ summary: 'Listar partidas de um campeonato' })
  findByTournament(@Param('id') id: string) {
    return this.matchesService.findByTournament(id);
  }

  @Post('matches/result')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Registrar resultado de partida' })
  submitResult(@Request() req, @Body() dto: SubmitResultDto) {
    return this.matchesService.submitResult(req.user.id, dto);
  }
}
