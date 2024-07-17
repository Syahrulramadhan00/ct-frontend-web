<template>
  <div class="flex flex-col">
    <div class="flex flex-1 justify-between">
      <div class="flex items-start">
        <NuxtLink to="/receipt"
          ><i class="pi pi-chevron-left text-lg ml-5 mr-4 pt-1"> </i
        ></NuxtLink>
        <div>
          <p class="font-bold text-lg">Tanda terima no 375/A/204</p>
          <p>Pt. Sinergi Indonesia</p>
        </div>
      </div>
      <div class="ml-2">
        <div
          class="main-container bg-black p-0 py-1 mb-2 justify-center rounded-2xl"
        >
          <p class="text-white flex-1 text-center">Belum dikunci</p>
        </div>
        <div
          class="main-container bg-purple-400 p-0 py-1 px-3 flex justify-evenly items-center"
        >
          <i class="pi pi-lock text-white mr-1"> </i>
          <p class="text-white">Simpan akhir</p>
        </div>
      </div>
    </div>
    <div class="main-container mt-5">
      <DataTable
        :value="invoice"
        scrollable
        scrollHeight="28rem"
        tableStyle="min-width: 20rem"
      >
        <template #header>
          <div class="flex justify-between">
            <div
              class="main-container bg-purple-400 p-0 flex items-center shadow-md"
            >
              <p class="font-semibold mx-3 text-white">Tambah</p>
            </div>
          </div>
        </template>
        <Column field="no" header="No" style="width: 5%"></Column>
        <Column field="kode" header="No invoice" style="width: 35%"></Column>
        <Column field="jumlah" header="Total"></Column>
        <Column field="" header="Menu">
          <template #body="{}">
            <div class="flex">
              <div
                class="shrink main-container bg-slate-100 p-0 px-6 py-1 mr-2"
              >
                <p class="font-semibold">Edit</p>
              </div>
              <div class="shrink main-container bg-red-400 p-0 px-6 py-1">
                <p class="font-semibold">Hapus</p>
              </div>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { FilterMatchMode } from "primevue/api";
import { DummyService } from "@/service/DummyService";
import "primeicons/primeicons.css";

onMounted(() => {
  invoice.value = DummyService.getInvoices();
});

const invoice = ref();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  no: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  barang: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  stok: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  status: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});
</script>