import { createEventSource } from 'eventsource-client'
import { sseMessageSchema } from './sse-client/sseMessageSchema'

createEventSource({
  url: 'http://localhost:8080/sse/connect'
})

function main() {
  console.log('========== a ==========')
  const a = () => {
    const now = new Date()
    const refreshEventMessage: any = {
      topic: 'refreshed-at',
      message: now.toString()
    }
    const { success, data } = sseMessageSchema.safeParse(refreshEventMessage)

    console.log(success)
    console.log(data)
  }
  a()

  console.log('========== b ==========')
  const b = () => {
    const now = new Date()
    const updateEventMessage: any = {
      topic: 'updated-at',
      message: now.toString()
    }
    const { success, data } = sseMessageSchema.safeParse(updateEventMessage)

    console.log(success)
    console.log(data)
  }
  b()

  console.log('========== c ==========')
  const c = () => {
    const channelMessage: any = {
      topic: 'channel/chzzk/7377716c1d4389a852b5b3c0189e10c2/state',
      message: 'open'
    }

    const { success, data } = sseMessageSchema.safeParse(channelMessage)

    console.log(success)
    console.log(data)
  }
  c()
}

main()