import {
  Controller, Get, Post, Put, Delete, Param, Body, Query,
  UseGuards, Request, ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TournamentStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TournamentsService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';

@ApiTags('Tournaments')
@Controller('tournaments')
export class TournamentsController {
  constructor(private tournamentsService: TournamentsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar campeonatos' })
  @ApiQuery({ name: 'game', required: false })
  @ApiQuery({ name: 'status', required: false, enum: TournamentStatus })
  @ApiQuery({ name: 'free', required: false, type: Boolean })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(
    @Query('game') game?: string,
    @Query('status') status?: TournamentStatus,
    @Query('free') free?: string,
    @Query('search') search?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit?: number,
  ) {
    return this.tournamentsService.findAll({
      game,
      status,
      free: free === 'true',
      search,
      page,
      limit,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar campeonato por ID' })
  findOne(@Param('id') id: string) {
    return this.tournamentsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar campeonato' })
  create(@Request() req, @Body() dto: CreateTournamentDto) {
    return this.tournamentsService.create(req.user.id, dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar campeonato' })
  update(@Param('id') id: string, @Request() req, @Body() dto: UpdateTournamentDto) {
    return this.tournamentsService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir campeonato' })
  remove(@Param('id') id: string, @Request() req) {
    return this.tournamentsService.remove(id, req.user.id);
  }

  @Post(':id/generate-bracket')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Gerar chaves do campeonato' })
  generateBracket(@Param('id') id: string, @Request() req) {
    return this.tournamentsService.generateBracket(id, req.user.id);
  }
}
