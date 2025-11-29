import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { createTransport, type Transporter } from 'nodemailer';

import appConfig from '../common/config/app.config';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(
    @Inject(appConfig.KEY)
    private readonly config: ConfigType<typeof appConfig>,
  ) {
    this.transporter = createTransport({
      service: 'gmail',
      auth: {
        user: this.config.email.user,
        pass: this.config.email.password,
      },
    });
  }

  async sendPasswordResetCode(to: string, code: string) {
    await this.transporter.sendMail({
      from: this.config.email.user,
      to,
      subject: '[하이미디어] 비밀번호 재설정을 위한 인증번호를 확인해주세요.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">비밀번호 재설정 인증번호</h2>
          <p>안녕하세요,</p>
          <p>비밀번호 재설정을 위한 인증번호가 발급되었습니다.</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #666;">인증번호</p>
            <p style="margin: 10px 0 0 0; font-size: 32px; font-weight: bold; color: #ff3d3d; letter-spacing: 8px;">${code}</p>
          </div>
          <p>인증번호는 10분간 유효합니다.</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            본 메일은 발신 전용입니다.
          </p>
        </div>
      `,
    });
  }
}
