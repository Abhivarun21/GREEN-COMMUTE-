async function handleLogin(){

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("https://green-commute-uib8.onrender.com/api/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("error-msg").style.display = "block";
  }
}