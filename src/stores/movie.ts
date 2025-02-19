import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Movie } from '@/types/Movie.ts'
import { baseUrlOmdb, paramOmdbSearchAll, paramOmdbType } from '@/apiConfig.ts'

export const useMovieStore = defineStore('movie', () => {
  const results = ref<Movie[] | null>(null)
  function clearResults() {
    results.value = null
  }

  async function searchAll(query: string) {
    clearResults()
    try {
      const response = await fetch(baseUrlOmdb + paramOmdbType + paramOmdbSearchAll + query)
      if (!response.ok) {
        console.error('Promise failed to resolve')
        return
      }
      const data = await response.json()
      if (data.Error) {
        console.error(data.Error)
        return
      }
      results.value = data.Search.filter((item: Movie) => item.Poster !== 'N/A')
      return results.value
    } catch (e) {
      console.error(e)
    }
  }
  return { results, searchAll, clearResults }
})
