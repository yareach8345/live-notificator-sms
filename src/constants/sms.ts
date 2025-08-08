import { getRequiredEnv, getRequiredEnvs } from '../utils/envUtil'

export const COOL_SMS_API_KEY = getRequiredEnv('COOL_SMS_API_KEY')
export const COOL_SMS_SECRET_KEY = getRequiredEnv('COOL_SMS_SECRET_KEY')
export const SENDER_PHONE_NUMBER = getRequiredEnv('SENDER_PHONE_NUMBER')
export const PHONE_NUMBERS = getRequiredEnvs('PHONE_NUMBERS')