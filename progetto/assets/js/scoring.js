(function () {
  function n(value) {
    return Number(value || 0);
  }

  function calcolaPunteggi(lama, cricchetto, punta) {
    const Attacco = n(lama.Attacco) + n(cricchetto.Attacco) + n(punta.Attacco);
    const Difesa = n(lama.Difesa) + n(cricchetto.Difesa) + n(punta.Difesa);
    const Resistenza = n(lama.Resistenza) + n(cricchetto.Resistenza) + n(punta.Resistenza);
    return {
      Attacco,
      Difesa,
      Resistenza,
      Altezza: n(cricchetto.Altezza),
      Propulsione: n(punta.Propulsione),
      Esplosione: n(punta.Esplosione),
      Totale: Attacco + Difesa + Resistenza + n(cricchetto.Altezza) + n(punta.Propulsione) + n(punta.Esplosione)
    };
  }

  window.BeyScoring = { calcolaPunteggi };
})();
