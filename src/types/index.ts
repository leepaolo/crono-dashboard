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
