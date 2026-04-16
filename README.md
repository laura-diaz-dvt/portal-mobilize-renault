## Consideraciones para implementar la herencia de filtros

* La URL de embebido debe incluirse en la lista de **Allow Embed Domain** en el panel de administración de Looker.  
Si el dominio no está permitido, la herencia de filtros entre dashboards embebidos no funcionará correctamente.

* El parámetro `&allow_login_screen=true` obliga a los usuarios a autenticarse en Looker antes de poder visualizar los dashboards embebidos:

```html
<iframe
  id="looker"
  src="https://nubalia.cloud.looker.com/embed/dashboards/356
    ?embed_domain=https://your-allowed-domain.com
    &sdk=3
    &allow_login_screen=true">
</iframe>
```

* Pasos para habilitar la herencia de filtros
1. Añadir el filtro en filterValues
```html
const filterValues = {
  Brand: null,
  PlateCode: null
}
```

2. Mapear los nombres de Looker a una clave común en filterKeys
```html
const filterKeys = {
  Brand: ["Brand", "Operation Brand"],
  PlateCode: ["Plate Code"]
}
```
3. Especificar qué dashboards utilizan este filtro
```html
const dashboards = {
  5959: { 
    title: "Bienvenida/o al Portal Mobilize",
    filters: { Brand: "Brand" }
  },
  5661: {
    title: "Informe Comercial",
    filters: { Brand: "Brand", PlateCode: "Plate Code" }
  },
  5909: {
    title: "Producción detallada financiación",
    filters: { Brand: "Operation Brand", PlateCode: "Plate Code" }
  }
}
```
