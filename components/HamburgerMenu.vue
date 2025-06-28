<template>
  <div class="relative">
    <button
      @click="$emit('toggle')"
      class="relative z-10 focus:outline-none w-8 h-8 flex flex-col justify-around items-center"
      aria-label="Toggle Menu"
    >
      <span
        class="block w-6 h-0.5 bg-gray-800 transform transition duration-300 ease-in-out"
        :class="{ 'rotate-45 translate-y-[10.5px]': isOpen }"
      ></span>
      <span
        class="block w-6 h-0.5 bg-gray-800 transition duration-300 ease-in-out"
        :class="{ 'opacity-0': isOpen }"
      ></span>
      <span
        class="block w-6 h-0.5 bg-gray-800 transform transition duration-300 ease-in-out"
        :class="{ '-rotate-45 -translate-y-[10.5px]': isOpen }"
      ></span>
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// The component now receives its state from the parent
defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

// It emits an event to notify the parent that it has been clicked
defineEmits(['toggle']);
</script>

<style>
/* This style block can remain as is */
button {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}
</style>