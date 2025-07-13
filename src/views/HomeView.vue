<script setup>
import { useSkateparkStore } from '@/stores/SkateparkStore'

const skateparkStore = useSkateparkStore()
</script>

<template>
  <section v-for="park in skateparkStore.getParks" :key="park.id" class="listing">
    <h3>{{ park.name }}</h3>
    <p>
      <span class="material-symbols-outlined"> location_on </span>
      {{ park.city }}, {{ park.state.substring(0, 2) }}
    </p>

    <div class="stats">
      <p><span class="material-symbols-outlined"> photo_camera </span> 0 photos</p>
      <p><span class="material-symbols-outlined"> group </span> 0 visits</p>
    </div>
  </section>
</template>
