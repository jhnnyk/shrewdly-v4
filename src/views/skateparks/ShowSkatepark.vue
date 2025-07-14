<script setup>
import { useSkateparkStore } from '@/stores/SkateparkStore'
import { useSessionStore } from '@/stores/SessionStore'
import { onMounted } from 'vue'

const skateparkStore = useSkateparkStore()
const sessionStore = useSessionStore()

onMounted(() => {
  sessionStore.fetchSessions()
  console.log('fetching sessions')
})

const formatDate = (date) => {
  return date.toDate().toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getSportIcon = (sport) => {
  switch (sport) {
    case 'skateboard':
      return 'skateboarding'
    case 'inline':
      return 'roller_skating'
    case 'quad':
      return 'roller_skating'
    case 'BMX':
      return 'pedal_bike'
    case 'scooter':
      return 'scooter'
    default:
      ' '
      break
  }
}
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
        <p><span class="material-symbols-outlined"> group </span> 0 sessions</p>
      </div>
      <div class="action-buttons">
        <RouterLink
          :to="`/skateparks/${skateparkStore.getCurrentPark.state.slice(3)}/${skateparkStore.getCurrentPark.slug}/sessions/add`"
        >
          <button><span class="material-symbols-outlined"> add_circle </span> Add Session</button>
        </RouterLink>
        <a href="#">
          <button class="inverted">
            <span class="material-symbols-outlined"> photo_camera </span> Add Photo
          </button>
        </a>
      </div>
    </section>

    <div>
      <h4>Recent Sessions</h4>
      <ul>
        <li v-for="session in sessionStore.getSessions" :key="session.id">
          <span class="material-symbols-outlined">
            {{ getSportIcon(session.sport) }}
          </span>

          {{ formatDate(session.sessionDate) }} : {{ session.title }} - {{ session.displayName }}
        </li>
      </ul>
    </div>

    <div class="admin">
      <h4>Admin</h4>
      <RouterLink
        :to="`/skateparks/${skateparkStore.getCurrentPark.state.slice(3)}/${skateparkStore.getCurrentPark.slug}/edit`"
      >
        <button class="inverted">
          <span class="material-symbols-outlined"> edit </span>
          Edit {{ skateparkStore.getCurrentPark.name }}
        </button>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.stats p {
  margin: 10px 0 15px 0;
}

.action-buttons {
  display: flex;
}

.action-buttons a {
  flex-grow: 1;
  margin: 0 10px 0 5px;
}

.action-buttons button {
  display: block;
  width: 100%;
}
</style>
