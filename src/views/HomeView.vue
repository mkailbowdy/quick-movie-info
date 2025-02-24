<script setup lang="ts">
import SearchComponent from '@/components/SearchComponent.vue'
</script>
<template>
  <SearchComponent />
  <div class="text-center p-4">
    <h1 class="text-3xl">Hi <span class="text-amber-500 border-b">Mighty Scout</span>!</h1>
    <div class="pt-4">
      <p class="text-gray-300">Read my review of my favorite movie!</p>
      <RouterLink
        :to="{ name: 'movie', query: { imdbID: 'tt14966898' } }"
        class="text-2xl text-indigo-500 hover:text-red-500 transition"
        >Late Night with the Devil<span class="ml-2">&rarr;</span></RouterLink
      >
    </div>
    <!--    <h1 class="animate slideInLeft animate&#45;&#45;fast text-5xl">Hello, World!</h1>-->
    <!--    <h1 class="animate slideInLeft animate&#45;&#45;slow text-5xl">Hello, World!</h1>-->
    <!--    <h1 class="animate slideInLeft animate&#45;&#45;infinite text-5xl">Hello, World!</h1>-->
    <!--    <h1 class="animate slideInLeft animate&#45;&#45;delay-1s text-5xl">Hello, World!</h1>-->
    <!--    <h1 class="animate slideInLeft text-5xl">Hello, World!</h1>-->
    <!--    <h1 class="inline-block animate bounce text-5xl">Hello, World!</h1>-->
  </div>
</template>
<style scoped>
/* Utility Class */
.animate {
  animation-duration: 1s;
  animation-fill-mode: both;
}
.animate.animate--infinite {
  animation-iteration-count: infinite;
}

.animate.animate--delay-1s {
  animation-delay: 1s;
}

.animate.animate--fast {
  animation-duration: 0.6s;
}

.animate.animate--slow {
  animation-duration: 3s;
}

@keyframes slideInLeft {
  from {
    transform: translateX(-300px);
  }
  to {
    transform: translateX(0);
  }
}
.slideInLeft {
  animation-name: slideInLeft;
  animation-timing-function: ease-in;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.rotate {
  animation-name: rotate;
  animation-timing-function: ease-in-out;
  transform-origin: top left;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-60px);
  }
  60% {
    transform: translateY(-30px);
  }
}

.bounce {
  animation-name: bounce;
  animation-timing-function: ease-in-out;
}

.btn {
  /*transition-property: transform;
  transition-duration: 0.5s;
  transition-timing-function: ease-out;
  transition-delay: 0s;*/
  transition: all 0.3s ease-in;
}
.btn:hover {
  transform: translateY(-10px);
  background-color: purple;
}
</style>
