import type { ChannelTalkVisibilityConfig } from '@/app/shared/types/channelTalk';

export const ChannelTalkConfig: ChannelTalkVisibilityConfig = {
  hideOnMobile: true,
  hidePaths: ['/posts/new', '/admin'],
  hidePrefixes: ['/posts/edit', '/posts/drafts'],
};
