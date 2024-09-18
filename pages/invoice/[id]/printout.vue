<script setup>
import {InvoiceApi} from "~/composables/invoices/InvoiceApi.js";
import {Util} from "~/composables/Util.js";
import {Terbilang} from "~/composables/Terbilang.js";

definePageMeta({
  layout: "paper",
});

const invoice = ref([]);
const route = useRoute();
const tax = ref();
const totalPrice = ref();
const {formatDateDM, formatY2Digit, getDeadline, formatNumber} = Util();
const sales = ref([]);
const {pending: salePending, getAllSales} = SalesApi();
const pending = ref(true);


const {
  getInvoice,
} = InvoiceApi();

const {toTerbilang} = Terbilang();

async function init() {
  invoice.value = await getInvoice(route.params.id);
  sales.value = await getAllSales(route.params.id);

  if (invoice.value.IsTaxable){
    tax.value = Math.round(invoice.value.TotalPrice / 100 * 11);
  } else {
    tax.value = 0;
  }
  totalPrice.value = invoice.value.TotalPrice + tax.value;
  console.log(tax.value);
  pending.value = false;
}

onMounted(() => {
  init();
});

function printInvoice() {
  window.print();
}
</script>

<template>
  <div v-if="pending" class="flex justify-center items-center h-[155mm]">
    <ProgressSpinner
    />
  </div>
  <div v-else>
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
          @click="printInvoice"
          class="main-container mt-2 ml-2 bg-purple-400 p-0 py-1 px-3 flex justify-evenly items-center hover:cursor-pointer"
      >
        <i class="pi pi-print text-white mr-1"> </i>
        <p class="text-white">print invoice</p>
      </div>
    </div>

    <!--  HEADER SECTION  -->
    <div class="z-100 absolute ml-[125mm] mt-[20mm]">
      <p class="text-sm">{{ formatDateDM(invoice.Date ?? "") }}</p>
    </div>
    <div class="z-100 absolute ml-[155mm] mt-[20mm]">
      <p class="text-sm">{{ formatY2Digit(invoice.Date ?? "") }}</p>
    </div>
    <div class="z-100 absolute ml-[38mm] mt-[33mm]">
      <p class="text-lg">{{ invoice ? invoice.InvoiceCode : "" }}</p>
    </div>
    <div class="z-100 absolute ml-[120mm] mt-[33mm]">
      <p class="text-xs">{{ invoice ? invoice.Client?.name : "" }}</p>
      <p class="text-xs">{{ invoice ? invoice.ProjectName : "" }}</p>
    </div>

    <!--  ROW 1  -->
    <div class="z-100 absolute ml-[15mm] mt-[55mm]">
      <p class="text-sm">{{ invoice ? invoice.Seller : "" }}</p>
    </div>
    <div class="z-100 absolute ml-[50mm] mt-[55mm]">
      <p class="text-sm">{{ invoice ? invoice.PoCode : "" }}</p>
    </div>
    <div class="z-100 absolute ml-[100mm] mt-[55mm]">
      <p class="text-sm">{{ invoice ? invoice.PaymentTerm : "" }} Hari</p>
    </div>
    <div class="z-100 absolute ml-[130mm] mt-[55mm]">
      <p class="text-sm">{{ getDeadline((invoice.Date ?? ""), (invoice.PaymentTerm ?? 0)) }}</p>
    </div>

    <!--  ROW 2  -->
    <div class="z-100 absolute ml-[20mm] mt-[80mm]">
      <div v-for="(sale) in sales">
      <div class="flex">
        <p class="text-sm w-[70mm]">{{ sale.nama }}</p>
        <p class="text-sm w-[25mm]">Rp. {{ formatNumber(sale.harga) }}</p>
        <p class="text-sm w-[15mm]">{{ formatNumber(sale.jumlah) }}</p>
        <p class="text-sm w-[35mm]">Rp. {{ formatNumber(sale.total) }}</p>
      </div>
      </div>
    </div>

    <!--  NOTES  -->
    <div class="z-100 absolute ml-[20mm] mt-[140mm]">
      <p class="text-xs">{{ invoice ? invoice.Platform : "" }} {{ invoice ? invoice.PlatformNumber : "" }}</p>
      <p class="text-xs">a/n {{ invoice ? invoice.PlatformDescription : "" }}</p>
    </div>

    <!--  ROW 3  -->
    <div class="z-100 absolute ml-[130mm] mt-[152mm]">
      <p class="text-sm">Rp. {{ formatNumber(invoice ? invoice.TotalPrice : "") }}</p>
    </div>

    <!--  DISCOUNT  -->
    <div class="z-100 absolute ml-[110mm] mt-[159mm]">
      <p class="text-sm">{{ invoice ? (invoice.Discount > 0 ? invoice.Discount : "") : "" }}</p>
    </div>

    <!--  TAX  -->
    <div v-if="tax !== 0 && tax !== null" class="z-100 absolute ml-[130mm] mt-[167mm]">
      <p class="text-sm">Rp. {{ formatNumber(tax) }}</p>
    </div>

    <!--  ROW 4  -->
    <div class="z-100 absolute ml-[130mm] mt-[176mm]">
      <p class="text-sm">Rp. {{ formatNumber(totalPrice) }}</p>
    </div>

    <!--  ROW 5  -->
    <div v-if="totalPrice !== null" class="z-100 absolute ml-[30mm] mt-[183mm] w-[100mm]">
      <p class="text-sm">{{ toTerbilang(totalPrice?.toString())}} RUPIAH</p>
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