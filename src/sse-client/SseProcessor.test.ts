import { SseProcessor } from './SseProcessor'
import { SseMessage } from './sseMessageSchema'

describe('SseProcessor 테스트', () => {
  const processor = new SseProcessor()

  const mockStateMessages = [
    {
      topic: 'channel/platform1/0001/state',
      payload: 'open'
    },
    {
      topic: 'channel/platform1/0001/state',
      payload: 'close'
    }
  ]

  const mockChannelAddedMessage = {
    topic: 'channel/platform1/0001/state',
    payload: 'added'
  }

  const mockChannelDeletedMessage = {
    topic: 'channel/platform1/0001/state',
    payload: 'deleted'
  }

  const mockRefreshedMessage = {
    topic: 'refreshed-at',
    payload: Date.now().toString()
  }

  const mockUpdatedMessage = {
    topic: 'updated-at',
    payload: Date.now().toString()
  }

  const passStateMessage = () => {
    mockStateMessages.forEach((message) => {
      processor.passMessage({ data: JSON.stringify(message) })
    })
  }

  beforeEach(() => {
    processor.clearMessageQueue()
  })

  describe('passMessage 메서드로 state 메시지를 추가한다', () => {
    test('passStateMessage', () => {
      passStateMessage()

      expect(processor.getNumberOfStoredMessages()).toBe(2)

      expect(processor.getStoredMessages()).toEqual(mockStateMessages)
    })

    test('passMessage에 updated-at 메시지를 보내면 메시지큐가 초기화 됨', () => {
      passStateMessage()

      const numberOfStoredMessagesBeforePassUpdatedAtMessage = processor.getNumberOfStoredMessages()
      processor.passMessage({ data: JSON.stringify(mockUpdatedMessage) })

      const numberOfStoredMessagesAfterPassUpdatedAtMessage = processor.getNumberOfStoredMessages()

      expect(numberOfStoredMessagesBeforePassUpdatedAtMessage).toBe(2)
      expect(numberOfStoredMessagesAfterPassUpdatedAtMessage).toBe(0)
    })

    test('passMessage에 updated-at 메시지를 보내면 메시지큐가 초기화 되고 콜백으로 이때까지 받은 메시지들을 받음', () => {
      passStateMessage()

      const updatedHandler = jest.fn<void, [SseMessage[]]>()

      processor.setUpdatedHandler(updatedHandler)

      const numberOfStoredMessagesBeforePassRefreshedAtMessage = processor.getNumberOfStoredMessages()

      processor.passMessage({ data: JSON.stringify(mockUpdatedMessage) })

      const numberOfStoredMessagesAfterPassRefreshedAtMessage = processor.getNumberOfStoredMessages()

      expect(numberOfStoredMessagesBeforePassRefreshedAtMessage).toBe(2)
      expect(numberOfStoredMessagesAfterPassRefreshedAtMessage).toBe(0)

      expect(updatedHandler).toHaveBeenCalled()
      expect(updatedHandler).toHaveBeenCalledWith(mockStateMessages)
    })

    test('passMessage로 open과 close외의 다른 메시지를 보내면 메시지 큐에 저장되지 않음', () => {
      mockStateMessages.forEach(message => processor.passMessage({ data: JSON.stringify(message) }))
      processor.passMessage({ data: JSON.stringify(mockChannelAddedMessage) })
      processor.passMessage({ data: JSON.stringify(mockChannelDeletedMessage) })

      expect(processor.getNumberOfStoredMessages()).toBe(2)
    })

    test('passMessage로 다른 형식의 메시지를 보내면 특별한 일이 일어나지 않음', () => {
      processor.passMessage({
        data: JSON.stringify({
          topic: 'undefined-topic',
          data: 'some data'
        })
      })

      expect(processor.getNumberOfStoredMessages()).toBe(0)
    })
  })
})