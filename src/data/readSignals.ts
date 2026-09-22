import signalTagsJson from './signalTags.json'
import signalsJson from './signals.json'
import usersJson from './users.json'
import type { Signal, SignalSegment, SignalTag, SignalTagId, SignalTextWeight, User } from '../types'

const signalTagIds = ['role-change', 'company-change', 'website-view'] as const
const textWeights = ['bold', 'semibold'] as const

export interface SignalView {
  signal: Signal
  user?: User
  tag: SignalTag
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isSignalTagId(value: string): value is SignalTagId {
  return (signalTagIds as readonly string[]).includes(value)
}

function isTextWeight(value: string): value is SignalTextWeight {
  return (textWeights as readonly string[]).includes(value)
}

function parseUser(value: unknown): User {
  if (!isRecord(value) || typeof value.id !== 'string' || typeof value.name !== 'string' || typeof value.role !== 'string') {
    throw new Error('Utente non valido')
  }
  return { id: value.id, name: value.name, role: value.role }
}

function parseSignalTag(value: unknown): SignalTag {
  if (!isRecord(value) || typeof value.id !== 'string' || typeof value.label !== 'string' || !isSignalTagId(value.id)) {
    throw new Error('Tag signal non valido')
  }
  return { id: value.id, label: value.label }
}

function parseSegment(value: unknown): SignalSegment {
  if (!isRecord(value) || typeof value.text !== 'string' || typeof value.weight !== 'string' || !isTextWeight(value.weight)) {
    throw new Error('Segmento signal non valido')
  }
  const segment: SignalSegment = { text: value.text, weight: value.weight }
  if (value.highlight !== undefined) {
    if (typeof value.highlight !== 'boolean') throw new Error('Highlight signal non valido')
    segment.highlight = value.highlight
  }
  return segment
}

function parseSignal(value: unknown): Signal {
  if (
    !isRecord(value) ||
    typeof value.id !== 'string' ||
    typeof value.avatar !== 'string' ||
    typeof value.tagId !== 'string' ||
    typeof value.date !== 'string' ||
    typeof value.unread !== 'boolean' ||
    typeof value.inSequence !== 'boolean' ||
    !isSignalTagId(value.tagId) ||
    !Array.isArray(value.segments)
  ) {
    throw new Error('Signal non valido')
  }

  const signal: Signal = {
    id: value.id,
    avatar: value.avatar,
    segments: value.segments.map(parseSegment),
    tagId: value.tagId,
    inSequence: value.inSequence,
    date: value.date,
    unread: value.unread,
  }

  if (value.userId !== undefined) {
    if (typeof value.userId !== 'string') throw new Error(`userId non valido su ${value.id}`)
    signal.userId = value.userId
  }

  return signal
}

function parseList<T>(value: unknown, parseItem: (item: unknown) => T, label: string): T[] {
  if (!Array.isArray(value)) throw new Error(`${label} deve essere una lista`)
  return value.map(parseItem)
}

export const users = parseList(usersJson, parseUser, 'users.json')
export const signalTags = parseList(signalTagsJson, parseSignalTag, 'signalTags.json')
export const signals = parseList(signalsJson, parseSignal, 'signals.json')

const usersById = new Map(users.map((user) => [user.id, user]))
const tagsById = new Map(signalTags.map((tag) => [tag.id, tag]))

export const signalViews: SignalView[] = signals.map((signal) => {
  const tag = tagsById.get(signal.tagId)
  if (!tag) throw new Error(`Tag mancante: ${signal.tagId}`)

  if (!signal.userId) return { signal, tag }

  const user = usersById.get(signal.userId)
  if (!user) throw new Error(`Utente mancante: ${signal.userId}`)
  return { signal, user, tag }
})
