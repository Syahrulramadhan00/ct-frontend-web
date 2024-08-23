<template>
  <div>
    <div class="flex">
      <div class="main-container grow h-[35rem] w-56">
        <div v-if="pending" class="flex w-full h-full items-center justify-center">

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
              <div class="flex">
                <div
                    @click="toggle"
                    class="main-container bg-zinc-400 p-0 flex items-center mr-2 shadow-md hover:cursor-pointer"
                >
                  <div class="flex justify-between items-center">
                    <i class="pi pi-filter-slash text-white ml-2"/>
                    <p class="font-semibold mx-3 text-white">Filter</p>
                  </div>
                </div>
                <IconField iconPosition="left">
                  <InputIcon>
                    <i class="pi pi-search"/>
                  </InputIcon>
                  <InputText
                      v-model="filters['global'].value"
                      placeholder="Keyword Search"
                  />
                </IconField>
              </div>
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
            <template #body="{ data }">
              <NuxtLink :to="'/delivery/detail/' + data.id">
                <i class="pi pi-chevron-right"></i>
              </NuxtLink>
            </template>
          </Column>
        </DataTable>
        <Pagination v-if="!pending" limit="10" :current-page="pageInfo?.page" :total-pages="pageInfo?.total_pages"
                    @update:currentPage="handlePageChange"/>
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

    <!--  FILTER SECTION  -->
    <OverlayPanel ref="op">
      <div class="flex flex-column gap-3 w-25rem h-25rem">
        <div>
          <FloatLabel class="mt-8">
            <InputText
                id="invoiceCode"
                v-model="invoiceCode"
                class="md:w-64 lg:w-96"
            />
            <label for="invoiceCode">kode invoice</label>
          </FloatLabel>
          <div
              @click="deleteFilter()"
              class="main-container bg-white border-2 border-black p-0 flex items-center justify-center h-10 shadow-md mt-8 hover:cursor-pointer">
            <p class="font-semibold mx-3">hapus filter</p>
          </div>
          <div
              @click="applyFilter()"
              class="main-container bg-purple-400 p-0 flex items-center justify-center h-10 shadow-md mt-2 hover:cursor-pointer">
            <p class="font-semibold mx-3 text-white">terapkan</p>
          </div>
        </div>
      </div>
    </OverlayPanel>
  </div>
</template>

<script setup>
import {ref, onMounted} from "vue";
import {FilterMatchMode} from "primevue/api";
import "primeicons/primeicons.css";
import Pagination from "~/components/Pagination.vue";

onMounted(() => {
  init();
});

async function init() {
  invoices.value = await getInvoices();
  invoiceCode.value = route.query.invoice_code;
  deliveries.value = await getDeliveries(1, invoiceCode.value);
}

const route = useRoute();

const deliveries = ref();
const filters = ref({
  global: {value: null, matchMode: FilterMatchMode.CONTAINS},
  no: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
  kode: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
  jumlah: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
  status: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
  tanggal: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
  klien: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
});
const openModal = ref(false);

const {pending, getInvoices, getDeliveries, createDelivery, pageInfo} = DeliveryApi();
const selectedInvoice = ref();
const invoices = ref([]);

async function addDelivery() {
  const isSuccess = await createDelivery(selectedInvoice.value.ID);
  openModal.value = false;
  if (isSuccess) {
    invoiceCode.value = "";
    deliveries.value = await getDeliveries(1);
  }
}

const handlePageChange = async (page) => {
  if (page === pageInfo?.value?.page) return;
  deliveries.value = await getDeliveries(page, invoiceCode.value);
};


const op = ref();
const toggle = (event) => {
  op.value.toggle(event);
}
const invoiceCode = ref();
async function applyFilter() {
  op.value.hide();
  deliveries.value = await getDeliveries(1, invoiceCode.value);
}

async function deleteFilter(){
  op.value.hide();
  invoiceCode.value = "";
  deliveries.value = await getDeliveries(1);
}
</script>