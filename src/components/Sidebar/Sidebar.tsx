export function Sidebar({ className = '' }: { className?: string }) {
  return (
    <aside
      aria-label="Sidebar"
      className={`sticky top-0 left-0 flex h-svh w-sidebar shrink-0 flex-col justify-between border-r border-line bg-surface ${className}`}
    />
  )
}
