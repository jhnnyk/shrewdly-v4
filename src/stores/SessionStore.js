import { defineStore } from 'pinia'
import { db } from '@/firebase'
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore'
import { useSkateparkStore } from './SkateparkStore'

export const useSessionStore = defineStore('SessionStore', {
  state: () => ({
    sessions: [],
    skateparkSessions: [],
    isLoading: false,
    error: null,
  }),

  actions: {
    async fetchAllSessions() {
      console.log('getting ALL sessions!')

      this.isLoading = true
      const sessionCollection = collection(db, 'sessions')

      try {
        const q = query(sessionCollection, orderBy('sessionDate', 'desc'), limit(10))
        const querySnapshot = await getDocs(q)
        this.sessions = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        this.isLoading = false
      } catch (error) {
        this.error = error
        this.isLoading = false
      }
    },

    async fetchSkateparkSessions(id) {
      console.log('getting skatepark sessions')

      this.isLoading = true
      const sessionCollection = collection(db, 'sessions')

      try {
        const q = query(
          sessionCollection,
          where('skateparkId', '==', id),
          orderBy('sessionDate', 'desc'),
          limit(10),
        )
        const querySnapshot = await getDocs(q)

        this.skateparkSessions = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        this.isLoading = false

        const skateparkStore = useSkateparkStore()
        skateparkStore.updateSessionCount(id, this.skateparkSessions.length)
      } catch (error) {
        console.log(error)
        this.error = error
        this.isLoading = false
      }
    },
  },

  getters: {
    getAllSessions: (state) => state.sessions,

    getSkateparkSessions: (state) => state.skateparkSessions,
  },
})
