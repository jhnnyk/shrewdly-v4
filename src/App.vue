<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <header>
    <h1 class="logo">Shredly</h1>
  </header>

  <main>
    <RouterView />
  </main>

  <NavBar />
</template>

<style scoped></style>
