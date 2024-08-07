<template>
  <div v-if="!pending" class="">
    <ConfirmDialog></ConfirmDialog>

    <!-- TITLE SECTION -->
    <div class="flex justify-between">
      <div class="flex flex-1 items-start">
        <NuxtLink to="/invoice"
          ><i class="pi pi-chevron-left text-lg ml-5 mr-4 pt-1"> </i
        ></NuxtLink>
        <div>
          <p class="font-bold text-lg">
            Invoice : {{ invoice ? invoice.InvoiceCode : "" }}
          </p>
          <p>{{ invoice ? invoice.Client.name : "" }}</p>
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
            @click="
              lockInvoice(invoice.ID, async () => {
                invoice = await getInvoice(route.params.id);
              })
            "
            class="main-container bg-purple-400 p-0 py-1 px-3 flex justify-evenly items-center hover:cursor-pointer"
          >
            <i class="pi pi-lock text-white mr-1"> </i>
            <p class="text-white">Simpan akhir</p>
          </div>
        </div>
      </div>
    </div>

    <!-- STEPPER SECTION -->
    <div class="flex main-container mt-8">
      <InvoiceStepper
        :activeIndex="invoice ? invoice.InvoiceStatusId - 2 : -1"
        class="flex-1"
      />
    </div>

    <!-- PRODUCT SECTION -->
    <div class="flex main-container mt-5">
      <DataTable
        v-if="!salePending"
        :value="sales"
        scrollable
        scrollHeight="18rem"
        tableStyle="min-width: 2rem"
        class="flex-1 w-0"
      >
        <template #header>
          <div class="flex justify-between">
            <div
              v-if="isInvoiceValid"
              @click="setupAddSale()"
              class="main-container bg-purple-400 p-0 flex items-center shadow-md hover:cursor-pointer"
            >
              <p class="font-semibold mx-3 text-white">Tambah</p>
            </div>
          </div>
        </template>
        <Column field="no" header="No" style="width: 5%"></Column>
        <Column field="nama" header="Nama barang" style="width: 35%"></Column>
        <Column field="jumlah" header="Jumlah"></Column>
        <Column field="harga" header="Harga"></Column>
        <Column field="total" header="Total"></Column>
        <Column field="" header="Menu" v-if="isInvoiceValid">
          <template #body="{data}">
            <div class="flex">
              <div
              @click="setupEditSale(data)"
                class="shrink main-container bg-slate-100 p-0 px-6 py-1 mr-2 hover:cursor-pointer"
              >
                <p class="font-semibold">Edit</p>
              </div>
              <div @click="confirmDelete(data.id)" class="shrink main-container bg-red-400 p-0 px-6 py-1 hover:cursor-pointer">
                <p class="font-semibold">Hapus</p>
              </div>
            </div>
          </template>
        </Column>
      </DataTable>
      <ProgressSpinner v-else />
    </div>

    <div class="flex mt-5 gap-5 flex-wrap-reverse">
      <div class="flex-1">
        <!-- FILE SECTION -->
        <div class="main-container">
          <p class="mb-3 font-semibold text-lg">Dokumen surat PO</p>
          <FileUpload
            name="demo[]"
            url="/api/upload"
            @upload="onAdvancedUpload($event)"
            :multiple="true"
            accept="image/*"
            :maxFileSize="1000000"
          >
            <template #empty>
              <p>Drag and drop files to here to upload.</p>
            </template>
          </FileUpload>
        </div>
        <div class="main-container mt-5">
          <p class="mb-3 font-semibold text-lg">Dokumen surat Faktur</p>
          <FileUpload
            name="demo[]"
            url="/api/upload"
            @upload="onAdvancedUpload($event)"
            :multiple="true"
            accept="image/*"
            :maxFileSize="1000000"
          >
            <template #empty>
              <p>Drag and drop files to here to upload.</p>
            </template>
          </FileUpload>
        </div>
      </div>

      <!-- FAKTUR SECTION -->
      <div class="main-container flex-1 min-w-96">
        <p class="mb-2">Apakah invoice memiliki faktur?</p>
        <div class="flex flex-wrap gap-3">
          <div class="flex align-items-center">
            <RadioButton
              v-model="faktur"
              inputId="ya"
              name="faktur"
              value="ya"
              :disabled="!isInvoiceValid"
            />
            <label for="faktur1" class="ml-2">Ya</label>
          </div>
          <div class="flex align-items-center">
            <RadioButton
              v-model="faktur"
              inputId="tidak"
              name="faktur"
              value="tidak"
              :disabled="!isInvoiceValid"
            />
            <label for="faktur2" class="ml-2">Tidak</label>
          </div>
        </div>
        <!-- DISCOUNT SECTION -->
        <div class="flex items-end">
          <FloatLabel class="mt-8">
            <InputText
              id="discount"
              v-model="discount"
              class="w-96 md:w-80"
              :disabled="!isInvoiceValid"
            />
            <label for="discount">Presentasi diskon</label>
          </FloatLabel>
          <p class="ml-4 text-2xl text-gray-500">%</p>
        </div>

        <!-- JANGKA PEMBAYARAN SECTION -->
        <div class="flex items-end">
          <FloatLabel class="mt-8">
            <InputText
              id="jangkaPembayaran"
              v-model="jangkaPembayaran"
              class="w-96 md:w-80"
              :disabled="!isInvoiceValid"
            />
            <label for="jangkaPembayaran">Jangka pembayaran</label>
          </FloatLabel>
          <p class="ml-4 text-lg text-gray-500">hari</p>
        </div>

        <div
          v-if="isInvoiceValid"
          @click="
            updateFaktur(
              {
                invoice_id: invoice.ID,
                discount: discount,
                payment_term: jangkaPembayaran,
                is_taxable: faktur === 'ya' ? true : false,
              },
              async () => {
                invoice = await getInvoice(route.params.id);
                initFaktur();
              }
            )
          "
          class="main-container bg-purple-400 p-0 py-1 px-3 flex justify-center items-center mt-10 hover:cursor-pointer"
        >
          <p class="text-white">Simpan</p>
        </div>
      </div>
    </div>

    <!-- MAIN INFORMATION SECTION -->
    <div class="main-container mt-5">
      <div class="flex flex-wrap">
        <div class="flex-1">
          <FloatLabel class="mt-4">
            <InputText
              id="poCode"
              v-model="poCode"
              class="lg:w-96 md:w-64"
              :disabled="!isInvoiceValid"
            />
            <label for="poCode">kode pre-order</label>
          </FloatLabel>
          <FloatLabel class="mt-8">
            <InputText
              id="namaPenjual"
              v-model="namaPenjual"
              class="md:w-64 lg:w-96"
              :disabled="!isInvoiceValid"
            />
            <label for="namaPenjual">Nama penjual</label>
          </FloatLabel>
          <div class="mt-8">
            <FloatLabel>
              <Textarea
                v-model="catatan"
                rows="5"
                cols="30"
                class="md:w-64 lg:w-96 sm:w-56"
              />
              <label>Catatan</label>
            </FloatLabel>
          </div>
        </div>
        <div class="flex-1">
          <FloatLabel class="mt-4">
            <InputText
              id="metodePembayaran"
              v-model="metodePembayaran"
              class="md:w-64 lg:w-96"
              :disabled="!isInvoiceValid"
            />
            <label for="metodePembayaran">Metode pembayaran</label>
          </FloatLabel>
          <FloatLabel class="mt-8">
            <InputText
              id="platformPembayran"
              v-model="platformPembayran"
              class="md:w-64 lg:w-96"
              :disabled="!isInvoiceValid"
            />
            <label for="platformPembayran">Platform pembayaran</label>
          </FloatLabel>
          <FloatLabel class="mt-8">
            <InputText
              id="nomorRekening"
              v-model="nomorRekening"
              class="md:w-64 lg:w-96"
              :disabled="!isInvoiceValid"
            />
            <label for="nomorRekening">Nomor rekening</label>
          </FloatLabel>
          <FloatLabel class="mt-8">
            <InputText
              id="deskripsiPlatform"
              v-model="deskripsiPlatform"
              class="md:w-64 lg:w-96"
              :disabled="!isInvoiceValid"
            />
            <label for="deskripsiPlatform">Deskripsi platform</label>
          </FloatLabel>
        </div>
      </div>
      <div class="flex w-full justify-center">
        <div
          @click="
            updateMainInformation(
              {
                invoice_id: invoice.ID,
                po_code: poCode,
                payment_method: metodePembayaran,
                platform: platformPembayran,
                platform_number: nomorRekening,
                platform_description: deskripsiPlatform,
                seller: namaPenjual,
                note: catatan,
              },
              async () => {
                invoice = await getInvoice(route.params.id);
                initMainInformation();
              }
            )
          "
          class="main-container bg-purple-400 p-0 py-1 px-3 mx-24 flex flex-1 justify-center items-center mt-8 hover:cursor-pointer"
        >
          <p class="text-white">Simpan</p>
        </div>
      </div>
    </div>

    <!-- ADD SALES SECTION -->
    <Dialog
      v-model:visible="addSale"
      modal
      :header=" isUpdate ? 'Ubah barang' : 'Tambah barang ke invoice' "
      :style="{ width: '25rem' }"
    >
      <div class="flex flex-col">
        <p v-if="!isUpdate" class="mb-3">Pilih barang :</p>
        <div v-if="!isUpdate" class="w-80 ml-4">
          <Dropdown
            v-model="selectedProduct"
            :options="products"
            filter
            filterIcon="ml-4 pi pi-search"
            optionLabel="barang"
            placeholder="pilihan barang"
            class="flex justify-between w-full items-center px-2"
            panelClass="bg-white rounded-lg px-2 hover:cursor-pointer drop-shadow-lg"
            :virtualScrollerOptions="{ itemSize: 38 }"
          />
        </div>
        <FloatLabel class="mt-8">
          <InputText id="count" v-model="productCount" class="w-[22rem]" />
          <label for="count">Jumlah barang</label>
        </FloatLabel>
        <FloatLabel class="mt-8">
          <InputText id="price" v-model="productPrice" class="w-[22rem]" />
          <label for="price">Harga satuan</label>
        </FloatLabel>
        <div
          @click="
          if(!isUpdate){
            addSales(
              {
                invoiceId: invoice.ID,
                productId: selectedProduct.id,
                count: productCount,
                price: productPrice,
              },
              async () => {
                setupAddSale();
                addSale = false;
                sales = await getAllSales(invoice.ID);
              }
            );
          } else {
            updateSales(
              {
                id: selectedSale,
                productId: selectedProduct.id,
                count: productCount,
                price: productPrice,
                currentCount: currentCount,
              },
              async () => {
                setupAddSale();
                addSale = false;
                sales = await getAllSales(invoice.ID);
              }
            );
          }
          "
          class="main-container bg-purple-400 p-0 flex items-center justify-center h-10 shadow-md mt-5 hover:cursor-pointer"
        >
          <div v-if="salePending" class="pt-1">
            <ProgressSpinner
              style="width: 20px; height: 20px"
              strokeWidth="6"
            />
          </div>
          <p v-else class="font-semibold mx-3 text-white">{{ isUpdate ? "Ubah" : "Tambah"}}</p>
        </div>
      </div>
    </Dialog>
  </div>
  <div
    v-else
    class="main-container w-full h-full flex justify-center items-center"
  >
    <ProgressSpinner />
  </div>
