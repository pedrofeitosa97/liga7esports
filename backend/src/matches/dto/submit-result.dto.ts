import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SubmitResultDto {
  @ApiProperty()
  @IsString()
  matchId: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  score1: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  score2: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  winnerId?: string;
}
