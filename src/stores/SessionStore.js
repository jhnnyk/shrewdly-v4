import { defineStore } from 'pinia'
import { db } from '@/firebase'
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore'
import { useSkateparkStore } from './SkateparkStore'

export const useSessionStore = defineStore('SessionStore', {
  state: () => ({
    sessions: [],
    isLoading: false,
    error: null,
  }),

  actions: {
    async fetchSkateparkSessions() {
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
    getAllSessions: (state) => state.sessions,

    getSkateparkSessions: (state) => {
      const skateparkStore = useSkateparkStore()
      return state.sessions.filter(
        (session) => session.skateparkId === skateparkStore.getCurrentPark.id,
      )
    },
  },
})
