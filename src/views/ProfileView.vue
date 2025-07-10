<script setup>
import { ref } from 'vue'
import SigninForm from '@/components/auth/SigninForm.vue'
import SignupForm from '@/components/auth/SignupForm.vue'
import { useUserStore } from '@/stores/UserStore'
import { auth } from '@/firebase'
import { signOut } from 'firebase/auth'

const userStore = useUserStore()

const signInUpToggle = ref('signin')

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
    <div v-if="signInUpToggle === 'signin'">
      <SigninForm />
      <p class="text-center">
        Or <a @click="signInUpToggle = 'signup'" href="#">create an account</a>.
      </p>
    </div>

    <div v-if="signInUpToggle === 'signup'">
      <SignupForm />
      <p class="text-center">Or <a @click="signInUpToggle = 'signin'" href="#">sign in</a>.</p>
    </div>
  </section>

  <div v-else>
    <section>
      <h1>Profile</h1>
      <p>{{ userStore.user.displayName }}</p>
    </section>
    <button @click="logout">Sign Out</button>
  </div>
</template>
