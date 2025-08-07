import { EventSourceMessage } from 'eventsource-client'
import { SseMessage } from './sseMessageSchema'
import { getMessageType, parseMessage } from '../utils/sseUtil'

export class SseProcessor {
  private readonly messageQueue: SseMessage[] = []

  private updatedHandler: ((messages: SseMessage[]) => void) | null = null

  setUpdatedHandler = (newHandler: (message: SseMessage[]) => void): void => {
    this.updatedHandler = newHandler
  }

  clearMessageQueue = () => {
    this.messageQueue.splice(0, this.messageQueue.length)
  }

  passMessage = (event: EventSourceMessage) => {
    const { success, data: parsedMessage } = parseMessage(event)

    if(!success) {
      return
    }

    const messageType = getMessageType(parsedMessage)

    switch (messageType) {
      case 'state':
        console.log('new state', parsedMessage.payload)
        if(parsedMessage.payload === 'open' || parsedMessage.payload === 'close') {
          this.messageQueue.push(parsedMessage)
        }
        break
      case 'updated':
        if(this.updatedHandler) {
          this.updatedHandler([...this.messageQueue])
        }
        this.clearMessageQueue()
        break
      case 'refreshed':
        this.clearMessageQueue()
        break
    }
  }

  getNumberOfStoredMessages = () => this.messageQueue.length

  getStoredMessages = () => [...this.messageQueue]
}