import z from 'zod'
import { channelEventRegex, channelRefreshEvent, channelUpdatedEvent } from './topics'

export const sseMessageSchema = z.object({
  topic: z.string().refine(val =>
    channelEventRegex.test(val) ||
    val === channelRefreshEvent ||
    val === channelUpdatedEvent
  ),
  payload: z.string()
})

export type SseMessage = z.infer<typeof sseMessageSchema>