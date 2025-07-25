<script setup>
import { useSkateparkStore } from '@/stores/SkateparkStore'

const skateparkStore = useSkateparkStore()
</script>

<template>
  <header>
    <h1 class="logo">Shredly</h1>
    <p>Discover amazing skateparks. Log your sessions. Add photos.</p>
  </header>
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
