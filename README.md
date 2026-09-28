# Crono Dashboard

Take-home assignment implementation: Sales engagement dashboard built with React, TypeScript, and Tailwind CSS.

**Live Demo**: [Placeholder - Deploy URL here]

---

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Tech Stack

| Technology | Rationale |
|------------|-----------|
| **React 19** | Modern UI library with latest features |
| **TypeScript 6** | Type safety with strict mode enabled |
| **Vite 8** | Fast build tool with instant HMR |
| **Tailwind CSS 4** | Utility-first CSS with design tokens mapped from Figma |
| **Radix UI** | Accessible headless components (Popover for signal actions) |
| **Oxlint** | Fast, modern linter for code quality |

---

## Folder Structure

```
crono-dashboard/
├── src/
│   ├── api/                  # API layer (mock backend simulation)
│   │   └── signals.ts        # Signal CRUD operations with artificial delay
│   ├── components/           # React components organized by feature
│   │   ├── Sidebar/
│   │   ├── Signals/
│   │   ├── TodaysTasks/
│   │   ├── Performance/
│   │   ├── Onboarding/
│   │   ├── Welcome/
│   │   └── Replies/
│   ├── data/                 # Static JSON mock data
│   │   ├── signals.json
│   │   ├── signalTags.json
│   │   └── users.json
│   ├── hooks/                # Custom React hooks
│   │   └── useSignals.ts     # Signals state management hook
│   ├── types/                # TypeScript type definitions
│   │   └── index.ts
│   ├── index.css             # Tailwind config with Figma design tokens
│   ├── App.tsx               # Main app layout
│   └── main.tsx              # App entry point
├── public/                   # Static assets (images, icons)
└── dist/                     # Production build output
```

---

## API Layer Architecture

The application uses a **three-layer architecture** for clean separation of concerns:

### 1. API Layer (`src/api/signals.ts`)

Mock backend simulation with typed async functions:

```typescript
// Fetches all signals
export async function getSignals(): Promise<ISignalView[]>

// Marks a signal as read (completed)
export async function completeSignal(id: string): Promise<ISignalView>

// Deletes a signal
export async function deleteSignal(id: string): Promise<void>
```

- Simulates 300ms network delay
- In-memory state persistence during session
- Reads from `src/data/*.json` files

### 2. Hook Layer (`src/hooks/useSignals.ts`)

React hook that consumes the API and manages state:

```typescript
const { signals, unreadCount, isLoading, error, complete, deleteSignal } = useSignals()
```

- Handles loading/error states
- Filters unread signals
- Exposes actions as callbacks

### 3. Component Layer (`src/components/Signals/*`)

UI components that consume only the hook:

```typescript
export function SignalsPanel() {
  const { signals, unreadCount, isLoading, error, complete, deleteSignal } = useSignals()
  // Renders UI based on hook data
}
```

### Swapping Mock API for Real Backend

**To integrate a real backend**, modify **only** `src/api/signals.ts`:

```typescript
// BEFORE (mock)
export async function getSignals(): Promise<ISignalView[]> {
  await simulateDelay()
  return buildSignalViews(currentSignals)
}

// AFTER (real backend)
export async function getSignals(): Promise<ISignalView[]> {
  const response = await fetch('https://api.crono.com/signals')
  if (!response.ok) throw new Error('Failed to fetch signals')
  return response.json()
}
```

**Components remain unchanged** - the hook interface stays the same.

---

## Design Decisions & Assumptions

### Signal Actions

- **Complete**: Marks signal as `read`, keeps it visible with subtle "read" styling
  - Decrements unread counter only if signal was unread
  - Signal status: `unread: true` → `unread: false`

- **Delete**: Removes signal from the list entirely
  - Decrements unread counter only if signal was unread
  - Signal is filtered out of the state

- **Unread Counter**: Derived from state (`signals.filter(s => s.unread).length`), never stored separately

### Layout & Viewport

- **Fixed layout optimized for 1440px** (Figma design target)
- **Desktop-only**: The application uses fixed-width layout matching the provided Figma design
- **Why not responsive?**: Without explicit viewport specifications (mobile/tablet/desktop breakpoints) and corresponding design comps, making the layout fluid would require design decisions outside the assignment scope and risk breaking the UI
- Layout uses CSS Grid with fixed column/row values mapped from Figma tokens

### Sidebar Collapse

- **Collapsed state**: 64px width, icon-only, labels hidden
- **Expanded state**: 192px width, identical to Figma
- **Accessibility**: `aria-expanded` on toggle button, `title` tooltips on icons when collapsed
- **Trial banner**: Hidden when collapsed to maintain clean icon-only appearance

---

## Known Limitations & Out of Scope

**Intentionally not implemented** (as per assignment scope):

- ❌ **Authentication/Authorization**: No login, all data visible
- ❌ **Real-time updates**: No WebSocket/polling, data loads once on mount
- ❌ **Pagination**: All signals loaded at once (suitable for small datasets)
- ❌ **Search/Filter**: No UI for filtering signals by tag/date/user
- ❌ **Keyboard navigation**: Popover closes with Escape, but no full keyboard nav
- ❌ **Mobile responsive**: Optimized for desktop viewports only (1280px+)
- ❌ **Dark mode**: Single light theme matching Figma design
- ❌ **Internationalization**: UI text hardcoded in Italian/English mix
- ❌ **Automated tests**: No Vitest/React Testing Library setup (planned for task 5)
- ❌ **Persistence**: Refreshing the page resets all changes (mock API uses in-memory state)

**Technical limitations**:

- Hardcoded date format in SignalRow (no date formatting library)
- No optimistic UI updates (actions show loading state)
- Error handling is minimal (simple error message, no retry logic)

---

## Browser Support

- Chrome/Edge 120+ (tested)
- Firefox 120+
- Safari 17+

Requires JavaScript enabled. No progressive enhancement.

---

## Contributing

This is a take-home assignment repository. For questions or feedback:

1. Open an issue on GitHub
2. Contact: [Your contact info here]

---

## License

Proprietary - Crono Take-Home Assignment © 2025
