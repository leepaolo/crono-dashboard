# Crono Dashboard — Checklist

Replica statica desktop della dashboard Crono. Un solo blocco è interattivo: **Signals**.

Viewport di riferimento: **1440px** di larghezza. L'altezza del frame Figma (750px) è solo l'above the fold: la pagina scorre in verticale, senza altezza fissa.

La dashboard è montata in `App.tsx`. Token in `@theme` dentro `src/index.css`. Icone in `public/img/`, usate con `<img>`.

## Vincoli

- [x] Solo desktop. Nessun breakpoint, media query, hamburger, sidebar collassabile o riflow a colonna singola.
- [x] Icone SVG in `public/img/`, importate con `<img>`. Nessuna libreria di icone generica.
- [x] Nessuno state manager esterno. Bastano `useState` e hook custom.
- [x] Dati mock in `data/*.json`, letti da un hook che simula una fetch (`setTimeout` + stato locale).
- [x] Elementi ripetuti (≥3 con la stessa struttura): un componente riusabile mappato su un array. Blocchi unici (Welcome, header di Replies): componente singolo.
- [x] Token di design (colori, font-size, spacing, radius) in `@theme` dentro `src/index.css`.

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

- [x] `@radix-ui/react-popover` per il menu Action.
- [x] SVG via `<img>` da `public/img/`.
- [x] Shell della pagina: `min-h-svh`, scroll del body, sfondo `--color-canvas`, font Poppins. Griglia a larghezza fissa (sidebar 192 + contenuto) che somma 1440px.
- [x] Shell a due colonne: sidebar + main. Il main è una griglia (Welcome | Replies | Performance) con Today's tasks che copre le prime due, Signals sotto a sinistra e Onboarding sotto a destra.

## 2. Tipi e dati mock

- [x] `src/types/index.ts` con i tipi di nav item, task, signal, metrica, step di onboarding, utente.
- [x] `data/navItems.json`: Dashboard (attivo), Find New, Lists, Templates, Sequences, Tasks, Inbox (badge `24`), Deals, Analytics (chevron). Ogni item: icona, label, badge opzionale, flag attivo, flag espandibile.
- [x] `data/tasks.json`: Overdue `3` (rosa), Pending Manual `10` (giallo), Pending Auto `20` (azzurro, badge `1 error`), Completed `8` (verde). I primi tre hanno chevron; Completed no.
- [x] `data/metrics.json`: Contacts engaged `0/500`, Companies engaged `0/500`, Activities `1000/2000`, Meetings `20/30`, Deals `100/200`, Pipeline `€50K/100K`. Ogni metrica: icona, valore, target.
- [x] `data/signals.json`: almeno le 5 righe visibili, con abbastanza item da far comparire lo scroll interno. Contatore iniziale derivato dalle righe non lette (nel mock è `12`).
- [x] `data/onboarding.json`: Integrations Setup `5 min`, Add new Contact `5 min`, Create your first sequence `10 min`, Add contacts to sequence `5 min`, Run your first task `10 min`.
- [x] Hook `useSignals`: carica il JSON dopo un `setTimeout`, espone lista, stato di loading e le azioni Complete / Delete.

### Forma di un signal

- [x] id, avatar, testo con segmenti (bold / semibold, highlight opzionale), `userId` opzionale verso `users.json`, `tagId` verso `signalTags.json`, flag `inSequence`, data (`Apr 2, 2025`), stato `unread`.

Righe visibili nel mock:

- [x] Robert Smith — role change, tag viola `Role change` + pill `in sequence`.
- [x] Robert Smith — company change, tag `Company change` + pill `in sequence`.
- [x] Robert Smith — role change, solo tag `Role change`.
- [x] Amazon — website view, `2 pages` e `65 sec` in evidenza, tag rosa `Website view`.
- [x] Amazon — stessa riga website view, ripetuta.

