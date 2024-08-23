<template>
  <div
    class="bg-opacity-50 bg-blur-lg bg-white backdrop-filter backdrop-blur-sm backdrop-saturate-150 rounded-2xl p-2 shadow-lg mb-4"
  >
    <div class="flex justify-between items-center">
      <div></div>
      <IconField>
        <InputIcon class="pi pi-search" />
        <InputText placeholder="Cari.." class="lg:w-[30rem]" />
      </IconField>
      <div class="rounded-2xl h-10 w-36">
        <div class="flex justify-evenly items-center h-full w-full">
          <i class="pi pi-bell"></i>
          <i class="pi pi-cog"></i>
          <div class="w-6 h-6 bg-black rounded-full"></div>
          <!-- <i class="pi pi-chevron-down"></i> -->
          <div class="card flex justify-center">
            <Button
              icon="pi pi-chevron-down"
              size="small"
              text
              rounded
              aria-label="Filter"
              @click="toggle"
              aria-haspopup="true"
              aria-controls="overlay_menu"
              style="color: black"
            />
            <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const menu = ref();
const items = ref([
  {
    label: "Options",
    items: [
      {
        label: "Logout",
        icon: "pi pi-sign-out",
        command: () => {
          localStorage.setItem("token", "");
          router.push("/auth");
        },
      },
    ],
  },
]);

const toggle = (event) => {
  menu.value.toggle(event);
};
</script>