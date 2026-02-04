import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@/auth/entities/user.entity';
import { Follow } from '@/follows/entities/follow.entity';

import { FollowsService } from '@/follows/follows.service';
import { FollowsController } from '@/follows/follows.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Follow, User])],
  controllers: [FollowsController],
  providers: [FollowsService],
})
export class FollowsModule {}
