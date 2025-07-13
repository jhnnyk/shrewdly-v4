<script setup>
import { ref } from 'vue'
import { auth, db } from '@/firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { useUserStore } from '@/stores/UserStore'

const userStore = useUserStore()

const displayName = ref('')
const email = ref('')
const password = ref('')
const sport = ref('skateboard')

const signup = async () => {
  userStore.isLoading = true

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user

    await updateProfile(user, {
      displayName: displayName.value,
    })

    await setDoc(doc(db, 'users', user.uid), {
      displayName: user.displayName,
      email: user.email,
      uid: user.uid,
      role: 'user',
      sport: sport.value,
    })

    console.log(user)

    userStore.setUser(user)
  } catch (error) {
    console.log(error.code, error.message)
  }

  userStore.isLoading = false
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
      <label for="sport">Preferred activity</label><br />
      <select v-model="sport" name="sport" id="sport">
        <option value="skateboard">Skateboard</option>
        <option value="scooter">Scooter</option>
        <option value="BMX">BMX</option>
        <option value="inline">Inline Skates</option>
        <option value="quad">Quad Skates</option>
      </select>
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
