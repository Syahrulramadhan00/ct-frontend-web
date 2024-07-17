<template>
  <div class="flex">
    <div class="main-container grow h-[35rem] w-56">
      <DataTable
        v-model:filters="filters"
        :value="tagihan"
        scrollable
        scrollHeight="28rem"
        tableStyle="min-width: 50rem"
        :globalFilterFields="[
          'no',
          'kode',
          'klien',
          'status',
          'jumlah',
          'tanggal',
        ]"
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
        <Column
          filterField="no"
          field="no"
          header="No"
          style="width: 5%"
        ></Column>
        <Column filterField="kode" field="kode" header="Kode invoice">
          <template #body="{ data }">
            <p class="font-bold">{{ data.kode }}</p>
          </template>
        </Column>
        <Column filterField="klien" field="klien" header="Klien"></Column>
        <Column filterField="jumlah" field="jumlah" header="Jumlah"></Column>
        <Column filterField="tanggal" field="tanggal" header="Tanggal"></Column>
        <Column filterField="status" field="status" header="Status">
          <template #body="{ data }">
            <div
              :class="{
                'main-container bg-red-500 p-0 px-2 py-1 flex justify-center rounded-2xl':
                  data.kodeStatus === 1,
                'main-container bg-green-500 p-0 px-2 py-1 flex justify-center rounded-2xl':
                  data.kodeStatus === 2,
                'main-container bg-black p-0 px-2 py-1 flex justify-center rounded-2xl':
                  data.kodeStatus === 0,
              }"
            >
              <p class="text-white">
                {{ data.status }}
              </p>
            </div>
          </template>
        </Column>
        <Column field="status" header="">
          <template #body="{}">
            <NuxtLink to="/invoice/detail"
              ><i class="pi pi-chevron-right"></i
            ></NuxtLink>
            <!-- <p>
              {{ data.status }}
            </p> -->
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
  tagihan.value = DummyService.getInvoices();
});

const tagihan = ref();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  no: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  kode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  jumlah: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  status: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  tanggal: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  klien: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});
</script>