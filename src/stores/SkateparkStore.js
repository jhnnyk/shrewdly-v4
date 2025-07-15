import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'
import { db } from '@/firebase'
import { collection, doc, getDocs, orderBy, query, setDoc } from 'firebase/firestore'

export const useSkateparkStore = defineStore('SkateparkStore', {
  state: () => ({
    parks: [],
    isLoading: false,
    error: null,
  }),

  actions: {
    async fetchParks() {
      this.isLoading = true
      const skateparkCollection = collection(db, 'skateparks')

      try {
        const q = query(skateparkCollection, orderBy('name'))
        const querySnapshot = await getDocs(q)
        this.parks = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        this.isLoading = false
      } catch (error) {
        console.log(error)
        this.error = error
        this.isLoading = false
      }
    },

    async updateSessionCount(id, count) {
      try {
        const skateparkRef = doc(db, 'skateparks', id)
        setDoc(skateparkRef, { sessionCount: count }, { merge: true })
      } catch (error) {
        console.log(error)
        this.error = error
        this.isLoading = false
      }
    },
  },

  getters: {
    getParks: (state) => state.parks,

    getCurrentPark: (state) => {
      const route = useRoute()

      return state.parks.find(
        (park) => park.state.slice(3) === route.params.stateSlug && park.slug === route.params.slug,
      )
    },
  },
})
