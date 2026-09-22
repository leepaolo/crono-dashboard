export function PerformancePanel({ className = '' }: { className?: string }) {
  return (
    <section
      aria-label="May's performance"
      className={`h-full max-h-performance-h w-full max-w-performance min-h-0 min-w-0 rounded-2xl border border-line bg-surface ${className}`}
    />
  )
}
