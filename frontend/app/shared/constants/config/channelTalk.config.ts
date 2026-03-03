import type { ChannelTalkVisibilityConfig } from '@/app/shared/types/channelTalk';

export const ChannelTalkConfig: ChannelTalkVisibilityConfig = {
  hideOnMobile: true,
  hidePaths: ['/posts/new', '/posts/draftId'],
  hidePrefixes: ['/posts/edit'],
};
