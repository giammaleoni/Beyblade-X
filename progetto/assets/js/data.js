(function () {
  const FALLBACK_BITS = [
    { "sigla": "F", "descrizione": "Flat" }, { "sigla": "T", "descrizione": "Taper" },
    { "sigla": "B", "descrizione": "Ball" }, { "sigla": "N", "descrizione": "Needle" },
    { "sigla": "HN", "descrizione": "High Needle" }, { "sigla": "LF", "descrizione": "Low Flat" },
    { "sigla": "P", "descrizione": "Point" }, { "sigla": "O", "descrizione": "Orb" },
    { "sigla": "S", "descrizione": "Spike" }, { "sigla": "R", "descrizione": "Rush" },
    { "sigla": "HT", "descrizione": "High Taper" }, { "sigla": "GF", "descrizione": "Gear Flat" },
    { "sigla": "GB", "descrizione": "Gear Ball" }, { "sigla": "GP", "descrizione": "Gear Point" },
    { "sigla": "GN", "descrizione": "Gear Needle" }, { "sigla": "U", "descrizione": "Unite" },
    { "sigla": "C", "descrizione": "Cyclone" }, { "sigla": "E", "descrizione": "Elevate" },
    { "sigla": "TP", "descrizione": "Trans Point" }, { "sigla": "M", "descrizione": "Merge" },
    { "sigla": "D", "descrizione": "Dot" }, { "sigla": "A", "descrizione": "Accel" },
    { "sigla": "H", "descrizione": "Hexa" }, { "sigla": "DB", "descrizione": "Disk Ball" },
    { "sigla": "MN", "descrizione": "Metal Needle" }, { "sigla": "G", "descrizione": "Glide" },
    { "sigla": "FB", "descrizione": "Free Ball" }, { "sigla": "L", "descrizione": "Level" },
    { "sigla": "BS", "descrizione": "Bound Spike" }, { "sigla": "LR", "descrizione": "Low Rush" },
    { "sigla": "UN", "descrizione": "Under Needle" }, { "sigla": "Z", "descrizione": "Zap" },
    { "sigla": "J", "descrizione": "Jolt" }, { "sigla": "UF", "descrizione": "Under Flat" },
    { "sigla": "V", "descrizione": "Vortex" }, { "sigla": "LO", "descrizione": "Low Orb" },
    { "sigla": "W", "descrizione": "Wedge" }, { "sigla": "K", "descrizione": "Kick" },
    { "sigla": "GR", "descrizione": "Gear Rush" }, { "sigla": "Tr", "descrizione": "Turbo" },
    { "sigla": "WB", "descrizione": "Wall Ball" }, { "sigla": "TK", "descrizione": "Trans Kick" },
    { "sigla": "Op", "descrizione": "Operate" }
  ];

  const FALLBACK_BEYS = [
    ["Buster Dran 5-70DB", "Unique Line", "Resistenza", "Right", ["Buster Dran", 70, 20, 10], ["5-70", 12, 8.5, 9.5, 70], ["DB", 15, 20, 55, 10, 30]],
    ["Dranzer Spiral 3-80T", "X-Over Project", "Equilibrio", "Right", ["Dranzer Spiral", 35, 30, 35], ["3-80", 15, 7, 8, 80], ["T", 35, 20, 20, 25, 80]],
    ["Driger Slash 4-80P", "X-Over Project", "Equilibrio", "Right", ["Driger Slash", 40, 35, 25], ["4-80", 11, 11, 8, 80], ["P", 25, 25, 25, 25, 80]],
    ["Mosasaurus 9-60U", "Jurassic World Collab", "Equilibrio", "Right", ["Mosasaurus", 32, 55, 13], ["9-60", 13, 10, 7, 60], ["U", 25, 25, 30, 20, 80]],
    ["Obsidian Shell 4-60D", "Basic Line", "Difesa", "Right", ["Obsidian Shell", 10, 65, 25], ["4-60", 11, 15, 6, 60], ["D", 10, 55, 25, 10, 50]],
    ["Shelter Drake 5-70O", "Basic Line", "Resistenza", "Right", ["Shelter Drake", 25, 40, 35], ["5-70", 12, 8.5, 9.5, 70], ["O", 10, 30, 50, 10, 30]],
    ["T. Rex 1-80GB", "Jurassic World Collab", "Resistenza", "Right", ["T. Rex", 65, 30, 5], ["1-80", 7, 4, 9, 80], ["GB", 10, 15, 45, 30, 30]],
    ["Yell Kong 3-60GB", "Basic Line", "Resistenza", "Right", ["Yell Kong", 13, 37, 50], ["3-60", 15, 9, 6, 60], ["GB", 10, 15, 45, 30, 30]]
  ].map(([nome, linea, tipo, spin, lama, cricchetto, punta, link]) => ({
    "Nome completo": nome,
    ...(link ? { "Link immagine": link } : {}),
    "Linea": linea,
    "Tipo": tipo,
    "Direzione spin": spin,
    "Lama": { "Nome": lama[0], "Linea": linea, "Tipo": tipo, "Direzione spin": spin, "Attacco": lama[1], "Difesa": lama[2], "Resistenza": lama[3] },
    "Cricchetto": { "Nome": cricchetto[0], "Attacco": cricchetto[1], "Difesa": cricchetto[2], "Resistenza": cricchetto[3], "Altezza": cricchetto[4] },
    "Punta": { "Nome": punta[0], "Attacco": punta[1], "Difesa": punta[2], "Resistenza": punta[3], "Propulsione": punta[4], "Esplosione": punta[5] }
  }));

  function slug(text) {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function placeholder(id, type) {
    const colors = { Attacco: "#E63946", Difesa: "#1FB6FF", Resistenza: "#FFD23F", Equilibrio: "#A05CFF" };
    const accent = colors[type] || "#1FB6FF";
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 420"><defs><radialGradient id="g"><stop offset="0" stop-color="${accent}"/><stop offset=".55" stop-color="#141B2D"/><stop offset="1" stop-color="#0A0E1A"/></radialGradient></defs><rect width="420" height="420" fill="#0A0E1A"/><g fill="none" stroke="${accent}" stroke-width="16" opacity=".9"><circle cx="210" cy="210" r="120"/><path d="M210 60v88M210 272v88M60 210h88M272 210h88"/><path d="M126 126l62 62M232 232l62 62M294 126l-62 62M188 232l-62 62"/></g><circle cx="210" cy="210" r="72" fill="url(#g)" stroke="#F5F5F7" stroke-width="5"/><text x="210" y="224" text-anchor="middle" font-family="Arial" font-size="42" font-weight="800" fill="#F5F5F7">${id.slice(0, 2).toUpperCase()}</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function localImagePath(id) {
    return `assets/img/beyblades/${id}.png`;
  }

  function normalize(beys, bits) {
    const bitMap = new Map(bits.map((bit) => [bit.sigla, bit.descrizione]));
    return beys.map((bey) => {
      const id = slug(bey["Nome completo"]);
      const puntaDesc = bitMap.get(bey.Punta.Nome) || bey.Punta.Nome;
      return {
        ...bey,
        id,
        fonteImmagine: bey["Link immagine"] || "",
        immagineLocale: localImagePath(id),
        immaginePlaceholder: placeholder(id, bey.Tipo),
        descrizionePunta: puntaDesc,
        punteggi: window.BeyScoring.calcolaPunteggi(bey.Lama, bey.Cricchetto, bey.Punta)
      };
    });
  }

  async function readJson(path, fallback) {
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error(response.statusText);
      return await response.json();
    } catch (error) {
      console.info(`Uso dati incorporati per ${path}.`, error);
      return fallback;
    }
  }

  async function loadData() {
    const [beys, bits] = await Promise.all([
      readJson("assets/data/beyblades.json", FALLBACK_BEYS),
      readJson("assets/data/punte_reference.json", FALLBACK_BITS)
    ]);
    const normalized = normalize(beys, bits);
    return { beyblades: normalized, punte: bits, components: buildComponents(normalized, bits) };
  }

  function buildComponents(beyblades, bits) {
    const bitMap = new Map(bits.map((bit) => [bit.sigla, bit.descrizione]));
    const groups = { lame: new Map(), cricchetti: new Map(), punte: new Map() };
    const add = (map, key, value, source) => {
      if (!map.has(key)) map.set(key, { ...value, origini: [] });
      const item = map.get(key);
      if (!item.origini.includes(source)) item.origini.push(source);
    };
    beyblades.forEach((bey) => {
      add(groups.lame, bey.Lama.Nome, bey.Lama, bey["Nome completo"]);
      add(groups.cricchetti, bey.Cricchetto.Nome, bey.Cricchetto, bey["Nome completo"]);
      add(groups.punte, bey.Punta.Nome, { ...bey.Punta, descrizione: bitMap.get(bey.Punta.Nome) || bey.Punta.Nome }, bey["Nome completo"]);
    });
    return {
      lame: [...groups.lame.values()],
      cricchetti: [...groups.cricchetti.values()],
      punte: [...groups.punte.values()]
    };
  }

  window.BeyData = { loadData, slug, placeholder };
})();
