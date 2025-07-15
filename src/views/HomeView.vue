<script setup>
import { useSkateparkStore } from '@/stores/SkateparkStore'

const skateparkStore = useSkateparkStore()
</script>

<template>
  <div v-if="skateparkStore.isLoading">Loading ....</div>
  <div v-else>
    <ul class="park-list">
      <li v-for="park in skateparkStore.getParks" :key="park.id">
        <RouterLink :to="`/skateparks/${park.state.slice(3)}/${park.slug}/${park.id}`">
          <section>
            <h3>{{ park.name }}</h3>
            <p>
              <span class="material-symbols-outlined"> location_on </span>
              {{ park.city }}, {{ park.state.substring(0, 2) }}
            </p>

            <div class="stats">
              <p><span class="material-symbols-outlined"> photo_camera </span> 0 photos</p>
              <p><span class="material-symbols-outlined"> group </span> 0 sessions</p>
            </div>
          </section>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
