import { EventSourceMessage } from 'eventsource-client'
import { SseMessage } from './sseMessageSchema'
import { getMessageType, parseMessage } from '../utils/sseUtil'

export class SseMessageProcessor {
  private readonly messageQueue: SseMessage[] = []

  private channelStateUpdatedHandler: ((messages: SseMessage[]) => void) | null = null

  private channelAddDeleteHandler: ((messages: SseMessage) => void) | null = null

  setChannelStateUpdatedHandler = (newHandler: (message: SseMessage[]) => void): void => {
    this.channelStateUpdatedHandler = newHandler
  }

  setChannelAddDeleteHandler = (newHandler: (messages: SseMessage) => void): void => {
    this.channelAddDeleteHandler = newHandler
  }

  clearMessageQueue = () => {
    this.messageQueue.splice(0, this.messageQueue.length)
  }

  processStateMessage = (message: SseMessage) => {
    console.log('[sse processor] received state messge', message.payload)
    switch(message.payload) {
      case 'open':
      case 'close':
        this.messageQueue.push(message)
        break
      case 'added':
      case 'deleted':
        if(this.channelAddDeleteHandler) {
          this.channelAddDeleteHandler(message)
        }
        break
    }
  }

  processUpdateMessage = (_message: SseMessage) => {
    console.log('[sse processor] received updated message')
    if(this.channelStateUpdatedHandler) {
      this.channelStateUpdatedHandler([...this.messageQueue])
    }
    this.clearMessageQueue()
  }

  processRefreshMessage = (_message: SseMessage) => {
    console.log('[sse processor] received refreshed message')
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