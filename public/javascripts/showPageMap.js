mapboxgl.accessToken = mapsToken;
var campData = JSON.parse(campground);
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v12', // style URL
center: campData.location.geometry.coordinates, // starting position [lng, lat]
zoom: 9, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

const marker1 = new mapboxgl.Marker()
.setLngLat(campData.location.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset:15})
    .setHTML(`<h5>${campData.title}</h5>`)
)
.addTo(map);