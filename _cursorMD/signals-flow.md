# Signals — flusso dati, custom hook, useEffect e guard

Guida di studio per il colloquio. Come i dati passano da `src/data/signals.json` fino ai componenti in `src/components/Signals/`.

In breve: i JSON vengono validati una sola volta dalle guard in `api/signals.ts`. Il custom hook `useSignals` li carica con un `useEffect` e tiene lo stato. `SignalsPanel` è l'unico componente che usa l'hook: passa i dati alle righe e riceve i click tramite callback.

---

## 1. Architettura a livelli

```
┌───────────────────────────────────────────────────────────────┐
│  types/index.ts   (fonte unica di verità per i tipi)           │
│  SIGNAL_TAG_IDS ─► TSignalTagId     ISignal, ISignalView, ...  │
└──────────────┬────────────────────────────────┬───────────────┘
               │ importato da                   │ importato da
               ▼                                ▼
┌──────────────────────┐   ┌─────────────────────────────────────┐
│ lib/guards.ts        │   │ data/*.json  (finto database)       │
│ oneOf(values, label) │   │ signals · users · signalTags        │
└──────────┬───────────┘   └──────────────────┬──────────────────┘
           │                                  │ import statico
           ▼                                  ▼
┌───────────────────────────────────────────────────────────────┐
│ api/signals.ts   (finto backend)                               │
│  ① VALIDA  JSON ──asTagId/asTextWeight──► ISignal[]            │
│  ② INDICIZZA  usersById, tagsById  (Map, ricerca rapida)       │
│  ③ STATO   let currentSignals  (finto database in memoria)     │
│  ④ UNISCE  buildSignalViews ──► { signal, user?, tag }         │
│  ⑤ ESPONE  getSignals · completeSignal · deleteSignal (+300ms) │
└──────────────────────────────┬────────────────────────────────┘
                               │ Promise<ISignalView[]>
                               ▼
┌───────────────────────────────────────────────────────────────┐
│ hooks/useSignals.ts   (stato + logica, niente interfaccia)     │
│  useState ─ views · isLoading · error                          │
│  useEffect([]) ─ carica una volta al montaggio                 │
│  useCallback ─ complete(id) · deleteSignal(id)                 │
│  valore derivato ─ unreadCount                                 │
└──────────────────────────────┬────────────────────────────────┘
                               │ { signals, unreadCount, isLoading,
                               │   error, complete, deleteSignal }
                               ▼
┌───────────────────────────────────────────────────────────────┐
│ components/Signals/SignalsPanel.tsx   (container)              │
│  stato UI locale: openSignalId  (un solo popover aperto)       │
│   ├── SignalsHeader          ◄── unreadCount                   │
│   └── SignalRow ×N           ◄── {...view}, menuOpen           │
│         └── SignalActionPopover (Radix)                        │
│               onComplete / onDelete ──► risalgono al container │
└───────────────────────────────────────────────────────────────┘
      i dati scendono tramite props ▼   ▲ gli eventi risalgono tramite callback
```

---

## 2. `types/index.ts` e `lib/guards.ts`: validare i JSON

**Il problema**: TypeScript importa i JSON con tipi "larghi". `tagId` diventa `string`, non `"role-change" | "company-change" | "website-view"`. Scrivere `as TSignalTagId` compilerebbe, ma non controllerebbe niente: un `"rol-change"` nel JSON passerebbe e romperebbe la UI.

**La soluzione** è in due passi:

```
types/index.ts                          lib/guards.ts
┌──────────────────────────────┐        ┌──────────────────────────┐
│ SIGNAL_TAG_IDS = [...]       │        │ oneOf(values, label)     │
│   as const   ← valori reali  │───────►│  └► (value: string) => T │
│                              │        │     includes? → T        │
│ TSignalTagId =               │        │     altrimenti → throw   │
│  (typeof SIGNAL_TAG_IDS)     │        └────────────┬─────────────┘
│   [number]   ← tipo ricavato │                     │
└──────────────────────────────┘                     ▼
                                api/signals.ts
                                asTagId = oneOf(SIGNAL_TAG_IDS, 'Tag signal')

  "role-change" ──► asTagId ──► TSignalTagId ✓
  "rol-change"  ──► asTagId ──► Error ✗  (si ferma al caricamento, non nella UI)
```

```ts
// types/index.ts
export const SIGNAL_TAG_IDS = ["role-change", "company-change", "website-view"] as const;
export type TSignalTagId = (typeof SIGNAL_TAG_IDS)[number];

// lib/guards.ts
export function oneOf<T extends string>(values: readonly T[], label: string) {
  return (value: string): T => {
    if ((values as readonly string[]).includes(value)) return value as T
    throw new Error(`${label} non valido: ${value}`)
  }
}
```

