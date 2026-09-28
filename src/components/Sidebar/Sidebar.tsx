import { useState } from 'react'
import navItems from '../../data/navItems.json'
import sidebar from '../../data/sidebar.json'
import { SidebarNavList } from './SidebarNavList'
import { TrialBanner } from './TrialBanner'
import { UserProfileFooter } from './UserProfileFooter'

export function Sidebar({ className = '' }: { className?: string }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside
      aria-label="Sidebar"
      className={`sticky top-0 left-0 flex h-svh shrink-0 flex-col border-r border-line bg-surface transition-[width] duration-300 ${
        isCollapsed ? 'w-16' : 'w-sidebar'
      } ${className}`}
    >
      <div
        className={`flex h-sidebar-header shrink-0 items-center py-header-y transition-[width,padding,justify-content] duration-300 ${
          isCollapsed ? 'w-16 justify-center px-0' : 'w-sidebar justify-between pr-2 pl-4'
        }`}
      >
        <img
          src="/img/crono-full-green-transparent.png"
          alt="crono"
          className={`h-7 w-auto transition-opacity duration-300 ${
            isCollapsed ? 'hidden opacity-0' : 'opacity-100'
          }`}
        />
        <button
          type="button"
          aria-label={isCollapsed ? 'Espandi la sidebar' : 'Comprimi la sidebar'}
          aria-expanded={!isCollapsed}
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`grid size-collapse shrink-0 place-items-center rounded-collapse bg-canvas transition-transform duration-300 ${
            isCollapsed ? 'rotate-180' : ''
          }`}
        >
          <img src="/img/arrow.svg" alt="" className="size-4" />
        </button>
      </div>
      <SidebarNavList items={navItems} isCollapsed={isCollapsed} />
      <TrialBanner {...sidebar.trial} isCollapsed={isCollapsed} />
      <UserProfileFooter {...sidebar.user} isCollapsed={isCollapsed} />
    </aside>
  )
}
