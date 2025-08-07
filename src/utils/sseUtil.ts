import { ParsedSseMessage, sseMessageSchema } from '../sse-client/sseMessageSchema'
import { channelEventRegex, channelRefreshEvent, channelUpdatedEvent } from '../constants/topics'
import { EventSourceMessage } from 'eventsource-client'

export const isTargetTopic = (event: ParsedSseMessage) =>
  event.topic === channelRefreshEvent ||
  event.topic === channelUpdatedEvent ||
  channelEventRegex.exec(event.topic)?.groups?.type === 'state'

export const getMessageType = (event: ParsedSseMessage) => {
  if(event.topic === channelRefreshEvent) {
    return 'refreshed'
  }

  if(event.topic === channelUpdatedEvent) {
    return 'updated'
  }

  if(channelEventRegex.exec(event.topic)?.groups?.type === 'state') {
    return 'state'
  }

  return 'unknown'
}

export const parseMessage = (event: EventSourceMessage) => {
  const parsedEvent = JSON.parse(event.data)
  return sseMessageSchema.safeParse(parsedEvent)
}