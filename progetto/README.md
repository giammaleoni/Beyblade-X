# La Mia Collezione Beyblade X

Sito statico vanilla HTML, CSS e JavaScript per esplorare una collezione personale Beyblade X.

## Come aprire

- Metodo semplice: apri `index.html` nel browser.
- Metodo consigliato: dalla cartella `progetto`, esegui `npx serve .` oppure usa un qualunque server statico.

Il sito prova a caricare `assets/data/beyblades.json` e `assets/data/punte_reference.json`. Se il browser blocca `fetch()` su file locale, usa un fallback incorporato in `assets/js/data.js`.

## Dati

I 9 Beyblade sono consolidati in:

- `assets/data/beyblades.json`

Le descrizioni estese delle punte sono in:

- `assets/data/punte_reference.json`

Per aggiungere nuovi Beyblade, aggiungi il record al JSON consolidato seguendo lo schema del progetto originale.

## Immagini

Le immagini locali vanno in:

- `assets/img/beyblades/`

Usa come nome file lo slug del Beyblade, per esempio:

- `driger-slash-4-80p.png`

Se l'immagine non esiste o il link originale punta a una pagina HTML, il sito mostra un placeholder SVG generato.

## Scoring

La funzione condivisa `calcolaPunteggi(lama, cricchetto, punta)` somma:

- `Attacco`: Lama + Cricchetto + Punta
- `Difesa`: Lama + Cricchetto + Punta
- `Resistenza`: Lama + Cricchetto + Punta
- `Altezza`: solo Cricchetto
- `Propulsione`: solo Punta
- `Esplosione`: solo Punta
- `Totale`: somma di tutti i punteggi numerici aggregati, cioe Attacco + Difesa + Resistenza + Altezza + Propulsione + Esplosione

La stessa funzione è usata da Lista, Componi e Random.
