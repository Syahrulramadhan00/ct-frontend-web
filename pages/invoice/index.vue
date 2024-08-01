<template>
  <div class="flex">
    <div class="main-container grow h-[35rem] w-56">
      <DataTable
        v-if="!invoicePending"
        v-model:filters="filters"
        :value="invoices"
        scrollable
        scrollHeight="28rem"
        tableStyle="min-width: 50rem"
        :globalFilterFields="['no', 'kode', 'klien', 'status', 'tanggal']"
      >
        <template #header>
          <div class="flex justify-between">
            <div
              @click="addModal = true"
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
        <Column filterField="kode" field="kode" header="Kode invoice">
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
                'main-container bg-green-500 p-0 px-2 py-1 flex justify-center rounded-2xl':
                  data.kodeStatus === 8,
                'main-container bg-black p-0 px-2 py-1 flex justify-center rounded-2xl':
                  data.kodeStatus === 1,
                'main-container bg-red-500 p-0 px-2 py-1 flex justify-center rounded-2xl':
                  data.kodeStatus != 8 && data.kodeStatus != 1,
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
          </template>
        </Column>
      </DataTable>
      <div v-else class="flex flex-1 justify-center items-center h-[34rem]">
        <ProgressSpinner />
      </div>
    </div>

    <Dialog
      v-model:visible="addModal"
      modal
      header="Buat invoice baru"
      :style="{ width: '25rem' }"
    >
      <div class="flex flex-col">
        <p class="mb-4">Pilih klien :</p>
        <div class="w-80 ml-4">
          <Dropdown
            v-model="selectedClient"
            :options="clients"
            optionLabel="name"
            placeholder="pilihan klien"
            class="flex justify-between w-full items-center px-2"
            panelClass="bg-white rounded-lg px-2 hover:cursor-pointer drop-shadow-lg"
            :virtualScrollerOptions="{ itemSize: 38 }"
          />
        </div>
        <div
          @click="
            createInvoice(selectedClient.id, async () => {
              addModal = false;
              invoices = await getInvoices();
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
  </div>
</template>

<script setup>
import { FilterMatchMode } from "primevue/api";
import { DummyService } from "@/service/DummyService";

onMounted(() => {
  init();
});

async function init() {
  invoices.value = await getInvoices();
  clients.value = await getClients();
}

const invoices = ref();
const addModal = ref(false);
const selectedClient = ref();
const clients = ref([]);
const { pending, getClients } = ClientApi();
const { pending: invoicePending, createInvoice, getInvoices } = InvoiceApi();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  no: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  kode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  status: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  tanggal: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  klien: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});
</script>