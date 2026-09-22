# Crono Dashboard — Checklist

Replica statica desktop della dashboard Crono. Un solo blocco è interattivo: **Signals**.

Viewport di riferimento: **1440px** di larghezza, contenitore centrato. L'altezza del frame Figma (750px) è solo l'above the fold: la pagina scorre in verticale, senza altezza fissa.

Stato attuale del repo: Vite + React 19 + TypeScript + Tailwind 4 già installati. Lo scaffold dei file c'è (shell vuoti, senza UI né logica). `App.tsx` è ancora il placeholder e non importa i componenti. Mancano Radix, le icone SVG e il contenuto di dati, tipi e componenti.

## Vincoli

- [ ] Solo desktop. Nessun breakpoint, media query, hamburger, sidebar collassabile o riflow a colonna singola.
- [ ] Icone esportate da Figma come SVG originali in `src/assets/icons/`. Non usare lucide o altre librerie generiche.
- [ ] Nessuno state manager esterno. Bastano `useState` e hook custom.
- [ ] Dati mock in `data/*.json`, letti da un hook che simula una fetch (`setTimeout` + stato locale).
- [ ] Elementi ripetuti (≥3 con la stessa struttura): un componente riusabile mappato su un array. Blocchi unici (Welcome, header di Replies): componente singolo.
- [ ] Token di design (colori, font-size, spacing, radius) centralizzati. Il prompt indica `tailwind.config.ts`; il progetto usa Tailwind 4, che di default tiene i token in `@theme` dentro `src/index.css`. Prima di partire, scegliere un solo posto e usarlo per tutti i valori. Finché le spec esatte non arrivano, stimare dagli screenshot e rifinire dopo.
- [ ] Verifica visiva solo a 1440px, confrontando con `Dashboard_Ultra` e `Dashboard_Ultra-Hovers`.

## Layout da replicare

Griglia a due zone: sidebar fissa a sinistra, contenuto a destra.

```
[ Sidebar ]  [ Welcome              ] [ Replies ] [ May's performance ]
             [ Today's tasks (4 card)            ] [                   ]
             [ Signals                           ] [ Onboarding        ]
```

Sfondo pagina grigio chiaro. Card bianche con radius ampio e ombra leggera. Il pannello Performance occupa la colonna destra per l'altezza di Welcome + Today's tasks. Onboarding sta sotto Performance, accanto a Signals.

---

## 0. Scaffold dei file

Fatto. I componenti esportano una funzione che ritorna `null`. I JSON sono array vuoti. `types/index.ts` e `useSignals.ts` non hanno ancora tipi né fetch. `App.tsx` non monta nulla di tutto questo.

- [x] `src/components/Sidebar/` — `Sidebar.tsx`, `SidebarNavList.tsx`, `TrialBanner.tsx`, `UserProfileFooter.tsx`
- [x] `src/components/Welcome/Welcome.tsx`
- [x] `src/components/Replies/Replies.tsx`
- [x] `src/components/TodaysTasks/` — `TodaysTasks.tsx`, `TaskStatCard.tsx`
- [x] `src/components/Signals/` — `SignalsPanel.tsx`, `SignalsHeader.tsx`, `SignalRow.tsx`, `SignalActionPopover.tsx`
- [x] `src/components/Performance/` — `PerformancePanel.tsx`, `MetricCard.tsx`
- [x] `src/components/Onboarding/` — `OnboardingPanel.tsx`, `OnboardingStep.tsx`
- [x] `src/data/` — `signals.json`, `navItems.json`, `metrics.json`, `tasks.json`, `onboarding.json`
- [x] `src/hooks/useSignals.ts`
- [x] `src/types/index.ts`

## 1. Setup

