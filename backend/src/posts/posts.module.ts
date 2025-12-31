import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { Post } from './entities/post.entity';
import { PostLike } from './entities/postLike.entity';
import { PostTag } from './entities/postTag.entity';
import { Tag } from './entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Category, Tag, PostTag, PostLike])],
  controllers: [PostsController, CategoriesController],
  providers: [PostsService, CategoriesService],
})
export class PostsModule {}
