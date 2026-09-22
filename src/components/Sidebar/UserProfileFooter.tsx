import type { SidebarUser } from "../../types";

export function UserProfileFooter({ name, role, avatar }: SidebarUser) {
  return (
    <div className="mt-auto flex h-footer-h w-sidebar shrink-0 items-center gap-footer-gap border-t border-line">
      <div className="flex h-profile-h w-sidebar items-center gap-profile-gap rounded-profile px-profile-x py-profile-y">
        <img src={avatar} alt="" className="size-8 shrink-0" />
        <div>
          <p className="text-profile whitespace-nowrap text-ink">{name}</p>
          <p className="text-profile whitespace-nowrap text-muted">{role}</p>
        </div>
      </div>
    </div>
  );
}
