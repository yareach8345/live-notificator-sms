import { getRequiredEnv } from '../utils/envUtil'

export const authDeviceId = getRequiredEnv('AUTH_DEVICE_ID')
export const authSecretKey = getRequiredEnv('AUTH_SECRET_KEY')