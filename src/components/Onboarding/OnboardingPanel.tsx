export function OnboardingPanel({ className = '' }: { className?: string }) {
  return (
    <section
      aria-label="Onboarding"
      className={`h-full max-h-onboarding-h w-full max-w-onboarding min-h-0 min-w-0 rounded-2xl border border-line bg-surface ${className}`}
    />
  )
}
