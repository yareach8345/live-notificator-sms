import { isAllowedState, transformToChannelMessage } from './channelMessageUtil'
import { allowedStates } from '../constants/channelStates'
import { ParsedSseMessage } from '../sse-client/sseMessageSchema'
import { ChannelId } from '../../types/ChannelId'
import { NotSupportedStateError } from '../error/NotSupportedStateError'
import { NotSupportedMessageError } from '../error/NotSupportedMessageError'

describe('channel message util 테스트', () => {
  describe('isAllowStates 함수 검사', () => {
    test('받기로 한 메시지인 경우는 모두 성공으로 처리', () => {
      const states = [ 'open', 'closed', 'deleted', 'added' ]

      const result = states.map(isAllowedState).reduce((prev, curr) => prev && curr, true)

      expect(result).toEqual(true)
      expect(states.length).toEqual(allowedStates.length)
    })

    test('받기로 하지 않은 메시지의 경우는 실패', () => {
      const notAllowedStates = 'something'

      const result = isAllowedState(notAllowedStates)

      expect((allowedStates as readonly string[]).includes(notAllowedStates)).toBe(false)
      expect(result).toBe(false)
    })
  })

  describe('transformToChannelMessage 테스트', () => {
    test('허용되는 타입의 상태 변경 메시지는 변형에 성공함', () => {
      const mockChannelId: ChannelId = { platform: 'platform1', id: '0001' }

      const topic = `channel/${mockChannelId.platform}/${mockChannelId.id}/state`

      const message: ParsedSseMessage[] = allowedStates.map(state => ({
        topic,
        payload: state
      }))

      const results = message.map(message => [message.payload, transformToChannelMessage(message)] as const)

      const hasSameTopic = results
        .map(result => result[1].channelId)
        .map(channelId => channelId.platform === mockChannelId.platform && channelId.id === mockChannelId.id)
        .reduce((prev, curr) => prev && curr, true)

      const hasRightState = results.map(results => results[0] === results[1].newState)
        .reduce((prev, curr) => prev && curr, true)

      expect(hasSameTopic).toBe(true)
      expect(hasRightState).toBe(true)
    })

    test('허용되지 않는 타입은 메시지 변형에 실패', () => {
      const message: ParsedSseMessage = {
        topic: `channel/platform1/0001/state`,
        payload: 'not allowed state'
      }

      expect((allowedStates as readonly string[]).includes(message.payload)).toEqual(false)
      expect(() => transformToChannelMessage(message)).toThrow(NotSupportedStateError)
    })

    test('메시지가 state 메시지가 아닐시 에러 발생', () => {
      const message: ParsedSseMessage = {
        topic: `channel/platform1/0001/test`,
        payload: 'open'
      }

      expect((allowedStates as readonly string[]).includes(message.payload)).toEqual(true)
      expect(() => transformToChannelMessage(message)).toThrow(NotSupportedMessageError)
    })
  })
})