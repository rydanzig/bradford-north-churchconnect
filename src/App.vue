<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import Topbar from '@/components/Topbar.vue'
import Banner from '@/components/Banner.vue'
import { useToastStore } from '@/stores/toast'

const toast = useToastStore()
const route = useRoute()

const showBanner = computed(() => {
  const name = String(route.name ?? '')
  return !['Dashboard', 'Members List'].includes(name)
})

const isHomePage = computed(() => route.name === 'Home' || route.path === '/')
const isRegisterPage = computed(() => route.name === 'Register' || route.path === '/register')

watchEffect(() => {
  document.body.classList.toggle('page-home', isHomePage.value)
  document.body.classList.toggle('page-register', isRegisterPage.value)
})
</script>

<template>
  <div class="toast" id="toast" :class="{ show: toast.show, error: toast.isError }">
    {{ toast.message }}
  </div>
  <Topbar />
  <Banner v-if="showBanner" />
  <router-view />
</template>

<style>
  @import "@/assets/styles/google.fonts.css";
  @import "@/assets/styles/main.css";
</style>
