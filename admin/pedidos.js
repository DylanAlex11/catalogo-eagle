let mapa =
L.map("map").setView([-0.1807,-78.4678],12)

L.tileLayer(
"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
{maxZoom:19}
).addTo(mapa)

let marcador

async function cargarPedidos(){

const { data } =
await supabase
.from("pedidos")
.select("*")
.order("id",{ascending:false})

const tabla =
document.getElementById("tablaPedidos")

tabla.innerHTML=""

data.forEach(p=>{

tabla.innerHTML+=`

<tr>

<td>${p.id}</td>

<td>${p.cliente}</td>

<td>${p.ciudad || ""}</td>

<td>$${p.total}</td>

<td>
<select onchange="cambiarEstado(${p.id}, this.value)">
<option ${p.estado=="pendiente"?"selected":""}>pendiente</option>
<option ${p.estado=="en camino"?"selected":""}>en camino</option>
<option ${p.estado=="entregado"?"selected":""}>entregado</option>
</select>
</td>

<td>
<button onclick="verMapa(${p.lat},${p.lng})">
Ver
</button>
</td>

</tr>

`

})

}

function verMapa(lat,lng){

if(marcador){
mapa.removeLayer(marcador)
}

mapa.setView([lat,lng],15)

marcador =
L.marker([lat,lng]).addTo(mapa)

}

async function cambiarEstado(id,estado){

await supabase
.from("pedidos")
.update({estado})
.eq("id",id)

}

cargarPedidos()