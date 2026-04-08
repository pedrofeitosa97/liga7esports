import { Controller, Post, Delete, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RegistrationsService } from './registrations.service';

@ApiTags('Registrations')
@Controller()
export class RegistrationsController {
  constructor(private registrationsService: RegistrationsService) {}

  @Post('tournaments/:id/join')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Inscrever-se em um campeonato' })
  join(@Param('id') id: string, @Request() req) {
    return this.registrationsService.join(req.user.id, id);
  }

  @Delete('tournaments/:id/leave')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sair de um campeonato' })
  leave(@Param('id') id: string, @Request() req) {
    return this.registrationsService.leave(req.user.id, id);
  }

  @Get('tournaments/:id/registration-status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verificar status de inscrição' })
  checkStatus(@Param('id') id: string, @Request() req) {
    return this.registrationsService.checkRegistration(req.user.id, id);
  }

  @Get('users/me/registrations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar campeonatos do usuário' })
  getMyRegistrations(@Request() req) {
    return this.registrationsService.getUserRegistrations(req.user.id);
  }
}
