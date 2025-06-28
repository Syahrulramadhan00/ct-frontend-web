<script setup>
import "primeicons/primeicons.css";
</script>

<template>
  <div class="relative min-h-screen">
    <div class="relative z-20 m-4 bg-none flex flex-col min-h-screen">
      <div class="flex flex-row flex-1 bg-none">
        
        <!-- Sidebar: Correctly hidden on small screens, visible on large -->
        <div class="fixed top-5 left-10 z-30 w-64 h-full hidden lg:block">
          <AppMenu />
        </div>

        <!-- Main Content Wrapper -->
        <!-- FIX: Margin is now responsive. No margin on small screens, ml-64 on large screens. -->
        <div class="flex flex-col flex-1 lg:ml-64">
          
          <!-- Header -->
          <!-- FIX: Positioning is now responsive. Spans most of the width on small screens, aligns with content on large. -->
          <div class="z-90 fixed top-5 right-5 left-5 lg:left-64 z-30">
            <AppHeader />
          </div>

          <!-- Page Content -->
          <!-- FIX: This container now naturally fills the space correctly without negative margins. -->
          <div class="z-0 flex-1 w-full p-4 mt-20">
            <slot />
          </div>
        </div>

      </div>
    </div>

    <!-- Background elements (unchanged) -->
    <div
      class="z-10 bg-sky-400 opacity-10 bg-fixed bg-cover bg-center h-screen blur-[128px] fixed top-0 left-0 right-0 bottom-0"
    ></div>
    <div
      class="z-0 bg-[url('~/assets/img/main-background.png')] bg-fixed bg-cover bg-center h-screen blur-[80px] fixed top-0 left-0 right-0 bottom-0"
    ></div>
  </div>
</template>