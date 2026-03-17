async function verificarSesion(){

const { data } =
await supabase.auth.getSession()

if(!data.session){

window.location.href="login.html"

return

}

}

async function cargarProductos(){

const { data } =
await supabase
.from("productos")
.select("*")

const tabla =
document.getElementById("tablaProductos")

tabla.innerHTML=""

data.forEach(p=>{

tabla.innerHTML+=`

<tr>

<td>${p.id}</td>

<td>${p.nombre}</td>

<td>
<input type="number" id="precio-${p.id}" value="${p.precio}">
</td>

<td>
<input type="number" id="oferta-${p.id}" value="${p.preciooferta || ''}">
</td>

<td>
<button onclick="guardar(${p.id})">
Guardar
</button>
</td>

</tr>

`

})

}

async function guardar(id){

let precio =
document.getElementById(`precio-${id}`).value

let oferta =
document.getElementById(`oferta-${id}`).value

await supabase
.from("productos")
.update({
precio:precio,
preciooferta:oferta || null
})
.eq("id",id)

alert("Precio actualizado")

}

async function logout(){

await supabase.auth.signOut()

window.location.href="login.html"

}

verificarSesion()

cargarProductos()