<script setup lang="ts">
  import Topbar from '@/components/Topbar.vue';
  import { useToastStore } from '@/stores/toast'

  const toast = useToastStore()
</script>

<template>
  <div class="toast" id="toast" :class="{ show: toast.show }"">
    {{ toast.message }}
  </div>
  <Topbar />
  <router-view />
</template>

<style>
  @import "@/assets/styles/google.fonts.css";
  @import "@/assets/styles/main.css";
</style>
