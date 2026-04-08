import {
  IsString, IsEnum, IsOptional, IsNumber, Min, Max,
  IsDateString, MinLength, MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TournamentFormat } from '@prisma/client';

export class CreateTournamentDto {
  @ApiProperty({ example: 'Copa Arena7 FC 26' })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @ApiProperty({ example: 'ea-fc-26' })
  @IsString()
  game: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  entryFee?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  rules?: string;

  @ApiProperty({ enum: TournamentFormat })
  @IsEnum(TournamentFormat)
  format: TournamentFormat;

  @ApiPropertyOptional({ default: 16 })
  @IsOptional()
  @IsNumber()
  @Min(2)
  @Max(128)
  maxPlayers?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  prize?: string;
}
