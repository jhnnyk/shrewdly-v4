<script setup>
import { ref } from 'vue'
import { useSkateparkStore } from '@/stores/SkateparkStore'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { useRouter } from 'vue-router'

const skateparkStore = useSkateparkStore()
const router = useRouter()

const newTag = ref('')

const addTag = (newTag) => {
  if (newTag !== '') {
    skateparkStore.getCurrentPark.tags.push(newTag)
  }
  resetTagInput()
}

const resetTagInput = () => {
  newTag.value = ''
}

const removeTag = (tagToDelete) => {
  skateparkStore.getCurrentPark.tags = skateparkStore.getCurrentPark.tags.filter(
    (tag) => tag !== tagToDelete,
  )
}

const updatePark = async () => {
  // save updates to DB
  await setDoc(doc(db, 'skateparks', skateparkStore.getCurrentPark.id), {
    name: skateparkStore.getCurrentPark.name,
    slug: skateparkStore.getCurrentPark.slug,
    street: skateparkStore.getCurrentPark.street,
    city: skateparkStore.getCurrentPark.city,
    state: skateparkStore.getCurrentPark.state,
    zip: skateparkStore.getCurrentPark.zip,
    latitude: skateparkStore.getCurrentPark.latitude,
    longitude: skateparkStore.getCurrentPark.longitude,
    size: skateparkStore.getCurrentPark.size,
    builder: skateparkStore.getCurrentPark.builder,
    opened_year: skateparkStore.getCurrentPark.opened_year,
    lights: skateparkStore.getCurrentPark.lights,
    tags: skateparkStore.getCurrentPark.tags,
    status: skateparkStore.getCurrentPark.status,
  })

  // redirect back to skatepark page after save
  router.push({
    name: 'show skatepark',
    params: {
      stateSlug: skateparkStore.getCurrentPark.state.slice(3),
      slug: skateparkStore.getCurrentPark.slug,
      id: skateparkStore.getCurrentPark.id,
    },
  })
}
</script>

<template>
  <div v-if="skateparkStore.isLoading">Loading ....</div>
  <section v-else>
    <form @submit.prevent="updatePark">
      <h1>Edit Skatepark</h1>

      <div class="field">
        <label for="name">name</label><br />
        <input
          v-model="skateparkStore.getCurrentPark.name"
          type="text"
          id="name"
          name="name"
          placeholder="e.g. Redstone Skatepark"
          required
        />
      </div>

      <div class="field">
        <label for="slug">URL slug</label><br />
        <input
          v-model="skateparkStore.getCurrentPark.slug"
          type="text"
          id="slug"
          name="slug"
          placeholder="e.g. redstone"
          required
        />
      </div>

      <div class="field">
        <label for="street">street</label><br />
        <input
          v-model="skateparkStore.getCurrentPark.street"
          type="text"
          id="street"
          name="street"
          placeholder="e.g. 123 Main St."
          required
        />
      </div>

      <div class="field">
        <label for="city">city</label><br />
        <input
          v-model="skateparkStore.getCurrentPark.city"
          type="text"
          id="city"
          name="city"
          placeholder="e.g. Denver"
          required
        />
      </div>

      <div class="field">
        <label for="state">state</label><br />
        <select v-model="skateparkStore.getCurrentPark.state" name="state" id="state" required>
          <option value="CA:california">California</option>
          <option value="CO:colorado">Colorado</option>
          <option value="IA:iowa">Iowa</option>
          <option value="KS:kansas">Kansas</option>
          <option value="NV:nevada">Nevada</option>
          <option value="OK:oklahoma">Oklahoma</option>
          <option value="TX:texas">Texas</option>
          <option value="UT:utah">Utah</option>
          <option value="WI:wisconsin">Wisconsin</option>
        </select>
      </div>

      <div class="field">
        <label for="zip">zip</label><br />
        <input
          v-model="skateparkStore.getCurrentPark.zip"
          type="text"
          id="zip"
          name="zip"
          placeholder="e.g. 90210"
          required
        />
      </div>

      <div class="field">
        <label for="latitude">latitude</label><br />
        <input
          v-model="skateparkStore.getCurrentPark.latitude"
          type="text"
          id="latitude"
          name="latitude"
          placeholder="e.g. 39.75947"
          required
        />
      </div>

      <div class="field">
        <label for="longitude">longitude</label><br />
        <input
          v-model="skateparkStore.getCurrentPark.longitude"
          type="text"
          id="longitude"
          name="longitude"
          placeholder="e.g. -105.00271"
          required
        />
      </div>

      <div class="field">
        <label for="size">size</label><br />
        <input
          v-model="skateparkStore.getCurrentPark.size"
          type="text"
          id="size"
          name="size"
          placeholder="e.g. 35000"
        />
      </div>

      <div class="field">
        <label for="builder">builder</label><br />
        <input
          v-model="skateparkStore.getCurrentPark.builder"
          type="text"
          id="builder"
          name="builder"
          placeholder="e.g. Team Pain"
        />
      </div>

      <div class="field">
        <label for="opened_year">opened year</label><br />
        <input
          v-model="skateparkStore.getCurrentPark.opened_year"
          type="text"
          id="opened_year"
          name="opened_year"
          placeholder="e.g. 2005"
        />
      </div>

      <div class="field">
        <input
          v-model="skateparkStore.getCurrentPark.lights"
          type="checkbox"
          id="lights"
          name="lights"
          value="true"
        />
        <label for="lights">Lights<span class="material-symbols-outlined"> lightbulb </span></label>
      </div>

      <div class="field">
        <label for="newTag">tags</label><br />
        <div>
          <button v-for="tag in skateparkStore.getCurrentPark.tags" class="inverted small">
            {{ tag }}
            <span @click.prevent="removeTag(tag)" class="material-symbols-outlined"> cancel </span>
          </button>
        </div>

        <input
          @keydown.enter.prevent="addTag(newTag)"
          v-model="newTag"
          type="text"
          id="newTag"
          name="newTag"
          placeholder="e.g. DIY"
        />
        <button @click.prevent="addTag(newTag)">add tag</button>
      </div>

      <div class="field">
        <label for="status">status</label><br />
        <select v-model="skateparkStore.getCurrentPark.status" name="status" id="status" required>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="under_construction">Under Construction</option>
        </select>
      </div>

      <div class="field">
        <button class="large" type="submit">save updates</button>
      </div>
    </form>
  </section>
</template>