- [ ] Installare `@radix-ui/react-popover` (oppure `dropdown-menu`) per il menu Action.
- [ ] Decidere come importare gli SVG: `vite-plugin-svgr` se serve ricolorare via CSS, altrimenti `<img>`.
- [ ] Creare `src/assets/icons/` e metterci gli SVG esportati da Figma.
- [ ] Impostare lo shell della pagina: contenitore 1440px centrato, `min-h-screen`, scroll del body. Sfondo pagina e font di base.
- [ ] Shell a due colonne: sidebar + main. Il main è una griglia a 3 colonne (Welcome | Replies | Performance) con Today's tasks che copre le prime due, Signals sotto a sinistra e Onboarding sotto a destra.

## 2. Tipi e dati mock

- [ ] `src/types/index.ts` con i tipi di nav item, task, signal, metrica, step di onboarding, utente. Fatti nav item, trial, utente e signal. Mancano task, metrica, step.
- [x] `data/navItems.json`: Dashboard (attivo), Find New, Lists, Templates, Sequences, Tasks, Inbox (badge `24`), Deals, Analytics (chevron). Ogni item: icona, label, badge opzionale, flag attivo, flag espandibile.
- [ ] `data/tasks.json`: Overdue `3` (rosa), Pending Manual `10` (giallo), Pending Auto `20` (azzurro, badge `1 error`), Completed `8` (verde). I primi tre hanno chevron; Completed no.
- [ ] `data/metrics.json`: Contacts engaged `0/500`, Companies engaged `0/500`, Activities `1000/2000`, Meetings `20/30`, Deals `100/200`, Pipeline `€50K/100K`. Ogni metrica: icona, colore della progress bar, valore, target.
- [x] `data/signals.json`: almeno le 5 righe visibili, con abbastanza item da far comparire lo scroll interno. Contatore iniziale derivato dalle righe non lette (nel mock è `12`).
- [ ] `data/onboarding.json`: Integrations Setup `5 min`, Add new Contact `5 min`, Create your first sequence `10 min`, Add contacts to sequence `5 min`, Run your first task `10 min`.
- [ ] Hook `useSignals`: carica il JSON dopo un `setTimeout`, espone lista, stato di loading e le azioni Complete / Delete.

### Forma di un signal

- [x] id, avatar, testo con segmenti (bold / semibold, highlight opzionale), `userId` opzionale verso `users.json`, `tagId` verso `signalTags.json`, flag `inSequence`, data (`Apr 2, 2025`), stato `unread`.

Righe visibili nel mock:

- [x] Robert Smith — role change, tag viola `Role change` + pill `in sequence`.
- [x] Robert Smith — company change, tag `Company change` + pill `in sequence`.
- [x] Robert Smith — role change, solo tag `Role change`.
- [x] Amazon — website view, `2 pages` e `65 sec` in evidenza, tag rosa `Website view`.
- [x] Amazon — stessa riga website view, ripetuta.

## 3. Signals (unico blocco interattivo)

Da fare per primo: è la funzionalità che viene valutata.

Spec header arrivate (in `@theme` di `src/index.css`):

- Header: 800×52, gap 4px, padding orizzontale 16px.
- Wrapper titolo + badge: 87×24, gap 6px.
- Titolo `Signals`: Poppins 600, 14px / 22px, letter-spacing 0, colore `--color-ink`.
- Badge: 28×24, padding 3px 8px, radius 12px, gap 10px. Fondo `--color-accent`, testo `--color-surface`. Il numero è `unread.length` (mock `12`). Font del numero allineato al titolo (14px / 600); line-height 18px per stare nel box da 24px.
- Sottotitolo: Poppins 400, 14px / 24px, letter-spacing 0, colore `--color-muted`.

Spec riga (`SignalRow`, token in `@theme`):

