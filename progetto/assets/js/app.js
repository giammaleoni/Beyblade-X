(function () {
  const sections = ["sfoglia", "lista", "componi", "random"];
  const state = {
    beyblades: [],
    components: null,
    punte: [],
    active: "sfoglia",
    builderPreset: null
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const stats = ["Attacco", "Difesa", "Resistenza", "Altezza", "Propulsione", "Esplosione", "Totale"];

  function fmt(value) {
    return Number.isInteger(value) ? String(value) : String(Number(value).toFixed(1));
  }

  function typeClass(type) {
    return `type-${type.toLowerCase()}`;
  }

  function imgTag(bey, className = "") {
    return `<img class="${className}" src="${bey.immagineLocale}" alt="${bey["Nome completo"]}" onerror="this.onerror=null;this.src='${bey.immaginePlaceholder}'">`;
  }

  function chips(bey) {
    return `<div class="chips">
      <span>${bey.Linea}</span>
      <span class="${typeClass(bey.Tipo)}">${bey.Tipo}</span>
      <span>${bey["Direzione spin"]}</span>
    </div>`;
  }

  function scoreBars(punteggi) {
    const max = Math.max(120, ...stats.map((key) => punteggi[key] || 0));
    return `<div class="score-bars">${stats.map((key) => {
      const value = punteggi[key] || 0;
      return `<div class="bar-row"><span>${key}</span><strong>${fmt(value)}</strong><i><b style="width:${Math.min(100, value / max * 100)}%"></b></i></div>`;
    }).join("")}</div>`;
  }

  function componentCard(title, component, extra = "") {
    const keys = ["Attacco", "Difesa", "Resistenza", "Altezza", "Propulsione", "Esplosione"].filter((key) => component[key] !== undefined);
    return `<article class="component-detail">
      <h4>${title}: ${component.Nome}</h4>
      ${extra ? `<p>${extra}</p>` : ""}
      <dl>${keys.map((key) => `<div><dt>${key}</dt><dd>${fmt(component[key])}</dd></div>`).join("")}</dl>
    </article>`;
  }

  function openDetail(bey) {
    const modal = $("#detail-modal");
    $(".modal-body", modal).innerHTML = `<button class="modal-close" aria-label="Chiudi dettaglio">x</button>
      <div class="modal-grid">
        <div>${imgTag(bey, "modal-image")}${bey.fonteImmagine ? `<a class="source-link" href="${bey.fonteImmagine}" target="_blank" rel="noreferrer">Fonte immagine/dati</a>` : ""}</div>
        <div>
          <p class="eyebrow">${bey.Linea}</p>
          <h2>${bey["Nome completo"]}</h2>
          ${chips(bey)}
          ${scoreBars(bey.punteggi)}
        </div>
      </div>
      <div class="component-grid">
        ${componentCard("Lama", bey.Lama)}
        ${componentCard("Cricchetto", bey.Cricchetto)}
        ${componentCard("Punta", bey.Punta, `${bey.Punta.Nome} = ${bey.descrizionePunta}`)}
      </div>`;
    modal.hidden = false;
    modal.classList.add("is-open");
    $(".modal-close", modal).focus();
  }

  function closeModal() {
    const modal = $("#detail-modal");
    modal.classList.remove("is-open");
    modal.hidden = true;
  }

  function setRoute(route) {
    state.active = sections.includes(route) ? route : "sfoglia";
    $$(".app-section").forEach((section) => section.classList.toggle("is-active", section.id === state.active));
    $$(".nav-tab").forEach((tab) => tab.classList.toggle("is-active", tab.dataset.route === state.active));
    if (location.hash !== `#${state.active}`) history.replaceState(null, "", `#${state.active}`);
  }

  function uniqueValues(items, getter) {
    return [...new Set(items.map(getter))].sort((a, b) => String(a).localeCompare(String(b)));
  }

  async function boot() {
    const data = await window.BeyData.loadData();
    Object.assign(state, data);
    $("#blade-count").textContent = `${state.beyblades.length} blade`;
    window.BeySlider.init(state);
    window.BeyList.init(state);
    window.BeyBuilder.init(state);
    window.BeyRandom.init(state);

    $$(".nav-tab").forEach((tab) => tab.addEventListener("click", () => setRoute(tab.dataset.route)));
    window.addEventListener("hashchange", () => setRoute(location.hash.slice(1)));
    $("#detail-modal").addEventListener("click", (event) => {
      if (event.target.id === "detail-modal" || event.target.classList.contains("modal-close")) closeModal();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !$("#detail-modal").hidden) closeModal();
    });
    setRoute(location.hash.slice(1));
  }

  window.BeyApp = { state, $, $$, stats, fmt, imgTag, chips, scoreBars, componentCard, openDetail, setRoute, uniqueValues, typeClass };
  document.addEventListener("DOMContentLoaded", boot);
})();
