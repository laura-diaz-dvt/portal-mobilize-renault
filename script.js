document.addEventListener('DOMContentLoaded', () => {

  const sidebar = document.querySelector('.sidebar')
  const toggleBtn = document.getElementById('toggleSidebar')

  // Toggle sidebar
  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('hidden')
  })

  // Mostrar/ocultar submenus
  const mainButtons = document.querySelectorAll('.main-btn')
  mainButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target')
      const targetDiv = document.getElementById(targetId)

      document.querySelectorAll('.submenu').forEach(sub => {
        if (sub.id !== targetId) sub.style.display = 'none'
      })

      if (getComputedStyle(targetDiv).display === 'none') {
        targetDiv.style.display = 'flex'
      } else {
        targetDiv.style.display = 'none'
      }
    })
  })

  const title = document.getElementById('dashboard-title')
  const iframe = document.getElementById('looker')
  let brandValue = null
  let plateCodeValue = null
  let dealerCodeValue = null
  let monthValue = null
  let yearValue = null

  function loadExplore(exploreName, exploreTitle){
    title.textContent = exploreTitle
    iframe.src = `https://renaultssadev.cloud.looker.com/embed/explore/zes/${exploreName}`
  }

  function loadDashboard(dashboardId, dashboardTitle) {
      title.textContent = dashboardTitle
      
      let baseUrl = `https://renaultssadev.cloud.looker.com/embed/dashboards/${dashboardId}?embed_domain=https://laura-diaz-dvt.github.io&sdk=3&allow_login_screen=true`

      if (brandValue) {
        const encodedBrand = encodeURIComponent(brandValue)
        if (dashboardId === 5978) baseUrl += `&Sale+Car+Brand=${encodedBrand}`
        else if (dashboardId === 5909) baseUrl += `&Operation+Brand=${encodedBrand}`
        else baseUrl += `&Brand=${encodedBrand}`
      }
      if (plateCodeValue) baseUrl += `&Plate+Code=${encodeURIComponent(plateCodeValue)}`
      if (dealerCodeValue) baseUrl += `&Dealer+Code=${encodeURIComponent(dealerCodeValue)}`
      if (monthValue) {
        const encodedMonth = encodeURIComponent(monthValue)
        baseUrl += (dashboardId === 5909 ? `&Fecha+Contratos+Month+Name=${encodedMonth}` : `&Fecha+Month+Name=${encodedMonth}`)
      }
      if (yearValue) {
        const encodedYear = encodeURIComponent(yearValue)
        baseUrl += (dashboardId === 5909 ? `&Fecha+Contratos+Year=${encodedYear}` : `&Fecha+Year=${encodedYear}`)
      }

      iframe.src = baseUrl
  }

  // Dashboards
  document.getElementById('btnD5959').addEventListener('click', () => loadDashboard(5959, 'Bienvenida/o al Portal Mobilize'))
  document.getElementById('btnD5978').addEventListener('click', () => loadDashboard(5978, 'Ventas'))
  document.getElementById('btnD5661').addEventListener('click', () => loadDashboard(5661, 'Informe Comercial'))
  document.getElementById('btnD5909').addEventListener('click', () => loadDashboard(5909, 'Producción detallada financiación'))

  // Explores
  document.getElementById('btnE_informe_comercial').addEventListener('click', () => loadExplore('informe_comercial', 'Informe comercial'))
  document.getElementById('btnE_pedidos').addEventListener('click', () => loadExplore('fact_order', 'Pedidos'))
  document.getElementById('btnE_ventas').addEventListener('click', () => loadExplore('fact_sales', 'Ventas'))
  document.getElementById('btnE_solicitudes').addEventListener('click', () => loadExplore('fact_proposal', 'Solicitudes'))

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
})
