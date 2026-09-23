import { OnboardingPanel } from "./components/Onboarding/OnboardingPanel";
import { PerformancePanel } from "./components/Performance/PerformancePanel";
import { Replies } from "./components/Replies/Replies";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { SignalsPanel } from "./components/Signals/SignalsPanel";
import { TodaysTasks } from "./components/TodaysTasks/TodaysTasks";
import { Welcome } from "./components/Welcome/Welcome";

const content =
  "grid shrink-0 grid-cols-[16px_var(--spacing-welcome)_8px_var(--spacing-replies)_8px_var(--spacing-performance)_16px] grid-rows-[16px_var(--spacing-welcome-h)_8px_var(--spacing-tasks-h)_8px_var(--spacing-signals-h)]";

export default function App() {
  return (
    <main className="flex min-h-svh w-full">
      <Sidebar />
      <div className={content}>
        <Welcome className="col-start-2 row-start-2" />
        <Replies className="col-start-4 row-start-2" />
        <TodaysTasks className="col-start-2 col-span-3 row-start-4" />
        <SignalsPanel className="col-start-2 col-span-3 row-start-6" />
        <PerformancePanel className="col-start-6 row-start-2 row-span-3 self-end" />
        <OnboardingPanel className="col-start-6 row-start-6" />
      </div>
    </main>
  );
}
