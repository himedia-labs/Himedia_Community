import path from 'path';
import { randomUUID } from 'crypto';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import appConfig from '@/common/config/app.config';
import { ERROR_CODES } from '@/constants/error/error-codes';

import type { ConfigType } from '@nestjs/config';
import type { UploadedFilePayload } from '@/uploads/uploads.types';

// 확장자 매핑
const MIME_EXTENSION_MAP: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

@Injectable()
export class UploadsService {
  private readonly bucket: string;
  private readonly client: S3Client;
  private readonly publicUrl: string;

  /**
   * 업로드 서비스
   * @description 이미지 업로드를 처리
   */
  constructor(@Inject(appConfig.KEY) private readonly config: ConfigType<typeof appConfig>) {
    this.bucket = this.config.r2.bucket;
    this.publicUrl = this.config.r2.publicUrl.replace(/\/$/, '');
    this.client = new S3Client({
      region: this.config.r2.region,
      endpoint: this.config.r2.endpoint,
      credentials: {
        accessKeyId: this.config.r2.accessKeyId,
        secretAccessKey: this.config.r2.secretAccessKey,
      },
    });
  }

  /**
   * 이미지 업로드
   * @description 파일을 업로드하고 URL을 반환
   */
  private async uploadImageFile(file: UploadedFilePayload, userId: string, prefix: string) {
    // 파일 검증
    if (!file) {
      throw new BadRequestException({
        message: '이미지 파일을 선택해주세요.',
        code: ERROR_CODES.VALIDATION_FAILED,
      });
    }

    // 키 생성
    const extension = path.extname(file.originalname) || MIME_EXTENSION_MAP[file.mimetype] || '';
    const key = `${prefix}/${userId}/${Date.now()}-${randomUUID()}${extension}`;

    // 업로드 처리
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return { url: `${this.publicUrl}/${key}` };
  }

  /**
   * 썸네일 업로드
   * @description 썸네일 이미지를 업로드
   */
  async uploadThumbnail(file: UploadedFilePayload, userId: string) {
    return this.uploadImageFile(file, userId, 'thumbnails');
  }

  /**
   * 본문 이미지 업로드
   * @description 본문 이미지를 업로드
   */
  async uploadImage(file: UploadedFilePayload, userId: string) {
    return this.uploadImageFile(file, userId, 'images');
  }

  /**
   * 아바타 업로드
   * @description 아바타 이미지를 업로드
   */
  async uploadAvatar(file: UploadedFilePayload, userId: string) {
    return this.uploadImageFile(file, userId, 'avatars');
  }
}
