(function () {
  let current = 0;
  let timer = null;
  let state;

  function render() {
    const root = BeyApp.$("#sfoglia");
    const bey = state.beyblades[current];
    root.innerHTML = `<div class="section-head"><p class="eyebrow">Sfoglia</p><h1>La Mia Collezione Beyblade X</h1></div>
      <div class="coverflow" aria-live="polite">
        <button class="arrow prev" aria-label="Beyblade precedente">‹</button>
        <div class="slides">${state.beyblades.map((item, index) => {
          const pos = index - current;
          const cls = pos === 0 ? "active" : pos === -1 ? "prev-card" : pos === 1 ? "next-card" : "hidden-card";
          return `<article class="slide ${cls}" data-index="${index}" tabindex="${pos === 0 ? 0 : -1}">
            ${BeyApp.imgTag(item, "blade-hero")}
            <h2>${item["Nome completo"]}</h2>
            ${BeyApp.chips(item)}
          </article>`;
        }).join("")}</div>
        <button class="arrow next" aria-label="Beyblade successivo">›</button>
      </div>
      <div class="slider-actions">
        <div class="dots">${state.beyblades.map((_, index) => `<button class="${index === current ? "is-active" : ""}" data-index="${index}" aria-label="Vai allo slide ${index + 1}"></button>`).join("")}</div>
        <button class="ghost autoplay" type="button">Autoplay off</button>
      </div>`;

    BeyApp.$(".prev", root).addEventListener("click", () => move(-1));
    BeyApp.$(".next", root).addEventListener("click", () => move(1));
    BeyApp.$$(".dot, .dots button", root).forEach((dot) => dot.addEventListener("click", () => go(Number(dot.dataset.index))));
    BeyApp.$(".slide.active", root).addEventListener("click", () => BeyApp.openDetail(bey));
    BeyApp.$(".autoplay", root).addEventListener("click", toggleAuto);
  }

  function go(index) {
    current = (index + state.beyblades.length) % state.beyblades.length;
    render();
  }

  function move(delta) {
    go(current + delta);
  }

  function toggleAuto(event) {
    if (timer) {
      clearInterval(timer);
      timer = null;
      event.target.textContent = "Autoplay off";
    } else {
      timer = setInterval(() => move(1), 3200);
      event.target.textContent = "Autoplay on";
    }
  }

  function init(appState) {
    state = appState;
    render();
    document.addEventListener("keydown", (event) => {
      if (appState.active !== "sfoglia") return;
      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);
    });
  }

  window.BeySlider = { init };
})();
