<script setup>
import { ref } from 'vue'
import { auth } from '@/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useUserStore } from '@/stores/UserStore'

const userStore = useUserStore()

const email = ref('')
const password = ref('')

const login = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user
      console.log(user)

      userStore.setUser(user)
      // ...
    })
    .catch((error) => {
      console.log(error.code, error.message)
    })
}
</script>

<template>
  <form @submit.prevent="login">
    <h1>Sign In</h1>
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
      <button type="submit">Sign In</button>
    </div>
  </form>
</template>
