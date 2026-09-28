# Review feedback

## 1. Complete e Delete hanno lo stesso effetto visibile

La lista mostra solo `unread: true`. Complete mette `unread: false` e la riga sparisce, come Delete.

Atteso: Complete lascia la riga e toglie il pallino. Delete la rimuove. Il badge resta `unread.length`.

`signals` deve essere `views`. Il filtro unread solo per `unreadCount`.

`signal-10`, `signal-11`, `signal-12` hanno `unread: false`: non compaiono.

### Snippet modificati

`src/hooks/useSignals.ts`

```ts
function removeSignal(views: ISignalView[], id: string): ISignalView[] {
  return views.filter((view) => view.signal.id !== id)
}

const unread = views.filter((view) => view.signal.unread)

return {
  signals: unread,
  unreadCount: unread.length,
  complete: (id: string) => setViews((current) => markProcessed(current, id)),
  deleteSignal: (id: string) => setViews((current) => removeSignal(current, id)),
}
```

`src/data/signals.json`

```json
{ "id": "signal-10", "unread": false }
{ "id": "signal-11", "unread": false }
{ "id": "signal-12", "unread": false }
```

## 3. La sidebar collassa, ma è fuori scope

Il bottone `«` è solo visivo. La sidebar resta `w-sidebar` (192px).

`isCollapsed` restringe a `w-16`, nasconde label, badge, chevron, logo, nome e `TrialBanner`.

### Snippet modificati

`src/components/Sidebar/Sidebar.tsx`

```tsx
const [isCollapsed, setIsCollapsed] = useState(false)

className={`... ${isCollapsed ? 'w-16' : 'w-sidebar'}`}
onClick={() => setIsCollapsed(!isCollapsed)}

<SidebarNavList items={navItems} isCollapsed={isCollapsed} />
<TrialBanner {...sidebar.trial} isCollapsed={isCollapsed} />
<UserProfileFooter {...sidebar.user} isCollapsed={isCollapsed} />
```

`src/components/Sidebar/SidebarNavList.tsx`

```tsx
className={`... ${isCollapsed ? 'w-16' : 'w-sidebar'}`}
title={isCollapsed ? item.label : undefined}
{item.badge && !isCollapsed ? ( /* badge */ ) : null}
{item.expandable && !isCollapsed ? ( /* chevron */ ) : null}
```

`src/components/Sidebar/TrialBanner.tsx`

```tsx
if (!active || isCollapsed) return null
```

`src/components/Sidebar/UserProfileFooter.tsx`

```tsx
className={`... ${isCollapsed ? 'w-16' : 'w-sidebar'}`}
title={isCollapsed ? name : ''}
className={`... ${isCollapsed ? 'w-0 overflow-hidden opacity-0' : 'w-auto opacity-100'}`}
```
