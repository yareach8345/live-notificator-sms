import dotenv from 'dotenv'

dotenv.config()

import { createEventSource } from 'eventsource-client'
import { getRequiredEnv } from './utils/envUtil'
import { SseMessageProcessor } from './sse-client/SseMessageProcessor'
import { authDeviceId, authSecretKey } from './constants/auth'

dotenv.config()

const sseProcessor = new SseMessageProcessor()

const sseClient = createEventSource({
  url: getRequiredEnv('SSE_URL'),
  headers: {
    'auth-device-id': authDeviceId,
    'auth-secret-key': authSecretKey,
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