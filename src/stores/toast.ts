import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', {
  state: () => ({
    message: '',
    show: false,
    isError: false
  }),

  actions: {
    showToast(msg: string, isError = false) {
      this.message = msg
      this.show = true
      this.isError = isError

      setTimeout(() => {
        this.show = false
        this.isError = false
      }, 3000)
    }
  }
})