- I tre tag sono un catalogo in `src/data/signalTags.json`. Il colore non sta nel JSON: l'id del tag è il nome della variabile (`--color-role-change` `#8846DC`, `--color-company-change` `#3B85E8`, `--color-website-view` `#E769CB`).
- `in sequence` non è uno di quei tag. È il flag `inSequence` sul signal. Testo `--color-insequenze-font` `#0A9B94`, fondo `--color-insequenze-bg` `#E9F8F8`.
- Robert Smith sta in `src/data/users.json` (ruolo `Sales`). I signal che lo riguardano hanno `userId`: il nome in bold viene dall'utente, il resto della frase è semibold.
- Riga: 796×40, gap 10px, padding orizzontale 16px. Wrapper 764×40, gap 48px. Logo + testo 549×40, gap 16px. Testo + tag 501×40, gap 2px. Data + Action 167×32, gap 16px.
- Nome: Poppins 700, 14px / 22px. Corpo: Poppins 600, 14px / 22px. Tag e data: 12px / 16px, ricavati dal box da 40px (22 + 2 + 16).
- Action: 90×32, padding 7px 16px, radius 34px, fondo `--color-action-button` `#1EBAB2`, testo surface.

- [x] `SignalsHeader`: titolo `Signals`, badge giallo con il conteggio, sottotitolo «Never miss a single opportunity: check out your top signals from your 1st-degree LinkedIn connections.»
- [x] Il badge è `unread.length`. Nessuno state separato per il numero.
- [x] `SignalRow`: avatar, testo con parti in bold/colore, tag pill, data grigia, bottone pill `Action` teal.
- [ ] `SignalActionPopover` (Radix): click su Action apre un popover con `Complete` (check verde) e `Delete` (cestino). Sfondo chiaro/menta, come in `Dashboard_Ultra-Hovers`.
- [ ] Scegliere Complete o Delete toglie la riga dalla lista unread (o la marca processata e la nasconde).
- [ ] Il badge scende di 1 a ogni azione (12 → 11 → …).
- [ ] Il popover si chiude con click fuori e con Escape (comportamento nativo di Radix). Un solo popover aperto alla volta.
- [ ] Lista con altezza massima fissa, scroll verticale interno, scrollbar visibile. Nel crop è a destra; il prompt dice «a sinistra del contenuto». Allinearsi al frame Figma quando si rifinisce.
- [ ] Stato vuoto: se tutte le righe sono processate, la lista non mostra righe e il badge è `0`.

### Verifica Signals

- [ ] Click su Action della seconda riga: si apre il popover sotto/accanto al bottone.
- [ ] Complete: la riga sparisce e il badge decrementa.
- [ ] Delete su un'altra riga: stesso effetto.
- [ ] Escape e click fuori chiudono il popover senza toccare la lista.
- [ ] Lo scroll interno funziona se le righe superano l'altezza massima.
- [ ] Ricaricando la pagina, i dati mock tornano allo stato iniziale.

## 4. Sidebar

Spec arrivate (in `@theme` di `src/index.css`):

- Header logo + freccia: 192×72, `space-between`, padding 22px 8px 22px 16px. Cerchio freccia: 24×24, radius 12px, fondo `#F5F7F9`.
- `SidebarNavList`: 192×416, gap 16px. Ogni voce è 32px (9×32 + 8×16 = 416).
- `TrialBanner`: 176×64, radius 8px. Si renderizza solo se `sidebar.json` → `trial.active`.
- `UserProfileFooter`: wrapper 192×72, gap 16px. Dentro, riga 192×52, gap 8px, padding 4px 12px, radius 29px.
- Label nav e titolo trial: Poppins 500, 14px / 18px, letter-spacing 0. Nav attivo `#0A9B94`, default `#7A8395`.
- «Upgrade plan»: 116×24, top 32px, left 8px, gap 4px, padding 4px 8px, radius 4px. Poppins 500, 12px / 16px, letter-spacing 0.
- Nome e ruolo nel footer: Poppins 400, 14px / 24px, letter-spacing 0.
- Colori ancora stimati dallo screenshot: testo `#303346`, badge e bottone `#F5BC09`, fondo trial `#FEF4D3`.
- Icone in `public/img/`. Lists, Analytics e il chevron non erano nel repo: SVG ricostruiti sullo stile degli originali, da sostituire con l'export Figma.

