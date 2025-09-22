// src/payments/dto/query-params.dto.ts

import { IsOptional, IsString, IsNumberString, IsEnum } from 'class-validator';

export class QueryParamsDto {
  @IsOptional()
  @IsNumberString()
  page?: number;

  @IsOptional()
  @IsNumberString()
  limit?: number;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order?: 'asc' | 'desc';
}