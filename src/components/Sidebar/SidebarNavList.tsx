import type { NavItem } from '../../types'

export function SidebarNavList({ items }: { items: NavItem[] }) {
  return (
    <nav aria-label="Principale" className="w-sidebar shrink-0">
      <ul className="flex h-nav-h flex-col gap-nav-gap">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              aria-current={item.active ? 'page' : undefined}
              className={`flex h-nav-item w-full items-center gap-2 pr-2 pl-4 text-nav ${item.active ? 'text-brand' : 'text-muted'}`}
            >
              <img src={item.icon} alt="" className="size-6 shrink-0" />
              <span>{item.label}</span>
              {item.badge ? (
                <span className="ml-auto inline-flex h-[18px] min-w-7 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] leading-none font-semibold text-white">
                  {item.badge}
                </span>
              ) : null}
              {item.expandable ? (
                <img src="/img/chevron.svg" alt="" className="ml-auto size-4 shrink-0" />
              ) : null}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
