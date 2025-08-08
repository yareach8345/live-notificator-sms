export interface AddDeleteMessageInfo {
  type: 'added' | 'deleted'
  channelInfo: {
    platform: string,
    channelName: string
  }
}

export interface OpenMessageInfo {
  type: 'open'
  channelInfos: {
    platform: string,
    channelName: string
  }[]
}

export type SendSmsMessageInfo = AddDeleteMessageInfo | OpenMessageInfo