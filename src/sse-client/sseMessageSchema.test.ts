import { sseMessageSchema } from './sseMessageSchema'
import { ZodError } from 'zod'

describe('sse message schema 테스트', () => {
  const now = new Date()

  test('refreshed-at 메시지 파싱', () => {
    const refreshEventMessage: any = {
      topic: 'refreshed-at',
      payload: now.toString()
    }
    const { success, data } = sseMessageSchema.safeParse(refreshEventMessage)

    expect(success).toBe(true)
    expect(data?.topic).toEqual('refreshed-at')
    expect(data?.payload).toEqual(now.toString())
  })

  test('updated-at 메시지 파싱', () => {
    const updateEventMessage: any = {
      topic: 'updated-at',
      payload: now.toString()
    }
    const { success, data } = sseMessageSchema.safeParse(updateEventMessage)

    expect(success).toBe(true)
    expect(data?.topic).toEqual('updated-at')
    expect(data?.payload).toEqual(now.toString())
  })

  test('state 변경 메시지 파싱', () => {
    const channelMessage: any = {
      topic: 'channel/chzzk/7377716c1d4389a852b5b3c0189e10c2/state',
      payload: 'open'
    }

    const { success, data } = sseMessageSchema.safeParse(channelMessage)

    expect(success).toBe(true)
    expect(data?.topic).toEqual('channel/chzzk/7377716c1d4389a852b5b3c0189e10c2/state')
    expect(data?.payload).toEqual('open')
  })

  test('channel state가 closed로 변경', () => {
    const channelMessage: any = {
      topic: 'channel/chzzk/4515b179f86b67b4981e16190817c580/state',
      payload: 'closed'
    }

    const { success, data } = sseMessageSchema.safeParse(channelMessage)

    expect(success).toBe(true)
    expect(data?.topic).toEqual('channel/chzzk/4515b179f86b67b4981e16190817c580/state')
    expect(data?.payload).toEqual('closed')
  })

  test('다른 형식의 메시지는 파싱 실패', () => {
    const someMessage: any = {
      topic: 'something other message',
      payload: 'open'
    }

    const { success, data, error } = sseMessageSchema.safeParse(someMessage)

    expect(success).toBe(false)
    expect(error).toBeInstanceOf(ZodError)
    expect(data).toBeUndefined()
  })
})