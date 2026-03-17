async function obtenerProductos(){

const { data, error } = await supabase
.from("productos")
.select("*")

if(error){
console.error("Error cargando productos:", error)
return []
}

return data

}