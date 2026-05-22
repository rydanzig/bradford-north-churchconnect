import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', {
  state: () => ({
    message: '',
    show: false
  }),

  actions: {
    showToast(msg: string) {
      this.message = msg
      this.show = true

      setTimeout(() => {
        this.show = false
      }, 3000)
    }
  }
})