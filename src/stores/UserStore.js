import { defineStore } from 'pinia'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'

export const useUserStore = defineStore('UserStore', {
  state: () => ({
    user: null,
    isLoading: false,
  }),
  actions: {
    async setUser(user) {
      this.user = user

      // add fields from users DB
      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        // console.log('Document data:', docSnap.data())
        this.user.role = docSnap.data().role
        this.user.sport = docSnap.data().sport
        this.user.skateparksVisited = docSnap.data().skateparksVisited
      } else {
        // docSnap.data() will be undefined in this case
        console.log('No such document!')
      }
    },
    clearUser() {
      this.user = null
    },
  },
})
