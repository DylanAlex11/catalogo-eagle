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
async function obtenerProductos() {

  const { data, error } = await supabase
    .from("productos")
    .select("*");

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) {
    console.error("Error cargando productos:", error);
    return [];
  }

  return data;
}