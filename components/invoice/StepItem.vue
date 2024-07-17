<template>
  <div class="flex flex-col items-center w-16 h-16 justify-start">
    <i
      :class="[
        'pi text-2xl mb-1 mx-2',
        active ? 'text-purple-900 pi-circle-fill' : 'text-slate-400 pi-circle',
      ]"
    ></i>
    <p
      :class="[
        'font-medium text-xs text-center',
        active ? 'text-purple-900' : 'text-slate-500',
      ]"
    >
      <slot></slot>
    </p>
  </div>
</template>
  
  <script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
  
  <style scoped>
/* Add any additional styles if necessary */
</style>
  