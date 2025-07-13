<script setup>
import { useSkateparkStore } from '@/stores/SkateparkStore'

const skateparkStore = useSkateparkStore()
</script>

<template>
  <div v-if="skateparkStore.isLoading">Loading ....</div>

  <div v-else>
    {{ skateparkStore.getCurrentPark.name }}
  </div>
</template>
