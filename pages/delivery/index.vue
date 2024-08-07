<template>
  <div>
    <div class="flex">
      <div class="main-container grow h-[35rem] w-56">
        <div v-if="penddeing" class="flex w-full h-full items-center justify-center">

          <ProgressSpinner/>
        </div>

        <DataTable
        v-else
          v-model:filters="filters"
          :value="deliveries"
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
          <Column filterField="kode" field="kode" header="No surat jalan">
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
                    data.kodeStatus === 2,
                  'main-container bg-green-500 p-0 px-2 py-1 flex justify-center rounded-2xl':
                    data.kodeStatus === 3,
                  'main-container bg-black p-0 px-2 py-1 flex justify-center rounded-2xl':
                    data.kodeStatus === 1,
                }"
              >
                <p class="text-white">
                  {{
                    data.kodeStatus === 2
                      ? "Proses"
                      : data.kodeStatus === 3
                      ? "Selesai"
                      : "Belum dikunci"
                  }}
                </p>
              </div>
            </template>
          </Column>
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

    <!-- ADD SALES SECTION -->
    <Dialog
      v-model:visible="openModal"
      modal
      header=" Buat surat jalan baru"
      :style="{ width: '25rem' }"
    >
      <div class="flex flex-col">
        <p class="mb-3">Pilih invoice :</p>
        <div class="w-80 ml-4">
          <Dropdown
            v-model="selectedInvoice"
            :options="invoices"
            filter
            filterIcon="ml-4 pi pi-search"
            optionLabel="InvoiceCode"
            placeholder="pilihan invoice"
            class="flex justify-between w-full items-center px-2"
            panelClass="bg-white rounded-lg px-2 hover:cursor-pointer drop-shadow-lg"
            :virtualScrollerOptions="{ itemSize: 38 }"
          >
          <template #option="slotProps">
        <div class="flex align-items-center">
          <div class="mr-2">({{ slotProps.option.ClientName }})</div>
            <div>{{ slotProps.option.InvoiceCode }}</div>
        </div>
    </template>
          </Dropdown>
        </div>
        <div
          @click="addDelivery()"
          class="main-container bg-purple-400 p-0 flex items-center justify-center h-10 shadow-md mt-5 hover:cursor-pointer"
        >
          <div v-if="salePending" class="pt-1">
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
import { DummyService } from "@/service/DummyService";
import "primeicons/primeicons.css";

onMounted(() => {
  init();
});

async function init() {
  invoices.value = await getInvoices();
  deliveries.value = await getDeliveries();
}

const deliveries = ref();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  no: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  kode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  jumlah: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  status: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  tanggal: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  klien: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});
const openModal = ref(false);

const { pending, getInvoices, getDeliveries, createDelivery } = DeliveryApi();
const selectedInvoice = ref();
const invoices = ref([]);
async function addDelivery() {
  const isSuccess = await createDelivery(selectedInvoice.value.ID);
  openModal.value = false;
  if (isSuccess){
    deliveries.value = await getDeliveries();
  }
}
</script>