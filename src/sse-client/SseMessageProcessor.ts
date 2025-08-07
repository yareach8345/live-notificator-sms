import { EventSourceMessage } from 'eventsource-client'
import { getMessageType, parseMessage } from '../utils/sseUtil'
import { ChannelStateMessage } from '../../types/ChannelStateMessage'
import { transformToChannelMessage } from '../utils/channelMessageUtil'
import { ParsedSseMessage } from './sseMessageSchema'

export class SseMessageProcessor {
  private readonly messageQueue: ChannelStateMessage[] = []

  private channelStateUpdatedHandler: ((messages: ChannelStateMessage[]) => void) | null = null

  private channelAddDeleteHandler: ((messages: ChannelStateMessage) => void) | null = null

  setChannelStateUpdatedHandler = (newHandler: (message: ChannelStateMessage[]) => void): void => {
    this.channelStateUpdatedHandler = newHandler
  }

  setChannelAddDeleteHandler = (newHandler: (messages: ChannelStateMessage) => void): void => {
    this.channelAddDeleteHandler = newHandler
  }

  clearMessageQueue = () => {
    this.messageQueue.splice(0, this.messageQueue.length)
  }

  processStateMessage = (message: ParsedSseMessage) => {
    const channelStateMessage = transformToChannelMessage(message)

    console.log('[sse processor] received state messge', channelStateMessage.newState)
    switch(channelStateMessage.newState) {
      case 'open':
      case 'closed':
        this.messageQueue.push(channelStateMessage)
        break
      case 'added':
      case 'deleted':
        if(this.channelAddDeleteHandler) {
          this.channelAddDeleteHandler(channelStateMessage)
        }
        break
    }
  }

  processUpdateMessage = (_message: ParsedSseMessage) => {
    console.log('[sse processor] received updated message')

    if(this.messageQueue.length === 0) {
      return
    }

    if(this.channelStateUpdatedHandler) {
      this.channelStateUpdatedHandler([...this.messageQueue])
    }

    this.clearMessageQueue()
  }

  processRefreshMessage = (_message: ParsedSseMessage) => {
    const now = new Date()
    console.log(`[sse processor] received refreshed message at ${now.toString()}`)
    this.clearMessageQueue()
  }

  passMessage = (event: EventSourceMessage) => {
    const { success, data: parsedMessage } = parseMessage(event)

    if(!success) {
      return
    }

    const messageType = getMessageType(parsedMessage)

    switch (messageType) {
      case 'state':
        this.processStateMessage(parsedMessage)
        break
      case 'updated':
        this.processUpdateMessage(parsedMessage)
        break
      case 'refreshed':
        this.processRefreshMessage(parsedMessage)
        break
    }
  }

  getNumberOfStoredMessages = () => this.messageQueue.length

  getStoredMessages = () => [...this.messageQueue]
}