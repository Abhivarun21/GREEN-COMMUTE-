const token = localStorage.getItem("token");
if (!token) window.location.href = "login.html";

/* NAVIGATION */
function showDashboard(){
document.getElementById("dashboardSection").style.display="block";
document.getElementById("historySection").style.display="none";
}
function showHistory(){
document.getElementById("dashboardSection").style.display="none";
document.getElementById("historySection").style.display="block";
loadHistory();
}

/* MAP */
var map = L.map('map').setView([17.385,78.486],12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
var routeLayer;

/* FIND ROUTE */
async function findRoute(){

let btn = document.getElementById("routeBtn");
btn.innerText = "Loading...";

let from=document.getElementById("from").value.trim();
let to=document.getElementById("to").value.trim();

if(!from || !to){
alert("Enter locations");
btn.innerText = "Find Route";
return;
}

try {

/* GEOCODING */
let geo1=await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${from}`);
let data1=await geo1.json();

let geo2=await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${to}`);
let data2=await geo2.json();

if(!data1.length || !data2.length){
alert("Invalid locations");
btn.innerText = "Find Route";
return;
}

let start=[data1[0].lon,data1[0].lat];
let end=[data2[0].lon,data2[0].lat];

/* ROUTE API */
let response = await fetch("http://localhost:3001/api/route", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ start, end })
});

let data = await response.json();

/* SAFE CHECK */
if (!data || !data.features || data.features.length === 0) {
  console.error("Route error:", data);
  alert("Route not found / API issue");
  btn.innerText = "Find Route";
  return;
}

/* DRAW MAP */
let coords = data.features[0].geometry.coordinates;
let latlngs = coords.map(c => [c[1], c[0]]);

if(routeLayer) map.removeLayer(routeLayer);

routeLayer = L.polyline(latlngs, { color:"blue", weight:5 }).addTo(map);
map.fitBounds(routeLayer.getBounds());

setTimeout(()=>map.invalidateSize(),200);

/* DISTANCE */
let distanceKm=data.features[0].properties.summary.distance/1000;

/* BACKEND */
let emissions=await fetch("http://localhost:3001/api/emission",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({distance:distanceKm})
}).then(r=>r.json());

let costs=await fetch("http://localhost:3001/api/cost",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({distance:distanceKm})
}).then(r=>r.json());

let modes=emissions.map(e=>{
let costRow=costs.find(c=>c.mode===e.mode);
return {...e, cost: costRow.cost};
});

/* ECO RECOMMENDATION */

let availableModes = modes.filter(mode => {

  let name = mode.mode.toLowerCase();

  // Remove train
  if (
    name.includes("train")
  ) {
    return false;
  }

  // Remove impractical modes
  if (distanceKm > 2 && name.includes("walk")) {
    return false;
  }

  if (distanceKm > 5 && name.includes("bike")) {
    return false;
  }

  return true;
});

// Safety fallback
if (availableModes.length === 0) {
  availableModes = modes;
}

// Lowest CO2
let bestEco = availableModes.reduce((best, current) => {

  return Number(current.carbon) < Number(best.carbon)
    ? current
    : best;

});

/* POPUP */
let container=document.getElementById("modeOptions");
container.innerHTML="";

modes.forEach(m=>{
let div=document.createElement("div");
div.className="mode-card";

let tag = (m.mode === bestEco.mode)
  ? "⭐ Recommended"
  : "";

div.innerHTML=`
<b>${m.mode}</b> ${tag}<br>
CO₂: ${m.carbon} | ₹${m.cost}
`;

div.onclick=()=>selectMode(m);
container.appendChild(div);
});

document.getElementById("modePopup").style.display="block";

} catch(err){
console.error(err);
alert("Something went wrong");
}

btn.innerText = "Find Route";
}

/* SAVE TRIP */
function selectMode(mode){
document.getElementById("modePopup").style.display="none";

fetch("http://localhost:3001/api/save-trip",{
method:"POST",
headers:{
"Content-Type":"application/json",
"Authorization":"Bearer "+token
},
body:JSON.stringify({
from:document.getElementById("from").value,
to:document.getElementById("to").value,
mode:mode.mode,
co2:mode.carbon_saved,
cost:mode.cost
})
}).then(()=>loadDashboard());
}

/* DASHBOARD */
async function loadDashboard(){
let res=await fetch("http://localhost:3001/api/trips",{
headers:{"Authorization":"Bearer "+token}
});
let trips=await res.json();

document.getElementById("totalTrips").innerText=trips.length;

let co2=trips.reduce((s,t)=>s+Number(t.co2_saved),0);
document.getElementById("co2Saved").innerText=co2.toFixed(2)+" kg";

let ecoTrips=trips.filter(t=>Number(t.co2_saved)>0).length;
document.getElementById("ecoTrips").innerText=ecoTrips;

let money=trips.reduce((s,t)=>s+Number(t.cost),0);
document.getElementById("moneySpent").innerText="₹"+money.toFixed(2);
}

/* HISTORY */
async function loadHistory(){
let res=await fetch("http://localhost:3001/api/trips",{
headers:{"Authorization":"Bearer "+token}
});
let trips=await res.json();

let table="";
trips.forEach(t=>{
table+=`<tr>
<td>${t.from_location}</td>
<td>${t.to_location}</td>
<td>${t.mode}</td>
<td>${t.co2_saved}</td>
<td>₹${t.cost}</td>
<td>${new Date(t.date).toLocaleDateString()}</td>
</tr>`;
});
document.getElementById("historyTable").innerHTML=table;
}

function closePopup(){
document.getElementById("modePopup").style.display="none";
}

window.onload=loadDashboard;
