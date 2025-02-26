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
  <div class="p-2">
    <form @submit.prevent="dismissKeyboard">
      <div class="flex gap-4 items-center">
        <RouterLink to="/"
          ><div
            class="aspect-square rounded-full flex items-center bg-gray-700 p-1 border-2 border-amber-500 transition hover:rotate-6"
          >
            FilmDB
          </div></RouterLink
        >
        <div class="relative w-full">
          <input
            class="block w-full bg-gray-800 rounded-full px-4 mx-auto h-12"
            v-model="query"
            type="text"
            name="query"
            id="query"
            placeholder="find a movie"
            @keyup="debouncedSearch"
          />
          <div v-if="loading" class="loader absolute right-3 top-3"></div>
        </div>
      </div>
    </form>
  </div>
  <div class="flex">
    <Transition>
      <div
        v-if="results"
        class="search flex md:justify-center pt-4 pb-4 gap-4 overflow-x-scroll md:overflow-visible md:flex-wrap"
      >
        <RouterLink
          v-for="result in results"
          :key="result.imdbID"
          class="popup flex flex-col w-64 cursor-pointer flex-shrink-0 md:opacity-70 md:hover:opacity-100 md:transition-opacity"
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

.popup {
  transition: all 0.3s ease;
}
.popup:hover {
  transform: translateY(-10px);
}
</style>
