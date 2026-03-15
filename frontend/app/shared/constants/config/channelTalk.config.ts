import type { ChannelTalkVisibilityConfig } from '@/app/shared/types/channelTalk';

export const ChannelTalkConfig: ChannelTalkVisibilityConfig = {
  hideOnMobile: true,
  hidePaths: ['/posts/new'],
  hidePrefixes: ['/posts/edit', '/posts/drafts', '/admin'],
};
