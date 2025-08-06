<script setup>
import { useSkateparkStore } from '@/stores/SkateparkStore'
import { useSessionStore } from '@/stores/SessionStore'
import { useUploadsStore } from '@/stores/UploadsStore'
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const skateparkStore = useSkateparkStore()
const sessionStore = useSessionStore()
const uploadsStore = useUploadsStore()

const backgroundImage = ref('')

onMounted(async () => {
  await sessionStore.fetchSkateparkSessions(route.params.id)
  await uploadsStore.fetchSkateparkUploads(route.params.id)

  if (uploadsStore.getSkateparkUploads[0]) {
    backgroundImage.value = `url(${uploadsStore.getSkateparkUploads[0].lgUrl})`
  }
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

const goBack = () => {
  router.go(-1)
}

const sizeToNumber = computed(() => {
  return +skateparkStore.getCurrentPark.size
})
</script>

<template>
  <div v-if="skateparkStore.isLoading">Loading ....</div>

  <div v-else>
    <div
      :style="{ backgroundImage: backgroundImage }"
      class="skatepark-header"
      :class="{ 'has-image': backgroundImage }"
    >
      <p>
        <button @click="goBack" class="back-button">
          <span class="material-symbols-outlined"> arrow_back </span>
        </button>
      </p>
      <div class="skatepark-title">
        <h1>{{ skateparkStore.getCurrentPark.name }}</h1>
        <p>
          <span class="material-symbols-outlined"> location_on </span>
          {{ skateparkStore.getCurrentPark.city }},
          {{ skateparkStore.getCurrentPark.state.substring(0, 2) }}
        </p>
      </div>
    </div>

    <section>
      <span class="material-symbols-outlined solid highlight"> star </span>
      <span class="rating">0.0</span>
      <span class="rating-count">(0)</span>

      <div class="stats">
        <p>
          <span class="material-symbols-outlined"> photo_camera </span>
          {{ uploadsStore.getSkateparkUploads.length }} photos
        </p>
        <p>
          <span class="material-symbols-outlined"> group </span>
          {{ sessionStore.getSkateparkSessions.length }}
          sessions
        </p>
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

    <div class="info">
      <div>
        <h4>Location</h4>
        <p>
          {{ skateparkStore.getCurrentPark.street }}<br />
          {{ skateparkStore.getCurrentPark.city }},
          {{ skateparkStore.getCurrentPark.state.substring(0, 2) }}
          {{ skateparkStore.getCurrentPark.zip }}
        </p>
        <p class="map-links">
          <a
            target="_blank"
            :href="`https://www.google.com/maps/search/?api=1&query=${skateparkStore.getCurrentPark.latitude}%2C${skateparkStore.getCurrentPark.longitude}`"
          >
            <span class="material-symbols-outlined"> map </span><br />
            Google
          </a>
          <a
            target="_blank"
            :href="`http://maps.apple.com/?ll=${skateparkStore.getCurrentPark.latitude},${skateparkStore.getCurrentPark.longitude}&q=${skateparkStore.getCurrentPark.name}`"
          >
            <span class="material-symbols-outlined"> map </span><br />
            Apple
          </a>
        </p>
      </div>

      <div>
        <h4>Stats</h4>
        <p>
          <span class="material-symbols-outlined"> square_foot </span>
          {{ sizeToNumber.toLocaleString() }} sqft.<br />
          <span class="material-symbols-outlined"> lightbulb </span>
          {{ skateparkStore.getCurrentPark.lights ? 'Yes!' : 'no' }}<br />
          <span class="material-symbols-outlined"> construction </span>
          {{ skateparkStore.getCurrentPark.builder }}, {{ skateparkStore.getCurrentPark.opened_year
          }}<br />
        </p>
      </div>
    </div>

    <div>
      <h4>Photos</h4>
      <div class="thumbnails">
        <div v-for="image in uploadsStore.getSkateparkUploads" :key="image.id" class="thumbnail">
          <figure v-if="image.smUrl">
            <img :src="image.smUrl" :alt="`${image.displayName}'s photo`" />
            <figcaption>
              {{ image.displayName }} <br />
              {{ formatDate(image.updatedAt) }}
            </figcaption>
          </figure>
          <div v-else>placeholder image</div>
        </div>
      </div>
    </div>

    <div>
      <h4>Recent Sessions</h4>

      <ul>
        <li v-for="session in sessionStore.getSkateparkSessions" :key="session.id">
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
.skatepark-header {
  margin: 0 -20px;
  padding: 20px;
}

.skatepark-header.has-image {
  height: 350px;
  margin-bottom: 20px;
  color: var(--strong-text-color);
  position: relative;
  background-size: cover;
}

.has-image .skatepark-title {
  background-color: var(--text-overlay-bg);
  position: absolute;
  bottom: 0;
  width: 100%;
  margin: 0 -20px;
  padding: 15px 30px;
}

.stats p {
  margin: 10px 0 15px 0;
}

.action-buttons,
.info,
.map-links {
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

.map-links {
  text-align: center;
}

.info div {
  display: block;
  width: 100%;
}

.map-links a {
  padding-right: 20px;
}
</style>