- **`as const`** mantiene i valori letterali. Senza, l'array sarebbe un semplice `string[]`.
- **`(typeof X)[number]`** ricava il tipo unione dall'array. C'è **una sola fonte**: se aggiungi un tag all'array, tipo e controllo si aggiornano insieme.
- **`oneOf`** è generica: la stessa funzione serve per i tag e per i pesi del testo.
- **`as readonly string[]`** serve perché `.includes()` su un array di letterali non accetta un `string` qualsiasi.
- **`value as T`** qui è sicuro: il controllo è appena stato fatto (`includes` da solo non restringe il tipo).
- Il principio è **"parse, don't validate"**: i dati sporchi diventano tipi sicuri in un unico punto, il confine con l'esterno. Da lì in poi il codice si fida dei tipi.

In produzione useremmo **Zod**: uno schema dà insieme validazione e tipo (`z.infer`), e vale anche per le risposte delle API. Per ora non serve.

---

## 3. `api/signals.ts`: il finto backend

- **Map per utenti e tag**: `usersById.get(id)` trova l'elemento subito, invece di scorrere l'array con `find` per ogni signal.
- **`buildSignalViews`**: unisce signal, user e tag come farebbe il server. `user` è opzionale, perché alcuni signal non hanno `userId`.
- **`let currentSignals`**: lo stato vive nel modulo, quindi complete e delete persistono finché non ricarichi la pagina.
- **`simulateDelay` (300ms)**: rende il mock asincrono come una rete vera, così loading, errori e race condition si gestiscono già adesso.
- **Contratto**: le tre funzioni restituiscono `Promise`. Passando alle API reali cambia **solo questo file**.

### Passaggio alle API reali (a voce, non implementato)

```ts
// .env  →  VITE_API_BASE_URL=https://api.crono.one/v1   (≈ environment.ts di Angular)
const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getSignals(signal?: AbortSignal): Promise<ISignalView[]> {
  const res = await fetch(`${BASE_URL}/signals`, { signal })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}
```

Hook e componenti non cambiano. Le variabili `VITE_*` finiscono nel bundle e sono pubbliche: niente segreti.

---

## 4. Custom hook `useSignals`

Un custom hook è una funzione `use*` che raggruppa stato, effetti e azioni. È l'equivalente di un service Angular con stato, ma **ogni componente che lo chiama ha il suo stato**, non è un singleton.

```
                 useSignals()
┌───────────────────────────────────────────────┐
│ STATO        useState: views, isLoading, error │
│ EFFETTO      useEffect([]) → getSignals()      │
│ AZIONI       useCallback([]):                  │
│                complete(id)     → map          │
│                deleteSignal(id) → filter       │
│ DERIVATO     unreadCount = views.filter(...)   │
│              (calcolato, mai salvato)          │
└───────────────────────────────────────────────┘
```

- **`unreadCount` è derivato**: si calcola a ogni render dalla lista, quindi non può andare fuori sincrono.
- **`useCallback([])`** dà alle azioni un riferimento stabile tra un render e l'altro.
- **`setViews(current => ...)`**, la forma a funzione, lavora sempre sull'ultimo stato, anche con più azioni in rapida successione.
- Le azioni **non** stanno in un `useEffect`: sono gestori di eventi. Gli effetti servono a sincronizzarsi con sistemi esterni, non a reagire ai click.

---

## 5. `useEffect`: ciclo di vita

```ts
useEffect(() => {
  // corpo: parte dopo il montaggio
  return () => {
    // cleanup: parte allo smontaggio (o prima della prossima esecuzione)
  }
}, [/* dipendenze */])
```

| Dipendenze | Quando parte | Equivalente Angular |
|---|---|---|
| `[]` | una volta, al montaggio | `ngOnInit` |
| `[a, b]` | al montaggio e quando `a` o `b` cambiano | `ngOnChanges` |
| nessun array | a ogni render | (da evitare) |
| cleanup (`return`) | smontaggio / prima di rieseguire | `ngOnDestroy` |

**StrictMode** (solo in sviluppo): React monta, smonta e rimonta ogni componente, così l'effetto e il cleanup vengono eseguiti due volte. Serve a far emergere effetti che non si puliscono bene. In produzione non succede.

---

## 6. `isMounted` e `AbortController`

### Il problema che risolvono

Una richiesta asincrona può finire **dopo** che il componente non ha più bisogno della risposta:

1. **Smontaggio**: l'utente cambia pagina prima che la risposta arrivi.
2. **Race condition**: l'effetto dipende da un parametro (es. `[filter]`). Parte la richiesta A, poi il filtro cambia e parte B. Se A arriva **dopo** B, sovrascrive i dati giusti con quelli vecchi.
3. **StrictMode**: il primo effetto viene annullato subito, ma la sua richiesta è già partita.

