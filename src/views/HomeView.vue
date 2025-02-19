<script setup lang="ts">
import SearchComponent from '@/components/SearchComponent.vue'
</script>
<template>
  <SearchComponent />
  <div class="text-center p-4">
    <h1 class="text-3xl">Hi <span class="text-amber-500">Mighty Scout</span>!</h1>
    <div class="pt-4">
      <p class="text-gray-300">Read my review of my favorite movie!</p>
      <RouterLink
        :to="{ name: 'movie', query: { imdbID: 'tt14966898' } }"
        class="text-2xl text-indigo-800 hover:text-indigo-500 transition"
        >Late Night with the Devil<span class="ml-2">&rarr;</span></RouterLink
      >
    </div>
  </div>
</template>
