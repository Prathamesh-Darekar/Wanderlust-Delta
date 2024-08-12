let mapContainer = document.createElement("div");
mapContainer.id = "map";
document.getElementById("map-container").appendChild(mapContainer);
// DISPLAYING MAP
const map = new maplibregl.Map({
  container: "map",
  style:
    "https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL",
  center: [longitude, latitude], // longitude,latitude
  zoom: 6,
});
const marker = new maplibregl.Marker({
  scale: 0.7,
  color: "#FE424D",
})
  .setLngLat([longitude, latitude])
  .addTo(map);
console.log(longitude);
console.log(latitude);
