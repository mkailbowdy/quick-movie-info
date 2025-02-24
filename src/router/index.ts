import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MovieView from '@/views/MovieView.vue'
import AnimationView from '@/views/AnimationView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/movie',
      name: 'movie',
      component: MovieView,
    },
    {
      path: '/animation',
      name: 'animation',
      component: AnimationView,
    },
  ],
})

export default router
