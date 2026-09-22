export function TodaysTasks({ className = '' }: { className?: string }) {
  return (
    <section
      aria-label="Today's tasks"
      className={`flex h-full max-h-tasks-h w-full flex-col gap-2 rounded-2xl border border-line bg-surface p-4 ${className}`}
    />
  )
}
