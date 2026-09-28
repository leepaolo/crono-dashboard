import metrics from '../../data/metrics.json'
import type { IMetric } from '../../types'
import { MetricCard } from './MetricCard'

export function PerformancePanel({ className = '' }: { className?: string }) {
  return (
    <section
      aria-label="May's performance"
      className={`flex h-performance-h w-performance flex-col gap-2 rounded-2xl bg-surface p-4 outline-1 -outline-offset-1 outline-action-menu-border ${className}`}
    >
      <div className="flex h-replies-header-h items-center justify-between">
        <h2 className="text-tasks-title text-navy">May’s performance</h2>
        <button type="button" className="inline-flex items-center gap-1 border-0 bg-transparent p-0 text-nav text-brand">
          Edit KPIs
          <img src="/img/edit.svg" alt="" className="size-3.5 shrink-0" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {(metrics as IMetric[]).map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>
    </section>
  )
}
