import { DASHBOARDS, LOOKER_ORIGIN, EMBED_DOMAIN } from "./config.js"


const sidebar = document.getElementById("sidebar")
const toggleBtn = document.getElementById("toggleSidebar")
const menu = document.getElementById("menu")
const iframe = document.getElementById("looker")
const title = document.getElementById("dashboard-title")


const state = {
filters: {
Brand: null,
"Plate Code": null,
"Dealer Code": null,
"Fecha Month Name": null,
"Fecha Year": null
}
}


toggleBtn.addEventListener("click", () => {
sidebar.classList.toggle("hidden")
})


function buildDashboardUrl(id) {
const url = new URL(`${LOOKER_ORIGIN}/embed/dashboards/${id}`)


url.searchParams.set("embed_domain", EMBED_DOMAIN)
url.searchParams.set("sdk", "3")
url.searchParams.set("allow_login_screen", "true")


Object.entries(state.filters).forEach(([key, value]) => {
if (value) url.searchParams.set(key, value)
})


return url.toString()
}


function loadDashboard({ id, title: dashboardTitle }) {
title.textContent = dashboardTitle
iframe.src = buildDashboardUrl(id)
}


DASHBOARDS.forEach(dashboard => {
const button = document.createElement("button")
button.className = "menu-button"
button.textContent = dashboard.title


button.addEventListener("click", () => loadDashboard(dashboard))
menu.appendChild(button)
})


loadDashboard(DASHBOARDS[0])


window.addEventListener("message", event => {
if (event.origin !== LOOKER_ORIGIN || event.source !== iframe.contentWindow) return


const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data
if (data.type !== "dashboard:run:complete") return


const filters = data.dashboard?.dashboard_filters || {}


Object.keys(state.filters).forEach(key => {
if (filters[key]) state.filters[key] = filters[key]
})
})
