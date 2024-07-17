<template>
  <div
    :class="[
      'flex-1 h-0.5 rounded-full mb-10',
      active ? 'bg-purple-900' : 'bg-slate-400',
    ]"
  ></div>
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

<style lang="scss" scoped>
</style>