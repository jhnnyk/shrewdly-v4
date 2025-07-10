<script setup>
import SigninForm from '@/components/auth/SigninForm.vue'
import { useUserStore } from '@/stores/UserStore'
import { auth } from '@/firebase'
import { signOut } from 'firebase/auth'

const userStore = useUserStore()

const logout = () => {
  signOut(auth)
    .then(() => {
      userStore.clearUser()
      console.log('user signed out')
    })
    .catch((error) => {
      console.log('Error signing out: ', error)
    })
}
</script>

<template>
  <section v-if="!userStore.user">
    <SigninForm />
  </section>

  <div v-else>
    <section>
      <h1>Profile</h1>
      <p>{{ userStore.user.email }}</p>
    </section>
    <button @click="logout">Sign Out</button>
  </div>
</template>