</template>
    
    <script setup>
import { DummyService } from "@/service/DummyService";

onMounted(() => {
  product.value = DummyService.getInvoiceProduct();
  init();
});

async function init() {
  invoice.value = await getInvoice(route.params.id);
  sales.value = await getAllSales(route.params.id);
  products.value = await getAllProduct();

  initFaktur();
  initMainInformation();
}

async function initFaktur() {
  faktur.value = invoice.value.IsTaxable ? "ya" : "tidak";
  discount.value = invoice.value.Discount;
  jangkaPembayaran.value = invoice.value.PaymentTerm;
}

async function initMainInformation() {
  poCode.value = invoice.value.PoCode == "" ? "-" : invoice.value.PoCode;
  metodePembayaran.value =
    invoice.value.PaymentMethod == "" ? "-" : invoice.value.PaymentMethod;
  platformPembayran.value =
    invoice.value.Platform == "" ? "-" : invoice.value.Platform;
  nomorRekening.value =
    invoice.value.PlatformNumber == "" ? "-" : invoice.value.PlatformNumber;
  deskripsiPlatform.value =
    invoice.value.PlatformDescription == ""
      ? "-"
      : invoice.value.PlatformDescription;
  namaPenjual.value = invoice.value.Seller == "" ? "-" : invoice.value.Seller;
  catatan.value = invoice.value.Note == "" ? "-" : invoice.value.Note;
}

