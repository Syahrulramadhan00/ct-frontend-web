<template>
  <div class="flex-1 main-container">
    <div class="flex justify-between items-center h-full">
      <div>
        <p class="font-semibold lg:text-lg text-sm">{{ title }}</p>
        <p class="font text-sm text-gray-500">tekan disini</p>
      </div>
      <div class="main-container bg-purple-900 shadow-none -p-4 ml-2">
        <i
          :class="[
            'pi',
            icon,
            'text-2xl',
            'items-center',
            'justify-center',
            'text-white',
            'font-black',
          ]"
        ></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
};
</script>