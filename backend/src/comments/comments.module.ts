import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { CommentReaction } from './entities/commentReaction.entity';
import { Post } from '../posts/entities/post.entity';
import { SnowflakeService } from '../common/services/snowflake.service';
import { OptionalJwtGuard } from '../auth/guards/optional-jwt.guard';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, CommentReaction, Post]), NotificationsModule],
  controllers: [CommentsController],
  providers: [CommentsService, SnowflakeService, OptionalJwtGuard],
})
export class CommentsModule {}
