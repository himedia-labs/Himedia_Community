import { Module } from '@nestjs/common';

import { UploadsService } from '@/uploads/uploads.service';
import { UploadsController } from '@/uploads/uploads.controller';

@Module({
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}
