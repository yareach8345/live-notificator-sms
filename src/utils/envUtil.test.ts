import { getRequiredEnv, getRequiredEnvs } from './envUtil'
import { RequiredEnvNotFoundError } from '../error/RequiredEnvNotFoundError'

describe('환경변수 가져오기 테스트', () => {
  const ORIGINAL_ENV = process.env

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV }
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  describe('getRequiredEnv', () => {
    test('getRequiredEnv로 환경변수를 가져올 수 있음', () => {
      process.env = { ...process.env, TEST_ENV: 'TEST_VALUE' }

      const result = getRequiredEnv('TEST_ENV')

      expect(result).toEqual('TEST_VALUE')
    })

    test('환경변수는 공백이 제거되서 반환', () => {
      process.env = {
        ...process.env,
        TEST_ENV1: '  TEST_VALUE1',
        TEST_ENV2: 'TEST_VALUE 2     ',
        TEST_ENV3: '  TEST_VALUE 3 '
      }

      const result1 = getRequiredEnv('TEST_ENV1')
      const result2 = getRequiredEnv('TEST_ENV2')
      const result3 = getRequiredEnv('TEST_ENV3')

      expect(result1).toBe('TEST_VALUE1')
      expect(result2).toBe('TEST_VALUE 2')
      expect(result3).toBe('TEST_VALUE 3')
    })

    test('환경변수가 존재하지 않으면 에러', () => {
      expect(() => getRequiredEnv('NOT_EXIST_ENV_NAME')).toThrow(RequiredEnvNotFoundError)
    })
  })

  describe('getRequiredEnvs', () => {
    test('getRequiredEnvs로 쉼표로 구분된 값들을 가져올 수 있음', () => {
      process.env = { ...process.env, TEST_ENVS: 'TEST_VALUE1,TEST_VALUE2' }

      const result = getRequiredEnvs('TEST_ENVS')

      expect(result).toHaveLength(2)
      expect(result).toEqual(['TEST_VALUE1', 'TEST_VALUE2'])
    })

    test('두번째 인수로 구분자를 설정 할 수 있음', () => {
      process.env = { ...process.env, TEST_ENVS: 'TEST_VALUE1;TEST_VALUE2' }

      const result = getRequiredEnvs('TEST_ENVS', ';')

      expect(result).toHaveLength(2)
      expect(result).toEqual(['TEST_VALUE1', 'TEST_VALUE2'])
    })

    test('구분자가 두번연속으로 올 경우 그 자리 빈 문자열이 들어감', () => {
      process.env = { ...process.env, TEST_ENVS: 'TEST_VALUE1,,TEST_VALUE2' }

      const result = getRequiredEnvs('TEST_ENVS')

      expect(result).toHaveLength(3)
      expect(result).toEqual(['TEST_VALUE1', '', 'TEST_VALUE2'])
    })

    test('환경를 불러올 때 좌우 공백이 제거됨', () => {
      process.env = { ...process.env, TEST_ENVS: 'TEST_VALUE1  ,, TEST_VALUE2  ,  ,   TEST_VALUE3' }

      const result = getRequiredEnvs('TEST_ENVS')

      expect(result).toHaveLength(5)
      expect(result).toEqual(['TEST_VALUE1', '', 'TEST_VALUE2', '', 'TEST_VALUE3'])
    })

    test('구분자가 없을 경우 길이가 1인 배열로 반환', () => {
      process.env = { ...process.env, TEST_ENVS: 'TEST_VALUE1' }

      const result = getRequiredEnvs('TEST_ENVS')

      expect(result).toHaveLength(1)
      expect(result).toEqual(['TEST_VALUE1'])
    })

    test('환경변수가 존재하지 않을 경우 에러 반환', () => {
      expect(() => getRequiredEnvs('TEST_ENVS')).toThrow(RequiredEnvNotFoundError)
    })
  })
})