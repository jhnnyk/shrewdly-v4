<script setup>
import { ref } from 'vue'
import { useSkateparkStore } from '@/stores/SkateparkStore'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const skateparkStore = useSkateparkStore()
const date = ref()
</script>

<template>
  <div v-if="skateparkStore.isLoading">Loading ...</div>
  <div v-else>
    <section>
      <form>
        <h1>Add {{ skateparkStore.getCurrentPark.name }} Session</h1>
        <div class="field">
          <label for="date">date</label><br />
          <VueDatePicker v-model="date" :month-change-on-scroll="false" />
        </div>
      </form>
    </section>
  </div>
</template>

<style></style>
