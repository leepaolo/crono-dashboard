export type NavItem = {
  id: string
  label: string
  icon: string
  active?: boolean
  badge?: string
  expandable?: boolean
}

export type TrialBannerData = {
  active: boolean
  message: string
  action: string
}

export type SidebarUser = {
  name: string
  role: string
  avatar: string
}

export interface User {
  id: string
  name: string
  role: string
}

export type SignalTagId = 'role-change' | 'company-change' | 'website-view'

export interface SignalTag {
  id: SignalTagId
  label: string
}

export type SignalTextWeight = 'bold' | 'semibold'

export interface SignalSegment {
  text: string
  weight: SignalTextWeight
  highlight?: boolean
}

export interface Signal {
  id: string
  userId?: string
  avatar: string
  segments: SignalSegment[]
  tagId: SignalTagId
  inSequence: boolean
  date: string
  unread: boolean
}
