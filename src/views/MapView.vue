<script setup>
import { ref, onMounted } from 'vue'
import { LMap, LTileLayer, LMarker, LPopup } from 'vue-leaflet'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'

const center = ref([39.5, -98.35]) // USA center
const zoom = ref(5)

import { useSkateparkStore } from '@/stores/SkateparkStore'

const skateparkStore = useSkateparkStore()
</script>

<template>
  <div v-if="skateparkStore.isLoading">Loading ....</div>
  <div v-else>
    <l-map :zoom="zoom" :center="center" style="height: 500px; width: 100%">
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <l-marker
        v-for="park in skateparkStore.getParks"
        :key="park.id"
        :lat-lng="[park.latitude, park.longitude]"
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
