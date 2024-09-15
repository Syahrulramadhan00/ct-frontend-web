<template>
  <div class="mx-auto bg-white border-2 h-[209mm] w-[150mm] p-0">
    <slot />
  </div>
</template>

<script setup>
</script>

<style scoped>
@page {
  size: A5;
  margin: 0;
}

@media print {
  body {
    margin: 0;
    padding: 0;
  }

  .mx-auto {
    margin: 0 !important;
    padding: 0 !important;
  }
}
</style>
