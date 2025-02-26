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
    <div class="flex justify-center gap-4 py-4">
      <button class="cool">button1</button>
      <button class="cool">button2</button>
      <button class="cool">button3</button>
      <button class="cool">button4</button>
      <button class="cool">button5</button>
    </div>
    <!--    <section class="hiddens">-->
    <!--      <h1>Hi mom</h1>-->
    <!--      <p>This is my website</p>-->
    <!--    </section>-->
    <!--    <section class="hiddens">-->
    <!--      <h1>Buy my product</h1>-->
    <!--      <p>Let's buy our food to go whe we get to the disnleyhand</p>-->
    <!--    </section>-->
    <!--    <div class="hiddens flex mt-16 flex-col relative justify-center">-->
    <!--      <img src="/dollars.svg" class="z-50 w-1/3">-->
    <!--      <img src="/phone.png" class="floating w-1/3 absolute top-0">-->
    <!--    </div>-->

    <!--    <h1 class="text-shadow-pop-top text-5xl">Movie DB</h1>-->
    <!--    <div class="h-screen"></div>-->
    <!--    <div class="h-screen"></div>-->
    <!--    <section class="hiddens">-->
    <!--      <h1>Buy my product</h1>-->
    <!--      <p>Let's buy our food to go whe we get to the disnleyhand</p>-->
    <!--    </section>-->
    <!--    <section class="hiddens">-->
    <!--      <h1>Buy my product</h1>-->
    <!--      <p>Let's buy our food to go whe we get to the disnleyhand</p>-->
    <!--    </section>-->
    <!--    <section class="hiddens">-->
    <!--      <h1>Buy my product</h1>-->
    <!--      <p>Let's buy our food to go whe we get to the disnleyhand</p>-->
    <!--    </section>-->
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

.cool {
  position: relative;
  aspect-ratio: 1;
  background-color: red;
  border-radius: 50%;
  inline-size: 5rem;
  transition: color 0.6s ease-in-out;
}

@property --fill {
  syntax: '<percentage>';
  inherits: true;
  initial-value: 0%;
}

.cool::before,
.cool::after {
  position: absolute;
  z-index: -1;
  content: '';
  inset: -5px;
  border-radius: inherit;
  background: conic-gradient(currentColor var(--fill), transparent var(--fill));
  /*transition: --fill 0.6s 0.3s ease-in-out;*/
  transition: --fill 0.6s ease-in-out;
}

/*.cool:hover, .cool:hover::before,.cool:hover::after {
transition-delay: 0s;
}*/

.cool:hover,
.cool:focus-visible,
.cool:focus-within {
  color: greenyellow;
  outline: 1px solid transparent;
}

.cool:nth-child(1):hover,
.cool:nth-child(1):focus-visible,
.cool:nth-child(1):focus-within {
  --fill: 100%;
}

.cool:nth-child(1)::after {
  display: none;
}

.cool:nth-child(2):hover,
.cool:nth-child(2):focus-visible,
.cool:nth-child(2):focus-within {
  --fill: 100%;
}
.cool:nth-child(2)::before {
  transform: rotateY(180deg);
}
.cool:nth-child(2)::after {
  display: none;
}

.cool:nth-child(3):hover,
.cool:nth-child(3):focus-visible,
.cool:nth-child(3):focus-within {
  --fill: 50%;
}

.cool:nth-child(3)::after {
  transform: rotateY(180deg);
}

.cool:nth-child(4):hover,
.cool:nth-child(4):focus-visible,
.cool:nth-child(4):focus-within {
  --fill: 50%;
}
.cool:nth-child(4)::before {
  transform: rotateX(180deg);
}
.cool:nth-child(4)::after {
  transform: rotate(180deg);
}

.cool:nth-child(5):hover,
.cool:nth-child(5):focus-visible,
.cool:nth-child(5):focus-within {
  --fill: 50%;
}
.cool:nth-child(5)::after {
  transform: rotate(180deg);
}
</style>
