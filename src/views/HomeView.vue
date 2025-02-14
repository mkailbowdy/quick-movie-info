<script setup lang="ts">
import { ref } from 'vue'
import type { Movie } from '../types/Movie.ts'
import { dismissKeyboard } from '../helpers/dismissKeyboard.ts'
import { debounce } from 'lodash'
import {
  apiConfig,
  youtubeEmbedLink,
  baseUrlOmdb,
  paramOmdbType,
  paramOmdbPlot,
  paramOmdbMovieTitle,
  paramOmdbSearchAll,
} from '../apiConfig.ts'

const error = ref(null)
const result = ref<Movie | null>(null)
const results = ref<Movie[] | null>(null)
const query = ref('')
const watchIt = ref(0)
const youtubeID = ref('')
const loading = ref(false)

function loadingStateOn() {
  loading.value = true
}
function loadingStateOff() {
  loading.value = false
}

function overallScore() {
  let imdb
  let rottenTomatoes

  if (!result.value) {
    console.error('There is no result value')
    return
  }

  switch (result.value.Ratings.length) {
    case 1:
      watchIt.value = Math.floor((parseFloat(result.value.imdbRating) / 10) * 100)
      return
    case 2:
      imdb = (parseFloat(result.value.imdbRating) / 10) * 100
      rottenTomatoes = parseInt(result.value.Ratings[1].Value)
      watchIt.value = Math.floor((imdb + rottenTomatoes) / 2)
      return
    case 3:
      imdb = (parseFloat(result.value.imdbRating) / 10) * 100
      rottenTomatoes = parseInt(result.value.Ratings[1].Value)
      const metacritic = parseFloat(
        result.value.Ratings[2].Value.slice(0, result.value.Ratings[2].Value.indexOf('/' + 1)),
      )
      watchIt.value = Math.floor((imdb + rottenTomatoes + metacritic) / 3)
      return
  }

  throw new Error()
}

async function fetchTrailer() {
  if (!result.value) {
    console.error('No result value available')
    return
  }
  try {
    const response = await fetch(apiConfig + result.value.imdbID)
    const data = await response.json()

    if (data.message) {
      console.error(data.message)
      return
    }

    youtubeID.value = youtubeEmbedLink + data[0].youtube_video_id
  } catch (e) {
    console.error(e)
  }
}

function resetVariables() {
  error.value = null
  result.value = null
  results.value = null
  youtubeID.value = ''
}

async function fetchMovie(imdbID: string) {
  dismissKeyboard()
  resetVariables()

  try {
    loadingStateOn()
    const response = await fetch(
      baseUrlOmdb + paramOmdbType + paramOmdbPlot + paramOmdbMovieTitle + imdbID,
    )

    if (!response.ok) {
      console.error('Promise failed to resolve')
      return
    }

    const data = await response.json()

    if (data.Error) {
      error.value = data.Error
      console.error('Promise failed to resolve')
      loadingStateOff()
      return
    }

    result.value = data
    loadingStateOff()
    overallScore()
    await fetchTrailer()
  } catch (e) {
    console.error(e)
  }
}
async function searchAll() {
  resetVariables()
  try {
    loadingStateOn()
    const response = await fetch(baseUrlOmdb + paramOmdbType + paramOmdbSearchAll + query.value)
    if (!response.ok) {
      console.error('Promise failed to resolve')
      return
    }
    const data = await response.json()
    if(data.Error){
      console.error(data.Error)
      return
    }
    results.value = data.Search.filter((item: Movie) => item.Poster !== 'N/A')
  } catch (e) {
    console.error(e)
  } finally {
    loadingStateOff()
  }
}
const debouncedSearch = debounce(searchAll, 300)
</script>

<template>
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
          class="block w-80 mx-auto rounded-full bg-white px-4 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-amber-400 sm:text-sm/6"
          placeholder="e.g. The Lion King"
          @keyup="debouncedSearch"
        />
        <h3 class="text-red-500">{{ error }}</h3>
      </div>
    </form>
  </div>

  <div v-if="loading" class="loader absolute top-4 left-4"></div>

  <div class="flex">
    <Transition>
      <div
        v-if="results"
        class="search flex sm:justify-center pt-4 pb-4 gap-8 overflow-x-scroll sm:overflow-visible sm:flex-wrap"
      >
        <div
          v-for="result in results"
          :key="result.Title"
          class="flex flex-col cursor-pointer flex-shrink-0 sm:opacity-70 sm:hover:opacity-100"
          @click="fetchMovie(result.imdbID)"
        >
          <img :src="result.Poster" alt="movie poster" />
          <div>
            <small>{{ result.Title }}</small>
          </div>
        </div>
      </div>
    </Transition>
  </div>

  <div class="mx-auto max-w-7xl px-4 pt-4 pb-4 sm:px-6 lg:px-8">
    <!-- We've used 3xl here, but feel free to try other max-widths based on your needs -->
    <div class="mx-auto max-w-3xl">
      <Transition name="slide">
        <div class="flex flex-col" v-if="result">
          <div class="text-4xl">{{ result.Title }}</div>
          <div class="flex justify-between text-gray-500 text-sm">
            <span>{{ result.Rated }}・{{ result.Runtime }}・{{ result.Year }}</span>
            <span>{{ result.Genre }}</span>
          </div>
          <div class="pt-4 pb-4">
            <iframe
              v-if="youtubeID"
              class="w-full"
              height="315"
              :src="youtubeID"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
            <div v-else>
              <img
                :src="result.Poster"
                class="mx-auto border border-gray-500 border-opacity-20"
                alt="movie poster"
              />
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
          <div class="flex items-center gap-4 justify-center pt-4 pb-4">
            <h2 class="text-2xl text-amber-500 font-bold">Overall Score</h2>
            <h3 class="text-5xl border-4 border-amber-500 rounded-full p-2">{{ watchIt }}</h3>
          </div>
          <div class="sm:flex sm:gap-4">
            <div class="pb-4 flex sm:w-1/2 flex-col gap-2">
              <h3 class="text-3xl">Plot Summary</h3>
              <p class="text-md tracking-wide leading-loose">{{ result.Plot }}</p>
            </div>
            <div
              class="flex flex-col sm:w-1/2 sm:flex-row mx-auto text-lg bg-gray-800 p-4 rounded justify-center"
            >
              <div class="flex flex-col gap-4">
                <div v-if="youtubeID" class="mx-auto">
                  <img :src="result.Poster" alt="movie poster" class="border-4 border-gray-500 border-opacity-80"/>
                </div>
                <div class="divide-y divide-gray-700">
                <div class="flex flex-col">
                  <div class="text-amber-500 font-semibold">Director</div>
                  <span>{{ result.Director }}</span>
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

      </Transition>
    </div>
  </div>
</template>

<style scoped>
/* we will explain what these classes do next! */

.v-enter-from {
  opacity: 0;
  transform: translateX(100px);
}
.v-enter-active {
  transition: all 1s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translatey(100px);
}

.slide-enter-active {
  transition: all 1s ease;
}

.search {
  scrollbar-width: none;
}
</style>
