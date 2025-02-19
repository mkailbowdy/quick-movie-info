<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { debounce } from 'lodash'
import { dismissKeyboard } from '@/helpers/dismissKeyboard.ts'
import { useMovieStore } from '@/stores/movie.ts'
import { useLoader } from '@/composables/useLoader.ts'

const store = useMovieStore()
const query = ref('')
const { results } = storeToRefs(store)
const { searchAll } = store
const { loading, loadingStateOn, loadingStateOff } = useLoader()

const debouncedSearch = debounce(async () => {
  loadingStateOn()
  await searchAll(query.value).then(loadingStateOff)
}, 300)
</script>
<template>
  <div v-if="loading" class="loader absolute top-4 left-4"></div>
  <div class="flex flex-col bg-gray-800 w-full">
    <form @submit.prevent="dismissKeyboard">
      <div class="flex flex-col gap-2 py-3">
        <label for="query" class="block text-3xl font-medium text-center text-amber-500"
          >Enter a movie title</label
        >
        <input
          v-model="query"
          type="text"
          name="query"
          id="query"
          class="block w-80 mx-auto rounded-full bg-white px-4 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-amber-400 md:text-sm/6"
          placeholder="e.g. The Lion King"
          @keyup="debouncedSearch"
        />
      </div>
    </form>
  </div>
  <div class="flex">
    <div v-if="loading" class="loader absolute top-4 left-4"></div>
    <Transition>
      <div
        v-if="results"
        class="search flex md:justify-center pt-4 pb-4 gap-4 overflow-x-scroll md:overflow-visible md:flex-wrap"
      >
        <RouterLink
          v-for="result in results"
          :key="result.imdbID"
          class="flex flex-col w-64 cursor-pointer flex-shrink-0 md:opacity-70 md:hover:opacity-100 md:transition-opacity"
          :to="{ name: 'movie', query: { imdbID: result.imdbID } }"
        >
          <img :src="result.Poster" class="h-96 object-cover" alt="movie poster" />
          <p class="">{{ result.Title }}</p>
        </RouterLink>
      </div>
    </Transition>
  </div>
</template>
<style scoped>
.v-enter-from {
  opacity: 0;
  transform: translateX(100px);
}
.v-enter-active {
  transition: all 1s ease;
}
.search {
  scrollbar-width: none;
}
</style>
