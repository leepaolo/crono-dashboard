import type { ITrialBannerData } from "../../types";

export function TrialBanner({ active, message, action }: ITrialBannerData) {
  if (!active) return null;

  return (
    <div className="relative mx-auto mt-trial-top h-trial-h w-trial-w shrink-0 overflow-hidden rounded-lg bg-trial px-2.5 py-2">
      {/* <img
        src="/img/trial-bg-icon.png"
        alt=""
        className="pointer-events-none absolute -top-[155px] -right-2 h-[305px] w-[229px] max-w-none"
      /> */}
      <p className="relative z-10 text-nav text-ink">{message}</p>
      <button
        type="button"
        className="absolute top-upgrade-top left-upgrade-left z-10 flex h-upgrade-h w-upgrade-w items-center gap-upgrade-gap rounded-upgrade bg-accent px-upgrade-x py-upgrade-y text-upgrade text-white"
      >
        {action}
        <img src="/img/upgrade-plan.svg" alt="" className="size-3" />
      </button>
    </div>
  );
}
