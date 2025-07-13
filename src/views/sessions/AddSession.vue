<script setup>
import { useSkateparkStore } from '@/stores/SkateparkStore'

const skateparkStore = useSkateparkStore()
</script>

<template>
  <div v-if="skateparkStore.isLoading">Loading ...</div>
  <div v-else>
    <h1>Add {{ skateparkStore.getCurrentPark.name }} Session</h1>
  </div>
</template>
