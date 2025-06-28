<template>
  <div class="flex">
    <div class="main-container grow h-[35rem] w-56">
      <Dialog
        v-model:visible="visible"
        modal
        header="tambah barang"
        :style="{ width: '25rem' }"
      >
        <div class="flex flex-col">
          <FloatLabel class="mt-8 ml-3">
            <InputText id="nama" v-model="namaBarang" class="w-80" />
            <label for="name">Nama barang</label>
          </FloatLabel>
          <div
            @click="
              addProduct(namaBarang, () => {
                visible = false;
                init();
              })
            "
            class="main-container bg-purple-400 p-0 flex items-center justify-center h-10 shadow-md mt-5 hover:cursor-pointer"
          >
            <div v-if="pending" class="pt-1">
              <ProgressSpinner
                style="width: 20px; height: 20px"
                strokeWidth="6"
              />
            </div>
            <p v-else class="font-semibold mx-3 text-white">Tambah</p>
          </div>
        </div>
      </Dialog>

      <DataTable
        v-if="!pending"
        v-model:filters="filters"
        :value="tagihan"
        scrollable
        scrollHeight="28rem"
        tableStyle="min-width: 50rem"
        :globalFilterFields="['no', 'barang', 'stok', 'status']"
      >
        <template #header>
          <div class="flex justify-between gap-12 overflow-scroll">
            <div
              @click="visible = true"
              class="main-container bg-purple-400 p-0 flex items-center shadow-md hover:cursor-pointer"
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
          </template>
        </Column>
      </DataTable>
      <div v-else class="flex flex-1 justify-center items-center h-[34rem]">
        <ProgressSpinner />
      </div>
    </div>
  </div>
</template>

<script setup>
import { FilterMatchMode } from "primevue/api";
import "primeicons/primeicons.css";
import Dialog from "primevue/dialog";
import ProgressSpinner from "primevue/progressspinner";

onMounted(() => {
  init();
});

const tagihan = ref([]);
const visible = ref(false);
const namaBarang = ref(null);
const { pending, addProduct, getAllProduct } = ProductApi();

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  no: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  barang: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  stok: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  status: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});

async function init() {
  tagihan.value = await getAllProduct();
}
</script>