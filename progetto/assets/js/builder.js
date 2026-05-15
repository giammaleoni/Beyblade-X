(function () {
  let state;
  let step = 0;
  const choice = { lama: null, cricchetto: null, punta: null };
  const steps = [
    { key: "lama", label: "Lama", pool: "lame" },
    { key: "cricchetto", label: "Cricchetto", pool: "cricchetti" },
    { key: "punta", label: "Punta", pool: "punte" }
  ];

  function render() {
    const root = BeyApp.$("#componi");
    const current = steps[step];
    root.innerHTML = `<div class="section-head compact"><p class="eyebrow">Componi</p><h1>Costruisci il tuo Blade</h1></div>
      <div class="builder-layout">
        <main>
          <div class="stepper">${steps.map((s, index) => `<span class="${index <= step ? "is-active" : ""}">${index + 1}. ${s.label}</span>`).join("")}</div>
          ${isComplete() ? finalMarkup() : selectionMarkup(current)}
        </main>
        <aside class="live-panel">${livePanel()}</aside>
      </div>`;
    bind(root);
  }

  function selectionMarkup(current) {
    return `<h2>Scegli ${current.label}</h2><div class="component-picker">${state.components[current.pool].map((item, index) => {
      const selected = choice[current.key]?.Nome === item.Nome;
      return `<article class="pick-card ${selected ? "selected" : ""}" data-pick="${index}">
        <h3>${item.Nome}</h3>
        <p>da: ${item.origini.join(", ")}</p>
        ${current.key === "punta" ? `<p class="bit-desc">${item.Nome} = ${item.descrizione}</p>` : ""}
        ${statsFor(item)}
      </article>`;
    }).join("")}</div><div class="wizard-actions">
      <button class="ghost back" ${step === 0 ? "disabled" : ""}>Indietro</button>
      <button class="primary next" ${choice[current.key] ? "" : "disabled"}>${step === 2 ? "Completa" : "Avanti"}</button>
    </div>`;
  }

  function statsFor(item) {
    return `<dl class="mini-stats">${Object.keys(item).filter((k) => ["Attacco", "Difesa", "Resistenza", "Altezza", "Propulsione", "Esplosione"].includes(k)).map((key) => `<div><dt>${key}</dt><dd>${BeyApp.fmt(item[key])}</dd></div>`).join("")}</dl>`;
  }

  function currentScores() {
    if (!choice.lama || !choice.cricchetto || !choice.punta) return null;
    return BeyScoring.calcolaPunteggi(choice.lama, choice.cricchetto, choice.punta);
  }

  function livePanel() {
    const scores = currentScores();
    const name = `${choice.lama?.Nome || "Lama"} ${choice.cricchetto?.Nome || "Cricchetto"}${choice.punta?.Nome || ""}`;
    return `<h2>${name}</h2>
      <ul class="chosen">
        <li>Lama: <b>${choice.lama?.Nome || "-"}</b></li>
        <li>Cricchetto: <b>${choice.cricchetto?.Nome || "-"}</b></li>
        <li>Punta: <b>${choice.punta ? `${choice.punta.Nome} (${choice.punta.descrizione})` : "-"}</b></li>
      </ul>
      ${scores ? BeyApp.scoreBars(scores) + radar(scores) : `<p class="muted">Seleziona i tre componenti per vedere i punteggi aggregati.</p>`}`;
  }

  function radar(scores) {
    const keys = ["Attacco", "Difesa", "Resistenza", "Propulsione", "Esplosione"];
    const points = keys.map((key, index) => {
      const angle = -Math.PI / 2 + index * Math.PI * 2 / keys.length;
      const radius = Math.min(82, (scores[key] || 0) / 120 * 82);
      return `${100 + Math.cos(angle) * radius},${100 + Math.sin(angle) * radius}`;
    }).join(" ");
    return `<svg class="radar" viewBox="0 0 200 200" role="img" aria-label="Grafico radar punteggi"><polygon points="100,18 178,75 148,166 52,166 22,75" /><polyline points="${points}" /></svg>`;
  }

  function isComplete() {
    return step > 2;
  }

  function finalMarkup() {
    const scores = currentScores();
    return `<div class="final-blade" id="final-blade"><p class="eyebrow">Il tuo Blade</p><h2>${choice.lama.Nome} ${choice.cricchetto.Nome}${choice.punta.Nome}</h2>${BeyApp.scoreBars(scores)}${BeyApp.componentCard("Lama", choice.lama)}${BeyApp.componentCard("Cricchetto", choice.cricchetto)}${BeyApp.componentCard("Punta", choice.punta, `${choice.punta.Nome} = ${choice.punta.descrizione}`)}</div>
      <div class="wizard-actions"><button class="primary restart">Componi un altro</button><button class="ghost save-shot">Salva immagine</button></div>`;
  }

  function bind(root) {
    BeyApp.$$("[data-pick]", root).forEach((card) => card.addEventListener("click", () => {
      const current = steps[step];
      choice[current.key] = state.components[current.pool][Number(card.dataset.pick)];
      render();
    }));
    BeyApp.$(".next", root)?.addEventListener("click", () => { step += 1; render(); });
    BeyApp.$(".back", root)?.addEventListener("click", () => { step -= 1; render(); });
    BeyApp.$(".restart", root)?.addEventListener("click", () => {
      step = 0;
      choice.lama = choice.cricchetto = choice.punta = null;
      render();
    });
    BeyApp.$(".save-shot", root)?.addEventListener("click", () => window.print());
  }

  function openWithPreset(preset) {
    choice.lama = preset.lama;
    choice.cricchetto = preset.cricchetto;
    choice.punta = preset.punta;
    step = 3;
    render();
    BeyApp.setRoute("componi");
  }

  function init(appState) {
    state = appState;
    render();
  }

  window.BeyBuilder = { init, openWithPreset };
})();
