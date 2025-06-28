<template>
  <div
    ref="sidebarNode"
    :class="[
      'fixed top-0 left-0 h-full w-[250px] bg-white shadow-2xl z-50',
      'flex flex-col transform transition-transform duration-300 ease-in-out',
      isOpen ? 'translate-x-0' : '-translate-x-full'
    ]"
  >
    <div class="flex items-center gap-x-3 p-4 border-b border-slate-200">
      <div class="w-7 h-7 bg-cover bg-center bg-[url('~/assets/img/logo-ct.png')]"></div>
      <p class="text-lg font-semibold text-slate-800">CahayaTeknik</p>
    </div>

    <nav class="flex-1 overflow-y-auto p-4 space-y-2">
      <div v-for="(group, index) in menuGroups" :key="group.title || index">
        <Divider v-if="index > 0" class="my-4" />

        <p
          v-if="group.title"
          class="px-3 pt-2 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider"
        >
          {{ group.title }}
        </p>

        <AppMenuItem
          v-for="item in group.items"
          :key="item.link"
          :icon="item.icon"
          :title="item.title"
          :link="item.link"
          @selected="emit('close')"
        />
      </div>
    </nav>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch, onUnmounted } from 'vue';
import AppMenuItem from './AppMenuItem.vue';
import Divider from 'primevue/divider';

// --- Props and Emits (remain the same) ---
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});
const emit = defineEmits(['close']);

// --- Data-Driven Menu Structure ---
// Managing the menu here is much cleaner than in the template.
const menuGroups = ref([
  {
    items: [
      { icon: 'pi-home', title: 'Dashboard', link: '/' },
      { icon: 'pi-box', title: 'Stok produk', link: '/product' },
      { icon: 'pi-shopping-bag', title: 'Pembelian', link: '/buy' },
    ]
  },
  {
    title: 'Penjualan',
    items: [
      { icon: 'pi-receipt', title: 'Invoice', link: '/invoice' },
      { icon: 'pi-truck', title: 'Surat jalan', link: '/delivery' },
      { icon: 'pi-book', title: 'Tanda terima', link: '/receipt' },
    ]
  },
  {
    items: [
      { icon: 'pi-address-book', title: 'Klien', link: '/client' },
      { icon: 'pi-warehouse', title: 'Supplier', link: '/supplier' },
      { icon: 'pi-chart-pie', title: 'Analitik', link: '/analytic' },
    ]
  }
]);


const sidebarNode = ref(null);
const handleClickOutside = (event) => {
  if (sidebarNode.value && !sidebarNode.value.contains(event.target)) {
    emit('close');
  }
};

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    document.addEventListener('mousedown', handleClickOutside);
  } else {
    document.removeEventListener('mousedown', handleClickOutside);
  }
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>