import { AddDeleteMessageInfo, OpenMessageInfo } from '../../types/SendSmsMessageInfo'
import { AllowedState, ChannelStateMessage } from '../../types/ChannelStateMessage'
import { fetchChannel, fetchChannels } from '../api/channel'
import { NotSupportedStateError } from '../error/NotSupportedStateError'

export const transformToAddDeleteMessage = async (channelStateMessage: ChannelStateMessage): Promise<AddDeleteMessageInfo> => {
  if(channelStateMessage.newState !== 'added' && channelStateMessage.newState !== 'deleted') {
    throw new NotSupportedStateError(channelStateMessage.newState)
  }

  const channelFetchResponse = await fetchChannel(channelStateMessage.channelId)

  const channelInfo = channelFetchResponse.data

  return {
    type: channelStateMessage.newState,
    channelInfo: {
      platform: channelInfo.channelId.platform,
      channelName: channelInfo.detail.displayName,
    }
  }
}

export const transformToOpenMessage = async (channelStateMessages: ChannelStateMessage[]): Promise<OpenMessageInfo> => {
  const notSupportedMessages = channelStateMessages
    .filter(channelStateMessage => channelStateMessage.newState !== 'open')
    .map(channelStateMessage => channelStateMessage.newState)
    .reduce((prev, curr) => prev.add(curr), new Set<AllowedState>())
  if(notSupportedMessages.size > 0) {
    throw new NotSupportedStateError(Array.from(notSupportedMessages).join(', '))
  }

  const channelsFetchResponse = await fetchChannels(channelStateMessages.map(channelStateMessage => channelStateMessage.channelId))

  const channelInfos = channelsFetchResponse.data

  return {
    type: 'open',
    channelInfos: channelInfos
      .map(channelInfo => ({ platform: channelInfo.channelId.platform, channelName: channelInfo.detail.displayName }))
  }
}