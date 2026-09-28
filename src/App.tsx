import { OnboardingPanel } from './components/Onboarding/OnboardingPanel'
import { PerformancePanel } from './components/Performance/PerformancePanel'
import { Replies } from './components/Replies/Replies'
import { Sidebar } from './components/Sidebar/Sidebar'
import { SignalsPanel } from './components/Signals/SignalsPanel'
import { TodaysTasks } from './components/TodaysTasks/TodaysTasks'
import { Welcome } from './components/Welcome/Welcome'

export default function App() {
  return (
    <main className="flex min-h-svh w-full">
      <Sidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 px-4 py-4">
        <div className="flex min-w-0 gap-2">
          <Welcome className="min-w-0 flex-1" />
          <Replies className="min-w-0 flex-1" />
          <PerformancePanel className="min-w-0 flex-1" />
        </div>
        <TodaysTasks />
        <div className="flex min-w-0 gap-2">
          <SignalsPanel className="min-w-0 flex-[2]" />
          <OnboardingPanel className="min-w-0 flex-1" />
        </div>
      </div>
    </main>
  )
}
