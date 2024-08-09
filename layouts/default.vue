<script setup>
import "primeicons/primeicons.css";
</script>

<template>
  <div class="relative min-h-screen">
    <div class="relative z-20 m-4 bg-none flex flex-col min-h-screen">
      <div class="flex flex-row flex-1 bg-none">
        <div class="fixed top-5 left-10 z-30 w-64 h-full">
          <AppMenu class />
        </div>
        <div class="flex flex-col flex-1 ml-64">
          <div class="z-90 fixed top-5 left-64 right-5 z-30">
            <AppHeader />
          </div>
          <div class="z-0 flex-1 w-full p-4 mt-20 -ml-4">
            <slot />
          </div>
        </div>
      </div>
    </div>
    <div
      class="z-10 bg-sky-400 opacity-10 bg-fixed bg-cover bg-center h-screen blur-[128px] fixed top-0 left-0 right-0 bottom-0"
    ></div>
    <div
      class="z-0 bg-[url('~/assets/img/main-background.png')] bg-fixed bg-cover bg-center h-screen blur-[80px] fixed top-0 left-0 right-0 bottom-0"
    ></div>
  </div>
</template>