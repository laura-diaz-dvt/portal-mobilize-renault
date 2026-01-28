const sidebar = document.querySelector('.sidebar')
const toggleBtn = document.getElementById('toggleSidebar')
const title = document.getElementById('dashboard-title')
const iframe = document.getElementById('looker')

toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('hidden')
})

// Filtros comunes a capturar
const filterValues = {
  Brand: null,
  PlateCode: null,
  DealerCode: null,
  Month: null,
  Year: null
}
  
// Nombres que Looker puede enviar para cada filtro
const filterKeys = {
  Brand: ["Brand", "Sale Car Brand", "Operation Brand"],
  PlateCode: ["Plate Code"],
  DealerCode: ["Dealer Code"],
  Month: ["Fecha Month Name", "Fecha Contratos Month Name"],
  Year: ["Fecha Year", "Fecha Contratos Year"]
}
  
// Diccionario de filtros por dashboard, con los nombres que Looker espera
const dashboards = {
  5959: { 
    title: "Bienvenida/o al Portal Mobilize",
    filters: { Brand: "Brand",  Month: "Fecha Month Name", Year: "Fecha Year" }
  },
  5978: { 
    title: "Ventas",
    filters: { Brand: "Sale Car Brand" }
  },
  5661: {
    title: "Informe Comercial",
    filters: { Brand: "Brand", PlateCode: "Plate Code", DealerCode: "Dealer Code", Month: "Fecha Month Name", Year: "Fecha Year" }
  },
  5909: {
    title: "Producción detallada financiación",
    filters: { Brand: "Operation Brand", PlateCode: "Plate Code", DealerCode: "Dealer Code", Month: "Fecha Contratos Month Name", Year: "Fecha Contratos Year" }
  }
}


function loadDashboard(dashboardId) {
  const dashboard = dashboards[dashboardId];
  if (!dashboard) return console.error("Dashboard no definido:", dashboardId);

  title.textContent = dashboard.title;

  let baseUrl =
    `https://renaultssadev.cloud.looker.com/embed/dashboards/${dashboardId}` +
    `?embed_domain=https://laura-diaz-dvt.github.io&sdk=3&allow_login_screen=true`;

  // recorrer los filtros definidos para ESTE dashboard
  for (const [filterKey, lookerName] of Object.entries(dashboard.filters)) {
    const value = filterValues[filterKey];
    if (!value) continue;

    baseUrl += `&${encodeURIComponent(lookerName)}=${encodeURIComponent(value)}`;
  }

  iframe.src = baseUrl;
}

// Botones
document.getElementById('btn5959').addEventListener('click', () => loadDashboard(5959))
document.getElementById('btn5978').addEventListener('click', () => loadDashboard(5978))
document.getElementById('btn5661').addEventListener('click', () => loadDashboard(5661))
document.getElementById('btn5909').addEventListener('click', () => loadDashboard(5909))

window.addEventListener("message", (event) => {
  if (event.source !== iframe.contentWindow || event.origin !== "https://renaultssadev.cloud.looker.com") return;

  let data;
  try {
    data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
  } catch(e) {
    console.error("Error parseando el mensaje:", e);
    return;
  }

  if (data.type === "dashboard:run:complete") {
    const filtros = data.dashboard?.dashboard_filters || {};

    for (const [key, aliases] of Object.entries(filterKeys)) {
      const value = aliases.map(alias => filtros[alias]).find(v => v !== undefined && v !== null && v !== "");
      if (value !== undefined) filterValues[key] = value;
    }

    console.log("Filtros actuales (heredados correctamente):", filterValues);
  }
})
