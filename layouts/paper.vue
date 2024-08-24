<template>
  <div class="mx-auto bg-white border-2 h-[206mm] w-[148mm] p-0">
    <slot />
  </div>
</template>

<script setup>
</script>

<style scoped>
@page {
  size: A4;
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
