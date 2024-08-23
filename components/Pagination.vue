<template>
  <div class="flex items-center justify-center py-4">
    <!-- Previous Button -->
    <button
        v-if="currentPage !== 1"
        @click="previousPage"
    >
      <i class="pi pi-chevron-left text-lg ml-5 mr-4 pt-1 hover:text-teal-800"> </i>
    </button>

    <!-- Page Numbers -->
    <div class="flex space-x-2">
      <button
          v-for="page in pages"
          :key="page"
          @click="changePage(page)"
          :class="{
          'px-4 py-2 rounded': true,
          'bg-blue-500 text-white': page === currentPage,
          'bg-gray-200 text-gray-700 hover:bg-gray-300': page !== currentPage
        }"
      >
        {{ page }}
      </button>
    </div>

    <!-- Next Button -->
    <button
        v-if="currentPage < totalPages"
        @click="nextPage"
    >
      <i class="pi pi-chevron-right text-lg ml-5 mr-4 pt-1 hover:text-teal-800"> </i>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  totalPages: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
  limit: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['update:currentPage']);

const limit = 5;

const pages = computed(() => {
  const half = Math.floor(limit / 2);
  let startPage = Math.max(1, props.currentPage - half);
  let endPage = Math.min(props.totalPages, startPage + limit - 1);

  if (endPage - startPage + 1 < limit) {
    startPage = Math.max(1, endPage - limit + 1);
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
});


const changePage = (page) => {
  emit('update:currentPage', page);
};

const nextPage = () => {
  if (props.currentPage < props.totalPages) {
    emit('update:currentPage', props.currentPage + 1);
  }
};

const previousPage = () => {
  if (props.currentPage > 1) {
    emit('update:currentPage', props.currentPage - 1);
  }
};
</script>
