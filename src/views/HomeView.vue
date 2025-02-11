<script setup lang="ts">
import { omdb } from '../../apikeys/apikeys.js'
import { ref } from 'vue'

interface Movie {
  Title: string
  Year: string
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Poster: string
  Ratings: { Source: string; Value: string }[]
  Metascore: string
  imdbRating: string
  imdbVotes: string
  imdbID: string
  Type: string
  DVD: string
  BoxOffice: string
  Production: string
  Website: string
  Response: string
}

const error = ref(null)
const result = ref<Movie | null>(null)
const paramMovieTitle = '&t='
const paramType = '&type=movie'
const paramPlot = '&plot=full'
const baseUrl = 'http://www.omdbapi.com/?' + omdb
const baseUrlTrailer = 'https://api.kinocheck.com/trailers?language=en&imdb_id='
const searchMovieDirectly = ref('')
const youtubeID = ref('')
const youtubeLink = 'https://www.youtube.com/embed/'

const fetchTrailer = () => {
  fetch(baseUrlTrailer + result.value?.imdbID)
    .then((response) => {
      if (!response.ok) {
        throw new Error()
      }
      return response.json()
    })
    .then((data) => {
      if (data.message) {
        throw new Error(data.message)
      }
      youtubeID.value = youtubeLink + data[0].youtube_video_id
    })
    .catch((e) => {
      console.log(e.message)
    })
}

function worthIt() {
  const imdb = (parseFloat(result.value.imdbRating) / 10) * 100
  const rottenTomatoes = parseInt(result.value.Ratings[1].Value)
  const metacritic = parseFloat(
    result.value.Ratings[2].Value.slice(0, result.value.Ratings[2].Value.indexOf('/' + 1)),
  )
  watchIt.value = Math.floor((imdb + rottenTomatoes + metacritic) / 3)
}
const searchDirectly = () => {
  if (result.value) {
    result.value = null
    youtubeID.value = ''
    error.value = null
  }
  const promiseSearch = fetch(
    baseUrl + paramType + paramPlot + paramMovieTitle + searchMovieDirectly.value,
  )
  promiseSearch
    .then((response) => {
      if (!response.ok) {
        throw new Error()
      }
      return response.json()
    })
    .then((data) => {
      if (data.Error) {
        throw new Error(data.Error)
      }
      result.value = data
      worthIt()
      fetchTrailer()
    })
    .catch((e) => {
      error.value = e.message
    })
}
const watchIt = ref(0)
</script>

<template>
  <form>
    <input
      type="text"
      class="border border-gray-500"
      id="searchMovieDirectly"
      v-model="searchMovieDirectly"
    />
    <button @click.prevent="searchDirectly">Search</button>
    <h3 class="text-red-500">{{ error }}</h3>
  </form>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <!-- We've used 3xl here, but feel free to try other max-widths based on your needs -->
    <div class="mx-auto max-w-3xl">
      <div class="flex flex-col pt-16 pb-16 gap-4" v-if="result">
        <div class="text-4xl">{{ result.Title }}</div>
        <div class="text-gray-500 text-md flex justify-between">
          <span>{{ result.Rated }}・{{ result.Runtime }}・{{ result.Year }}</span>
          <span>{{ result.Genre }}</span>
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
        <div class="flex flex-row justify-between">
          <div class="text-md text-yellow-500">
            IMDB
            <div class="text-3xl text-white" v-if="result.Ratings[0]">
              {{ result.Ratings[0].Value }}
            </div>
          </div>
          <div class="text-md text-yellow-500">
            Rotten Tomatoes
            <div class="text-3xl text-white" v-if="result.Ratings[1]">
              {{ result.Ratings[1].Value }}
            </div>
          </div>
          <div class="text-md text-yellow-500">
            Metacritic
            <div class="text-3xl text-white" v-if="result.Ratings[2]">
              {{ result.Ratings[2].Value }}
            </div>
          </div>
        </div>
        <div class="flex items-center gap-4 justify-center">
          <h2 class="text-2xl text-yellow-500 font-bold">Overall Score</h2>
          <h3 class="text-5xl border border-4 border-yellow-500 rounded-full p-2">{{ watchIt }}</h3>
        </div>
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
        <h3 class="text-2xl">Plot Summary</h3>
        <div>{{ result.Plot }}</div>
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
