import { ParsedSseMessage } from '../sse-client/sseMessageSchema'
import { channelEventRegex } from '../constants/topics'
import { RegexMatchFailError } from '../error/RegexMatchFailError'
import { ChannelId } from '../../types/ChannelId'
import { AllowedState, ChannelStateMessage } from '../../types/ChannelStateMessage'
import { NotSupportedStateError } from '../error/NotSupportedStateError'
import { allowedStates } from '../constants/channelStates'

function isAllowedState(state: string): state is AllowedState {
  return (allowedStates as readonly string[]).includes(state);
}

export const transformToChannelMessage = (sseMessage: ParsedSseMessage): ChannelStateMessage => {
  const topicMatchResult = sseMessage.topic.match(channelEventRegex)

  if(!topicMatchResult || !topicMatchResult.groups) {
    throw new RegexMatchFailError(sseMessage.topic, channelEventRegex)
  }

  const channelId: ChannelId = {
    platform: topicMatchResult.groups.platform,
    id: topicMatchResult.groups.id,
  }

  const newState = sseMessage.payload

  if(!isAllowedState(newState)) {
    throw new NotSupportedStateError(newState)
  }

  return { channelId, newState }
}