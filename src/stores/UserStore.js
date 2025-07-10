import { defineStore } from 'pinia'

export const useUserStore = defineStore('UserStore', {
  state: () => ({
    user: null,
    isLoading: false,
  }),
  actions: {
    setUser(user) {
      this.user = user
    },
    clearUser() {
      this.user = null
    },
  },
})
