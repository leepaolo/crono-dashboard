# Review feedback

## N1. Complete e Delete hanno lo stesso effetto visibile

La lista mostra solo `unread: true`. Complete mette `unread: false` e la riga sparisce, come Delete.

Atteso: Complete lascia la riga e toglie il pallino. Delete la rimuove. Il badge resta `unread.length`.

`signals` deve essere `views`. Il filtro unread solo per `unreadCount`.

`signal-10`, `signal-11`, `signal-12` hanno `unread: false`: non comparivano.

### Modifiche

`src/hooks/useSignals.ts` espone tutte le view. Il badge resta il conteggio degli unread.

```ts
const unreadCount = views.filter((view) => view.signal.unread).length

return {
  signals: views,
  unreadCount,
}
```

`src/components/Signals/SignalRow.tsx`: riga letta con `opacity-60`. Passa `isRead` al menu.

```tsx
className={`... ${signal.unread ? '' : 'opacity-60'}`}
isRead={!signal.unread}
```

`src/components/Signals/SignalActionPopover.tsx`: se la riga è letta, Complete non c'è. Resta Delete.

```tsx
{!isRead ? (
  <button type="button" onClick={onComplete}>Complete</button>
) : null}
```

### Comportamento corretto

| Azione | Prima (BUG) | Ora (CORRETTO) |
| --- | --- | --- |
| Complete unread signal | Segnale sparisce | Segnale rimane visibile, opacità 60%, solo Delete disponibile |
| Complete read signal | N/A (già nascosto) | Bottone "Complete" non mostrato |
| Delete any signal | Segnale rimosso | Segnale rimosso (comportamento invariato) |
| Unread counter | Corretto | Corretto (sempre derivato) |


------------------------------------------------------------------------------------------------------------------------------------

## N2. I signal passano da un API finto

`SignalsPanel` non legge il JSON. Chiama l'hook, l'hook chiama `src/api/signals.ts`. Lo stato sta in `currentSignals`.

1. Mount: `getSignals` aspetta 300ms e restituisce tutte le view.
2. Complete: `completeSignal` mette `unread: false` e ritorna la view. L'hook sostituisce la riga.
3. Delete: `deleteSignal` toglie l'id. L'hook toglie la riga.
4. Errore in fetch: il pannello mostra il messaggio al posto della lista.

Il filtro di N1 non c'è più: l'hook espone `signals: views`. Complete aggiorna la riga e la lascia in lista.

### Snippet

`src/api/signals.ts`

```ts
let currentSignals = [...signals]

export async function getSignals(): Promise<ISignalView[]> {
  await simulateDelay()
  return buildSignalViews(currentSignals)
}

export async function completeSignal(id: string): Promise<ISignalView> {
  await simulateDelay()
  currentSignals[signalIndex] = { ...currentSignals[signalIndex], unread: false }
  return buildSignalViews([currentSignals[signalIndex]])[0]
}

export async function deleteSignal(id: string): Promise<void> {
  await simulateDelay()
  currentSignals = currentSignals.filter((s) => s.id !== id)
}
```

`src/components/Signals/SignalsPanel.tsx`

```tsx
const { signals, unreadCount, isLoading, error, complete, deleteSignal } = useSignals()

{error ? (
  <p>Errore nel caricamento dei signals: {error.message}</p>
) : (
  <ul>
    {signals.map((view) => (
      <SignalRow
        onComplete={() => { complete(view.signal.id); setOpenSignalId(null) }}
        onDelete={() => { deleteSignal(view.signal.id); setOpenSignalId(null) }}
      />
    ))}
  </ul>
)}
```

------------------------------------------------------------------------------------------------------------------------------------

## N3. La sidebar collassa, ma è fuori scope

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

------------------------------------------------------------------------------------------------------------------------------------

## N4. Claude può fare commit senza conferma

`.claude/settings.local.json` è nuovo e non tracciato. Non è in `.gitignore`.

Autorizza `git add` e `git commit` senza chiedere.

### Snippet

`.claude/settings.local.json`

```json
{
  "permissions": {
    "allow": ["Bash(git add:*)", "Bash(git commit:*)"]
  }
}
```
