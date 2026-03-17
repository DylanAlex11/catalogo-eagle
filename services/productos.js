async function obtenerProductos() {
  try {

    const { data, error } = await supabaseClient
      .from("productos")
      .select("*");

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
      console.error("Error Supabase:", error);
      return [];
    }

    return data || [];

  } catch (e) {
    console.error("Error general:", e);
    return [];
  }
}