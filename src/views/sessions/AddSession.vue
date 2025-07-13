<script setup>
import { ref } from 'vue'
import { useSkateparkStore } from '@/stores/SkateparkStore'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const skateparkStore = useSkateparkStore()
const date = ref()
const duration = ref()
const title = ref('')
const notes = ref('')
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

        <div class="field">
          <label for="duration">duration</label><br />
          <select v-model="duration" name="duration" id="duration">
            <option value="15">15m</option>
            <option value="30">30m</option>
            <option value="45">45m</option>
            <option value="60">1hr</option>
            <option value="75">1hr 15m</option>
            <option value="90">1hr 30m</option>
            <option value="105">1hr 45m</option>
            <option value="120">2hr</option>
            <option value="135">2hr 15m</option>
          </select>
        </div>

        <div class="field">
          <label for="title">title</label><br />
          <input
            v-model="title"
            type="text"
            id="title"
            name="title"
            placeholder="Saturday w/ the crew"
            required
          />
        </div>

        <div class="field">
          <label for="notes">notes</label><br />
          <textarea
            v-model="notes"
            name="notes"
            id="notes"
            placeholder="Had a great time with my friends... "
          ></textarea>
        </div>

        <div class="field">
          <button class="large" type="submit">
            <span class="material-symbols-outlined"> add_circle </span> Save Session
          </button>
        </div>
      </form>
    </section>
  </div>
</template>

<style></style>
