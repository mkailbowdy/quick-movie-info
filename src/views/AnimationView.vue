<script setup lang="ts">
</script>
<template>
  <div class="h-screen grid place-items-center">
    <div>
      <div class="card">
      </div>
    </div>
  </div>

</template>
<style scoped>
.card {
  position: relative;
  justify-content: center;
  align-items: center;
  inline-size: 5em;
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: white;
}
.card::after, .card::before {
  content: '';
  position: absolute;
  inset:-5px;
  border-radius: inherit;
  background: conic-gradient(red 100%, transparent 100%);
  z-index: -1;
}
</style>
