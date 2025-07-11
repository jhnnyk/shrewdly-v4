<script setup>
import { useSkateparkStore } from '@/stores/SkateparkStore'

const skateparkStore = useSkateparkStore()
</script>

<template>
  <section v-for="park in skateparkStore.getParks" :key="park.id">
    <h1>{{ park.name }}</h1>
  </section>
</template>
