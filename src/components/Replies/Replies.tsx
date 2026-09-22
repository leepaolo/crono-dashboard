export function Replies({ className = '' }: { className?: string }) {
  return (
    <section
      aria-label="Replies"
      className={`flex h-full max-h-replies-h w-full flex-col gap-2 rounded-2xl border border-line bg-surface p-4 ${className}`}
    />
  )
}
