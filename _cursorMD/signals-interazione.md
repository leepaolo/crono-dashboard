# Signals — Complete, Delete e contatore

Unico blocco interattivo della dashboard. Il resto della pagina è statico.

## Cosa fa il contatore

Il numero nel badge giallo accanto al titolo **Signals** (oggi `12`) è il conteggio delle righe ancora non lette.

Non è il badge Inbox della sidebar (`24`) e non è uno state a parte. Si calcola sempre come `unread.length`: quante righe hanno `unread: true`. In `signals.json` sono 12, tutte non lette, quindi il badge parte da 12.

Ogni Complete o Delete porta quella riga fuori dagli unread. Il badge scende da solo: 12 → 11 → … Se le processi tutte, la lista è vuota e il badge è `0`.

## Complete e Delete

Sono due voci del popover che si apre cliccando **Action**.

| Voce | Icona | Effetto in questa replica |
| --- | --- | --- |
| Complete | spunta | toglie la riga dalla lista e fa scendere il badge di 1 |
| Delete | cestino | lo stesso effetto |

La differenza è solo l’etichetta. Non esiste una lista “completati” né un cestino: entrambe le azioni segnano il signal come processato (`unread: false`) e la lista mostra solo le righe ancora non lette.

Click fuori dal popover, o Escape, chiude il menu e non tocca la lista.

## Come è simulato in locale

Niente localStorage e niente API. Lo stato vive in memoria per la sessione, dentro `useSignals`.

1. Al mount l’hook aspetta un `setTimeout` (fetch finta) e copia i signal del JSON in `useState`.
2. Espone la lista unread, `loading`, `unreadCount`, `complete(id)` e `deleteSignal(id)`.
3. Entrambe le azioni impostano `unread: false` su quell’id.
4. Il pannello renderizza solo le righe non lette e passa `unreadCount` all’header.

Ricaricando la pagina lo state si perde e il mock torna a 12. È il comportamento richiesto: la persistenza oltre la sessione è fuori scope.
