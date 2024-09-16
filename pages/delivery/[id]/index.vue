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
      <div v-if="isDeliveryValid">
        <div class="ml-2">
          <div
              class="main-container bg-black p-0 py-1 mb-2 justify-center rounded-2xl"
          >
            <p class="text-white flex-1 text-center">Belum dikunci</p>
          </div>
          <div
              @click="lockDelivery({
              delivery_id : delivery.ID,
              invoice_id : delivery.InvoiceId
              }, async () => {
                await init();
              })"
              class="main-container bg-purple-400 p-0 py-1 px-3 flex justify-evenly items-center hover:cursor-pointer"
          >
            <i class="pi pi-lock text-white mr-1"> </i>
            <p class="text-white">Simpan akhir</p>
          </div>
        </div>
      </div>

      <div v-else>
        <div class="ml-2">
          <div
              @click="toPrintout()"
              class="main-container mt-2 bg-transparent border-black border-2 p-0 py-1 px-3 flex justify-evenly items-center hover:cursor-pointer"
          >
            <i class="pi pi-print text-black mr-1"> </i>
            <p class="text-black">print surat jalan</p>
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
                v-if="isDeliveryValid"
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
        <Column field="" header="Menu" v-if="isDeliveryValid">
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

    <!-- MAIN INFORMATION SECTION  -->
    <div class="flex mt-5 gap-5 flex-wrap-reverse">
      <div class="flex-1">
        <!-- COURIER SECTION -->
        <div class="main-container">
          <p class="mb-3 font-semibold text-lg">Kurir pengiriman</p>
          <Dropdown
              v-model="selectedCourier"
              :options="couriers"
              filter
              :disabled="!isDeliveryValid"
              filterIcon="ml-4 pi pi-search"
              optionLabel="username"
              placeholder="pilihan kurir"
              class="flex justify-between w-full items-center px-2"
              panelClass="bg-white rounded-lg px-2 hover:cursor-pointer drop-shadow-lg"
              :virtualScrollerOptions="{ itemSize: 38 }"
          />
          <div
              @click="updateSender({
                id: delivery.ID,
                sender: selectedCourier.id
              }, async () => {
                await initCouriers();
              })"
              v-if="isDeliveryValid"
              class="main-container bg-purple-400 p-0 py-1 px-3 flex justify-center items-center my-5 hover:cursor-pointer"
          >
            <div v-if="pending" class="pt-1">
              <ProgressSpinner
                  style="width: 20px; height: 20px"
                  strokeWidth="6"
              />
            </div>
            <p v-else class="text-white">Simpan</p>
          </div>
        </div>

        <!-- DOCUMENT SECTION -->
        <div class="main-container mt-5">
          <p class="mb-3 font-semibold text-lg">Dokumen pengiriman</p>
          <div class="border-dashed border-2 rounded px-3 py-5 h-32 flex items-center justify-center">
            <p class="text-gray-500">Dokumen pengiriman belum diunggah</p>
          </div>
        </div>
      </div>

      <div class="main-container flex-1 min-w-96">
        <!-- DESTINATION SECTION -->

        <FloatLabel class="mt-4">
          <InputText
              id="destination"
              v-model="destination"
              class="w-96 md:w-80"
              :disabled="!isDeliveryValid"
          />
          <label for="discount">Tujuan lokasi pengiriman</label>
        </FloatLabel>


        <!-- NOTE SECTION -->
        <FloatLabel class="mt-8">
              <Textarea
                  v-model="catatan"
                  rows="5"
                  cols="30"
                  class="md:w-64 lg:w-96 sm:w-56"
              />
          <label for="catatan">catatan</label>
        </FloatLabel>

        <div
            @click="showNote = true"
            class="main-container bg-transparent border-2 shadow-none border-black p-0 py-1 px-3 flex justify-center items-center mt-10 hover:cursor-pointer"
        >
          <p>lihat note sebelumnya</p>
        </div>

        <div
            @click="updateDeliveryInformation({
              delivery_id: delivery.ID,
              place: destination,
              note: catatan
            }, async () => {
              delivery = await getDelivery(route.params.id);
              await initMainInformation();
            })"
            class="main-container bg-purple-400 p-0 py-1 px-3 flex justify-center items-center mt-4 hover:cursor-pointer"
        >
          <div v-if="pending" class="pt-1">
            <ProgressSpinner
                style="width: 20px; height: 20px"
                strokeWidth="6"
            />
          </div>
          <p class="text-white">Simpan</p>
        </div>
      </div>
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
                <div>(belum terkirim : {{ slotProps.value.Count }})</div>
              </div>
              <span v-else>Pilihan barang</span>
            </template>
            <template #option="slotProps">
              <div class="flex align-items-center">
                <div class="mr-2">{{ slotProps.option.Name }}</div>
                <div>(belum terkirim : {{ slotProps.option.Count }})</div>
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

    <!-- PREVIOUS NOTES SECTION -->
    <Dialog
        v-model:visible="showNote"
        modal
        header="Catatan sebelumnya"
        :style="{ width: '25rem' }"
    >
      <div class="flex flex-col mt-4 items-center justify-center">
        <p>{{ previousNote ? previousNote : "tidak ada catatan" }}</p>
      </div>
    </Dialog>

  </div>
