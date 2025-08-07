import { getMessageType, isTargetTopic, parseMessage } from './sseUtil'
import { EventSourceMessage } from 'eventsource-client'
import { channelEventRegex, channelRefreshEvent, channelUpdatedEvent } from '../constants/topics'

describe('sse util 테스트', () => {
  const channelOpenMessage = {
    topic: 'channel/platform1/0001/state',
    payload: 'open'
  }

  const channelCloseMessage = {
    topic: 'channel/platform1/0001/state',
    payload: 'close'
  }

  const refreshedMessage = {
    topic: 'refreshed-at',
    payload: Date.now().toString()
  }

  const updatedMessage = {
    topic: 'updated-at',
    payload: Date.now().toString()
  }

  const otherMessage = {
    topic: 'some-topic',
    payload: 'unknown content'
  }

  describe('getMessageType 테스트', () => {
    test('state 메시지 감지', () => {
      const channelOpenMessageTestResult = getMessageType(channelOpenMessage)
      const channelCloseMessageTestResult = getMessageType(channelCloseMessage)

      expect(channelOpenMessageTestResult).toEqual('state')
      expect(channelCloseMessageTestResult).toEqual('state')
    })

    test('refreshed 메시지 감지 테스트', () => {
      const result = getMessageType(refreshedMessage)

      expect(result).toEqual('refreshed')
    })

    test('updated 메시지 감지 테스트', () => {
      const result = getMessageType(updatedMessage)

      expect(result).toEqual('updated')
    })

    test('다른 메시지는 false를 반환', () => {
      const result = getMessageType(otherMessage)

      expect(result).toEqual('unknown')
    })
  })

  describe('isTargetMessage 테스트', () => {
    test('state 메시지 감지', () => {
      const channelOpenMessageTestResult = isTargetTopic(channelOpenMessage)
      const channelCloseMessageTestResult = isTargetTopic(channelCloseMessage)

      expect(channelOpenMessageTestResult).toEqual(true)
      expect(channelCloseMessageTestResult).toEqual(true)
    })

    test('refreshed 메시지 감지 테스트', () => {
      const result = isTargetTopic(refreshedMessage)

      expect(result).toEqual(true)
    })

    test('updated 메시지 감지 테스트', () => {
      const result = isTargetTopic(updatedMessage)

      expect(result).toEqual(true)
    })

    test('다른 메시지는 false를 반환', () => {
      const result = isTargetTopic(otherMessage)

      expect(result).toEqual(false)
    })
  })

  describe('parseMessage 테스트', () => {
    const toEventSourceMessage = (obj: object): EventSourceMessage => ({ data: JSON.stringify(obj) })

    test('state 메시지 파싱', () => {
      const channelOpenMessageParseResult = parseMessage(toEventSourceMessage(channelOpenMessage))
      const channelCloseMessageParseResult = parseMessage(toEventSourceMessage(channelCloseMessage))

      expect(channelOpenMessageParseResult.success).toEqual(true)
      expect(channelOpenMessageParseResult.data?.topic).toMatch(channelEventRegex)
      expect(channelOpenMessageParseResult.data).toEqual(channelOpenMessage)

      expect(channelCloseMessageParseResult.success).toEqual(true)
      expect(channelCloseMessageParseResult.data?.topic).toMatch(channelEventRegex)
      expect(channelCloseMessageParseResult.data).toEqual(channelCloseMessage)
    })

    test('refreshed 메시지 감지 테스트', () => {
      const result = parseMessage(toEventSourceMessage(refreshedMessage))

      expect(result.success).toEqual(true)
      expect(result.data?.topic).toEqual(channelRefreshEvent)
      expect(result.data).toEqual(refreshedMessage)
    })

    test('updated 메시지 감지 테스트', () => {
      const result = parseMessage(toEventSourceMessage(updatedMessage))

      expect(result.success).toEqual(true)
      expect(result.data?.topic).toEqual(channelUpdatedEvent)
      expect(result.data).toEqual(updatedMessage)
    })

    test('다른 메시지는 false를 반환', () => {
      const result = parseMessage(toEventSourceMessage(otherMessage))

      expect(result.success).toEqual(false)
      expect(result.data).toBeUndefined()
    })
  })
});