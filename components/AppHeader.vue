<template>
  <SidebarApp :isOpen="isSidebarOpen" @close="closeSidebar" />

  <div
    class="bg-opacity-50 bg-blur-lg bg-white backdrop-filter backdrop-blur-sm backdrop-saturate-150 rounded-2xl p-2 shadow-lg mb-4"
  >
    <div class="flex justify-between lg:justify-end items-center">
      <div class="lg:hidden">
        <HamburgerMenu :isOpen="isSidebarOpen" @toggle="toggleSidebar" />
      </div>

      <!-- Adjusted structure for better alignment -->
      <div class="rounded-2xl h-10 w-auto flex items-center space-x-2 pr-2">
        <div class="w-6 h-6 bg-black rounded-full"></div>
        <div class="card flex items-center">
          <p class="text-sm font-medium mr-1">Syahrul Ramadhan</p>
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
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import HamburgerMenu from "./HamburgerMenu.vue";
import SidebarApp from "./SidebarApp.vue";

// --- State for the Sidebar ---
const isSidebarOpen = ref(false);
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
const closeSidebar = () => {
  isSidebarOpen.value = false;
};
// --- End Sidebar State ---

const router = useRouter();

// --- PrimeVue Menu Logic (remains the same) ---
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
