import { ChannelId } from '../../types/ChannelId'
import { authDeviceId, authSecretKey } from '../constants/auth'
import { getChannelsUrl, getChannelUrl } from '../utils/backendUtil'

export const fetchChannel = async (channelId: ChannelId) => {
  return fetch(
    getChannelUrl(channelId),
    {
      method: 'GET',
      headers: {
        'auth-device-id': authDeviceId,
        'auth-secret-key': authSecretKey,
      }
    }
  )
}

export const fetchChannels = async (channelIds: ChannelId[]) => {
  return fetch(
    getChannelsUrl(channelIds),
    {
      method: 'GET',
      headers: {
        'auth-device-id': authDeviceId,
        'auth-secret-key': authSecretKey,
      }
    }
  )
}
