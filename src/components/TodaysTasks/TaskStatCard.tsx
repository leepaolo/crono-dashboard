import type { TaskId, TaskStat } from '../../types'

const tone: Record<TaskId, { card: string; count: string }> = {
  overdue: { card: 'bg-task-overdue-bg', count: 'text-task-overdue' },
  'pending-manual': { card: 'bg-task-manual-bg', count: 'text-task-manual' },
  'pending-auto': { card: 'bg-task-auto-bg', count: 'text-task-auto' },
  completed: { card: 'bg-task-done-bg', count: 'text-task-done' },
}

export function TaskStatCard({ task }: { task: TaskStat }) {
  const colors = tone[task.id]

  return (
    <article
      className={`relative flex h-task-card-h w-task-card shrink-0 flex-col justify-between rounded-task-card p-4 ${colors.card}`}
    >
      {task.error ? (
        <span className="absolute top-2 right-3 inline-flex h-6 w-task-error items-center gap-0.5 rounded-2xl bg-surface pl-2">
          <span className="text-task-error whitespace-nowrap text-task-overdue">{task.error}</span>
          <img src="/img/warning-s.svg" alt="" className="size-4 shrink-0" />
        </span>
      ) : null}
      <p className={`text-task-count ${colors.count}`}>{task.count}</p>
      <div className="flex items-center justify-between">
        <p className="text-task-label text-navy">{task.label}</p>
        {task.chevron ? (
          <img src="/img/chevron.svg" alt="" className="size-4 shrink-0 -rotate-90" />
        ) : null}
      </div>
    </article>
  )
}
