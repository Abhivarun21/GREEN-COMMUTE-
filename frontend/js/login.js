async function handleLogin(){

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("http://localhost:3001/api/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (res.ok) {
    //  store ONLY token
    localStorage.setItem("token", data.token);

    window.location.href = "dashboard.html";
  } else {
    document.getElementById("error-msg").style.display = "block";
  }
}