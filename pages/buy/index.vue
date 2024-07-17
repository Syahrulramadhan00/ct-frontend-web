<template>
  <div class="flex">
    <div class="main-container grow h-[35rem] w-56">
      <DataTable
        v-model:filters="filters"
        :value="pembelian"
        scrollable
        scrollHeight="28rem"
        tableStyle="min-width: 50rem"
        :globalFilterFields="['no', 'nama', 'harga', 'total', 'tanggal']"
      >
        <template #header>
          <div class="flex justify-between">
            <div
              class="main-container bg-purple-400 p-0 flex items-center shadow-md"
            >
              <p class="font-semibold mx-3 text-white">Tambah</p>
            </div>
            <IconField iconPosition="left">
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText
                v-model="filters['global'].value"
                placeholder="Keyword Search"
              />
            </IconField>
          </div>
        </template>
        <!-- no : 10,
                nama : 'Longdrut 3/4"',
                jumlah : '190',
                harga : '100.000',
                total : '19.000.000',
                tanggal : '21/12/2024', -->
        <Column
          filterField="no"
          field="no"
          header="No"
          style="width: 5%"
        ></Column>
        <Column filterField="nama" field="nama" header="Nama"></Column>
        <Column
          filterField="jumlah"
          field="jumlah"
          header="Jumlah"
          style="width: 15%"
        ></Column>
        <Column filterField="harga" field="harga" header="Harga"></Column>
        <Column filterField="total" field="total" header="Total"></Column>
        <Column filterField="tanggal" field="tanggal" header="Tanggal"></Column>
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
  pembelian.value = DummyService.getHistoriPembelian();
});

const pembelian = ref();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  no: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  nama: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  harga: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  total: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  tanggal: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});
</script>