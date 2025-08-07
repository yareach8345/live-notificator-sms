import { ChannelId } from '../../types/ChannelId'
import { authDeviceId, authSecretKey } from '../constants/auth'
import { getChannelsUrl, getChannelUrl } from '../utils/backendUtil'
import axios from 'axios'
import { ChannelDto } from '../dto/ChannelDto'

export const fetchChannel = async (channelId: ChannelId) => {
  return axios.get<ChannelDto>(
    getChannelUrl(channelId),
    {
      headers: {
        'auth-device-id': authDeviceId,
        'auth-secret-key': authSecretKey,
      }
    }
  )
}

export const fetchChannels = async (channelIds: ChannelId[]) => {
  return axios.get<ChannelDto>(
    getChannelsUrl(channelIds),
    {
      headers: {
        'auth-device-id': authDeviceId,
        'auth-secret-key': authSecretKey,
      }
    }
  )
}
