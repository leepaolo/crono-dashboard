# Crono Dashboard — Checklist

Replica statica desktop della dashboard Crono. Un solo blocco è interattivo: **Signals**.

Viewport di riferimento: **1440px** di larghezza, contenitore centrato. L'altezza del frame Figma (750px) è solo l'above the fold: la pagina scorre in verticale, senza altezza fissa.

Stato attuale del repo: Vite + React 19 + TypeScript + Tailwind 4 già installati. `App.tsx` è ancora il placeholder. Mancano Radix, le icone SVG, i dati mock e tutti i componenti.

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

## 0. Setup

- [ ] Installare `@radix-ui/react-popover` (oppure `dropdown-menu`) per il menu Action.
- [ ] Decidere come importare gli SVG: `vite-plugin-svgr` se serve ricolorare via CSS, altrimenti `<img>`.
- [ ] Creare le cartelle: `src/components/{Sidebar,Welcome,Replies,TodaysTasks,Signals,Performance,Onboarding}`, `src/data`, `src/hooks`, `src/types`, `src/assets/icons`.
- [ ] Impostare lo shell della pagina: contenitore 1440px centrato, `min-h-screen`, scroll del body. Sfondo pagina e font di base.
- [ ] Shell a due colonne: sidebar + main. Il main è una griglia a 3 colonne (Welcome | Replies | Performance) con Today's tasks che copre le prime due, Signals sotto a sinistra e Onboarding sotto a destra.

## 1. Tipi e dati mock

- [ ] `src/types/index.ts` con i tipi di nav item, task, signal, metrica, step di onboarding, utente.
- [ ] `data/navItems.json`: Dashboard (attivo), Find New, Lists, Templates, Sequences, Tasks, Inbox (badge `24`), Deals, Analytics (chevron). Ogni item: icona, label, badge opzionale, flag attivo, flag espandibile.
- [ ] `data/tasks.json`: Overdue `3` (rosa), Pending Manual `10` (giallo), Pending Auto `20` (azzurro, badge `1 error`), Completed `8` (verde). I primi tre hanno chevron; Completed no.
- [ ] `data/metrics.json`: Contacts engaged `0/500`, Companies engaged `0/500`, Activities `1000/2000`, Meetings `20/30`, Deals `100/200`, Pipeline `€50K/100K`. Ogni metrica: icona, colore della progress bar, valore, target.
- [ ] `data/signals.json`: almeno le 5 righe visibili, con abbastanza item da far comparire lo scroll interno. Contatore iniziale derivato dalle righe non lette (nel mock è `12`).
- [ ] `data/onboarding.json`: Integrations Setup `5 min`, Add new Contact `5 min`, Create your first sequence `10 min`, Add contacts to sequence `5 min`, Run your first task `10 min`.
- [ ] Hook `useSignals`: carica il JSON dopo un `setTimeout`, espone lista, stato di loading e le azioni Complete / Delete.

### Forma di un signal

- [ ] id, avatar, testo con segmenti (plain / bold / colorato), tag primario (es. `Role change`, `Company change`, `Website view`) con colore, tag secondario opzionale `in sequence`, data (`Apr 2, 2025`), stato `unread`.

Righe visibili nel mock:

- [ ] Robert Smith — role change, tag viola `Role change` + pill `in sequence`.
- [ ] Robert Smith — company change, tag `Company change` + pill `in sequence`.
- [ ] Robert Smith — role change, solo tag `Role change`.
- [ ] Amazon — website view, `2 pages` e `65 sec` in evidenza, tag rosa `Website view`.
- [ ] Amazon — stessa riga website view, ripetuta.

## 2. Signals (unico blocco interattivo)

Da fare per primo: è la funzionalità che viene valutata.

- [ ] `SignalsHeader`: titolo `Signals`, badge giallo con il conteggio, sottotitolo «Never miss a single opportunity: check out your top signals from your 1st-degree LinkedIn connections.»
- [ ] Il badge è `unread.length`. Nessuno state separato per il numero.
- [ ] `SignalRow`: avatar, testo con parti in bold/colore, tag pill, data grigia, bottone pill `Action` teal.
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

## 3. Sidebar

- [ ] `Sidebar`: colonna bianca, logo fulmine + wordmark `crono` in teal, bottone `«` in alto a destra (solo visivo, non collassa).
- [ ] `SidebarNavList`: lista data-driven. Dashboard attivo in teal. Inbox con badge arancione `24`. Analytics con chevron. Icone SVG originali, grigie; l'item attivo in teal.
- [ ] `TrialBanner`: card gialla condizionale. Testo «Trial ends in 2 days», bottone «Upgrade plan» con lucchetto, motivo decorativo a destra. Renderizzarla solo se il flag trial è attivo nei dati.
- [ ] `UserProfileFooter`: avatar circolare con fulmine, nome `William Robertson`, ruolo `Sales`.

## 4. Welcome, Replies, Today's tasks

- [ ] `Welcome`: card bianca. Titolo `Welcome Alex,` in navy bold. Sottotitolo grigio: «Here's your performance overview where you can track your daily and monthly KPIs».
- [ ] `Replies`: header con titolo `Replies` e link teal `Open inbox >`. Corpo su fondo menta: icona inbox in cerchio, numero `24` grande, stack di 4 avatar sovrapposti (Reddit, Amazon, McDonald's, marchio «M»).
- [ ] `TodaysTasks`: titolo `Today's tasks`, poi 4 `TaskStatCard` in riga.
- [ ] `TaskStatCard`: numero grande colorato, label, chevron opzionale, badge errore opzionale (`1 error` + triangolo sulla card Pending Auto). Sfondi: rosa, giallo, azzurro, verde.

## 5. Performance

- [ ] `PerformancePanel`: titolo `May's performance`, link teal `Edit KPIs` con icona matita.
- [ ] Griglia a 2 colonne di `MetricCard`.
- [ ] `MetricCard`: icona, label, valore/target (es. `1000/2000`, `€50K/100K`), progress bar nel colore della metrica.
- [ ] Allineare il primo slot al frame corretto. Il crop isolato lascia vuota la cella in alto a sinistra e mette Companies engaged da sola a destra. `Dashboard_Ultra` invece mostra Contacts engaged `0/500` in quella cella, e l'hover mostra un'icona info. Seguire il prompt (cella vuota) finché non arriva la spec; tenere Contacts engaged nei dati così si può riaccendere.
- [ ] Ordine nel crop: riga 1 Companies engaged; riga 2 Activities (viola) | Meetings (oro); riga 3 Deals (rosa) | Pipeline (verde).

## 6. Onboarding

- [ ] `OnboardingPanel`: titolo `Onboarding`.
- [ ] `OnboardingStep` ripetuto 5 volte, separato da divider.
- [ ] Ogni step: icona illustrata colorata, titolo, durata a destra in grigio (`5 min` / `10 min`).
- [ ] Icone distinte: Integrations (link/puzzle), Contact (persona + valigetta), Sequence (razzo), Add contacts (persona +), Task (checkbox).

## 7. Composizione e rifinitura

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
