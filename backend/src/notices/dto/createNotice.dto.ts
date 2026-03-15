import { IsDateString, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

import { NoticeType } from '../entities/notice.entity';

export class CreateNoticeDto {
  @IsIn([NoticeType.ANNOUNCEMENT, NoticeType.UPDATE])
  type!: NoticeType;

  @IsString()
  @MaxLength(200)
  title!: string;

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

  @IsString()
  markdownContent!: string;

  @IsOptional()
  @IsDateString()
  publishedAt?: string;
}
