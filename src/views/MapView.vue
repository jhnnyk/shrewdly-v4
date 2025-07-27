<script setup>
import { ref } from 'vue'
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet'
import L from 'leaflet'
import { useSkateparkStore } from '@/stores/SkateparkStore'

const center = ref([39.5, -98.35]) // USA center
const zoom = ref(5)
const leafletMap = ref(null)

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
</style>
