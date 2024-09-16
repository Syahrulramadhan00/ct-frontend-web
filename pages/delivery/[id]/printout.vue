<script setup>
definePageMeta({
  layout: "paper",
});

function printDelivery() {
  window.print();
}
</script>

<template>
  <div>
    <div class="z-0 absolute">
      <div class="border-dashed border-white border-t-2 w-[149mm] mt-2">
      </div>
      <div class="flex">
        <div class="border-dashed border-white border-l-2 h-[204mm] ml-2">
        </div>
      </div>
    </div>

    <!-- PRINT BUTTON   -->
    <div class="z-100 absolute" id="print-button">
      <div
          @click="printDelivery"
          class="main-container mt-2 ml-2 bg-purple-400 p-0 py-1 px-3 flex justify-evenly items-center hover:cursor-pointer"
      >
        <i class="pi pi-print text-white mr-1"> </i>
        <p class="text-white">print surat jalan</p>
      </div>
    </div>

    <!--  HEADER SECTION  -->
    <div class="z-100 absolute ml-[132mm] mt-[17mm]">
      <p class="text-sm">26 januari</p>
    </div>
    <div class="z-100 absolute ml-[155mm] mt-[17mm]">
      <p class="text-sm">24</p>
    </div>
    <div class="z-100 absolute ml-[55mm] mt-[38mm]">
      <p class="text-lg">177/x/SAM/SBY/22/A</p>
      <p class="text-lg">177/x/SAM/SBY/22</p>
    </div>
    <div class="z-100 absolute ml-[120mm] mt-[28mm]">
      <p class="text-xs">Pt sinergi Makmur sentosa</p>
      <p class="text-xs">proyek : ikn</p>
    </div>

    <!--  PRODUCT SECTION  -->
    <div class="z-100 absolute ml-[20mm] mt-[65mm]">
<!--      <div v-for="(sale) in sales">-->
        <div class="flex">
          <p class="text-sm w-[25mm]">9999</p>
          <p class="text-sm w-[40mm]">PCS</p>
          <p class="text-sm w-[60mm]">Mur M8 Galv.</p>
        </div>
<!--      </div>-->
    </div>
  </div>
</template>

<style scoped>
@media print {
  #print-button {
    display: none;
  }
}
</style>