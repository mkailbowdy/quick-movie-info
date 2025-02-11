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
const baseUrl = 'http://www.omdbapi.com/?' + omdb
const baseUrlTrailer = 'https://api.kinocheck.com/trailers?language=en&imdb_id='
const searchMovieDirectly = ref('')
const youtubeID = ref('')
const youtubeLink = 'https://www.youtube.com/embed/'
const fetchTrailer = () => {
  fetch(baseUrlTrailer + result.value?.imdbID)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Fetch failed...Find out why')
      }
      return response.json()
    })
    .then((data) => {
      console.log(data)
      youtubeID.value = youtubeLink + data[0].youtube_video_id
    })
}
const searchDirectly = () => {
  if (result.value) {
    result.value = null
    youtubeID.value = ''
  }
  const promiseSearch = fetch(baseUrl + paramMovieTitle + searchMovieDirectly.value)
  promiseSearch
    .then((response) => {
      if (!response.ok) {
        throw new Error('Fetch failed...Find out why')
      }
      return response.json()
    })
    .then(async (data) => {
      if (data.Error) {
        throw new Error(data.Error)
      }
      result.value = data
      fetchTrailer()
    })
    .catch((e) => {
      error.value = e
    })
}
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
      <div class="container mt-8" v-if="result">
        <div class="item text-4xl">{{ result.Title }}</div>
        <div class="item">
          <div class="text-gray-500 text-md">
            {{ result.Rated }}・{{ result.Runtime }}・{{ result.Year }}
          </div>
        </div>
        <div class="item">
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
        </div>
        <div class="text-md text-yellow-500">
          IMDB
          <div class="text-3xl text-white">{{ result.Ratings[0].Value }}</div>
        </div>
        <div class="text-md text-yellow-500">
          RT
          <div class="text-3xl text-white">{{ result.Ratings[1].Value }}</div>
        </div>
        <div class="text-md text-yellow-500">
          Metacritic
          <div class="text-3xl text-white">{{ result.Ratings[2].Value }}</div>
        </div>
        <div class="item"><img :src="result.Poster" alt="movie poster" /></div>
        <div class="item">{{ result.Plot }}</div>
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

.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 1em;
}

.item:nth-child(1) {
  grid-area: 1 / 1 / 2 / 2;
  grid-column: 1 / 4;
  grid-row: 0 / 2;
}

.item:nth-child(2) {
  grid-area: 2 / 1 / 3 / 2;
  grid-column: 1 / 4;
}

.item:nth-child(3) {
  grid-area: 3 / 1 / 4 / 2;
  grid-column: 1 / 4;
}

.item:nth-child(4) {
  grid-area: 4 / 1 / 5 / 2;
}

.item:nth-child(5) {
  grid-area: 4 / 2 / 5 / 3;
}

.item:nth-child(6) {
  grid-area: 4 / 3 / 5 / 4;
}

.item:nth-child(7) {
  grid-area: 5 / 1 / 6 / 2;
}

.item:nth-child(8) {
  grid-area: 5 / 2 / 6 / 3;
  grid-column: 2 / 4;
}
</style>
