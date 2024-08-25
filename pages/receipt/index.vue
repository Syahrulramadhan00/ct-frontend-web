<template>
  <div>

  <div class="flex">
    <div class="main-container grow h-[35rem] w-56">
      <DataTable
        v-model:filters="filters"
        :value="receipt"
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
              @click="openModal = true"
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
        <Column filterField="kode" field="kode" header="Tanda terima">
          <template #body="{ data }">
            <p class="font-bold">{{ data.kode }}</p>
          </template>
        </Column>
        <Column filterField="klien" field="klien" header="Klien"></Column>
        <Column filterField="tanggal" field="tanggal" header="Tanggal"></Column>
        <Column filterField="status" field="status" header="Status">
          <template #body="{ data }">
            <div
              :class="{
                'main-container bg-red-500 p-0 px-2 py-1 flex justify-center rounded-2xl':
                  data.status === 2,
                'main-container bg-green-500 p-0 px-2 py-1 flex justify-center rounded-2xl':
                  data.status === 3,
                'main-container bg-black p-0 px-2 py-1 flex justify-center rounded-2xl':
                  data.status === 1,
              }"
            >
              <p class="text-white">
                {{
                  data.status === 2
                    ? "Proses"
                    : data.status === 3
                    ? "Selesai"
                    : "Belum dikunci"
                }}
              </p>
            </div>
          </template>
        </Column>
        <Column field="status" header="">
          <template #body="{data}">
            <nuxt-link :to="'/receipt/detail/' + data.id">
              <i class="pi pi-chevron-right"></i>
            </nuxt-link>
            <!-- <p>
              {{ data.status }}
            </p> -->
          </template>
        </Column>
      </DataTable>
    </div>
  </div>

    <!-- ADD SALES SECTION -->
    <Dialog
        v-model:visible="openModal"
        modal
        header=" Buat tanda terima baru"
        :style="{ width: '25rem' }"
    >
      <div class="flex flex-col">
        <p class="mb-3">Pilih client :</p>
        <div class="w-80 ml-4">
          <Dropdown
              v-model="selectedClient"
              :options="clients"
              filter
              filterIcon="ml-4 pi pi-search"
              optionLabel="name"
              placeholder="pilihan client"
              class="flex justify-between w-full items-center px-2"
              panelClass="bg-white rounded-lg px-2 hover:cursor-pointer drop-shadow-lg"
              :virtualScrollerOptions="{ itemSize: 38 }"
          />
        </div>
        <div
            @click="postReceipt()"
            class="main-container bg-purple-400 p-0 flex items-center justify-center h-10 shadow-md mt-5 hover:cursor-pointer"
        >
          <div v-if="invoicePending" class="pt-1">
            <ProgressSpinner
                style="width: 20px; height: 20px"
                strokeWidth="6"
            />
          </div>
          <p v-else class="font-semibold mx-3 text-white">Buat</p>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { FilterMatchMode } from "primevue/api";
import "primeicons/primeicons.css";
import {InvoiceApi} from "~/composables/invoices/InvoiceApi.js";

onMounted(() => {
  init();
});


async function init(){
  receipt.value = await getReceipts();
  clients.value = await getReceiptClients();
}

async function postReceipt(){
  await addReceipt(selectedClient.value.id, async() => {
    openModal.value = false;
    clients.value = await getReceiptClients();
    receipt.value = await getReceipts();
    selectedClient.value = null;
  });
}

const {pending, getReceipts, addReceipt} = ReceiptApi();
const {pending : clientPending, getReceiptClients} = ClientApi();
const openModal = ref(false);
const clients = ref([]);
const selectedClient = ref(null);

const receipt = ref();
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