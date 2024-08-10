<template>
  <div>
    <!--    CONFIRM DIALOG SECTION -->
    <ConfirmDialog></ConfirmDialog>


    <!-- TITLE SECTION -->
    <div class="flex justify-between">
      <div class="flex flex-1 items-start">
        <NuxtLink to="/delivery"
        ><i class="pi pi-chevron-left text-lg ml-5 mr-4 pt-1"> </i
        ></NuxtLink>
        <div>
          <p class="font-bold text-lg">
            Surat jalan :
            {{ delivery ? delivery.OrderCode : "" }}
          </p>
          <p>
            {{ delivery ? delivery.Invoice.Client.name : "" }}
          </p>
        </div>
      </div>
      <div v-if="isInvoiceValid">
        <div class="ml-2">
          <div
              class="main-container bg-black p-0 py-1 mb-2 justify-center rounded-2xl"
          >
            <p class="text-white flex-1 text-center">Belum dikunci</p>
          </div>
          <div
              @click=""
              class="main-container bg-purple-400 p-0 py-1 px-3 flex justify-evenly items-center hover:cursor-pointer"
          >
            <i class="pi pi-lock text-white mr-1"> </i>
            <p class="text-white">Simpan akhir</p>
          </div>
        </div>
      </div>
    </div>

    <!-- PRODUCT SECTION -->
    <div class="flex main-container mt-5">
      <DataTable
          v-if="!productPending"
          :value="products"
          scrollable
          scrollHeight="18rem"
          tableStyle="min-width: 2rem"
          class="flex-1 w-0"
      >
        <template #header>
          <div class="flex justify-between">
            <div
                v-if="isInvoiceValid"
                @click="async () => {
                  await resetForm();
                  isUpdate = false;
                  showModal = true;
                }"
                class="main-container bg-purple-400 p-0 flex items-center shadow-md hover:cursor-pointer"
            >
              <p class="font-semibold mx-3 text-white">Tambah</p>
            </div>
          </div>
        </template>
        <Column field="no" header="No" style="width: 5%"></Column>
        <Column field="Name" header="Nama barang" style="width: 35%"></Column>
        <Column field="Quantity" header="Jumlah"></Column>
        <Column field="" header="Menu" v-if="isInvoiceValid">
          <template #body="{data}">
            <div class="flex">
              <div
                  @click="()=> {
                    resetForm();
                    selectedProduct = data;
                    saleCount = data.Quantity;
                    isUpdate = true;
                    showModal = true;
                  }"
                  class="shrink main-container bg-slate-100 p-0 px-6 py-1 mr-2 hover:cursor-pointer"
              >
                <p class="font-semibold">Edit</p>
              </div>
              <div @click="confirmDelete(data)"
                   class="shrink main-container bg-red-400 p-0 px-6 py-1 hover:cursor-pointer">
                <p class="font-semibold">Hapus</p>
              </div>
            </div>
          </template>
        </Column>
      </DataTable>
      <ProgressSpinner v-else/>
    </div>

    <!-- MODAL SECTION -->
    <Dialog
        v-model:visible="showModal"
        modal
        :header=" isUpdate ? 'Ubah barang' : 'Tambah barang ke surat jalan' "
        :style="{ width: '25rem' }"
    >
      <div class="flex flex-col">
        <p v-if="!isUpdate" class="mb-3">Pilih barang :</p>
        <div v-if="!isUpdate" class="w-80 ml-4">
          <Dropdown
              v-model="selectedSale"
              :options="availableSales"
              filter
              filterIcon="ml-4 pi pi-search"
              optionLabel="Name"
              placeholder="pilihan barang"
              class="flex justify-between w-full items-center px-2"
              panelClass="bg-white rounded-lg px-2 hover:cursor-pointer drop-shadow-lg"
              :virtualScrollerOptions="{ itemSize: 38 }"
          >
            <template #value="slotProps">
              <div v-if="slotProps.value" class="flex align-items-center">
                <div class="mr-2">{{ slotProps.value.Name }}</div>
                <div>(sisa : {{ slotProps.value.Count }})</div>
              </div>
              <span v-else>Pilihan barang</span>
            </template>
            <template #option="slotProps">
              <div class="flex align-items-center">
                <div class="mr-2">{{ slotProps.option.Name }}</div>
                <div>(sisa : {{ slotProps.option.Count }})</div>
              </div>
            </template>
          </Dropdown>
        </div>
        <FloatLabel class="mt-8">
          <InputText id="count" v-model="saleCount" class="w-[22rem]"/>
          <label for="count">Jumlah barang</label>
        </FloatLabel>
        <div
            @click="changeProduct()"
            class="main-container bg-purple-400 p-0 flex items-center justify-center h-10 shadow-md mt-5 hover:cursor-pointer"
        >
          <div v-if="productPending" class="pt-1">
            <ProgressSpinner
                style="width: 20px; height: 20px"
                strokeWidth="6"
            />
          </div>
          <p v-else class="font-semibold mx-3 text-white">{{ isUpdate ? "Ubah" : "Tambah" }}</p>
        </div>
      </div>
    </Dialog>

  </div>
</template>

<script setup>
import {onMounted} from "vue";

const route = useRoute();
const delivery = ref(null);
const isInvoiceValid = ref(true);
const products = ref([]);
const availableSales = ref([]);
const showModal = ref(false);
const isUpdate = ref(false);
const selectedSale = ref(null);
const saleCount = ref(null);
const selectedProduct = ref(null);

onMounted(() => {
  init();
});

async function init() {
  delivery.value = await getDelivery(route.params.id);

  await resetProducts();
}

async function resetProducts() {
  resetForm();
  products.value = await getDeliveryProducts(route.params.id);
  availableSales.value = await getAvailableSales(delivery.value.InvoiceId);
}

function resetForm(){
  saleCount.value = null;
  selectedSale.value = null;
  selectedProduct.value = null;
  showModal.value = false;
}

function changeProduct(){
    if (isUpdate.value){
      updateDeliveryProduct(
          {
            id: +selectedProduct.value.id,
            current_quantity : +selectedProduct.value.Quantity,
            quantity : +saleCount.value,
            sale_id: selectedProduct.value.SaleId
          }, async () => {
            await resetProducts();
          }
      )
    } else {
      createDeliveryProduct(
          {
            id: route.params.id,
            salesId : selectedSale.value.id,
            quantity : saleCount.value
          }, async () => {
            await resetProducts();
          }
      )
    }

}

const {
  pending,
  getDelivery,
} = DeliveryApi();

const {
  pending: productPending,
  getDeliveryProducts,
  createDeliveryProduct,
  getAvailableSales,
  deleteDeliveryProduct,
    updateDeliveryProduct
} = DeliveryProductApi();

const confirm = useConfirm();
const confirmDelete = (data) => {
  confirm.require({
    message: 'Apakah ingin menghapus produk ini dari surat jalan?',
    header: 'Hapus barang',
    icon: 'pi pi-info-circle mr-2',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    rejectClass: 'bg-white border-none hover:border-solid hover:border-green-500 hover:bg-white',
    acceptClass: 'bg-red-400 border-none focus:ring-0 hover:border-solid hover:border-green-500 hover:bg-red-400 hover:border-[3px]',
    accept: () => {
      deleteDeliveryProduct({
        id: data.id,
        quantity: data.Quantity,
        saleId: data.SaleId
      }, async () => {
        await resetProducts();
      });
    },
    reject: () => {
    }
  });
};

</script>

<style scoped>

</style>