import { EventSourceMessage } from 'eventsource-client'
import { SseMessage } from './sseMessageSchema'
import { getMessageType, parseMessage } from '../utils/sseUtil'

export class SseProcessor {
  private readonly messageQueue: SseMessage[] = []

  private refreshedHandler: ((messages: SseMessage[]) => void) | null = null

  setRefreshedHandler = (newHandler: (message: SseMessage[]) => void): void => {
    this.refreshedHandler = newHandler
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
        this.messageQueue.push(parsedMessage)
        break
      case 'refreshed':
        if(this.refreshedHandler) {
          this.refreshedHandler([...this.messageQueue])
        }
        this.clearMessageQueue()
        break
      case 'updated':
        this.clearMessageQueue()
        break
    }
  }

  getNumberOfStoredMessages = () => this.messageQueue.length

  getStoredMessages = () => [...this.messageQueue]
}