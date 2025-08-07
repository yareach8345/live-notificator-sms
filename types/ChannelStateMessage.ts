import { ChannelId } from './ChannelId'
import { allowedStates } from '../src/constants/channelStates'

export type AllowedState = typeof allowedStates[number];

export interface ChannelStateMessage {
  channelId: ChannelId,
  newState: AllowedState
}