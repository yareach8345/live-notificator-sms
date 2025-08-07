import z from 'zod'
import { channelEventRegex, channelRefreshEvent, channelUpdatedEvent } from '../constants/topics'

export const sseMessageSchema = z.object({
  topic: z.string().refine(val =>
    channelEventRegex.test(val) ||
    val === channelRefreshEvent ||
    val === channelUpdatedEvent
  ),
  payload: z.string()
})

export type ParsedSseMessage = z.infer<typeof sseMessageSchema>