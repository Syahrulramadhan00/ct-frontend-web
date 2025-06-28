<template>
  <div class="flex items-center">
    <template v-for="(step, index) in steps" :key="index">
      <InvoiceStepItem :active="index <= activeIndex">
        {{ step }}
      </InvoiceStepItem>
      <InvoiceLineItem
        v-if="index < steps.length - 1"
        :active="index < activeIndex"
      />
    </template>
  </div>
</template>
  
  <script>
export default {
  props: {
    activeIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      steps: [
        "Buat PO",
        "Finalisasi",
        "Barang Terkirim",
        "Buat Faktur",
        "Tanda Terima",
        "Pembayaran",
        "Selesai",
      ],
    };
  },
};
</script>
  
  <style scoped>
/* Add any additional styles if necessary */
</style>
  