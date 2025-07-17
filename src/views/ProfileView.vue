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
      signInUpToggle.value = 'signin'
    })
    .catch((error) => {
      console.log('Error signing out: ', error)
    })
}
</script>

<template>
  <div class="loading" v-if="userStore.isLoading">Loading ....</div>

  <div v-else>
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

    <div v-if="userStore.user">
      <section>
        <h1>Profile</h1>
        <p>
          <span class="material-symbols-outlined"> person </span>
          {{ userStore.user.displayName }}
        </p>
        <p v-if="userStore.user.skateparksVisited">
          Skateparks visited: {{ userStore.user.skateparksVisited.length }}
        </p>
      </section>
      <button @click="logout">Sign Out</button>
    </div>
  </div>
</template>