</template>

<script setup>
import {onMounted} from "vue";
import {UserApi} from "~/composables/UserApi.js";

const route = useRoute();
const router = useRouter();
const delivery = ref(null);
const isDeliveryValid = ref(true);
const products = ref([]);
const availableSales = ref([]);
const showModal = ref(false);
const isUpdate = ref(false);
const selectedSale = ref(null);
const saleCount = ref(null);
const selectedProduct = ref(null);
const couriers = ref(null);
const selectedCourier = ref(null);
const destination = ref(null);
const catatan = ref(null);
const showNote = ref(false);
const previousNote = ref(null);

onMounted(() => {
  init();
});

async function init() {
  delivery.value = await getDelivery(route.params.id);
  previousNote.value = await getPreviousNote(route.params.id);
  isDeliveryValid.value = delivery.value.Status === 1;

  await resetProducts();
  await initCouriers();
  await initMainInformation();
}

async function resetProducts() {
  resetForm();
  products.value = await getDeliveryProducts(route.params.id);
  availableSales.value = await getAvailableSales(delivery.value.InvoiceId);
}

async function initMainInformation() {
  destination.value = delivery.value.Place;
  catatan.value = delivery.value.Note;
}

async function initCouriers() {
  couriers.value = await getAllVerified();
  selectedCourier.value = couriers.value.find(courier => courier.id === delivery.value.SenderId);
}

function resetForm() {
  saleCount.value = null;
  selectedSale.value = null;
  selectedProduct.value = null;
  showModal.value = false;
}

function changeProduct() {
  if (isUpdate.value) {
    updateDeliveryProduct(
        {
          id: +selectedProduct.value.id,
          current_quantity: +selectedProduct.value.Quantity,
          quantity: +saleCount.value,
          sale_id: selectedProduct.value.SaleId
        }, async () => {
          await resetProducts();
        }
    )
  } else {
    createDeliveryProduct(
        {
          id: route.params.id,
          salesId: selectedSale.value.id,
          quantity: saleCount.value
        }, async () => {
          await resetProducts();
        }
    )
  }

}

const {
  pending,
  getDelivery,
  updateSender,
  updateDeliveryInformation,
  getPreviousNote,
  lockDelivery
} = DeliveryApi();

const {
  pending: productPending,
  getDeliveryProducts,
  createDeliveryProduct,
  getAvailableSales,
  deleteDeliveryProduct,
  updateDeliveryProduct
} = DeliveryProductApi();

const {
  pending: userPending,
  getAllVerified
} = UserApi();

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

async function toPrintout() {
  await router.push(`/delivery/${route.params.id}/printout`);
}
</script>

<style scoped>

</style>