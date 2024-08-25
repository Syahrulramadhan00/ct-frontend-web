<template>
  <div v-if="!pending" class="">
    <ConfirmDialog></ConfirmDialog>
    <Toast />

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
              @click="lock()"
              class="main-container bg-purple-400 p-0 py-1 px-3 flex justify-evenly items-center hover:cursor-pointer"
          >
            <i class="pi pi-lock text-white mr-1"> </i>
            <p class="text-white">Simpan akhir</p>
          </div>
        </div>
      </div>

      <!--  SURAT JALAN BUTTON  -->
      <div v-else>
        <div class="ml-2">
          <div
              @click="seeDelivery"
              class="main-container bg-purple-400 p-0 py-1 px-3 flex justify-evenly items-center hover:cursor-pointer"
          >
            <p class="text-white">Lihat surat jalan</p>
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
              <div @click="confirmDelete(data.id)"
                   class="shrink main-container bg-red-400 p-0 px-6 py-1 hover:cursor-pointer">
                <p class="font-semibold">Hapus</p>
              </div>
            </div>
          </template>
        </Column>
      </DataTable>
      <ProgressSpinner v-else/>
    </div>

    <div class="flex mt-5 gap-5 flex-wrap-reverse">
      <div class="flex-1">
        <!-- FILE SECTION -->
        <div class="main-container">
          <p class="mb-3 font-semibold text-lg">Dokumen surat PO</p>
          <FileUpload
              name="demo[]"
              @uploader="uploadFile($event)"
              :multiple="true"
              :customUpload="true"
              :disabled="!isInvoiceValid"
              accept="application/pdf"
              :maxFileSize="1000000"
          >
            <template #empty>
              <div class="flex items-center justify-center">

              <ProgressSpinner v-if="PoFilePending"/>
              <div
                  @click="openPoUrl()"
                  v-else-if="invoice?.PoPath !== null && invoice?.PoPath !== ''"
                  class="main-container w-36 bg-primary opcaity-60 p-0 py-1 flex justify-center items-center hover:cursor-pointer"
              >
                <p class="font-bold">Lihat Dokumen</p>
              </div>
              <p v-else>Drag and drop files to here to upload.</p>
              </div>
            </template>
          </FileUpload>
        </div>
        <div class="main-container mt-5">
          <div class="flex items-baseline">
          <p class="mb-3 font-semibold text-lg">Dokumen surat Faktur</p>
            <p v-if="!isFakturInactive" class="text-gray-700 ml-2">(belum aktif)</p>
          </div>
          <FileUpload
              name="demo[]"
              @uploader="uploadFaktur($event)"
              :multiple="true"
              :customUpload="true"
              :disabled="!isFakturInactive"
              accept="application/pdf"
              :maxFileSize="1000000"
          >
            <template #empty>
              <div class="flex items-center justify-center">

                <ProgressSpinner v-if="fakturFilePending"/>
                <div
                    @click="openFakturUrl()"
                    v-else-if="invoice?.FacturePath !== null && invoice?.FacturePath !== ''"
                    class="main-container w-36 bg-primary opcaity-60 p-0 py-1 flex justify-center items-center hover:cursor-pointer"
                >
                  <p class="font-bold">Lihat Dokumen</p>
                </div>
                <p v-else>Drag and drop files to here to upload.</p>
              </div>
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
                is_taxable: faktur === 'ya',
              },
              async () => {
                invoice = await getInvoice(route.params.id);
                await initFaktur();
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
                id="project"
                v-model="project"
                class="lg:w-96 md:w-64"
                :disabled="!isInvoiceValid"
            />
            <label for="project">nama proyek</label>
          </FloatLabel>
          <FloatLabel class="mt-8">
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
                v-tooltip.focus.top="'contoh : Imam S'"
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
              <label v-if="isInvoiceValid">Catatan</label>
              <label v-else>Catatan  <span class="text-red-500">(bisa diubah)</span></label>
            </FloatLabel>
          </div>
        </div>
        <div class="flex-1">

            <div class="bg-white rounded">
              <label for="date" class="block text-sm font-medium text-gray-500 mb-2">Pilih Tanggal <span v-if="!isInvoiceValid" class="text-red-500">(bisa diubah)</span></label>
              <input
                  type="date"
                  id="date"
                  :value="date"
                  @change="closeDatePicker"
                  @blur="closeDatePicker"
                  ref="datePickerRef"
                  class="w-full px-3 py-2 md:w-64 lg:w-96 border border-gray-200 rounded-md focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
              />
            </div>

          <FloatLabel class="mt-8">
            <InputText
                v-tooltip.focus.top="'contoh : Transfer'"
                id="metodePembayaran"
                v-model="metodePembayaran"
                class="md:w-64 lg:w-96"
                :disabled="!isInvoiceValid"
            />
            <label for="metodePembayaran">Metode pembayaran</label>
          </FloatLabel>
          <FloatLabel class="mt-8">
            <InputText
                v-tooltip.focus.top="'contoh : BCA'"
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
                v-tooltip.focus.top="'contoh : Safitri'"
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
                project : project,
                date : date
              },
              async () => {
                invoice = await getInvoice(route.params.id);
                await initMainInformation();
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
          <InputText id="count" v-model="productCount" class="w-[22rem]"/>
          <label for="count">Jumlah barang</label>
        </FloatLabel>
        <FloatLabel class="mt-8">
          <InputText id="price" v-model="productPrice" class="w-[22rem]"/>
          <label for="price">Harga satuan</label>
        </FloatLabel>
        <div
            @click="addOrUpdateSale()"
            class="main-container bg-purple-400 p-0 flex items-center justify-center h-10 shadow-md mt-5 hover:cursor-pointer"
        >
          <div v-if="salePending" class="pt-1">
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
  <div
      v-else
      class="main-container w-full h-full flex justify-center items-center"
  >
    <ProgressSpinner/>
  </div>
</template>

<script setup>
import {DummyService} from "@/service/DummyService";
import {Util} from "~/composables/Util.js";
import {PoFileApi} from "~/composables/invoices/PoFileApi.js";
import {InvoiceApi} from "~/composables/invoices/InvoiceApi.js";
import {FakturFileApi} from "~/composables/invoices/FakturFileApi.js";

onMounted(() => {
  product.value = DummyService.getInvoiceProduct();
  init();
});

const {formatDateYMD} = Util();
const toast = useToast();

async function init() {
  invoice.value = await getInvoice(route.params.id);
  sales.value = await getAllSales(route.params.id);
  products.value = await getAllProduct();

  await initFaktur();
  await initMainInformation();
}

async function initFaktur() {
  faktur.value = invoice.value.IsTaxable ? "ya" : "tidak";
  discount.value = invoice.value.Discount;
  jangkaPembayaran.value = invoice.value.PaymentTerm;
}

async function initMainInformation() {
  poCode.value = invoice.value.PoCode === "" ? "-" : invoice.value.PoCode;
  metodePembayaran.value =
      invoice.value.PaymentMethod === "" ? "-" : invoice.value.PaymentMethod;
  platformPembayran.value =
      invoice.value.Platform === "" ? "-" : invoice.value.Platform;
  nomorRekening.value =
      invoice.value.PlatformNumber === "" ? "-" : invoice.value.PlatformNumber;
  deskripsiPlatform.value =
      invoice.value.PlatformDescription === ""
          ? "-"
          : invoice.value.PlatformDescription;
  namaPenjual.value = invoice.value.Seller === "" ? "-" : invoice.value.Seller;
  catatan.value = invoice.value.Note === "" ? "-" : invoice.value.Note;
  project.value = invoice.value.ProjectName === "" ? "-" : invoice.value.ProjectName;
  date.value = invoice.value.Date === "" ? "" : formatDateYMD(invoice.value.Date);
}

const {
  pending,
  getInvoice,
  updateFaktur,
  updateMainInformation,
  lockInvoice,
} = InvoiceApi();
const {pending: salePending, getAllSales, deleteSales, addSales, updateSales} = SalesApi();
const {getAllProduct} = ProductApi();

const route = useRoute();
const router = useRouter();

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
const project = ref("");
const date = ref(null);

const sales = ref([]);
const addSale = ref(false);
const selectedProduct = ref(null);
const products = ref([]);
const productCount = ref(null);
const productPrice = ref(null);
const isUpdate = ref(false);
const currentCount = ref(null);
const selectedSale = ref(null);

function setupAddSale() {
  isUpdate.value = false;
  selectedProduct.value = null;
  productCount.value = null;
  productPrice.value = null;
  addSale.value = true;
}

function setupEditSale(sale) {
  isUpdate.value = true;
  selectedProduct.value = products.value.find(p => p.barang === sale.nama);
  productCount.value = sale.jumlah;
  productPrice.value = sale.harga;
  selectedSale.value = sale.id;
  currentCount.value = sale.jumlah;
  addSale.value = true;
}

const isInvoiceValid = computed(() => {
  return invoice.value != null && invoice.value.InvoiceStatusId < 3;
});

const isFakturInactive = computed(() => {
  return invoice.value != null && invoice.value.InvoiceStatusId > 4 && invoice.value.InvoiceStatusId < 7;
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

async function seeDelivery() {
  const data = {invoice_code: invoice.value?.InvoiceCode};
  const queryString = new URLSearchParams(data).toString();
  await router.push(`/delivery?${queryString}`);
}

const closeDatePicker = (event) => {
  date.value = event.target.value;
  datePickerRef.value.blur();
};

const datePickerRef = ref(null);

const {error,result, pending : PoFilePending, postFile, getUrl } = PoFileApi();
const {error : fakturError,result : fakturResult, pending : fakturFilePending, postFile : postFaktur, getUrl : getFaktur } = FakturFileApi();

const uploadFile = async (event) => {
  await postFile( {file : event.files[0], id : route.params.id, data : invoice?.value?.PoPath} , async () => {
    if (error.value !== null) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: error.value,
        life: 3000,
      });
    } else {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'File berhasil diupload',
        life: 3000,
      });
      invoice.value.PoPath = result.value.data;
      invoice.value.InvoiceStatusId = 2;
    }
  });
};

