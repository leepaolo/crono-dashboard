# Crono Dashboard — Static Screen (React/TS/Tailwind)

## Contesto

Replica statica della dashboard "Crono" a partire da Figma. Assignment valutato anche sulla **fedeltà visiva** al design. Un solo blocco richiede interazione reale: **Signals**.

**Scope: solo desktop.** Le specifiche non richiedono responsive/mobile — non implementare breakpoint, media query o layout adattivi per tablet/mobile. Non investire tempo su hamburger menu, sidebar collassabile su mobile, o riflow delle card in colonna singola.

**Viewport di riferimento (da Figma Dev Mode): 1440px di larghezza.** L'altezza del frame (750px) è solo la porzione "above the fold" mostrata nel mockup — il contenuto scrolla oltre (vedi frame "Dashboard_Ultra-Hovers" che segue). Non fissare l'altezza della pagina a 750px: usare flow naturale del contenuto (altezza minima `100vh` se serve riempire lo schermo, poi scroll verticale del body/main). Il layout può assumere `width: 1440px` come contenitore centrato, senza necessità di adattarsi a larghezze diverse.

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- Radix UI (`@radix-ui/react-popover` o `dropdown-menu`) per il tooltip Action
- **Icone: esportate come SVG originali da Figma** (non libreria generica tipo lucide-react), per fedeltà 1:1 su stile e colori — in particolare Nav Bar, Onboarding (icone illustrate colorate) e avatar/loghi in Signals. Salvate in `src/assets/icons/` e importate come componenti React (`vite-plugin-svgr`) o `<img src=".../icon.svg" />` a seconda della necessità di controllo del colore via CSS.
- Nessun state manager esterno (Redux/Zustand non necessari): `useState` / hook custom bastano
- Dati mock in `data/*.json`, caricati via hook che simula una fetch (`setTimeout` + stato locale) — pattern "API-ready" anche se lo screen è statico

## Struttura cartelle proposta

```
src/
  components/
    Sidebar/
      Sidebar.tsx
      SidebarNavList.tsx
      TrialBanner.tsx
      UserProfileFooter.tsx
    Welcome/
      Welcome.tsx
    Replies/
      Replies.tsx
    TodaysTasks/
      TodaysTasks.tsx
      TaskStatCard.tsx
    Signals/
      SignalsPanel.tsx
      SignalsHeader.tsx
      SignalRow.tsx
      SignalActionPopover.tsx
    Performance/
      PerformancePanel.tsx
      MetricCard.tsx
    Onboarding/
      OnboardingPanel.tsx
      OnboardingStep.tsx
  data/
    signals.json
    navItems.json
    metrics.json
    tasks.json
    onboarding.json
  hooks/
    useSignals.ts
  types/
    index.ts
  App.tsx
```

## Principio guida per i componenti

**Componente riusabile + array di dati** ogni volta che nel Figma compaiono ≥3 elementi con la stessa struttura visiva che cambiano solo nei valori:
- `TaskStatCard` → mappato su 4 task (Overdue, Pending Manual, Pending Auto, Completed)
- `MetricCard` → mappato su 6 metriche (Contacts engaged, Companies engaged, Activities, Meetings, Deals, Pipeline)
- `OnboardingStep` → mappato su 5 step
- `SignalRow` → mappato su N signal

**Componente singolo/inline** per i blocchi unici non ripetuti (Welcome, Replies header).

## Componenti principali (7 blocchi dal Figma)

1. **Nav Bar** (sidebar sinistra): logo, lista nav data-driven (icona + label + badge opzionale, item attivo evidenziato), banner "Trial ends in 2 days" come componente separato e condizionale, footer con utente loggato (nome + ruolo).
2. **Welcome**: card statica con titolo + sottotitolo.
3. **Replies**: card con counter + stack di avatar.
4. **Today's tasks**: 4 card colorate (rosso/giallo/blu/verde), una con badge errore ("1 error").
5. **Signals** (interattivo — vedi sotto).
6. **Performance ("May's performance")**: griglia 2 colonne di 6 metriche con progress bar, header con link "Edit KPIs". Nota Figma: il primo slot della colonna sinistra è vuoto nella prima riga (Companies engaged è da sola a destra in alto).
7. **Onboarding**: lista di step con icona, titolo, durata stimata.

## Requisito funzionale obbligatorio — Signals

- Ogni riga: avatar, testo con parti bold/colorate, tag pillola (es. "Role change", tag secondario "In sequence"), data, bottone pill "Action" (teal).
- Click su **Action** → apre un popover/tooltip con due opzioni: **Complete** (icona check) e **Delete** (icona cestino).
- Selezionare una delle due opzioni:
  - rimuove/segna la riga come processata (fuori dalla lista "unread")
  - **decrementa il badge contatore accanto al titolo "Signals"** (es. da 12 a 11)
- Il contatore deve essere **derivato** dallo stato dei signal (`unread.length`), non uno state separato, per evitare disallineamenti.
- Popover chiudibile con click esterno / Escape (gestito nativamente da Radix).
- Lista con scroll verticale interno (altezza max fissa) e scrollbar visibile a sinistra del contenuto come da Figma.

## Design tokens

Colori, font-size, padding, margin **non sono ancora tutti noti**: verranno forniti progressivamente componente per componente durante lo sviluppo, con la sintassi:

```
NomeComponente/elemento: padding Xpx Ypx, font-size Npx/peso, colore #HEX, radius Xpx
```

Centralizzare ogni valore ricevuto in `tailwind.config.ts` (`theme.extend.colors`, `fontSize`, `spacing`) invece di usare valori arbitrari inline, così i token sono riusabili anche in componenti simili non ancora specificati. Per i componenti ancora privi di spec esatta, usare valori stimati dagli screenshot come placeholder e rifinire in un secondo passaggio.

## Ordine di sviluppo

1. Setup progetto (Vite + TS + Tailwind + Radix)
2. `types/` + `data/*.json` mock
3. **Signals** completo (funzionalità core valutata)
4. Sidebar / Nav Bar
5. Welcome, Replies, Today's tasks
6. Performance
7. Onboarding
8. Rifinitura pixel-perfect (colori, font, spacing) man mano che arrivano le spec

## Nota

Nessun requisito di responsive design in questa fase: sviluppo e QA solo su viewport desktop.
