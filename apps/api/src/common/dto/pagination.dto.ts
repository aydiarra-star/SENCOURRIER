import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

/** Paramètres de pagination communs à toutes les listes publiques. */
export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  perPage: number = 20;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  search?: string;

  get skip(): number {
    return (this.page - 1) * this.perPage;
  }
}
