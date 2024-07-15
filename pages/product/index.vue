<template>
  <div class="flex">
    <div class="main-container grow h-[35rem] w-56">
      <DataTable
        v-model:filters="filters"
        :value="tagihan"
        scrollable
        scrollHeight="28rem"
        tableStyle="min-width: 50rem"
        :globalFilterFields="['no', 'barang', 'stok', 'status']"
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
        <Column filterField="barang" field="barang" header="Barang"></Column>
        <Column
          filterField="stok"
          field="stok"
          header="Stok"
          style="width: 15%"
        ></Column>
        <Column filterField="status" field="status" header="Status"></Column>
        <Column field="status" header="">
          <template #body="{}">
            <i class="pi pi-chevron-right"></i>
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
  tagihan.value = DummyService.getStokBarang();
});

const tagihan = ref();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  no: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  barang: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  stok: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  status: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});
</script>