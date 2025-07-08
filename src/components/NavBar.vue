<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav>
    <RouterLink to="/">
      <span class="material-symbols-outlined"> home </span><br />
      Home
    </RouterLink>
    <RouterLink to="/about">
      <span class="material-symbols-outlined"> settings </span><br />
      About
    </RouterLink>
  </nav>
</template>

<style>
nav {
  position: fixed;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  bottom: 0;
  width: 100%;
  height: 70px;
  background-color: var(--content-bg-color);
  border-top: 1px solid var(--content-border-color);
  text-align: center;
}

nav a {
  text-decoration: none;
}
</style>
