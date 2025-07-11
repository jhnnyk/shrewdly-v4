<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useUserStore } from './stores/UserStore'
import { useSkateparkStore } from './stores/SkateparkStore'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'

import NavBar from './components/NavBar.vue'

const userStore = useUserStore()
const skateparkStore = useSkateparkStore()

onMounted(() => {
  skateparkStore.fetchParks()
  console.log('fetching all skateparks')

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      userStore.setUser(user)
    } else {
      // User is signed out
      userStore.clearUser()
    }
  })
})
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
