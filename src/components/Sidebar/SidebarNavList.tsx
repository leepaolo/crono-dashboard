import type { INavItem } from '../../types'

export function SidebarNavList({
  items,
  isCollapsed,
}: {
  items: INavItem[]
  isCollapsed: boolean
}) {
  return (
    <nav
      aria-label="Principale"
      className={`shrink-0 transition-[width] duration-300 ${isCollapsed ? 'w-16' : 'w-sidebar'}`}
    >
      <ul className="flex h-nav-h flex-col gap-nav-gap">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              aria-current={item.active ? 'page' : undefined}
              title={isCollapsed ? item.label : undefined}
              className={`flex h-nav-item w-full items-center gap-2 pr-2 text-nav ${item.active ? 'text-brand' : 'text-muted'} ${
                isCollapsed ? 'justify-center pl-0' : 'pl-4'
              } transition-[padding] duration-300`}
            >
              <img src={item.icon} alt="" className="size-6 shrink-0" />
              <span
                className={`transition-[opacity,width] duration-300 ${
                  isCollapsed ? 'w-0 overflow-hidden opacity-0' : 'w-auto opacity-100'
                }`}
              >
                {item.label}
              </span>
              {item.badge && !isCollapsed ? (
                <span className="ml-auto inline-flex h-[18px] min-w-7 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] leading-none font-semibold text-white">
                  {item.badge}
                </span>
              ) : null}
              {item.expandable && !isCollapsed ? (
                <img src="/img/chevron.svg" alt="" className="ml-auto size-4 shrink-0" />
              ) : null}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
