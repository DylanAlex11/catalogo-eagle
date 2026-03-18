async function login(){

  const email =
  document.getElementById("email").value

  const password =
  document.getElementById("password").value

  const { data, error } =
  await supabaseClient.auth.signInWithPassword({
    email,
    password
  })

  if(error){
    alert("Credenciales incorrectas")
    return
  }

  // ✅ guarda sesión básica
  localStorage.setItem("admin", "true")

  window.location.href = "admin.html"

}