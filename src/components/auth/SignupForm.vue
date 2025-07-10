<script setup>
import { ref } from 'vue'
import { auth } from '@/firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useUserStore } from '@/stores/UserStore'

const userStore = useUserStore()

const displayName = ref('')
const email = ref('')
const password = ref('')

const signup = async () => {
  // createUserWithEmailAndPassword(auth, email.value, password.value)
  //   .then((userCredential) => {
  //     // Signed up
  //     const user = userCredential.user
  //     console.log(user)

  //     userStore.setUser(user)
  //     // ...
  //   })
  //   .catch((error) => {
  //     console.log(error.code, error.message)
  //   })
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user

    await updateProfile(user, {
      displayName: displayName.value,
    })

    console.log(user)

    userStore.setUser(user)
  } catch (error) {
    console.log(error.code, error.message)
  }
}
</script>

<template>
  <form @submit.prevent="signup">
    <h1>Sign Up</h1>
    <div class="field">
      <label for="displayName">Display Name</label><br />
      <input
        v-model="displayName"
        type="text"
        id="displayName"
        name="displayName"
        placeholder="e.g. johndoe@email.com"
        required
      />
    </div>

    <div class="field">
      <label for="email">Email</label><br />
      <input
        v-model="email"
        type="text"
        id="email"
        name="email"
        placeholder="e.g. johndoe@email.com"
        required
      />
    </div>

    <div class="field">
      <label for="password">Password</label><br />
      <input
        v-model="password"
        type="password"
        id="password"
        name="password"
        placeholder="e.g. password123"
        required
      />
    </div>

    <div>
      <button type="submit">Sign Up</button>
    </div>
  </form>
</template>
