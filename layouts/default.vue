<script setup>
import "primeicons/primeicons.css";
</script>

<template>
  <div class="">
    <div class="relative z-20 m-4 bg-none">
      <div class="flex flex-row bg-none">
        <AppMenu />
        <div>
          <AppHeader />
          <slot />
        </div>
      </div>
    </div>
    <AppFooter />
    <div
      class="z-10 bg-sky-400 opacity-10 bg-fixed bg-cover bg-center h-screen blur-[128px] absolute inset-0"
    ></div>
    <div
      class="z-0 bg-[url('~/assets/img/main-background.png')] bg-fixed bg-cover bg-center h-screen blur-[80px] absolute inset-0"
    ></div>
  </div>
</template>