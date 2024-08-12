let mapContainer = document.createElement("div");
mapContainer.id = "map";
document.getElementById("map-container").appendChild(mapContainer);
// DISPLAYING MAP
var map = L.map("map").setView([latitude, longitude], 10);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

L.marker([latitude, longitude])
  .addTo(map)
  .bindPopup(`${city} , ${country}`)
  .openPopup();
