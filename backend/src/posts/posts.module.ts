import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { SnowflakeService } from '../common/services/snowflake.service';
import { Category } from './entities/category.entity';
import { Post } from './entities/post.entity';
import { PostImage } from './entities/postImage.entity';
import { PostLike } from './entities/postLike.entity';
import { PostTag } from './entities/postTag.entity';
import { PostShareLog } from './entities/postShareLog.entity';
import { PostViewLog } from './entities/postViewLog.entity';
import { Tag } from './entities/tag.entity';
import { OptionalJwtGuard } from '../auth/guards/optional-jwt.guard';
import { Comment } from '../comments/entities/comment.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Category, Tag, PostTag, PostLike, PostImage, PostShareLog, PostViewLog, Comment]),
    NotificationsModule,
  ],
  controllers: [PostsController, CategoriesController, TagsController],
  providers: [PostsService, CategoriesService, TagsService, SnowflakeService, OptionalJwtGuard],
})
export class PostsModule {}