```
 RACE CONDITION (senza protezione)
 filter="a" ─► richiesta A ───────────────────────► risposta A ─► setViews(A) ✗ dati vecchi!
 filter="b" ─────────► richiesta B ──► risposta B ─► setViews(B)
```

### `isMounted`: ignorare la risposta (quello che usiamo oggi)

```ts
useEffect(() => {
  let isMounted = true               // ogni esecuzione ha la SUA variabile (closure)

  signalsApi.getSignals()
    .then((data) => {
      if (isMounted) setViews(data)  // applica solo se questo effetto è ancora valido
    })

  return () => {
    isMounted = false                // il cleanup "spegne" questa esecuzione
  }
}, [])
```

```
 montaggio ─► effetto: isMounted=true ─► getSignals() ──┐
 smontaggio ─► cleanup: isMounted=false                 │
                                          ...300ms ─────┴─► then ─► isMounted? ✗ ignorata
```

- **Come funziona**: per closure. `.then` e cleanup condividono la stessa variabile locale; quando il cleanup la mette a `false`, la risposta di quella esecuzione viene scartata.
- **Pregi**: semplice, funziona con **qualsiasi** Promise (anche il nostro mock), nessuna modifica all'API.
- **Limite**: la richiesta **continua** comunque. Rete, CPU e memoria vengono consumate fino alla fine, e la risposta viene buttata via.
- Nella documentazione React la stessa variabile si chiama `ignore` (`let ignore = false`). È solo un nome diverso per lo stesso schema.
- Da React 18 non c'è più il warning "can't perform a React state update on an unmounted component". Il motivo principale per usare questo schema oggi è la **race condition**, non lo smontaggio.

### `AbortController`: annullare davvero la richiesta

È un'API standard del browser, non di React. Il controller crea un `signal`; chi riceve il signal (es. `fetch`) si ferma quando si chiama `abort()`.

```ts
const controller = new AbortController()
fetch(url, { signal: controller.signal })  // ascolta il signal
controller.abort()                          // fetch si ferma e la Promise
                                            // viene rifiutata con un DOMException 'AbortError'
```

Nell'hook:

```ts
useEffect(() => {
  const controller = new AbortController()

  signalsApi.getSignals(controller.signal)
    .then((data) => {
      setViews(data)
      setIsLoading(false)
    })
    .catch((err) => {
      if (err instanceof DOMException && err.name === 'AbortError') return  // non è un errore vero
      setError(err instanceof Error ? err : new Error(String(err)))
      setIsLoading(false)
    })

  return () => controller.abort()
}, [])
```

```
 montaggio ─► effetto: new AbortController ─► fetch(signal) ──┐
 smontaggio ─► cleanup: controller.abort() ───────────────────┤ la rete si ferma
                                                              └─► catch(AbortError) ─► ignorata
```

- **Pregi**: la richiesta HTTP viene **cancellata** davvero (la vedi come "canceled" in DevTools → Network). Risparmia banda e server, e risolve race condition e smontaggio insieme.
- **Obbligo**: nel `catch` bisogna **ignorare `AbortError`**, altrimenti ogni cambio pagina mostrerebbe un errore finto.
- **Limite**: funziona solo se chi esegue il lavoro **supporta il signal** (`fetch`, axios, TanStack Query). Una Promise qualsiasi, come il nostro `setTimeout`, lo ignora.

### Confronto

| | `isMounted` | `AbortController` |
|---|---|---|
| Cosa fa | ignora la risposta | annulla la richiesta |
| La rete si ferma? | no | sì |
| Serve modificare l'API? | no | sì, deve accettare `signal` |
| Funziona con il mock attuale? | sì | solo rendendo il mock "annullabile" |
| Gestione errori | nessuna in più | ignorare `AbortError` nel `catch` |
| Race condition | risolta | risolta |
| Quando usarlo | Promise non annullabili | `fetch` / HTTP reale |

### Dovrei usare `AbortController` al posto di `isMounted`?

**Oggi no, con il backend reale sì.**

- Il nostro "backend" è un `setTimeout` + array in memoria: non c'è nessuna richiesta di rete da annullare. Per usare `AbortController` dovremmo far accettare un `signal` a `getSignals` e scrivere un `simulateDelay` che rifiuta la Promise su `abort`. Sarebbe codice in più per simulare un vantaggio che il mock non ha.
- `isMounted` è corretto per una Promise non annullabile, ed è lo schema indicato nella documentazione React.
- Quando `api/signals.ts` passerà a `fetch`, il cambio è naturale: `getSignals(signal?: AbortSignal)` passa il signal a `fetch`, e nell'hook si sostituisce `isMounted` con `controller.abort()` (codice sopra).

