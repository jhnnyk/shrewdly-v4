<script setup>
import { ref } from 'vue'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { useRouter } from 'vue-router'

const router = useRouter()

const newTag = ref('')

const name = ref('')
const slug = ref('')
const street = ref('')
const city = ref('')
const state = ref('')
const zip = ref('')
const latitude = ref('')
const longitude = ref('')
const size = ref('')
const builder = ref('')
const opened_year = ref('')
const lights = ref(false)
const tags = ref([])
const status = ref('open')

const addTag = (newTag) => {
  if (newTag !== '') {
    tags.value.push(newTag)
  }
  resetTagInput()
}

const resetTagInput = () => {
  newTag.value = ''
}

const removeTag = (tagToDelete) => {
  tags.value = tags.value.filter((tag) => tag !== tagToDelete)
}

const addPark = async () => {
  // add to db
  const docRef = await addDoc(collection(db, 'skateparks'), {
    name: name.value,
    slug: slug.value,
    street: street.value,
    city: city.value,
    state: state.value,
    zip: zip.value,
    latitude: latitude.value,
    longitude: longitude.value,
    size: size.value,
    builder: builder.value,
    opened_year: opened_year.value,
    lights: lights.value,
    tags: tags.value,
    status: status.value,
  })

  // confirm write
  console.log('skatepark added with ID: ', docRef.id)

  // redirect to home screen
  router.push({ name: 'home' })
}
</script>

<template>
  <section>
    <form @submit.prevent="addPark">
      <h1>Add Skatepark</h1>

      <div class="field">
        <label for="name">name</label><br />
        <input
          v-model="name"
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
          v-model="slug"
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
          v-model="street"
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
          v-model="city"
          type="text"
          id="city"
          name="city"
          placeholder="e.g. Denver"
          required
        />
      </div>

      <div class="field">
        <label for="state">state</label><br />
        <select v-model="state" name="state" id="state" required>
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
        <input v-model="zip" type="text" id="zip" name="zip" placeholder="e.g. 90210" required />
      </div>

      <div class="field">
        <label for="latitude">latitude</label><br />
        <input
          v-model="latitude"
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
          v-model="longitude"
          type="text"
          id="longitude"
          name="longitude"
          placeholder="e.g. -105.00271"
          required
        />
      </div>

      <div class="field">
        <label for="size">size</label><br />
        <input v-model="size" type="text" id="size" name="size" placeholder="e.g. 35000" />
      </div>

      <div class="field">
        <label for="builder">builder</label><br />
        <input
          v-model="builder"
          type="text"
          id="builder"
          name="builder"
          placeholder="e.g. Team Pain"
        />
      </div>

      <div class="field">
        <label for="opened_year">opened year</label><br />
        <input
          v-model="opened_year"
          type="text"
          id="opened_year"
          name="opened_year"
          placeholder="e.g. 2005"
        />
      </div>

      <div class="field">
        <input v-model="lights" type="checkbox" id="lights" name="lights" value="true" />
        <label for="lights">Lights<span class="material-symbols-outlined"> lightbulb </span></label>
      </div>

      <div class="field">
        <label for="newTag">tags</label><br />
        <div>
          <button v-for="tag in tags" class="inverted small">
            {{ tag }}
            <span @click="removeTag(tag)" class="material-symbols-outlined"> cancel </span>
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
        <select v-model="status" name="status" id="status" required>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="under_construction">Under Construction</option>
        </select>
      </div>

      <div class="field">
        <button class="large" type="submit">Add Skatepark</button>
      </div>
    </form>
  </section>
</template>