async function openPoUrl() {
  await getUrl(invoice.value.PoPath, async ()=>{
    await window.open(result.value.data, '_blank');
  });
}

const uploadFaktur = async (event) => {
  await postFaktur( {file : event.files[0], id : route.params.id, data : invoice?.value?.FacturePath} , async () => {
    if (error.value !== null) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: error.value,
        life: 3000,
      });
    } else {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'File berhasil diupload',
        life: 3000,
      });
      invoice.value.FacturePath = fakturResult.value.data;
      if(invoice.value.InvoiceStatusId < 5) {
        invoice.value.InvoiceStatusId = 5;
      }
    }
  });
};

async function openFakturUrl() {
  await getFaktur(invoice.value.FacturePath, async ()=>{
    window.open(fakturResult.value.data, '_blank');
  });
}

async function addOrUpdateSale(){
  if(!isUpdate.value){
    await addSales(
        {
          invoiceId: invoice.value.ID,
          productId: selectedProduct.value.id,
          count: productCount.value,
          price: productPrice.value,
        },
        async () => {
          setupAddSale();
          addSale.value = false;
          sales.value = await getAllSales(invoice.value.ID);
        }
    );
  } else {
    await updateSales(
        {
          id: selectedSale.value,
          productId: selectedProduct.value.id,
          count: productCount.value,
          price: productPrice.value,
          currentCount: currentCount.value,
        },
        async () => {
          setupAddSale();
          addSale.value = false;
          sales.value = await getAllSales(invoice.value.ID);
        }
    );
  }
}

async function lock(){
  if (invoice.value.InvoiceStatusId < 2){
    toast.add({
      severity: 'error',
      summary: 'PO kosong',
      detail: 'isi terlebih dahulu dokumen PO',
      life: 3000,
    });
  } else {
  await lockInvoice(invoice.value.ID, async () => {
    invoice.value = await getInvoice(route.params.id);
  })
  }
}

</script>