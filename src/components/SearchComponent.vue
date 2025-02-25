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
  <div class="p-2">
    <form @submit.prevent="dismissKeyboard">
      <div class="flex gap-4">
        <RouterLink to="/"><svg id="logo-14" width="73" height="49" viewBox="0 0 73 49" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M46.8676 24C46.8676 36.4264 36.794 46.5 24.3676 46.5C11.9413 46.5 1.86765 36.4264 1.86765 24C1.86765 11.5736 11.9413 1.5 24.3676 1.5C36.794 1.5 46.8676 11.5736 46.8676 24Z" class="ccustom" fill="#68DBFF"></path> <path d="M71.1324 24C71.1324 36.4264 61.1574 46.5 48.8529 46.5C36.5484 46.5 26.5735 36.4264 26.5735 24C26.5735 11.5736 36.5484 1.5 48.8529 1.5C61.1574 1.5 71.1324 11.5736 71.1324 24Z" class="ccompli1" fill="#FF7917"></path> <path d="M36.6705 42.8416C42.8109 38.8239 46.8676 31.8858 46.8676 24C46.8676 16.1144 42.8109 9.17614 36.6705 5.15854C30.5904 9.17614 26.5735 16.1144 26.5735 24C26.5735 31.8858 30.5904 38.8239 36.6705 42.8416Z" class="ccompli2" fill="#5D2C02"></path> </svg></RouterLink>
        <input
            class="block w-full bg-gray-800 rounded-full px-4 mx-auto"
            v-model="query"
            type="text"
            name="query"
            id="query"
            placeholder="find a movie"
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
