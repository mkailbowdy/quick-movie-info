<script setup lang="ts">
import { ref } from 'vue'
import type { Movie } from '../types/Movie.ts'
import { dismissKeyboard } from '../helpers/dismissKeyboard.ts'
import ButtonComponent from '@/components/ButtonComponent.vue'

const baseUrlKinocheck = 'https://api.kinocheck.com/trailers?language=en&imdb_id='
const baseUrlOmdb = `https://www.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_API_KEY}`
const paramOmdbMovieTitle = '&i='
const paramOmdbSearchAll = '&s='
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
    return (watchIt.value = Math.floor((imdb + rottenTomatoes + metacritic) / 3))
  }

  if (result.value?.Ratings.length === 2) {
    const imdb = (parseFloat(result.value.imdbRating) / 10) * 100
    const rottenTomatoes = parseInt(result.value.Ratings[1].Value)
    return (watchIt.value = Math.floor((imdb + rottenTomatoes) / 2))
  }

  if (result.value?.Ratings.length === 1) {
    return (watchIt.value = (parseFloat(result.value.imdbRating) / 10) * 100)
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



async function fetchMovie(imdbID: string) {
  dismissKeyboard()
  if (result.value) {
    result.value = null
    youtubeID.value = ''
    error.value = null
  }

  try {
    loading.value = true
    const response = await fetch(
      baseUrlOmdb + paramOmdbType + paramOmdbPlot + paramOmdbMovieTitle + imdbID,
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

const results = ref<Movie[] | null>([])
async function searchAll(){
  console.log(query.value)
  const response = await fetch(baseUrlOmdb + paramOmdbType + paramOmdbSearchAll + query.value)
  if (!response.ok) {
    throw new Error()
  }
  // console.log(data)
  const data = await response.json()
  results.value = data.Search
}
</script>

<template>
  <div class="flex flex-col bg-red-950 items-center mb-4">
    <form>
      <div class="flex flex-col gap-2 py-3">
        <label for="query" class="block text-3xl font-medium text-center"
          >Enter a movie title</label
        >
        <input
          v-model="query"
          type="text"
          name="query"
          id="query"
          class="block w-full rounded-full bg-white px-4 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          placeholder="e.g. The Lion King"
          @keyup="searchAll"
        />
<!--        <div class="self-center">-->
<!--          <ButtonComponent size="medium" class="bg-amber-500">Search</ButtonComponent>-->
<!--        </div>-->
        <h3 class="text-red-500">{{ error }}</h3>
      </div>
    </form>
  </div>
  <div v-if="results" class="flex gap-8 overflow-x-scroll text-white">
    <div v-for="result in results" >
      <div class="w-48" @click="fetchMovie(result.imdbID)">
        <div>{{result.Title}}</div>
        <img :src="result.Poster" alt="movie poster">
      </div>
    </div>
  </div>
  <div v-if="loading" class="flex justify-center pt-8">
    <div class="loader"></div>
  </div>
  <div class="mx-auto max-w-7xl px-4 pt-4 pb-4 sm:px-6 lg:px-8" v-else>
    <!-- We've used 3xl here, but feel free to try other max-widths based on your needs -->
    <div class="mx-auto max-w-3xl">
      <div class="flex flex-col gap-1" v-if="result">
        <div class="text-4xl">{{ result.Title }}</div>
        <div class="text-gray-500 text-sm flex justify-between">
          <span>{{ result.Rated }}・{{ result.Runtime }}・{{ result.Year }}</span>
          <span>{{ result.Genre }}</span>
        </div>
        <div class="pt-4">
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
        <div class="pb-4 flex flex-col gap-2">
          <h3 class="text-3xl">Plot Summary</h3>
          <p class="text-md tracking-wide leading-loose">{{ result.Plot }}</p>
        </div>
        <div class="text-lg flex flex-col bg-gray-800 p-4 rounded justify-center gap-2">
          <img v-if="youtubeID" :src="result.Poster" alt="movie poster" />
          <div class="divide-y divide-gray-600 leading-relaxed flex flex-col gap-1">
            <div>
              <div class="text-amber-500 font-semibold">Director</div>
              {{ result.Director }}
            </div>
            <div>
              <div class="text-amber-500 font-semibold">Writer</div>
              {{ result.Writer }}
            </div>
            <div>
              <div class="text-amber-500 font-semibold">Box Office</div>
              {{ result.BoxOffice }}
            </div>
            <div>
              <div class="text-amber-500 font-semibold">Awards</div>
              {{ result.Awards }}
            </div>
            <div>
              <div class="text-amber-500 font-semibold">Cast</div>
              {{ result.Actors }}
            </div>
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
