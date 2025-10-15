<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css' // vue-sonner v2 requires this import
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <header class="bg-white shadow p-4">
      <h1 class="text-2xl text-center font-bold text-gray-800">Car Panel</h1>
    </header>

    <main class="flex-1 pr-4 pl-4 overflow-auto">
      <router-view />
    </main>

    <Toaster />
  </div>
</template>

<style scoped>
h1 {
  font-family: 'Pacifico', cursive;
}
</style>
