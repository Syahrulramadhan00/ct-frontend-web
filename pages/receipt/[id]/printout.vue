<script setup>
import {onMounted, ref} from "vue";
import {Util} from "~/composables/Util.js";

definePageMeta({
  layout: "a4",
});

const route = useRoute();
const pending = ref(true);
const {getReceipt, getInvoices} = ReceiptApi();
const rawInvoices = ref();
const receipt = ref();
const invoices = ref([]);
const {formatNumber} = Util();

onMounted(async () => {
  receipt.value = await getReceipt(route.params.id);
  rawInvoices.value = await getInvoices(route.params.id);
  invoices.value = [...rawInvoices.value];
  while (invoices.value.length < 12) {
    invoices.value.push(null);
  }
  pending.value = false;
});

function padZeroes(num) {
  if (num === null) return "";

  return num.toString().padStart(4, '0');
}

function getDateNow() {
  const date = new Date();
  const options = {day: '2-digit', month: 'long', year: 'numeric'};
  return date.toLocaleDateString('id-ID', options);
}

function getDate(date) {
  if (date === null) return "";
  return date.split('T')[0];
}

const totalAmount = computed(() => {
  return rawInvoices.value.reduce((sum, inv) => {
    return sum + (inv?.rawJumlah || 0);
  }, 0);
});

function printReceipt() {
  window.print();
}
</script>

<template>
  <div v-if="pending" class="flex justify-center items-center h-[155mm]">
    <ProgressSpinner
    />
  </div>

  <div v-else class="z-0 absolute" id="pages">
    <div class="z-100 absolute" id="print-button">
      <div
          @click="printReceipt"
          class="main-container mt-2 ml-2 bg-purple-400 p-0 py-1 px-3 flex justify-evenly items-center hover:cursor-pointer"
      >
        <i class="pi pi-print text-white mr-1"> </i>
        <p class="text-white">print tanda terima</p>
      </div>
    </div>

    <div class="flex flex-col justify-center items-center">
      <!--  HEADER  -->
      <NuxtImg
          src="images/logo-ct.png"
          width="128"
          class="my-5"
      />
      <p class="text-lg">SURAT TANDA TERIMA</p>
      <div class="border-b-2 border-black w-[140mm]"></div>
      <p class="text-lg">NO. {{ padZeroes(receipt?.Number) }}</p>

      <!--  BODY  -->
      <div class="w-full mb-2 mt-5">
        <p class="ml-12">Terima dari : CV. Catur Cahaya Teknik</p>
      </div>
      <table>
        <thead>
        <tr>
          <th>No</th>
          <th>Tanggal</th>
          <th>No. Invoice</th>
          <th>Jumlah</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(inv, index) in invoices" :key="index">
          <td>{{ index + 1 }}</td>
          <td v-if="inv">{{ getDate(inv?.tanggal) }}</td>
          <td v-else></td>

          <td v-if="inv">{{ inv?.kode }}</td>
          <td v-else></td>

          <td v-if="inv" class="right-align">{{ formatNumber(inv?.jumlah) }}</td>
          <td v-else class="right-align"></td>
        </tr>
        </tbody>
        <tfoot>
        <tr class="total-row">
          <td colspan="3">Total</td>
          <td class="right-align">Rp. {{ formatNumber(totalAmount) }}</td>
        </tr>
        </tfoot>
      </table>

      <!--  FOOTER  -->
      <div class="flex mt-3">
        <div class="w-[70mm]">
        </div>
        <div>
          <p>Surabaya, {{ getDateNow() }}</p>
          <p>yang menerima </p>
          <p class="mt-14">({{ receipt?.Client?.name }})</p>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
table {
  width: 85%;
  border-collapse: collapse;
}

table, th, td {
  border: 1px solid black;
}

th, td {
  padding: 2px;
  text-align: left;
}

.total-row td {
  font-weight: bold;
}

.right-align {
  text-align: right;
}

@media print {
  #print-button {
    display: none;
  }


  #pages {
    transform: scale(1.41); /* A4/A5 = 297mm/210mm ≈ 1.41 */
    transform-origin: top left;
    margin: 0;
  }
}
</style>