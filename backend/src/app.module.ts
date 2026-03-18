import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { DatabaseModule } from './database/database.module';
import { EmailModule } from './email/email.module';
import { AuthModule } from './auth/auth.module';
import { FollowsModule } from './follows/follows.module';
import { HealthModule } from './health/health.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { UploadsModule } from './uploads/uploads.module';
import { AdminModule } from './admin/admin.module';
import { NoticesModule } from './notices/notices.module';
import { NotificationsModule } from './notifications/notifications.module';
import { BlogsModule } from './blogs/blogs.module';
import appConfig from './common/config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV ?? 'development'}`,
      load: [appConfig],
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    EmailModule,
    AuthModule,
    FollowsModule,
    HealthModule,
    PostsModule,
    CommentsModule,
    UploadsModule,
    AdminModule,
    NoticesModule,
    NotificationsModule,
    BlogsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
