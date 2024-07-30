<template>
  <div
    class="bg-blur-lg backdrop-filter backdrop-blur-xl bg-white/65 rounded-2xl p-2 shadow-lg mt-44 min-w-96 lg:mx-44 md:mx-44 mx-4"
  >
    <div class="flex items-center justify-around flex-wrap py-12">
      <div class="mx-2 flex flex-col justify-center">
        <p class="text-6xl font-bold mb-3">Verifikasi</p>
        <p class="text-6xl font-bold mb-8">kode</p>
      </div>
      <div class="">
        <div class="flex">
          <!-- <InputOtp class="" v-model="otp" /> -->
          <InputOtp v-model="otp">
            <template #default="{ attrs, events }">
              <input
                type="text"
                v-bind="attrs"
                v-on="events"
                class="flex-1 lg:w-24 w-12 md:w-16 text-3xl appearance-none text-center transition-all duration-200 bg-transparent border-2 rounded-lg border-black focus:outline-none focus:border-purple-600"
              />
            </template>
          </InputOtp>
        </div>
        <div class="flex flex-col items-center">
          <div
            class="main-container bg-purple-300 p-0 py-1 px-3 flex justify-evenly items-center mt-8 w-56 md:w-64 lg:w-[27rem] mb-2"
          >
            <p class="text-purple-800 font-semibold">Verifikasi</p>
          </div>
          <div class="flex">
            <NuxtLink>
              <p class="font-semibold text-blue-600 text-sm mr-1">
                Hubungi Admin
              </p>
            </NuxtLink>
            <p class="text-sm">untuk mendapat token</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import InputOtp from "primevue/inputotp";
import { ref } from "vue";

definePageMeta({
  layout: "background",
});

const otp = ref(null);
</script>
  