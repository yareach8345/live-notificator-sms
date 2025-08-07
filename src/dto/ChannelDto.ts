export interface ChannelDto {
  channelId: {
    platform: string,
    id: string,
  },
  detail: {
    displayName: string,
  },
  liveState: {
    isOpen: boolean,
  }
}
