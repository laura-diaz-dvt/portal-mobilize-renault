const sidebar = document.querySelector('.sidebar')
const toggleBtn = document.getElementById('toggleSidebar')

toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('hidden')
})

const title = document.getElementById('dashboard-title')
const iframe = document.getElementById('looker')
let brandValue = null
let plateCodeValue = null
let dealerCodeValue = null
let monthValue = null
let yearValue = null

function loadDashboard(dashboardId, dashboardTitle) {
    title.textContent = dashboardTitle
    
    let baseUrl = `https://renaultssadev.cloud.looker.com/embed/dashboards/${dashboardId}?embed_domain=https://laura-diaz-dvt.github.io&sdk=3&allow_login_screen=true`

    if (brandValue) {
      const encodedBrand = encodeURIComponent(brandValue)
      if (dashboardId === 5978) {
        baseUrl += `&Sale+Car+Brand=${encodedBrand}`
      } else if (dashboardId === 5909) {
        baseUrl += `&Operation+Brand=${encodedBrand}`
      } else {
        baseUrl += `&Brand=${encodedBrand}`
      }
    }
    if (plateCodeValue) {
      const encodedPlateCode = encodeURIComponent(plateCodeValue)
      baseUrl += `&Plate+Code=${encodedPlateCode}`
    }
    if (dealerCodeValue) {
      const encodedDealerCode = encodeURIComponent(dealerCodeValue)
      baseUrl += `&Dealer+Code=${encodedDealerCode}`
    }
    if (monthValue) {
      const encodedMonth = encodeURIComponent(monthValue)
      if (dashboardId === 5909) {
        baseUrl += `&Fecha+Contratos+Month+Name=${encodedMonth}`
      } else {
        baseUrl += `&Fecha+Month+Name=${encodedMonth}`
      }
    }
    if (yearValue) {
      const encodedYear = encodeURIComponent(yearValue)
      if (dashboardId === 5909) {
        baseUrl += `&Fecha+Contratos+Year=${encodedYear}`
      } else {
        baseUrl += `&Fecha+Year=${encodedYear}`
      }
    }

    iframe.src = baseUrl
}

// Botones
document.getElementById('btn5959').addEventListener('click', () => loadDashboard(5959, 'Bienvenida/o al Portal Mobilize'))
document.getElementById('btn5978').addEventListener('click', () => loadDashboard(5978, 'Ventas'))
document.getElementById('btn5661').addEventListener('click', () => loadDashboard(5661, 'Informe Comercial'))
document.getElementById('btn5909').addEventListener('click', () => loadDashboard(5909, 'Producción detallada financiación'))

// Escuchar eventos del dashboard
window.addEventListener("message", (event) => {
  if (event.source !== iframe.contentWindow ||
      event.origin !== "https://renaultssadev.cloud.looker.com") return

  let data
  try {
    data = (typeof event.data === "string") ? JSON.parse(event.data) : event.data
  } catch(e) {
    console.error("Error parseando el mensaje:", e)
    return
  }

  if (data.type === "dashboard:run:complete") {
    const filtros = data.dashboard?.dashboard_filters
    const currentBrand = filtros?.Brand || filtros?.["Sale Car Brand"] || filtros?.["Operation Brand"]
    const currentPlateCode= filtros?.["Plate Code"]
    const currentDealerCode = filtros?.["Dealer Code"]
    const currentMonth= filtros?.["Fecha Month Name"]  || filtros?.["Fecha Contratos Month Name"]
    const currentYear= filtros?.["Fecha Year"] || filtros?.["Fecha Contratos Year"]

    if (currentBrand) {
      brandValue = currentBrand
      console.log("Brand actual:", brandValue)
    }
  }
})
