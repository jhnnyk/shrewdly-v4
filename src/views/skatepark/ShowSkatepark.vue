<script setup>
import { useSkateparkStore } from '@/stores/SkateparkStore'

const skateparkStore = useSkateparkStore()
</script>

<template>
  <div v-if="skateparkStore.isLoading">Loading ....</div>

  <div v-else>
    <h1>{{ skateparkStore.getCurrentPark.name }}</h1>
    <p>
      <span class="material-symbols-outlined"> location_on </span>
      {{ skateparkStore.getCurrentPark.city }},
      {{ skateparkStore.getCurrentPark.state.substring(0, 2) }}
    </p>

    <section>
      <span class="material-symbols-outlined solid highlight"> star </span>
      <span class="rating">0.0</span>
      <span class="rating-count">(0)</span>

      <div class="stats">
        <p><span class="material-symbols-outlined"> photo_camera </span> 0 photos</p>
        <p><span class="material-symbols-outlined"> group </span> 0 visits</p>
      </div>
      <div class="action-buttons">
        <button><span class="material-symbols-outlined"> add_circle </span> Add Session</button>
        <button class="inverted">
          <span class="material-symbols-outlined"> photo_camera </span> Add Photo
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stats p {
  margin: 10px 0 15px 0;
}

.action-buttons {
  display: flex;
}

.action-buttons button {
  flex-grow: 1;
}
</style>
