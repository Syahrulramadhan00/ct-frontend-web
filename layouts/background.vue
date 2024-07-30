<script setup>
import "primeicons/primeicons.css";
</script>

<template>
  <div class="relative min-h-screen">
    <div class="relative z-20 m-4 bg-none flex flex-col">
      <slot />
    </div>
    <div
      class="z-10 bg-sky-400 opacity-10 bg-fixed bg-cover bg-center h-screen blur-[128px] fixed top-0 left-0 right-0 bottom-0"
    ></div>
    <div
      class="z-0 bg-[url('~/assets/img/main-background.png')] bg-fixed bg-cover bg-center h-screen blur-[80px] fixed top-0 left-0 right-0 bottom-0"
    ></div>
  </div>
</template>