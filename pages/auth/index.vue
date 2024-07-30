<template>
  <div
    class="bg-blur-lg backdrop-filter backdrop-blur-xl bg-white/65 rounded-2xl p-2 shadow-lg mt-44 min-w-96 lg:mx-44 md:mx-44 mx-4"
  >
    <div class="flex items-center justify-around flex-wrap py-12">
      <div class="mx-2">
        <p class="text-2xl font-light mb-2">Selamat datang 👋</p>
        <p class="text-6xl font-bold mb-8">Sign in</p>
      </div>
      <div class="">
        <FloatLabel class="mt-4">
          <InputText id="email" v-model="email" class="md:w-64 lg:w-[27rem]" />
          <label for="email">Email</label>
        </FloatLabel>
        <div class="">
          <FloatLabel class="mt-8">
            <InputText
              id="password"
              v-model="password"
              class="md:w-64 lg:w-[27rem]"
            />
            <label for="password">Password</label>
          </FloatLabel>
          <p class="mt-1 font-semibold text-blue-600 text-sm">Lupa password?</p>
        </div>
        <div class="flex flex-col items-center">
          <div
            class="main-container bg-purple-300 p-0 py-1 px-3 flex justify-evenly items-center mt-8 w-56 md:w-64 lg:w-[27rem] mb-2"
          >
            <p class="text-purple-800 font-semibold">Masuk</p>
          </div>
          <div class="flex">
            <p class="text-sm mr-1">Tidak punya akun?</p>
            <NuxtLink to="/auth/register">
              <p class="font-semibold text-blue-600 text-sm">Daftar disini</p>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "background",
});

const email = ref(null);
const password = ref(null);
</script>

