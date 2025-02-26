<script setup lang="ts">
import SearchComponent from '@/components/SearchComponent.vue'
import { onMounted } from 'vue'

onMounted(()=>{
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      console.log(entry)
      if (entry.isIntersecting) {
        entry.target.classList.add('reviews')
      } else {
        entry.target.classList.remove('reviews')
      }
    })
  }, {
    root: null,
    rootMargin: "0px",
    threshold: 1.0,
  })
  const ele = document.querySelector('.reviews')
  if(ele){
    observer.observe(ele)
  }
})

</script>
<template>
  <SearchComponent />
  <section class="py-12">
    <div class="space-y-4 w-3/4">
      <h2 class="max-w-2xl text-3xl tracking-tight text-strong sm:text-4xl xl:text-5xl/[1.2]">Film Lookup</h2>
      <p class="max-w-2xl text-base text-default sm:text-lg text-neutral-400">
        Get the basic info of the movies you're interested in -- no spammy links
      </p>
    </div>
      <div class="flex gap-4 -rotate-6 skew-x-12 mt-12 -ml-8 w-7/12 overflow-x-visible">
        <img src="/nosferatu.jpg" class="gallery"/>
        <img src="/dune.jpg" class="gallery"/>
        <img src="/latenight.jpg"  class="gallery"/>
        <img src="/starwars.jpg"  class="gallery"/>
        <img src="/avatar.jpg"  class="gallery"/>
      </div>

  </section>
  <section class="py-12">
    <div class="bg-gray-800 p-4 w-3/4 reviews">
      <div class="space-y-4 w-3/4">
        <h2 class="max-w-2xl text-3xl tracking-tight text-strong sm:text-4xl xl:text-5xl/[1.2]">Our Reviews</h2>
        <p class="max-w-2xl text-base text-default sm:text-lg text-neutral-400">
          We're film lovers. Read our reviews first before committing the time to watch.
        </p>
        <div>
          <RouterLink
            :to="{ name: 'movie', query: { imdbID: 'tt14966898' } }"
            class="text-indigo-500 hover:text-red-500 transition"
          >Late Night with the Devil<span class="ml-2">&rarr;</span></RouterLink
          >
        </div>
      </div>
    </div>
  </section>
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
.reviews{
  box-shadow: 16px 16px teal;
  transition: all 0.3s ease-out;
}



</style>
