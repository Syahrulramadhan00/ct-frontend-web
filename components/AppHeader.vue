<template>
  <div
    class="bg-opacity-50 bg-blur-lg bg-white backdrop-filter backdrop-blur-sm backdrop-saturate-150 rounded-2xl p-2 shadow-lg mb-4"
  >
    <div class="flex justify-between items-center">
      <div class="w-2"></div>
      <IconField>
        <InputIcon class="pi pi-search" />
        <InputText placeholder="Cari.." class="w-[30rem]" />
      </IconField>
      <div class="rounded-2xl h-10 w-36">
        <div class="flex justify-evenly items-center h-full w-full">
          <i class="pi pi-bell"></i>
          <i class="pi pi-cog"></i>
          <div class="w-6 h-6 bg-black rounded-full"></div>
          <i class="pi pi-chevron-down"></i>
        </div>
      </div>
    </div>
  </div>
</template>