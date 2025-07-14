import { defineStore } from 'pinia'
import { db } from '@/firebase'
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'

export const useSessionStore = defineStore('SessionStore', {
  state: () => ({
    sessions: [],
    isLoading: false,
    error: null,
  }),

  actions: {
    async fetchSessions() {
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
  },

  getters: {
    getSessions: (state) => state.sessions,
  },
})
