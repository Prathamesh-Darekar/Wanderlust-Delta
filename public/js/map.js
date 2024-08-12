let mapContainer = document.createElement("div");
mapContainer.id = "map";
document.getElementById("map-container").appendChild(mapContainer);
// DISPLAYING MAP
// const map = new maplibregl.Map({
//   container: "map",
//   style:
//     "https://api.maptiler.com/maps/streets/style.json?key=houAlUeGpISvpnNSbo2D",
//   center: [longitude, latitude], // longitude,latitude
//   zoom: 6,
// });
// const marker = new maplibregl.Marker({
//   scale: 0.7,
//   color: "#FE424D",
// })
//   .setLngLat([longitude, latitude])
//   .addTo(map);
var map = L.map("map").setView([latitude, longitude], 10);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

L.marker([latitude, longitude])
  .addTo(map)
  .bindPopup(`${city} , ${country}`)
  .openPopup();
