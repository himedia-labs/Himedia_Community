import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OptionalJwtGuard } from '../auth/guards/optional-jwt.guard';

import { Post } from '../posts/entities/post.entity';
import { Follow } from '../follows/entities/follow.entity';
import { Comment } from './entities/comment.entity';
import { CommentReaction } from './entities/commentReaction.entity';

import { CommentsService } from './comments.service';
import { SnowflakeService } from '../common/services/snowflake.service';

import { CommentsController, MyCommentsController } from './comments.controller';

import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, CommentReaction, Follow, Post]), NotificationsModule],
  controllers: [CommentsController, MyCommentsController],
  providers: [CommentsService, SnowflakeService, OptionalJwtGuard],
})
export class CommentsModule {}