Frase da colloquio:

> "Ho usato un flag `isMounted` perché il mock è una Promise non annullabile: ignoro le risposte arrivate dopo il cleanup. Con `fetch` reale passerei ad `AbortController`, così la richiesta viene cancellata davvero, e ignorerei l'`AbortError` nel catch. Con TanStack Query non servirebbe nemmeno: passa lui il `signal` alla `queryFn` e annulla da solo."

### Le azioni (`complete`, `deleteSignal`) hanno bisogno di protezione?

Non nello stesso modo. Sono mutazioni avviate da un click: di solito **non** si annullano quando il componente si smonta, perché l'utente si aspetta che il delete avvenga comunque. Il rischio vero è il **doppio click** durante l'attesa, che si risolve disabilitando il pulsante mentre l'azione è in corso (stato `pendingIds`).

---

## 7. Cosa succede quando clicchi "Delete"

```
 Click "Delete"
      │
      ▼
 SignalActionPopover ── onDelete() ─► SignalRow ─► SignalsPanel
                                                     │ deleteSignal(id)       (dall'hook)
                                                     │ setOpenSignalId(null)  → chiude il popover
                                                     ▼
 useSignals.deleteSignal(id)
      │ await signalsApi.deleteSignal(id) ──► api: 300ms, filtra currentSignals
      │   ✓ setViews(current => current.filter(...))
      │   ✗ setError(err)
      ▼
 React ri-renderizza ─► riga rimossa, unreadCount ricalcolato ─► badge aggiornato
```

"Complete" segue lo stesso percorso: l'API restituisce la view aggiornata con `unread: false` e l'hook sostituisce quella riga con `map`. La riga resta visibile con `opacity-60`, senza pallino, e il menu non mostra più "Complete".

---

## 8. Divisione dei compiti

| File | Compito | Equivalente Angular |
|---|---|---|
| `types/index.ts` | Tipi e costanti, fonte unica | `models/*.ts` |
| `lib/guards.ts` | Validazione a runtime riusabile | funzioni di utilità / validator |
| `data/*.json` | Finto database | file mock / `in-memory-web-api` |
| `api/signals.ts` | Accesso ai dati asincrono | service con `HttpClient` |
| `hooks/useSignals.ts` | Stato + ciclo di vita | service con stato + `ngOnInit`/`ngOnDestroy` |
| `SignalsPanel.tsx` | Container (dati + stato UI) | componente "smart" |
| `SignalRow`, `SignalActionPopover`, `SignalsHeader` | Solo presentazione | componenti con `@Input`/`@Output` |

---

## 9. Punti da dire al colloquio

### Pregi

1. **Livelli separati**: JSON → api → hook → container → presentazione. Ogni livello conosce solo quello sotto.
2. **Validazione nel punto d'ingresso** con una sola fonte di verità (`SIGNAL_TAG_IDS` → tipo + guard).
3. **Contratto asincrono realistico**: il mock restituisce Promise con attesa, quindi loading, errori e race condition sono già gestiti.
4. **Stato derivato**: `unreadCount` è calcolato, non duplicato.
5. **Stato UI separato dai dati**: `openSignalId` vive nel container, non nell'hook.
6. **Accessibilità**: Radix Popover (focus, Esc, ARIA), `aria-busy`, `aria-label`, `alt=""` sulle immagini decorative.

### Limiti (da citare tu per primo)

| Problema | Soluzione |
|---|---|
| Un solo `error`: se un'azione fallisce, sparisce l'intera lista | Separare errore di caricamento da errore delle azioni (toast) |
| Nessun aggiornamento ottimistico: la UI aspetta 300ms | Aggiornare subito, annullare se fallisce |
| `isLoading` non si vede (solo `aria-busy`) | Skeleton delle righe |
| Nessun messaggio a lista vuota | "Nessun signal" quando la lista è vuota |
| `dateTime="2025-04-02"` fisso in `SignalRow` | ISO dal backend, formattato con `Intl.DateTimeFormat` |
| `isMounted` non annulla la richiesta | `AbortController` quando si passa a `fetch` |
| Doppio click possibile durante l'attesa | Stato `pendingIds` e pulsante disabilitato |
| Unione dei dati lato client | Farla sul backend |
| Nessun test | Vitest: `oneOf`, `buildSignalViews`, `useSignals` con `renderHook` |

### Passo successivo

> "Per un prodotto reale sostituirei `useSignals` con **TanStack Query**: `useQuery` per il caricamento e `useMutation` con `onMutate` per l'aggiornamento ottimistico. Cache, retry, annullamento tramite `signal` e deduplicazione sarebbero già inclusi. Il livello `api/` resterebbe identico: è proprio per questo che è separato."
