import { IsOptional, IsString, IsInt, IsDateString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class SearchAuditDto extends PaginationDto {
  @ApiPropertyOptional({ example: 'Usuarios' })
  @IsOptional()
  @IsString()
  tabla?: string;

  @ApiPropertyOptional({ example: 'UPDATE' })
  @IsOptional()
  @IsString()
  accion?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  usuario_id?: number;

  @ApiPropertyOptional({ example: '2026-01-01' })
  @IsOptional()
  @IsDateString()
  desde?: string;

  @ApiPropertyOptional({ example: '2026-12-31' })
  @IsOptional()
  @IsDateString()
  hasta?: string;
}
