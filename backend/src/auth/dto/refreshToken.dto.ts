import { IsString, Length } from 'class-validator';

import { TOKEN_CONFIG } from '../../constants/config/token.config';
import { VALIDATION_MESSAGES } from '../../constants/message/dto.messages';

// 토큰 갱신
export class RefreshTokenDto {
  @IsString({ message: VALIDATION_MESSAGES.REFRESH_TOKEN_STRING })
  @Length(TOKEN_CONFIG.REFRESH_TOKEN_LENGTH, TOKEN_CONFIG.REFRESH_TOKEN_LENGTH, {
    message: VALIDATION_MESSAGES.REFRESH_TOKEN_INVALID_FORMAT,
  })
  refreshToken!: string;
}
