import type { SignalView } from "../../data/readSignals";
import type { SignalSegment, SignalTagId } from "../../types";
import { SignalActionPopover } from "./SignalActionPopover";

const tagColorClass: Record<SignalTagId, string> = {
  "role-change": "text-role-change",
  "company-change": "text-company-change",
  "website-view": "text-website-view",
};

function segmentClass(segment: SignalSegment) {
  const weight =
    segment.weight === "bold" ? "text-signal-name" : "text-signal-body";
  const color = segment.highlight ? "text-brand" : "text-ink";
  return `${weight} ${color}`;
}

export function SignalRow({
  signal,
  user,
  tag,
  menuOpen,
  onMenuOpenChange,
}: SignalView & {
  menuOpen: boolean;
  onMenuOpenChange: (open: boolean) => void;
}) {
  return (
    <li className="mb-signal-row-b w-full shrink-0 border-b border-line px-signal-row-x last:mb-0">
      <div className="mb-signal-row-b flex w-full items-center gap-signal-main-gap">
        <div className="flex min-w-0 flex-1 items-center gap-signal-identity-gap">
          <div className="relative size-signal-avatar shrink-0">
            <img
              src={signal.avatar}
              alt=""
              className="size-full rounded-full"
            />
            {signal.unread ? (
              <span
                aria-hidden="true"
                className="absolute top-signal-unread-top left-signal-unread-left z-10 size-signal-unread rounded-full border-2 border-white bg-accent"
              />
            ) : null}
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-signal-copy-gap">
            <p className="truncate text-signal-body text-ink">
              {user ? (
                <span className="text-signal-name">{user.name}</span>
              ) : null}
              {signal.segments.map((segment, index) => (
                <span
                  key={`${segment.text}-${index}`}
                  className={segmentClass(segment)}
                >
                  {segment.text}
                </span>
              ))}
            </p>
            <div className="flex items-center gap-1.5">
              <span className={`text-signal-tag ${tagColorClass[tag.id]}`}>
                {tag.label}
              </span>
              {signal.inSequence ? (
                <span className="inline-flex h-4 items-center rounded-full bg-insequenze-bg px-1.5 text-signal-tag text-insequenze-font">
                  In sequence
                </span>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex h-signal-meta-h w-signal-meta shrink-0 items-center justify-end gap-signal-meta-gap">
          <time
            dateTime="2025-04-02"
            className="text-signal-date whitespace-nowrap text-muted"
          >
            {signal.date}
          </time>
          <SignalActionPopover open={menuOpen} onOpenChange={onMenuOpenChange} />
        </div>
      </div>
    </li>
  );
}
