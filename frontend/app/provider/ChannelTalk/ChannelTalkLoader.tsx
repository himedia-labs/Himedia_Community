'use client';

import { useEffect, useRef } from 'react';

import * as ChannelService from '@channel.io/channel-web-sdk-loader';

import { useCurrentUserQuery } from '@/app/api/auth/auth.queries';
import { useAuthStore } from '@/app/shared/store/authStore';

/**
 * 채널톡 로더
 * @description 채널톡 스크립트 로드 및 유저 정보 연동
 */
export default function ChannelTalkLoader() {
  const { accessToken, isInitialized } = useAuthStore();
  const { data: user } = useCurrentUserQuery();
  const isBootedRef = useRef(false);

  useEffect(() => {
    const pluginKey = process.env.NEXT_PUBLIC_CHANNEL_TALK_PLUGIN_KEY;

    if (!pluginKey || !isInitialized || isBootedRef.current) return;
    if (accessToken && !user) return;

    const initChannelTalk = () => {
      ChannelService.loadScript();

      ChannelService.boot({
        pluginKey,
        ...(user && {
          memberId: user.id,
          memberHash: user.channelTalkMemberHash!,
          profile: {
            name: user.name,
            email: user.email,
            mobileNumber: user.phone,
          },
        }),
      });

      isBootedRef.current = true;
    };

    initChannelTalk();
  }, [isInitialized, accessToken, user]);

  return null;
}
