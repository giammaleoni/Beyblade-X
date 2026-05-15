(function () {
  let state;
  let mode = window.matchMedia("(max-width: 767px)").matches ? "cards" : "table";
  let sort = { key: "Nome completo", dir: "asc" };
  const filters = { search: "", Linea: new Set(), Tipo: new Set(), "Direzione spin": new Set(), ranges: {} };

  const columns = ["Nome completo", "Linea", "Tipo", "Direzione spin", "Attacco", "Difesa", "Resistenza", "Altezza", "Propulsione", "Esplosione", "Totale"];
  const numeric = ["Attacco", "Difesa", "Resistenza", "Altezza", "Propulsione", "Esplosione", "Totale"];

  function valueOf(bey, key) {
    return bey.punteggi[key] ?? bey[key] ?? "";
  }

  function seedRanges() {
    numeric.forEach((key) => {
      const values = state.beyblades.map((bey) => valueOf(bey, key));
      filters.ranges[key] = { min: Math.min(...values), max: Math.max(...values), value: Math.max(...values) };
    });
  }

  function render() {
    const root = BeyApp.$("#lista");
    root.innerHTML = `<div class="section-head compact"><p class="eyebrow">Cerca e filtra</p><h1>Archivio componenti originali</h1></div>
      <div class="list-layout">
        <aside class="filters">${filterMarkup()}</aside>
        <div class="results">
          <div class="toolbar">
            <label class="search"><span>⌕</span><input id="search-input" type="search" placeholder="Cerca blade o componente"></label>
            <button class="ghost view-toggle" type="button">${mode === "table" ? "Vista card" : "Vista tabella"}</button>
          </div>
          <div id="list-results"></div>
        </div>
      </div>`;
    bindFilters(root);
    drawResults();
  }

  function filterMarkup() {
    const group = (key) => `<fieldset><legend>${key}</legend>${BeyApp.uniqueValues(state.beyblades, (b) => b[key]).map((value) =>
      `<label><input type="checkbox" data-filter="${key}" value="${value}" ${filters[key].has(value) ? "checked" : ""}>${value}</label>`).join("")}</fieldset>`;
    const ranges = numeric.map((key) => {
      const range = filters.ranges[key];
      return `<label class="range-label"><span>${key}: <b>${BeyApp.fmt(range.value)}</b></span><input type="range" min="${range.min}" max="${range.max}" step="0.5" value="${range.value}" data-range="${key}"></label>`;
    }).join("");
    return `${group("Linea")}${group("Tipo")}${group("Direzione spin")}<fieldset><legend>Punteggi massimi</legend>${ranges}</fieldset><button class="reset" type="button">Reset filtri</button>`;
  }

  function bindFilters(root) {
    let debounce;
    BeyApp.$("#search-input", root).value = filters.search;
    BeyApp.$("#search-input", root).addEventListener("input", (event) => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        filters.search = event.target.value.trim().toLowerCase();
        drawResults();
      }, 200);
    });
    BeyApp.$$(".filters input[type=checkbox]", root).forEach((input) => input.addEventListener("change", () => {
      const set = filters[input.dataset.filter];
      input.checked ? set.add(input.value) : set.delete(input.value);
      drawResults();
    }));
    BeyApp.$$(".filters input[type=range]", root).forEach((input) => input.addEventListener("input", () => {
      filters.ranges[input.dataset.range].value = Number(input.value);
      input.previousElementSibling.querySelector("b").textContent = BeyApp.fmt(Number(input.value));
      drawResults();
    }));
    BeyApp.$(".reset", root).addEventListener("click", () => {
      filters.search = "";
      ["Linea", "Tipo", "Direzione spin"].forEach((key) => filters[key].clear());
      seedRanges();
      render();
    });
    BeyApp.$(".view-toggle", root).addEventListener("click", () => {
      mode = mode === "table" ? "cards" : "table";
      render();
    });
  }

  function filtered() {
    const search = filters.search;
    return state.beyblades.filter((bey) => {
      if (search) {
        const text = [bey["Nome completo"], bey.Lama.Nome, bey.Cricchetto.Nome, bey.Punta.Nome, bey.descrizionePunta].join(" ").toLowerCase();
        if (!text.includes(search)) return false;
      }
      for (const key of ["Linea", "Tipo", "Direzione spin"]) {
        if (filters[key].size && !filters[key].has(bey[key])) return false;
      }
      return numeric.every((key) => valueOf(bey, key) <= filters.ranges[key].value);
    }).sort((a, b) => {
      const av = valueOf(a, sort.key);
      const bv = valueOf(b, sort.key);
      const result = typeof av === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sort.dir === "asc" ? result : -result;
    });
  }

  function drawResults() {
    const items = filtered();
    const root = BeyApp.$("#list-results");
    if (mode === "cards") {
      root.innerHTML = `<div class="card-grid">${items.map(card).join("")}</div>`;
    } else {
      root.innerHTML = `<div class="table-wrap"><table><thead><tr><th>Img</th>${columns.map((key) =>
        `<th><button data-sort="${key}">${key}${sort.key === key ? (sort.dir === "asc" ? " ↑" : " ↓") : ""}</button></th>`).join("")}</tr></thead><tbody>${items.map(row).join("")}</tbody></table></div>`;
      BeyApp.$$("th button", root).forEach((button) => button.addEventListener("click", () => {
        sort = sort.key === button.dataset.sort ? { key: sort.key, dir: sort.dir === "asc" ? "desc" : "asc" } : { key: button.dataset.sort, dir: "asc" };
        drawResults();
      }));
    }
    BeyApp.$$("[data-open]", root).forEach((el) => el.addEventListener("click", () => BeyApp.openDetail(state.beyblades.find((b) => b.id === el.dataset.open))));
  }

  function row(bey) {
    return `<tr data-open="${bey.id}" tabindex="0"><td>${BeyApp.imgTag(bey, "thumb")}</td>${columns.map((key) => `<td>${BeyApp.fmt(valueOf(bey, key))}</td>`).join("")}</tr>`;
  }

  function card(bey) {
    return `<article class="blade-card" data-open="${bey.id}" tabindex="0">${BeyApp.imgTag(bey, "thumb large")}<h3>${bey["Nome completo"]}</h3>${BeyApp.chips(bey)}${BeyApp.scoreBars(bey.punteggi)}</article>`;
  }

  function init(appState) {
    state = appState;
    seedRanges();
    render();
  }

  window.BeyList = { init };
})();
