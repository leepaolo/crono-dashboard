import signalTagsJson from './signalTags.json'
import signalsJson from './signals.json'
import usersJson from './users.json'
import type { ISignal, ISignalSegment, ISignalTag, ISignalView, IUser, TSignalTagId, TSignalTextWeight } from '../types'

const signalTagIds = ['role-change', 'company-change', 'website-view'] as const satisfies readonly TSignalTagId[]
const textWeights = ['bold', 'semibold'] as const satisfies readonly TSignalTextWeight[]

function asTagId(id: string): TSignalTagId {
  if ((signalTagIds as readonly string[]).includes(id)) return id as TSignalTagId
  throw new Error(`Tag signal non valido: ${id}`)
}

function asTextWeight(weight: string): TSignalTextWeight {
  if ((textWeights as readonly string[]).includes(weight)) return weight as TSignalTextWeight
  throw new Error(`Peso testo non valido: ${weight}`)
}

function toSegment(segment: (typeof signalsJson)[number]['segments'][number]): ISignalSegment {
  const parsed: ISignalSegment = { text: segment.text, weight: asTextWeight(segment.weight) }
  if ('highlight' in segment && segment.highlight !== undefined) parsed.highlight = segment.highlight
  return parsed
}

export const users = usersJson satisfies IUser[]

export const signalTags: ISignalTag[] = signalTagsJson.map((tag) => ({
  id: asTagId(tag.id),
  label: tag.label,
}))

export const signals: ISignal[] = signalsJson.map((signal) => {
  const parsed: ISignal = {
    id: signal.id,
    avatar: signal.avatar,
    segments: signal.segments.map(toSegment),
    tagId: asTagId(signal.tagId),
    inSequence: signal.inSequence,
    date: signal.date,
    unread: signal.unread,
  }
  if (signal.userId !== undefined) parsed.userId = signal.userId
  return parsed
})

const usersById = new Map(users.map((user) => [user.id, user]))
const tagsById = new Map(signalTags.map((tag) => [tag.id, tag]))

export const signalViews: ISignalView[] = signals.map((signal) => {
  const tag = tagsById.get(signal.tagId)
  if (!tag) throw new Error(`Tag mancante: ${signal.tagId}`)

  if (!signal.userId) return { signal, tag }

  const user = usersById.get(signal.userId)
  if (!user) throw new Error(`Utente mancante: ${signal.userId}`)
  return { signal, user, tag }
})
