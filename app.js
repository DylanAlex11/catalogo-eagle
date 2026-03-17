let productos = []

let carrito =
JSON.parse(localStorage.getItem("carrito")) || []

async function iniciarCatalogo(){

productos = await obtenerProductos()

ordenarOfertas()

mostrarProductos(productos)

mostrarDestacados()

actualizarContador()

}

iniciarCatalogo()

function ordenarOfertas(){

productos.sort((a,b)=>{

if(b.oferta && !a.oferta) return 1
if(a.oferta && !b.oferta) return -1
return 0

})

}

function crearCard(p){

let precioHTML = ""

if(p.oferta){

precioHTML = `
<p>
<span style="text-decoration:line-through;color:#999">
$${p.precio}
</span>
<strong style="color:red">
$${p.precioOferta}
</strong>
</p>
`

}else{

precioHTML = `<p>$${p.precio}</p>`

}

return `

<div class="card" onclick="abrirModal(${p.id})">

<img src="${p.imagen}">

<h3>${p.nombre}</h3>

${precioHTML}

<button onclick="event.stopPropagation(); abrirModal(${p.id})">

Ver producto

</button>

</div>

`

}

function mostrarProductos(lista){

const contenedor =
document.getElementById("productos")

contenedor.innerHTML = ""

lista.forEach(p => {

contenedor.innerHTML += crearCard(p)

})

}

function mostrarDestacados(){

const contenedor =
document.getElementById("destacados")

let destacados = productos.slice(0,3)

contenedor.innerHTML = ""

destacados.forEach(p => {

contenedor.innerHTML += crearCard(p)

})

}

function buscarProducto(){

let texto =
document.getElementById("buscador")
.value
.toLowerCase()

let filtrados =
productos.filter(p =>
p.nombre
.toLowerCase()
.includes(texto)
)

mostrarProductos(filtrados)

}

function filtrarCategoria(cat){

if(cat=="todos"){

mostrarProductos(productos)

return

}

let filtrados =
productos.filter(p =>
p.categoria == cat
)

mostrarProductos(filtrados)

}

function abrirModal(id){

let producto =
productos.find(p => p.id == id)

let precio = producto.oferta
? "$"+producto.precioOferta
: "$"+producto.precio

document.getElementById("modalImagen")
.src = producto.imagen

document.getElementById("modalNombre")
.innerText = producto.nombre

document.getElementById("modalPrecio")
.innerText = precio

document.getElementById("modalMarca")
.innerText = "Marca: " + producto.marca

document.getElementById("modalModelo")
.innerText = "Modelo: " + producto.modelo

document.getElementById("modalDescripcion")
.innerText = producto.descripcion

document.getElementById("modalAgregar")
.onclick = () => agregarCarrito(id)

document.getElementById("modalProducto")
.style.display="flex"

}

function cerrarModal(){

document.getElementById("modalProducto")
.style.display="none"

}

function agregarCarrito(id){

let producto =
productos.find(p => p.id == id)

let existente =
carrito.find(p => p.id == id)

let precioFinal = producto.oferta
? producto.precioOferta
: producto.precio

if(existente){

existente.cantidad++

}else{

carrito.push({
...producto,
precio:precioFinal,
cantidad:1
})

}

guardarCarrito()

mostrarNotificacion()

animarCarrito()

}

function abrirCarrito(){

let lista =
document.getElementById("listaCarrito")

lista.innerHTML=""

let total = 0

carrito.forEach(p=>{

let subtotal = p.precio * p.cantidad

total += subtotal

lista.innerHTML+=`

<li>

<strong>${p.nombre}</strong><br>

Marca: ${p.marca}<br>

Modelo: ${p.modelo}<br>

Cantidad: ${p.cantidad}<br>

Subtotal: $${subtotal}

<div>

<button onclick="sumar(${p.id})">+</button>

<button onclick="restar(${p.id})">-</button>

</div>

</li>

`

})

document.getElementById("totalCarrito")
.innerText = total

document.getElementById("carrito")
.style.display="block"

}

function cerrarCarrito(){

document.getElementById("carrito")
.style.display="none"

}

function sumar(id){

let p = carrito.find(x=>x.id==id)

p.cantidad++

guardarCarrito()

}

function restar(id){

let p = carrito.find(x=>x.id==id)

p.cantidad--

if(p.cantidad<=0){

carrito = carrito.filter(x=>x.id!=id)

}

guardarCarrito()

}

function vaciarCarrito(){

carrito=[]

guardarCarrito()

}

function guardarCarrito(){

localStorage.setItem(
"carrito",
JSON.stringify(carrito)
)

actualizarContador()

abrirCarrito()

}

function actualizarContador(){

let total=0

carrito.forEach(p=>{

total+=p.cantidad

})

document
.getElementById("contadorCarrito")
.innerText = total

}

function enviarWhatsApp(){

if(carrito.length === 0){
alert("Tu carrito está vacío")
return
}

let nombre = prompt("Ingresa tu nombre para enviar el pedido:")

if(!nombre){
alert("Debes ingresar tu nombre para continuar")
return
}

let fecha = new Date().toLocaleString()

let mensaje =
"Hola, quiero hacer el siguiente pedido:%0A%0A"

mensaje += `Cliente: ${nombre}%0A`
mensaje += `Fecha: ${fecha}%0A%0A`

let total = 0

carrito.forEach(p=>{

let subtotal = p.precio * p.cantidad

total += subtotal

mensaje += `• ${p.nombre}%0A`
mensaje += `Marca: ${p.marca}%0A`
mensaje += `Modelo: ${p.modelo}%0A`
mensaje += `Categoría: ${p.categoria}%0A`
mensaje += `Cantidad: ${p.cantidad}%0A`
mensaje += `Subtotal: $${subtotal}%0A%0A`

})

mensaje += `%0A--------------------%0A`

mensaje += `TOTAL: $${total}%0A`

window.open(
`https://wa.me/525670072002?text=${mensaje}`
)

}

function generarPDF(){

const { jsPDF } = window.jspdf

const doc = new jsPDF()

doc.text("Pedido de productos",20,20)

let y=40

carrito.forEach(p=>{

doc.text(
`${p.nombre} x ${p.cantidad}`,
20,
y
)

y+=10

})

doc.save("pedido.pdf")

}

function mostrarNotificacion(){

let n =
document.getElementById("notificacion")

n.classList.add("mostrar")

setTimeout(()=>{

n.classList.remove("mostrar")

},2000)

}

function animarCarrito(){

let carritoIcon =
document.querySelector(".botonCarrito")

carritoIcon.classList.add("rebote")

setTimeout(()=>{

carritoIcon.classList.remove("rebote")

},300)

}
async function iniciarCatalogo(){

  productos = await obtenerProductos()

  console.log("PRODUCTOS:", productos) // 👈 ESTA LÍNEA

  ordenarOfertas()
  mostrarProductos(productos)
  mostrarDestacados()
  actualizarContador()

}