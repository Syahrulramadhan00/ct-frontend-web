<template>
  <div class="flex flex-row items-baseline mt-3">
    <i
      :class="[
        'pi',
        icon,
        'mr-1',
        'text-sm',
        { 'text-purple-500': isActive, 'text-slate-400': !isActive },
      ]"
    ></i>
    <p
      :class="[
        'text-sm',
        'font-medium',
        { 'text-purple-500': isActive, 'text-slate-400': !isActive },
      ]"
    >
      {{ title }}
    </p>
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
    isActive: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
  