<script setup>
import { ref } from 'vue'
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet'
import L from 'leaflet'
import { useSkateparkStore } from '@/stores/SkateparkStore'

const center = ref([39.5, -98.35]) // USA center
const zoom = ref(5)
const leafletMap = ref(null)
const nearbyParks = ref([])

const skateparkStore = useSkateparkStore()

// Pink marker with "skateboarding" icon
const skateIcon = new L.DivIcon({
  html: `
    <div class="custom-marker-wrapper">
      <div class="custom-marker-pin"></div>
      <span class="material-symbols-outlined custom-marker-icon">skateboarding</span>
    </div>
  `,
  className: '', // Prevents Leaflet default styles
  iconSize: [32, 32],
  iconAnchor: [16, 32], // bottom-center of the circle
  popupAnchor: [0, -32],
})

const onMapReady = (mapInstance) => {
  leafletMap.value = mapInstance

  const latlngs = skateparkStore.getParks.map((park) => [park.latitude, park.longitude])
  if (latlngs.length > 0) {
    const bounds = L.latLngBounds(latlngs)
    mapInstance.fitBounds(bounds, { padding: [20, 20] })
  }
}

// User location -------
function toRad(degrees) {
  return (degrees * Math.PI) / 180
}

function getDistanceMiles(lat1, lng1, lat2, lng2) {
  const R = 3958.8 // miles
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function locateUser() {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser.')
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords

      // Zoom map to user location
      if (leafletMap.value) {
        leafletMap.value.setView([latitude, longitude], 12)
      }

      // Find nearest skateparks
      const sorted = skateparkStore.getParks
        .map((park) => {
          const distance = getDistanceMiles(latitude, longitude, park.latitude, park.longitude)
          return { ...park, distance }
        })
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 10)

      nearbyParks.value = sorted
    },
    (error) => {
      alert('Could not get your location.')
      console.error(error)
    },
  )
}
</script>

<template>
  <div v-if="skateparkStore.isLoading">Loading ....</div>
  <div v-else>
    <l-map :zoom="zoom" :center="center" style="height: 500px; width: 100%" @ready="onMapReady">
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <l-marker
        v-for="park in skateparkStore.getParks"
        :key="park.id"
        :lat-lng="[park.latitude, park.longitude]"
        :icon="skateIcon"
      >
        <l-popup>
          <strong>{{ park.name }}</strong
          ><br />
          {{ park.city }}
        </l-popup>
      </l-marker>
    </l-map>

    <p class="location-button">
      <button @click="locateUser">
        <span class="material-symbols-outlined"> location_on </span>
        Use My Location
      </button>
    </p>

    <ul v-if="nearbyParks.length" class="park-list">
      <li v-for="park in nearbyParks" :key="park.id">
        <RouterLink :to="`/skateparks/${park.state.slice(3)}/${park.slug}/${park.id}`">
          <section>
            <h3>{{ park.name }}</h3>
            <p>
              <span class="material-symbols-outlined"> location_on </span>
              {{ park.city }}, {{ park.state.substring(0, 2) }}
              <span class="highlight">{{ park.distance.toFixed(1) }} mi</span>
            </p>

            <div class="stats">
              <p>
                <span class="material-symbols-outlined"> photo_camera </span>
                {{ park.uploadsCount }} photos
              </p>
              <p>
                <span class="material-symbols-outlined"> group </span>
                {{ park.sessionCount }} sessions
              </p>
            </div>
          </section>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<style>
.custom-marker-wrapper {
  width: 32px;
  height: 32px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-marker-pin {
  width: 32px;
  height: 32px;
  background-color: var(--highlight-color); /* Tailwind's pink-500 */
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  position: absolute;
  top: 0;
  left: 0;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

.custom-marker-icon {
  position: relative;
  color: white;
  font-size: 18px;
  z-index: 1;
}

.location-button {
  margin: 20px 0;
  text-align: center;
}
</style>
