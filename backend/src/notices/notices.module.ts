import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SnowflakeService } from '../common/services/snowflake.service';
import { User } from '../auth/entities/user.entity';

import { NoticeReaction } from './entities/noticeReaction.entity';
import { Notice } from './entities/notice.entity';
import { NoticesController } from './notices.controller';
import { NoticesService } from './notices.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Notice, NoticeReaction])],
  controllers: [NoticesController],
  providers: [NoticesService, SnowflakeService],
  exports: [NoticesService],
})
export class NoticesModule {}
