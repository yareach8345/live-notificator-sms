import { SseMessage, sseMessageSchema } from '../sse-client/sseMessageSchema'
import { channelEventRegex, channelRefreshEvent, channelUpdatedEvent } from '../sse-client/topics'
import { EventSourceMessage } from 'eventsource-client'

export const isTargetTopic = (event: SseMessage) =>
  event.topic === channelRefreshEvent ||
  event.topic === channelUpdatedEvent ||
  channelEventRegex.exec(event.topic)?.groups?.type === 'state'

export const getMessageType = (event: SseMessage) => {
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