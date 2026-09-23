import type { OnboardingStepData } from '../../types'

export function OnboardingStep({ step }: { step: OnboardingStepData }) {
  return (
    <div className="flex h-onboarding-row-h w-onboarding-steps shrink-0 items-center justify-between pr-onboarding-row-pr">
      <div className="flex h-onboarding-row-h items-center gap-onboarding-gap">
        <img
          src={step.icon}
          alt=""
          width={40}
          height={40}
          className="size-onboarding-icon shrink-0"
        />
        <span className="text-tasks-title whitespace-nowrap text-navy">{step.title}</span>
      </div>
      <span className="text-profile whitespace-nowrap text-muted">{step.duration}</span>
    </div>
  )
}
