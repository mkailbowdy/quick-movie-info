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
  <div class="flex flex-col w-full">
    <form @submit.prevent="dismissKeyboard">
      <div class="flex flex-col gap-2 p-8">
        <h1
          class="heading text-5xl font-medium text-center text-red-500 leading-relaxed tracking-wide"
        >
          Movie DB
        </h1>
        <input
          v-model="query"
          type="text"
          name="query"
          id="query"
          class="bg-gray-800 w-64 px-4 py-2 self-center focus:shadow-[0px_0px_30px] focus:shadow-red-800 focus:outline focus:outline-1 focus:outline-red-800 focus:ring-red-500"
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
