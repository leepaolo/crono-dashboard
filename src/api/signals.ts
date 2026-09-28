import signalTagsJson from '../data/signalTags.json'
import signalsJson from '../data/signals.json'
import usersJson from '../data/users.json'
import type {
  ISignal,
  ISignalSegment,
  ISignalTag,
  ISignalView,
  IUser,
  TSignalTagId,
  TSignalTextWeight,
} from '../types'

const API_DELAY_MS = 300

const signalTagIds = [
  'role-change',
  'company-change',
  'website-view',
] as const satisfies readonly TSignalTagId[]
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

const users = usersJson satisfies IUser[]

const signalTags: ISignalTag[] = signalTagsJson.map((tag) => ({
  id: asTagId(tag.id),
  label: tag.label,
}))

const signals: ISignal[] = signalsJson.map((signal) => {
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

function buildSignalViews(signalList: ISignal[]): ISignalView[] {
  return signalList.map((signal) => {
    const tag = tagsById.get(signal.tagId)
    if (!tag) throw new Error(`Tag mancante: ${signal.tagId}`)

    if (!signal.userId) return { signal, tag }

    const user = usersById.get(signal.userId)
    if (!user) throw new Error(`Utente mancante: ${signal.userId}`)
    return { signal, user, tag }
  })
}

// In-memory state simulating backend persistence
let currentSignals = [...signals]

function simulateDelay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, API_DELAY_MS))
}

/**
 * Fetches all signals from the mock backend.
 * @returns Promise resolving to array of signal views
 */
export async function getSignals(): Promise<ISignalView[]> {
  await simulateDelay()
  return buildSignalViews(currentSignals)
}

/**
 * Marks a signal as read (completed).
 * @param id - Signal ID
 * @returns Promise resolving to the updated signal view
 * @throws Error if signal not found
 */
export async function completeSignal(id: string): Promise<ISignalView> {
  await simulateDelay()

  const signalIndex = currentSignals.findIndex((s) => s.id === id)
  if (signalIndex === -1) {
    throw new Error(`Signal con id ${id} non trovato`)
  }

  currentSignals[signalIndex] = {
    ...currentSignals[signalIndex],
    unread: false,
  }

  const updatedSignal = currentSignals[signalIndex]
  const views = buildSignalViews([updatedSignal])
  return views[0]
}

/**
 * Deletes a signal from the backend.
 * @param id - Signal ID
 * @returns Promise resolving when deletion is complete
 * @throws Error if signal not found
 */
export async function deleteSignal(id: string): Promise<void> {
  await simulateDelay()

  const signalIndex = currentSignals.findIndex((s) => s.id === id)
  if (signalIndex === -1) {
    throw new Error(`Signal con id ${id} non trovato`)
  }

  currentSignals = currentSignals.filter((s) => s.id !== id)
}
