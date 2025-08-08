import dotenv from 'dotenv'

dotenv.config()

import { createEventSource } from 'eventsource-client'
import { getRequiredEnv } from './utils/envUtil'
import { SseMessageProcessor } from './sse-client/SseMessageProcessor'
import { authDeviceId, authSecretKey } from './constants/auth'
import { SmsSender } from './sms/sms-sender'
import { COOL_SMS_API_KEY, COOL_SMS_SECRET_KEY, PHONE_NUMBERS, SENDER_PHONE_NUMBER } from './constants/sms'
import { transformToAddDeleteMessage, transformToOpenMessage } from './sms/channelStateMessageTransformers'

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

const sms = new SmsSender(
  COOL_SMS_API_KEY,
  COOL_SMS_SECRET_KEY,
  SENDER_PHONE_NUMBER,
  PHONE_NUMBERS
)

sseProcessor.setChannelStateUpdatedHandler(async messages => {
  if(messages.length === 0) {
    return
  }
  const openMessages = messages.filter(msg => msg.newState === 'open')
  const messageInfo = await transformToOpenMessage(openMessages)
  await sms.sendOpenMessage(messageInfo)
})

sseProcessor.setChannelAddDeleteHandler(async message => {
  if(message.newState === 'added') {
    const messageInfo = await transformToAddDeleteMessage(message)
    await sms.sendAddDeleteMessage(messageInfo)
  }
})

sseClient.connect()