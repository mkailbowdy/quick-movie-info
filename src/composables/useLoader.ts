import { ref } from 'vue'

export function useLoader() {
  const loading = ref(false)
  function loadingStateOn() {
    loading.value = true
  }
  function loadingStateOff() {
    loading.value = false
  }
  return { loading, loadingStateOn, loadingStateOff }
}
