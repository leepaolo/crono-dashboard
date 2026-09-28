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
