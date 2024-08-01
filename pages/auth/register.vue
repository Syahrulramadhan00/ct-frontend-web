<template>
  <div
    class="bg-blur-lg backdrop-filter backdrop-blur-xl bg-white/65 rounded-2xl p-2 shadow-lg mt-44 min-w-96 lg:mx-44 md:mx-44 mx-4"
  >
    <div class="flex items-center justify-around flex-wrap py-12 px-3">
      <div class="mx-2">
        <p class="text-2xl font-light mb-2">Selamat datang 👋</p>
        <p class="text-6xl font-bold mb-8">Register</p>
      </div>
      <div class="">
        <FloatLabel class="">
          <InputText
            id="username"
            v-model="username"
            class="md:w-64 lg:w-[27rem]"
          />
          <label for="username">Username</label>
        </FloatLabel>
        <FloatLabel class="mt-8">
          <InputText id="email" v-model="email" class="md:w-64 lg:w-[27rem]" />
          <label for="email">Email</label>
        </FloatLabel>
        <FloatLabel class="mt-8">
          <InputText
            id="password"
            v-model="password"
            class="md:w-64 lg:w-[27rem]"
          />
          <label for="password">Password</label>
        </FloatLabel>
        <div class="flex flex-col items-center">
          <div
            @click="register"
            class="main-container bg-purple-300 p-0 py-1 px-3 flex justify-evenly items-center mt-8 w-56 md:w-64 lg:w-[27rem] mb-2 hover:cursor-pointer"
          >
            <div v-if="pending" class="pt-1">
              <ProgressSpinner
                style="width: 20px; height: 20px"
                strokeWidth="6"
              />
            </div>
            <p v-else class="text-purple-800 font-semibold">Daftar</p>
          </div>
          <div class="flex justif">
            <p class="text-sm mr-1">Sudah punya akun?</p>
            <NuxtLink to="/auth">
              <p class="font-semibold text-blue-600 text-sm">Masuk disini</p>
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

import FetchUtils from "~/composables/FetchUtils";
import ProgressSpinner from "primevue/progressspinner";
import { useRouter } from "vue-router";
import { useEmailOtp } from "~/store/EmailOtp";

const { fetchApi, res, url, pending, method, body } = FetchUtils();

const email = ref(null);
const password = ref(null);
const username = ref(null);
const router = useRouter();
const storeOtp = useEmailOtp();

async function requestOtp() {
  url.value = "request-otp";

  body.value = {
    email: email.value,
  };

  await fetchApi();

  if (res.value.status == 200) {
    storeOtp.setEmailOtp(email.value);
    router.push("/auth/otp");
  }
}

async function register() {
  url.value = "register";
  method.value = "POST";

  body.value = {
    email: email.value,
    password: password.value,
    name: username.value,
  };

  await fetchApi();

  if (res.value.status == 200) {
    requestOtp();
  }
}
</script>

  
  