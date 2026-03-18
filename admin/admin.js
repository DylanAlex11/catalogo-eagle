async function verificarSesion(){

  const { data } =
  await supabaseClient.auth.getSession()

  if(!data.session){
    window.location.href = "login.html"
    return
  }

}

async function cargarProductos(){

  const { data, error } =
  await supabaseClient
  .from("productos")
  .select("*")

  if(error){
    console.error(error)
    return
  }

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

  const { error } =
  await supabaseClient
  .from("productos")
  .update({
    precio:precio,
    preciooferta:oferta || null
  })
  .eq("id",id)

  if(error){
    alert("Error al guardar")
    console.error(error)
    return
  }

  alert("Precio actualizado")

}

async function logout(){

  await supabaseClient.auth.signOut()

  localStorage.removeItem("admin")

  window.location.href="login.html"

}

// 🚀 ejecutar correctamente
async function iniciarAdmin(){
  await verificarSesion()
  await cargarProductos()
}

iniciarAdmin()