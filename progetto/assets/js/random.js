(function () {
  let state;
  let result = null;

  function pick(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function generate() {
    const display = BeyApp.$("#random-result");
    display.classList.add("rolling");
    const pools = state.components;
    const rolls = setInterval(() => {
      display.innerHTML = resultMarkup({
        lama: pick(pools.lame),
        cricchetto: pick(pools.cricchetti),
        punta: pick(pools.punte)
      }, true);
    }, 90);
    setTimeout(() => {
      clearInterval(rolls);
      result = { lama: pick(pools.lame), cricchetto: pick(pools.cricchetti), punta: pick(pools.punte) };
      display.classList.remove("rolling");
      display.innerHTML = resultMarkup(result, false);
      bindResult();
    }, 1500);
  }

  function resultMarkup(combo, rolling) {
    const scores = BeyScoring.calcolaPunteggi(combo.lama, combo.cricchetto, combo.punta);
    return `<div class="random-card ${rolling ? "is-rolling" : ""}">
      <h2>${combo.lama.Nome} ${combo.cricchetto.Nome}${combo.punta.Nome}</h2>
      <div class="component-grid">
        ${BeyApp.componentCard("Lama", combo.lama, `da: ${combo.lama.origini.join(", ")}`)}
        ${BeyApp.componentCard("Cricchetto", combo.cricchetto, `da: ${combo.cricchetto.origini.join(", ")}`)}
        ${BeyApp.componentCard("Punta", combo.punta, `da: ${combo.punta.origini.join(", ")} - ${combo.punta.Nome} = ${combo.punta.descrizione}`)}
      </div>
      ${BeyApp.scoreBars(scores)}
      ${rolling ? "" : `<div class="wizard-actions"><button class="ghost download-json">Salva configurazione</button><button class="primary open-builder">Apri in Componi</button></div>`}
    </div>`;
  }

  function bindResult() {
    BeyApp.$(".download-json")?.addEventListener("click", () => {
      const payload = {
        nome: `${result.lama.Nome} ${result.cricchetto.Nome}${result.punta.Nome}`,
        lama: result.lama,
        cricchetto: result.cricchetto,
        punta: result.punta,
        punteggi: BeyScoring.calcolaPunteggi(result.lama, result.cricchetto, result.punta)
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${BeyData.slug(payload.nome)}.json`;
      link.click();
      URL.revokeObjectURL(link.href);
    });
    BeyApp.$(".open-builder")?.addEventListener("click", () => BeyBuilder.openWithPreset(result));
  }

  function render() {
    const root = BeyApp.$("#random");
    root.innerHTML = `<div class="random-stage">
      <p class="eyebrow">Genera Random</p>
      <h1>Launch una combinazione nuova</h1>
      <button class="generate" type="button">GENERA</button>
      <div id="random-result" class="random-result"><p class="muted">Premi genera per estrarre lama, cricchetto e punta dal pool unico.</p></div>
    </div>`;
    BeyApp.$(".generate", root).addEventListener("click", generate);
  }

  function init(appState) {
    state = appState;
    render();
  }

  window.BeyRandom = { init };
})();
