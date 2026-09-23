import { Fragment } from 'react'
import tasks from '../../data/tasks.json'
import type { ITaskStat } from '../../types'
import { TaskStatCard } from './TaskStatCard'

export function TodaysTasks({ className = '' }: { className?: string }) {
  return (
    <section
      aria-label="Today's tasks"
      className={`flex h-full max-h-tasks-h w-full flex-col gap-2 rounded-2xl border border-action-menu-border bg-surface p-4 ${className}`}
    >
      <h2 className="text-tasks-title text-navy">Today’s tasks</h2>
      <div className="flex h-task-card-h items-center justify-between">
        {(tasks as ITaskStat[]).map((task, index) => (
          <Fragment key={task.id}>
            {index > 0 ? (
              <span aria-hidden="true" className="h-task-card-h w-px shrink-0 bg-action-menu-border" />
            ) : null}
            <TaskStatCard task={task} />
          </Fragment>
        ))}
      </div>
    </section>
  )
}
