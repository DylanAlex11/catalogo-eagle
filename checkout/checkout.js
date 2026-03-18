const tienda = {
  lat:-0.1807,
  lng:-78.4678
}

let mapa = L.map("map").setView([tienda.lat,tienda.lng],13)

L.tileLayer(
"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
{maxZoom:19}
).addTo(mapa)

let marcador

// 📍 BUSCAR DIRECCIÓN
async function buscarDireccion(){

  let texto = document.getElementById("direccionBusqueda").value

  let res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${texto}`
  )

  let data = await res.json()

  if(data.length === 0){
    alert("Dirección no encontrada")
    return
  }

  let lat = parseFloat(data[0].lat)
  let lon = parseFloat(data[0].lon)

  mapa.setView([lat,lon],16)

  if(marcador) mapa.removeLayer(marcador)

  marcador = L.marker([lat,lon]).addTo(mapa)

  window.lat = lat
  window.lng = lon

  calcularEnvioFinal()
}

// 📍 CLICK EN MAPA
mapa.on("click",function(e){

  if(marcador) mapa.removeLayer(marcador)

  marcador = L.marker(e.latlng).addTo(mapa)

  window.lat = e.latlng.lat
  window.lng = e.latlng.lng

  calcularEnvioFinal()
})

// 📏 DISTANCIA
function calcularDistancia(lat1,lon1,lat2,lon2){

  let R = 6371

  let dLat = (lat2-lat1)*(Math.PI/180)
  let dLon = (lon2-lon1)*(Math.PI/180)

  let a =
  Math.sin(dLat/2)**2 +
  Math.cos(lat1*Math.PI/180) *
  Math.cos(lat2*Math.PI/180) *
  Math.sin(dLon/2)**2

  return 2*R*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))
}

// 🚚 ENVÍO
function calcularEnvio(d){
  if(d<=5) return 2
  if(d<=10) return 3
  if(d<=20) return 5
  if(d<=40) return 8
  return 12
}

// 🔥 TOTAL PRODUCTOS + FINAL
function calcularTotal(){

  let carrito = JSON.parse(localStorage.getItem("carrito")) || []

  let totalProductos =
  carrito.reduce((acc,p)=>acc + p.precio*p.cantidad,0)

  let envio =
  parseFloat(document.getElementById("envio").innerText)

  let totalFinal = totalProductos + envio

  document.getElementById("totalProductos").innerText = totalProductos
  document.getElementById("totalFinal").innerText = totalFinal
}

// 🔥 FUNCIÓN PRINCIPAL
function calcularEnvioFinal(){

  if(!window.lat || !window.lng) return

  let distancia =
  calcularDistancia(
    tienda.lat,
    tienda.lng,
    window.lat,
    window.lng
  )

  let envio = calcularEnvio(distancia)

  document.getElementById("distancia").innerText = distancia.toFixed(2)
  document.getElementById("envio").innerText = envio

  calcularTotal()
}

// 💾 CREAR PEDIDO
async function crearPedido(){

  let cliente = document.getElementById("nombre").value
  let telefono = document.getElementById("telefono").value
  let ciudad = document.getElementById("ciudad").value
  let direccion = document.getElementById("calle").value

  if(!cliente || !telefono){
    alert("Completa los datos")
    return null
  }

  if(!window.lat){
    alert("Selecciona ubicación en el mapa")
    return null
  }

  let envio = parseFloat(document.getElementById("envio").innerText)
  let carrito = JSON.parse(localStorage.getItem("carrito")) || []

  let total = carrito.reduce((acc,p)=>acc+p.precio*p.cantidad,0)+envio

  const { data, error } = await supabaseClient
  .from("pedidos")
  .insert([{
    cliente,
    telefono,
    direccion,
    ciudad,
    lat:window.lat,
    lng:window.lng,
    envio,
    productos:carrito,
    total,
    estado:"pendiente",
    fecha:new Date()
  }])
  .select()

  if(error){
    alert("Error al guardar pedido")
    console.error(error)
    return null
  }

  return data[0]
}

// 💬 TRANSFERENCIA
async function pagarTransferencia(){

  let pedido = await crearPedido()
  if(!pedido) return

  let mensaje =
  `Hola, hice el pedido #${pedido.id}\n`+
  `Total: $${pedido.total}\n`+
  `Cliente: ${pedido.cliente}\n`+
  `Dirección: ${pedido.direccion}, ${pedido.ciudad}\n\n`+
  `Quiero pagar por transferencia`

  window.open(
    `https://wa.me/525670072002?text=${encodeURIComponent(mensaje)}`
  )

  localStorage.removeItem("carrito")
}

// 💳 PAYPHONE
async function pagarPayphone(){

  let pedido = await crearPedido()
  if(!pedido) return

  let linkPayphone =
  "https://pay.payphonetodoesposible.com/XXXXXXXX"

  window.location.href = linkPayphone
}

// 🚀 CALCULAR TOTAL AL CARGAR
window.onload = function(){
  calcularTotal()
}