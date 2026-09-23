import { Fragment } from 'react'
import steps from '../../data/onboarding.json'
import type { OnboardingStepData } from '../../types'
import { OnboardingStep } from './OnboardingStep'

export function OnboardingPanel({ className = '' }: { className?: string }) {
  return (
    <section
      aria-label="Onboarding"
      className={`relative h-full max-h-onboarding-h w-full max-w-onboarding min-h-0 min-w-0 rounded-2xl bg-surface outline-1 -outline-offset-1 outline-action-menu-border ${className}`}
    >
      <h2 className="absolute top-onboarding-inset left-onboarding-inset text-tasks-title text-navy">
        Onboarding
      </h2>
      <div className="absolute top-onboarding-steps-top left-onboarding-inset flex h-onboarding-steps-h w-onboarding-steps flex-col gap-onboarding-gap">
        {(steps as OnboardingStepData[]).map((step, index) => (
          <Fragment key={step.id}>
            <OnboardingStep step={step} />
            {index < steps.length - 1 ? (
              <span aria-hidden="true" className="h-px w-onboarding-steps shrink-0 bg-action-menu-border" />
            ) : null}
          </Fragment>
        ))}
      </div>
    </section>
  )
}