## 3. Signals (unico blocco interattivo)

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
- [x] `SignalActionPopover` (Radix): click su Action apre un popover con `Complete` (check verde) e `Delete` (cestino).
- [x] Scegliere Complete o Delete toglie la riga dalla lista unread (la marca processata e la nasconde).
- [x] Il badge scende di 1 a ogni azione (12 → 11 → …).
- [x] Il popover si chiude con click fuori e con Escape (comportamento nativo di Radix). Un solo popover aperto alla volta.
- [x] Lista con altezza massima fissa, scroll verticale interno, scrollbar visibile.
- [x] Stato vuoto: se tutte le righe sono processate, la lista non mostra righe e il badge è `0`.

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

Spec Welcome arrivate (in `@theme` di `src/index.css`):

- Card: 396×142, radius 16px, bordo 1px `--color-action-menu-border` `#E6E9F2`, gap 8px, padding 32px 24px, fondo `--color-surface`. Posizione nel frame (top 16px, left 208px) è la griglia di `App.tsx`: sidebar 192 + gutter 16.
- Titolo `Welcome Alex,`: Poppins 700, 24px / 30px, letter-spacing 0, colore `--color-navy`.
- Descrizione: Poppins 400, 14px / 20px, letter-spacing 0, colore `--color-muted`.

Spec Replies arrivate (in `@theme` di `src/index.css`):

- Card: 396×142, radius 16px, bordo 1px `--color-action-menu-border`, gap 8px, padding 16px, fondo `--color-surface`. Stesso bordo e fondo di Welcome. Posizione nel frame (top 16px, left 612px) è la griglia di `App.tsx`.
- Header: 364×22, `space-between`. Titolo `Replies`: stessi token di Today's tasks (`--text-tasks-title`, `--color-navy`).
- `Open inbox`: stessi token della nav (`--text-nav`, `--color-brand`) più chevron 16px nello stesso colore.
- Corpo: 364×80, radius 12px, gap 16px, padding 16px 24px 16px 16px, fondo `--color-insequenze-bg`.
- Icona mail: 48×48, radius 24px, padding 12px, fondo `--color-replies-icon` `#CEEDED`.
- Numero `24`: Poppins 500, 36px / 44px, colore `--color-replies-figure` `#3E485B`.
- Stack loghi: 104×32, quattro cerchi da 32px sovrapposti di 8px (Reddit, Amazon, McDonald's, Medium).

- [x] `Welcome`: card bianca. Titolo `Welcome Alex,` in navy bold. Sottotitolo grigio: «Here's your performance overview where you can track your daily and monthly KPIs».
- [x] `Replies`: header con titolo `Replies` e link teal `Open inbox >`. Corpo su fondo menta: icona inbox in cerchio, numero `24` grande, stack di 4 avatar sovrapposti (Reddit, Amazon, McDonald's, marchio «M»).
- [x] `TodaysTasks`: titolo `Today's tasks`, poi 4 `TaskStatCard` in riga.
- [x] `TaskStatCard`: numero grande colorato, label, chevron opzionale, badge errore opzionale (`1 error` + triangolo sulla card Pending Auto). Sfondi: rosa, giallo, azzurro, verde.

## 6. Performance

- [x] `PerformancePanel`: titolo `May's performance`, link teal `Edit KPIs` con icona matita.
- [x] Griglia a 2 colonne di `MetricCard`.
- [x] `MetricCard`: icona, label, valore/target (es. `1000/2000`, `€50K/100K`), progress bar nel colore della metrica. Contacts engaged è la prima cella, con icona info.

## 7. Onboarding

- [x] `OnboardingPanel`: titolo `Onboarding`.
- [x] `OnboardingStep` ripetuto 5 volte, separato da divider.
- [x] Ogni step: icona illustrata colorata, titolo, durata a destra in grigio (`5 min` / `10 min`).
- [x] Icone distinte: Integrations, Contact, Sequence, Add contacts, Task.

## 8. Composizione

- [x] I 7 blocchi sono montati in `App.tsx` nella griglia descritta sopra.
- [x] Nessuna media query o layout adattivo.

## Fuori scope

- Responsive, tablet, mobile.
- Pagine diverse dalla dashboard (Find New, Lists, Inbox, ecc.): la nav è solo visiva.
- Collapse della sidebar, Edit KPIs, Open inbox, Upgrade plan: nessun comportamento, solo aspetto.
- State manager, API vere, persistenza delle azioni Signals oltre la sessione.
