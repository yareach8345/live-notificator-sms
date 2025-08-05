import dotenv from 'dotenv'
import { createEventSource } from 'eventsource-client'
import { getRequiredEnv } from './utils/envUtil'

dotenv.config()

const sseClient = createEventSource({
  url: getRequiredEnv('SSE_URL'),
  headers: {
    'auth-device-id': getRequiredEnv('AUTH_DEVICE_ID'),
    'auth-secret-key': getRequiredEnv('AUTH_SECRET_KEY'),
  },
  onMessage: (event) => {
    console.log(event)
  },
  onConnect: () => {
    console.log('[sse] connected')
  },
  onDisconnect: () => {
    console.log('[sse] disconnected')
  }
})

sseClient.connect()