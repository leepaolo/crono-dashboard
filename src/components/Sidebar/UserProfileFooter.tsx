import type { ISidebarUser } from '../../types'

export function UserProfileFooter({
  name,
  role,
  avatar,
  isCollapsed,
}: ISidebarUser & { isCollapsed: boolean }) {
  return (
    <div
      className={`mt-auto flex h-footer-h shrink-0 items-center gap-footer-gap border-t border-line transition-[width] duration-300 ${
        isCollapsed ? 'w-16' : 'w-sidebar'
      }`}
    >
      <div
        className={`flex h-profile-h items-center gap-profile-gap rounded-profile px-profile-x py-profile-y transition-[width] duration-300 ${
          isCollapsed ? 'w-16 justify-center px-0' : 'w-sidebar'
        }`}
      >
        <img src={avatar} alt="" className="size-8 shrink-0" title={isCollapsed ? name : ''} />
        <div
          className={`transition-[opacity,width] duration-300 ${
            isCollapsed ? 'w-0 overflow-hidden opacity-0' : 'w-auto opacity-100'
          }`}
        >
          <p className="text-profile whitespace-nowrap text-ink">{name}</p>
          <p className="text-profile whitespace-nowrap text-muted">{role}</p>
        </div>
      </div>
    </div>
  )
}
