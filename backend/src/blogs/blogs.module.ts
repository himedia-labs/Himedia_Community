import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SnowflakeService } from '../common/services/snowflake.service';

import { BlogEntry } from './entities/blogEntry.entity';
import { BlogFeed } from './entities/blogFeed.entity';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';

@Module({
  imports: [TypeOrmModule.forFeature([BlogFeed, BlogEntry])],
  controllers: [BlogsController],
  providers: [BlogsService, SnowflakeService],
})
export class BlogsModule {}
