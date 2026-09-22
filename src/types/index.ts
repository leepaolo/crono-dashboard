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

export type SignalTextKind = 'plain' | 'bold' | 'colored'

export type SignalSegment = {
  text: string
  kind: SignalTextKind
}

export type SignalTagTone = 'role' | 'company' | 'website'

export type SignalTag = {
  label: string
  tone: SignalTagTone
}

export type Signal = {
  id: string
  avatar: string
  segments: SignalSegment[]
  tag: SignalTag
  secondaryTag?: string
  date: string
  unread: boolean
}
