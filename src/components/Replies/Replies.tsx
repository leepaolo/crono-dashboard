const logos = [
  { src: '/img/reddit.svg', name: 'Reddit' },
  { src: '/img/amazon.png', name: 'Amazon' },
  { src: '/img/mac.svg', name: "McDonald's" },
  { src: '/img/medium.svg', name: 'Medium' },
]

export function Replies({ className = '' }: { className?: string }) {
  return (
    <section
      aria-label="Replies"
      className={`flex h-replies-h w-replies flex-col gap-2 rounded-2xl border border-action-menu-border bg-surface p-4 ${className}`}
    >
      <div className="flex h-replies-header-h items-center justify-between">
        <h2 className="text-tasks-title text-navy">Replies</h2>
        <button type="button" className="inline-flex items-center gap-1 border-0 bg-transparent p-0 text-nav text-brand">
          Open inbox
          <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4 shrink-0">
            <path
              d="M6.5 4L10.5 8L6.5 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <div className="flex h-20 items-center gap-4 rounded-xl bg-insequenze-bg py-4 pr-6 pl-4">
        <span className="inline-flex size-replies-icon shrink-0 items-center justify-center rounded-replies-icon bg-replies-icon p-3">
          <img src="/img/mail.svg" alt="" className="size-6" />
        </span>
        <p className="text-replies-count text-replies-figure">24</p>
        <div className="ml-auto flex w-replies-stack shrink-0">
          {logos.map((logo, index) => (
            <img
              key={logo.name}
              src={logo.src}
              alt=""
              className={`relative size-replies-avatar rounded-full ${index > 0 ? '-ml-2' : ''}`}
              style={{ zIndex: index + 1 }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
