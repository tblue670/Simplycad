# Contabilità Cantieri

Versione **v04.2** · pagina protetta da password.

Il file `index.html` contiene l'app **cifrata**: senza la password, chi apre il sito o guarda i file su GitHub vede solo la richiesta di password e testo illeggibile.

## Cosa contiene

| File | A cosa serve |
|---|---|
| `index.html` | L'app cifrata con la schermata della password |
| `manifest.webmanifest` | Nome e icona per installarla come app |
| `sw.js` | Apertura veloce e uso senza rete |
| `icon-192.png`, `icon-512.png` | Icone |

## Uso

- All'apertura scrivi la password e tocca **Entra**.
- **Ricorda su questo dispositivo**: se spuntato, non la chiede più su quel dispositivo finché non tocchi **Blocca**.
- **Blocca** (in alto, o in Dati → Accesso con password) dimentica la password su quel dispositivo e torna alla schermata iniziale.
- I dati restano nel browser del dispositivo: bloccare non cancella nulla.

## Aggiornare

Carica i nuovi file con **Add file → Upload files** e **Commit changes**. Ogni nuova versione va cifrata di nuovo con la stessa password.