- [x] `Sidebar`: colonna bianca, logo fulmine + wordmark `crono` in teal, bottone `«` in alto a destra (solo visivo, non collassa).
- [x] `SidebarNavList`: lista data-driven. Dashboard attivo in teal. Inbox con badge arancione `24`. Analytics con chevron. Icone SVG originali, grigie; l'item attivo in teal.
- [x] `TrialBanner`: card gialla condizionale. Testo «Trial ends in 2 days», bottone «Upgrade plan» con lucchetto, motivo decorativo a destra. Renderizzarla solo se il flag trial è attivo nei dati.
- [x] `UserProfileFooter`: avatar circolare con fulmine, nome `William Robertson`, ruolo `Sales`.

## 5. Welcome, Replies, Today's tasks

- [ ] `Welcome`: card bianca. Titolo `Welcome Alex,` in navy bold. Sottotitolo grigio: «Here's your performance overview where you can track your daily and monthly KPIs».
- [ ] `Replies`: header con titolo `Replies` e link teal `Open inbox >`. Corpo su fondo menta: icona inbox in cerchio, numero `24` grande, stack di 4 avatar sovrapposti (Reddit, Amazon, McDonald's, marchio «M»).
- [ ] `TodaysTasks`: titolo `Today's tasks`, poi 4 `TaskStatCard` in riga.
- [ ] `TaskStatCard`: numero grande colorato, label, chevron opzionale, badge errore opzionale (`1 error` + triangolo sulla card Pending Auto). Sfondi: rosa, giallo, azzurro, verde.

## 6. Performance

- [ ] `PerformancePanel`: titolo `May's performance`, link teal `Edit KPIs` con icona matita.
- [ ] Griglia a 2 colonne di `MetricCard`.
- [ ] `MetricCard`: icona, label, valore/target (es. `1000/2000`, `€50K/100K`), progress bar nel colore della metrica.
- [ ] Allineare il primo slot al frame corretto. Il crop isolato lascia vuota la cella in alto a sinistra e mette Companies engaged da sola a destra. `Dashboard_Ultra` invece mostra Contacts engaged `0/500` in quella cella, e l'hover mostra un'icona info. Seguire il prompt (cella vuota) finché non arriva la spec; tenere Contacts engaged nei dati così si può riaccendere.
- [ ] Ordine nel crop: riga 1 Companies engaged; riga 2 Activities (viola) | Meetings (oro); riga 3 Deals (rosa) | Pipeline (verde).

## 7. Onboarding

- [ ] `OnboardingPanel`: titolo `Onboarding`.
- [ ] `OnboardingStep` ripetuto 5 volte, separato da divider.
- [ ] Ogni step: icona illustrata colorata, titolo, durata a destra in grigio (`5 min` / `10 min`).
- [ ] Icone distinte: Integrations (link/puzzle), Contact (persona + valigetta), Sequence (razzo), Add contacts (persona +), Task (checkbox).

## 8. Composizione e rifinitura

- [ ] Montare i 7 blocchi in `App.tsx` nella griglia descritta sopra.
- [ ] Passare i token mano a mano che arrivano, con la sintassi `NomeComponente/elemento: padding, font-size/peso, colore, radius`, e sostituire i placeholder.
- [ ] Confrontare a 1440px con `Dashboard_Ultra`: spazi tra card, radius, pesi dei font, colori dei tag e delle progress bar.
- [ ] Confrontare l'hover di Action con `Dashboard_Ultra-Hovers`.
- [ ] Controllare che non ci siano media query o layout adattivi introdotti per sbaglio.

## Fuori scope

- Responsive, tablet, mobile.
- Pagine diverse dalla dashboard (Find New, Lists, Inbox, ecc.): la nav è solo visiva.
- Collapse della sidebar, Edit KPIs, Open inbox, Upgrade plan: nessun comportamento, solo aspetto.
- State manager, API vere, persistenza delle azioni Signals oltre la sessione.
