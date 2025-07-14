<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSkateparkStore } from '@/stores/SkateparkStore'
import { useUserStore } from '@/stores/UserStore'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/firebase'

const skateparkStore = useSkateparkStore()
const userStore = useUserStore()
const router = useRouter()

const date = ref()
const duration = ref()
const title = ref('')
const notes = ref('')

const addSession = async () => {
  // add to DB
  const docRef = await addDoc(collection(db, 'sessions'), {
    skateparkId: skateparkStore.getCurrentPark.id,
    userId: userStore.user.uid,
    displayName: userStore.user.displayName,
    sessionDate: date.value,
    duration: duration.value,
    sport: userStore.user.sport,
    title: title.value,
    notes: notes.value,
  })

  // confirm write
  console.log('Session added with ID: ', docRef.id)

  // redirect back to skatepark page
  router.push({
    name: 'show skatepark',
    params: {
      stateSlug: skateparkStore.getCurrentPark.state.slice(3),
      slug: skateparkStore.getCurrentPark.slug,
    },
  })
}
</script>

<template>
  <div v-if="skateparkStore.isLoading || userStore.isLoading">Loading ...</div>
  <div v-else>
    <section>
      <form @submit.prevent="addSession">
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
            <option value="150">2hr 30m</option>
            <option value="165">2hr 45m</option>
            <option value="180">3hr</option>
          </select>
        </div>

        <div class="field">
          <label for="sport">activity</label><br />
          <select v-model="userStore.user.sport" name="sport" id="sport">
            <option value="skateboard">Skateboard</option>
            <option value="scooter">Scooter</option>
            <option value="BMX">BMX</option>
            <option value="inline">Inline Skates</option>
            <option value="quad">Quad Skates</option>
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
