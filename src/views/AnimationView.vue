<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      console.log(entry)
      if (entry.isIntersecting) {
        entry.target.classList.add('show')
      } else {
        entry.target.classList.remove('show')
      }
    })
  })
  const hiddenElements = document.querySelectorAll('.hiddens')
  hiddenElements.forEach((el) => observer.observe(el))
  console.log(hiddenElements)
})
</script>
<template>
  <div class="body">
    <section class="hiddens">
      <h1>Hi mom</h1>
      <p>This is my website</p>
    </section>
    <section class="hiddens">
      <h1>Buy my product</h1>
      <p>Let's buy our food to go whe we get to the disnleyhand</p>
    </section>
    <div class="hiddens flex mt-16 flex-col relative justify-center">
      <img src="/dollars.svg" class="z-50 w-1/3">
      <img src="/phone.png" class="floating w-1/3 absolute top-0">
    </div>

    <h1 class="text-shadow-pop-top text-5xl">Movie DB</h1>
    <div class="h-screen"></div>
    <div class="h-screen"></div>
    <section class="hiddens">
      <h1>Buy my product</h1>
      <p>Let's buy our food to go whe we get to the disnleyhand</p>
    </section>
    <section class="hiddens">
      <h1>Buy my product</h1>
      <p>Let's buy our food to go whe we get to the disnleyhand</p>
    </section>
    <section class="hiddens">
      <h1>Buy my product</h1>
      <p>Let's buy our food to go whe we get to the disnleyhand</p>
    </section>
  </div>
</template>
<style scoped>
@keyframes floating {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-20px);
  }
}
.floating {
  /* @keyframes duration | easing-function | delay | iteration-count | direction | fill-mode | play-state | name */
  animation: 2s ease-in-out 0s infinite alternate both running floating;
}

section {
  display: grid;
  place-items: center;
  align-items: center;
  min-height: 100vh;
  color: white;
}

.hiddens {
  opacity: 0;
  filter: blur(5px);
  transform: translateX(-100%);
  transition: all 1s;
}

.show {
  opacity: 1;
  filter: blur(0);
  transform: translateX(0);
}
.body {
  padding: 0;
  margin: 0;
}
</style>
