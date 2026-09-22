import * as Popover from '@radix-ui/react-popover'

const itemClass =
  'flex h-action-menu-item-h w-action-menu-item shrink-0 items-center justify-between gap-action-menu-item-gap rounded-action-menu-item p-action-menu-item-p text-action-menu text-ink hover:bg-insequenze-bg hover:text-insequenze-font focus-visible:bg-insequenze-bg focus-visible:text-insequenze-font focus-visible:outline-none'

function CheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8.228 11.222L12.005 15L19.68 7.325C18.1 4.735 15.256 3 12 3C7.029 3 3 7.029 3 12C3 16.971 7.029 21 12 21C16.632 21 20.443 17.5 20.941 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" aria-hidden="true">
      <path
        d="M0.75 3.53563H12.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.893 3.53552V12.9641C11.893 13.9112 11.1258 14.6784 10.1787 14.6784H3.32152C2.37438 14.6784 1.60724 13.9112 1.60724 12.9641V3.53552"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.32157 0.749983H4.17871"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.03581 6.96423V11.2499"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.46373 6.96423V11.2499"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SignalActionPopover({
  open,
  onOpenChange,
  onComplete,
  onDelete,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: () => void
  onDelete: () => void
}) {
  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="inline-flex h-signal-action-h w-signal-action shrink-0 items-center justify-center gap-signal-action-gap rounded-signal-action bg-action-button px-signal-action-x py-signal-action-y text-signal-action text-surface hover:bg-brand data-[state=open]:bg-brand"
        >
          Action
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="end"
          sideOffset={8}
          className="z-50 flex h-action-menu-h w-action-menu flex-col rounded-action-menu bg-surface p-action-menu-p shadow-action-menu outline-none"
        >
          <Popover.Close asChild>
            <button type="button" className={itemClass} onClick={onComplete}>
              <span>Complete</span>
              <span className="inline-flex size-6 shrink-0 items-center justify-center">
                <CheckIcon />
              </span>
            </button>
          </Popover.Close>
          <Popover.Close asChild>
            <button type="button" className={itemClass} onClick={onDelete}>
              <span>Delete</span>
              <span className="inline-flex size-6 shrink-0 items-center justify-center">
                <TrashIcon />
              </span>
            </button>
          </Popover.Close>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
