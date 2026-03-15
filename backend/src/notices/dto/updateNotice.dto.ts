import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateNoticeDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  version?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  releaseType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  releaseScope?: string;

  @IsOptional()
  @IsString()
  markdownContent?: string;

  @IsOptional()
  @IsDateString()
  publishedAt?: string;
}
