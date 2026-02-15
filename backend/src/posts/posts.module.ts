import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Comment } from '../comments/entities/comment.entity';
import { OptionalJwtGuard } from '../auth/guards/optional-jwt.guard';
import { SnowflakeService } from '../common/services/snowflake.service';
import { NotificationsModule } from '../notifications/notifications.module';

import { TagsService } from './tags.service';
import { PostsService } from './posts.service';
import { TagsController } from './tags.controller';
import { PostsController } from './posts.controller';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';

import { Tag } from './entities/tag.entity';
import { Post } from './entities/post.entity';
import { PostTag } from './entities/postTag.entity';
import { Category } from './entities/category.entity';
import { PostLike } from './entities/postLike.entity';
import { PostImage } from './entities/postImage.entity';
import { PostViewLog } from './entities/postViewLog.entity';
import { PostShareLog } from './entities/postShareLog.entity';
import { Follow } from '../follows/entities/follow.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
      Category,
      Tag,
      PostTag,
      PostLike,
      PostImage,
      PostShareLog,
      PostViewLog,
      Comment,
      Follow,
    ]),
    NotificationsModule,
  ],
  controllers: [PostsController, CategoriesController, TagsController],
  providers: [PostsService, CategoriesService, TagsService, SnowflakeService, OptionalJwtGuard],
})
export class PostsModule {}
