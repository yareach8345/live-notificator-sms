import { getRequiredEnv } from './envUtil'
import { ChannelId } from '../../types/ChannelId'

const backendUrl = getRequiredEnv('BACKEND_URL')

export const getChannelUrl = (channelId: ChannelId) => `${backendUrl}/channels/minimal/${channelId.platform}/${channelId.id}`

export const getChannelsUrl = (channelIds: ChannelId[]) => {
  const query = channelIds.map(({platform, id}) => `id=${platform}-${id}`).join('&')
  return `${backendUrl}/channels/minimal?${query}`
}
