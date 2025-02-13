<script setup lang="ts">
import { ref } from 'vue'
import type { Movie } from '../types/Movie.ts'
import { dismissKeyboard } from '../helpers/dismissKeyboard.ts'
import ButtonComponent from '@/components/ButtonComponent.vue'

const baseUrlKinocheck = 'https://api.kinocheck.com/trailers?language=en&imdb_id='
const baseUrlOmdb = `https://www.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_API_KEY}`
const paramOmdbMovieTitle = '&t='
const paramOmdbPlot = '&plot=full'
const paramOmdbType = '&type=movie'
const youtubeEmbedLink = 'https://www.youtube.com/embed/'

const error = ref(null)
const result = ref<Movie | null>(null)
const query = ref('')
const watchIt = ref(0)
const youtubeID = ref('')
const loading = ref(false)

function overallScore() {
  if (result.value?.Ratings.length === 3) {
    const imdb = (parseFloat(result.value.imdbRating) / 10) * 100
    const rottenTomatoes = parseInt(result.value.Ratings[1].Value)
    const metacritic = parseFloat(
      result.value.Ratings[2].Value.slice(0, result.value.Ratings[2].Value.indexOf('/' + 1)),
    )
    return watchIt.value = Math.floor((imdb + rottenTomatoes + metacritic) / 3)
  }

  if (result.value?.Ratings.length === 2) {
    const imdb = (parseFloat(result.value.imdbRating) / 10) * 100
    const rottenTomatoes = parseInt(result.value.Ratings[1].Value)
    return watchIt.value = Math.floor((imdb + rottenTomatoes) / 2)
  }

  if (result.value?.Ratings.length === 1) {
    return watchIt.value = (parseFloat(result.value.imdbRating) / 10) * 100
  }

  throw new Error()
}

async function fetchTrailer() {
  if (result.value) {
    try {
      const response = await fetch(baseUrlKinocheck + result.value.imdbID)
      const data = await response.json()
      if (data.message) {
        throw new Error(data.message)
      }
      youtubeID.value = youtubeEmbedLink + data[0].youtube_video_id
    } catch (e) {
      console.error(e)
    }
  }
}

async function fetchMovie() {
  dismissKeyboard()
  if (result.value) {
    result.value = null
    youtubeID.value = ''
    error.value = null
  }

  try {
    loading.value = true
    const response = await fetch(
      baseUrlOmdb + paramOmdbType + paramOmdbPlot + paramOmdbMovieTitle + query.value,
    )
    if (!response.ok) {
      throw new Error()
    }
    const data = await response.json()
    if (data.Error) {
      loading.value = false
      error.value = data.Error
      throw new Error(data.Error)
    }
    result.value = data
    console.log(result.value)
    loading.value = false
    overallScore()
    await fetchTrailer()
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <div class="flex flex-col p-4 bg-red-950 items-center">
    <form @submit.prevent="fetchMovie">
      <div class="flex flex-col gap-2">
        <label for="query" class="block text-lg font-medium text-center">Enter a movie title</label>
        <input
          v-model="query"
          type="text"
          name="query"
          id="query"
          class="block w-full rounded-full bg-white px-4 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          placeholder="e.g. The Lion King"
        />
        <div class="self-center pt-4">
          <ButtonComponent size="medium" class="bg-amber-500">Search</ButtonComponent>
        </div>
        <h3 class="text-red-500">{{ error }}</h3>
      </div>
    </form>
  </div>

  <div v-if="loading" class="flex flex-col items-center justify-center h-screen">
    <div class="loader"></div>
  </div>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" v-else>
    <!-- We've used 3xl here, but feel free to try other max-widths based on your needs -->
    <div class="mx-auto max-w-3xl">
      <div class="flex flex-col p-2 pt-8 gap-4" v-if="result">
        <div>
          <div class="text-4xl">{{ result.Title }}</div>
          <div class="text-gray-500 text-sm flex justify-between">
            <span>{{ result.Rated }}・{{ result.Runtime }}・{{ result.Year }}</span>
            <span>{{ result.Genre }}</span>
          </div>
        </div>
        <iframe
          v-if="youtubeID"
          class="w-full"
          height="315"
          :src="youtubeID"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
        <div v-else class="flex justify-center">
          <img :src="result.Poster" alt="movie poster" />
        </div>
        <div class="flex justify-between">
          <div class="text-md text-amber-500 text-center">
            IMDB
            <div class="text-xl text-white" v-if="result.Ratings[0]">
              {{ result.Ratings[0].Value }}
            </div>
          </div>
          <div class="text-md text-amber-500 text-center">
            Rotten Tomatoes
            <div class="text-xl text-white" v-if="result.Ratings[1]">
              {{ result.Ratings[1].Value }}
            </div>
            <div v-else class="text-xl text-white">-</div>
          </div>
          <div class="text-md text-amber-500 text-center">
            Metacritic
            <div class="text-xl text-white" v-if="result.Ratings[2]">
              {{ result.Ratings[2].Value }}
            </div>
            <div v-else class="text-3xl text-white">-</div>
          </div>
        </div>
        <div class="flex items-center gap-4 justify-center pt-2 pb-2">
          <h2 class="text-2xl text-amber-500 font-bold">Overall Score</h2>
          <h3 class="text-5xl border-4 border-amber-500 rounded-full p-2">{{ watchIt }}</h3>
        </div>
        <h3 class="text-2xl">Plot Summary</h3>
        <div>{{ result.Plot }}</div>
        <div class="flex gap-4">
          <img v-if="youtubeID" :src="result.Poster" alt="movie poster" class="h-64" />
          <div class="flex flex-col">
            <div>Director: {{ result.Director }}</div>
            <div>Writer: {{ result.Writer }}</div>
            <div>Box Office: {{ result.BoxOffice }}</div>
            <div>Awards: {{ result.Awards }}</div>
            <div>Cast: {{ result.Actors }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 5s ease-in-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
