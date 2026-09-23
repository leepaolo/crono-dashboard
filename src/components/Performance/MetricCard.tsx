import type { IMetric, TMetricId } from '../../types'

const tone: Record<TMetricId, { value: string; fill: string; track: string }> = {
  contacts: { value: 'text-company-change', fill: 'bg-company-change', track: 'bg-metric-track' },
  companies: { value: 'text-metric-companies', fill: 'bg-metric-companies', track: 'bg-metric-track' },
  activities: { value: 'text-role-change', fill: 'bg-role-change', track: 'bg-metric-activities-track' },
  meetings: { value: 'text-metric-meetings', fill: 'bg-metric-meetings', track: 'bg-trial' },
  deals: { value: 'text-website-view', fill: 'bg-website-view', track: 'bg-metric-deals-track' },
  pipeline: { value: 'text-task-done', fill: 'bg-task-done', track: 'bg-insequenze-bg' },
}

function MetricIcon({ src, colorClass }: { src: string; colorClass: string }) {
  if (!src.endsWith('/task.svg')) {
    return <img src={src} alt="" className="shrink-0" />
  }

  return (
    <span
      aria-hidden
      className={`inline-block size-4 shrink-0 bg-current mask-contain mask-center mask-no-repeat ${colorClass}`}
      style={{
        maskImage: `url("${src}")`,
        WebkitMaskImage: `url("${src}")`,
      }}
    />
  )
}

export function MetricCard({ metric }: { metric: IMetric }) {
  const colors = tone[metric.id]
  const progress = Math.min(100, (metric.value / metric.target) * 100)

  return (
    <article className="flex h-metric-h min-w-0 flex-col rounded-lg border border-action-menu-border bg-surface px-2 py-[7px]">
      <div className="flex h-4 items-center justify-between">
        <p className="text-upgrade text-replies-figure">{metric.label}</p>
        {metric.info ? <img src="/img/info.svg" alt="" width={16} height={16} className="size-4 shrink-0" /> : null}
      </div>
      <div className="mt-2 flex h-6 items-center gap-1">
        {metric.icon ? <MetricIcon src={metric.icon} colorClass={colors.value} /> : null}
        <span className="inline-flex items-center">
          <span className={`text-metric-value ${colors.value}`}>{metric.valueLabel}</span>
          <span className="text-metric-value text-metric-target">/{metric.targetLabel}</span>
        </span>
      </div>
      <div className={`mt-1 h-metric-bar-h shrink-0 overflow-hidden rounded-metric-bar ${colors.track}`}>
        <div className={`h-full rounded-metric-bar ${colors.fill}`} style={{ width: `${progress}%` }} />
      </div>
    </article>
  )
}