const onAdvancedUpload = () => {
  toast.add({
    severity: "info",
    summary: "Success",
    detail: "File Uploaded",
    life: 3000,
  });
};

const {
  pending,
  getInvoice,
  updateFaktur,
  updateMainInformation,
  lockInvoice,
} = InvoiceApi();
const { pending: salePending, addSales, getAllSales, deleteSales, updateSales } = SalesApi();
const { pending: productPending, getAllProduct } = ProductApi();

const route = useRoute();

const invoice = ref(null);
const product = ref();
const faktur = ref("");
const discount = ref(null);
const jangkaPembayaran = ref(null);

const poCode = ref("");
const metodePembayaran = ref("");
const platformPembayran = ref("");
const nomorRekening = ref("");
const deskripsiPlatform = ref("");
const namaPenjual = ref("");
const catatan = ref("");

const sales = ref([]);
const addSale = ref(false);
const selectedProduct = ref(null);
const products = ref([]);
const productCount = ref(null);
const productPrice = ref(null);
const isUpdate = ref(false);
const currentCount = ref(null);
const selectedSale = ref(null);
function setupAddSale(){
  isUpdate.value = false;
  selectedProduct.value = null;
  productCount.value = null;
  productPrice.value = null;
  addSale.value = true;
}
function setupEditSale(sale){
  isUpdate.value = true;
  selectedProduct.value = products.value.find(p => p.barang === sale.nama);
  productCount.value = sale.jumlah;
  productPrice.value = sale.harga;
  selectedSale.value = sale.id;
  currentCount.value = sale.jumlah;
  addSale.value = true;
}

const isInvoiceValid = computed(() => {
  return invoice.value != null && invoice.value.InvoiceStatusId === 1;
});

const confirm = useConfirm();
const confirmDelete = (id) => {
    confirm.require({
        message: 'Apakah ingin menghapus produk ini dari invoice?',
        header: 'Hapus barang',
        icon: 'pi pi-info-circle mr-2',
        rejectLabel: 'Cancel',
        acceptLabel: 'Delete',
        rejectClass: 'bg-white border-none hover:border-solid hover:border-green-500 hover:bg-white',
        acceptClass: 'bg-red-400 border-none focus:ring-0 hover:border-solid hover:border-green-500 hover:bg-red-400 hover:border-[3px]',
        accept: () => {
          deleteSales(id, async () => {
            sales.value = await getAllSales(route.params.id);
          });
        },
        reject: () => {
        }
    });
};

</script>