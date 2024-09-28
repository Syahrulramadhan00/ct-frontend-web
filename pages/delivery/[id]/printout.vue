<script setup>
import {onMounted} from "vue";
import {Util} from "~/composables/Util.js";

definePageMeta({
  layout: "paper",
});

const delivery = ref();
const products = ref([]);
const route = useRoute();

async function init() {
  delivery.value = await getDelivery(route.params.id);
  products.value = await getDeliveryProducts(route.params.id);
}

const {
  pending,
  getDelivery,
} = DeliveryApi();
const {formatDateDM, formatY2Digit, formatNumber} = Util();
const {
  getDeliveryProducts,
} = DeliveryProductApi();


onMounted(() => {
  init();
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
      <p class="text-sm">{{formatDateDM(delivery?.CreatedAt ?? "")}}</p>
    </div>
    <div class="z-100 absolute ml-[155mm] mt-[17mm]">
      <p class="text-sm">{{formatY2Digit(delivery?.CreatedAt ?? "")}}</p>
    </div>
    <div class="z-100 absolute ml-[50mm] mt-[35mm]">
      <p>{{delivery?.OrderCode ?? ""}}</p>
      <p>{{delivery?.Invoice?.PoCode ?? ""}}</p>
    </div>
    <div class="z-100 absolute ml-[112mm] mt-[32mm]">
      <p class="font-bold">{{delivery?.Invoice?.Client?.name ?? ""}}</p>
      <p class="text-sm">{{ delivery?.Invoice?.Client?.place ?? "" }}</p>
      <p class="text-sm">{{"proy " + delivery?.Invoice?.ProjectName ?? ""}}</p>
    </div>

    <!--  PRODUCT SECTION  -->
    <div class="z-100 absolute ml-[27mm] mt-[65mm]">
      <div v-for="(product) in products">
        <div class="flex">
          <p class="w-[25mm]">{{formatNumber(product?.Quantity ?? "")}}</p>
          <p class="w-[33mm]">PCS</p>
          <p class="w-[60mm]">{{product.Name ?? ""}}</p>
        </div>
      </div>
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