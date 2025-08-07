import dotenv from 'dotenv'
import { createEventSource } from 'eventsource-client'
import { getRequiredEnv } from './utils/envUtil'
import { SseProcessor } from './sse-client/SseProcessor'

dotenv.config()

const sseProcessor = new SseProcessor()

const sseClient = createEventSource({
  url: getRequiredEnv('SSE_URL'),
  headers: {
    'auth-device-id': getRequiredEnv('AUTH_DEVICE_ID'),
    'auth-secret-key': getRequiredEnv('AUTH_SECRET_KEY'),
  },
  onMessage: (event) => {
    sseProcessor.passMessage(event)
  },
  onConnect: () => {
    console.log('[sse] connected')
  },
  onDisconnect: () => {
    console.log('[sse] disconnected')
  }
})

sseProcessor.setUpdatedHandler(messages => {
  console.group('refreshed!')
  console.log(messages)
  console.groupEnd()
})

sseClient.connect()