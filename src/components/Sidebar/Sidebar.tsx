import navItems from '../../data/navItems.json'
import sidebar from '../../data/sidebar.json'
import { SidebarNavList } from './SidebarNavList'
import { TrialBanner } from './TrialBanner'
import { UserProfileFooter } from './UserProfileFooter'

export function Sidebar({ className = '' }: { className?: string }) {
  return (
    <aside
      aria-label="Sidebar"
      className={`sticky top-0 left-0 flex h-svh w-sidebar shrink-0 flex-col border-r border-line bg-surface ${className}`}
    >
      <div className="flex h-sidebar-header w-sidebar shrink-0 items-center justify-between py-header-y pr-2 pl-4">
        <img src="/img/crono-full-green-transparent.png" alt="crono" className="h-7 w-auto" />
        <button
          type="button"
          aria-label="Comprimi la sidebar"
          className="grid size-collapse place-items-center rounded-collapse bg-canvas"
        >
          <img src="/img/arrow.svg" alt="" className="size-4" />
        </button>
      </div>
      <SidebarNavList items={navItems} />
      <TrialBanner {...sidebar.trial} />
      <UserProfileFooter {...sidebar.user} />
    </aside>
  )
}
