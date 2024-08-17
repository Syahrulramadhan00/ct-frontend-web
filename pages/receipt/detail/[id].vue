<template>
  <div>
  <div class="flex flex-col">
    <div class="flex flex-1 justify-between">
      <div class="flex items-start">
        <NuxtLink to="/receipt"
        ><i class="pi pi-chevron-left text-lg ml-5 mr-4 pt-1"> </i
        ></NuxtLink>
        <div>
          <p class="font-bold text-lg">Tanda terima no {{ receipt?.Number }}</p>
          <p>{{receipt?.Client.name}}</p>
        </div>
      </div>
      <div v-if="receipt?.Status === 1" class="ml-2">
        <div
            class="main-container bg-black p-0 py-1 mb-2 justify-center rounded-2xl"
        >
          <p class="text-white flex-1 text-center">Belum dikunci</p>
        </div>
        <div
            @click="lockClick"
            class="main-container bg-purple-400 p-0 py-1 px-3 flex justify-evenly items-center hover:cursor-pointer"
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
                v-if="receipt?.Status === 1"
                @click="openModal = true"
                class="main-container bg-purple-400 p-0 flex items-center shadow-md hover:cursor-pointer"
            >
              <p class="font-semibold mx-3 text-white">Tambah</p>
            </div>
          </div>
        </template>
        <Column field="no" header="No" style="width: 5%"></Column>
        <Column field="kode" header="No invoice" style="width: 35%"></Column>
        <Column field="jumlah" header="Total"></Column>
        <Column field="" header="Menu">
          <template #body="{ data }">
            <div class="flex">
              <div
                  @click="confirmDelete(data.id)"
                  class="shrink main-container bg-red-400 p-0 px-6 py-1 hover:cursor-pointer">
                <p class="font-semibold">Hapus</p>
              </div>
            </div>
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
        <p class="mb-3">Pilih invoice :</p>
        <div class="w-80 ml-4">
          <Dropdown
              v-model="selectedInvoice"
              :options="invoicesMenu"
              filter
              filterIcon="ml-4 pi pi-search"
              optionLabel="InvoiceCode"
              placeholder="pilihan client"
              class="flex justify-between w-full items-center px-2"
              panelClass="bg-white rounded-lg px-2 hover:cursor-pointer drop-shadow-lg"
              :virtualScrollerOptions="{ itemSize: 38 }"
          >
                      <template #value="slotProps">
                        <div v-if="slotProps.value" class="flex align-items-center">
                          <div class="mr-2">{{ slotProps.value.InvoiceCode }}</div>
                          <div>( {{ slotProps.value.Client.name }} )</div>
                        </div>
                        <span v-else>Pilihan invoice</span>
                      </template>

                      <template #option="slotProps">
                        <div class="flex align-items-center">
                          <div class="mr-2">{{ slotProps.option.InvoiceCode }}</div>
                          <div>( {{ slotProps.option.Client.name }} )</div>
                        </div>
                      </template>
                    </Dropdown>
        </div>
        <div
            @click="postInvoice()"
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

    <!--    CONFIRM DIALOG SECTION -->
    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { FilterMatchMode } from "primevue/api";
import "primeicons/primeicons.css";


onMounted(async () => {
  receipt.value = await getReceipt(route.params.id);
  invoicesMenu.value = await getReceiptInvoices(receipt.value?.Client.id);
  invoice.value = await getInvoices(route.params.id);
});

async function postInvoice(){
  await addInvoice({invoiceId : selectedInvoice.value.ID, receiptId : route.params.id}, async() => {
    openModal.value = false;
    invoice.value = await getInvoices(route.params.id);
    invoicesMenu.value = await getReceiptInvoices(receipt.value?.Client.id);
    selectedInvoice.value = null;
  });
}

async function eraseInvoice(id){
  await deleteInvoice(id, async() => {
    openModal.value = false;
    invoice.value = await getInvoices(route.params.id);
    invoicesMenu.value = await getReceiptInvoices(receipt.value?.Client.id);
    selectedInvoice.value = null;
  });
}

async function lockClick(){
  await lockReceipt(route.params.id, async() => {
    receipt.value = await getReceipt(route.params.id);
  });
}

const route = useRoute();
const {pending, getReceipt, getInvoices, addInvoice, deleteInvoice, lockReceipt } = ReceiptApi();
const receipt = ref();
const invoice = ref();
const invoicesMenu = ref([]);
const selectedInvoice = ref(null);
const openModal = ref(false);
const {pending : invoicePending, getReceiptInvoices } = InvoiceApi();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  no: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  barang: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  stok: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  status: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});

const confirm = useConfirm();
const confirmDelete = (id) => {
  if (receipt?.value.Status === 1){
  confirm.require({
    message: 'Apakah ingin menghapus invoice ini dari tanda terima?',
    header: 'Hapus invoice',
    icon: 'pi pi-info-circle mr-2',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    rejectClass: 'bg-white border-none hover:border-solid hover:border-green-500 hover:bg-white',
    acceptClass: 'bg-red-400 border-none focus:ring-0 hover:border-solid hover:border-green-500 hover:bg-red-400 hover:border-[3px]',
    accept: () => {

      eraseInvoice(id);
    },
    reject: () => {
    }
  });
  }
};
</script>