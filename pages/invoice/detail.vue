<template>
  <div class="">
    <!-- TITLE SECTION -->
    <div class="flex justify-between">
      <div class="flex flex-1 items-start">
        <NuxtLink to="/invoice"
          ><i class="pi pi-chevron-left text-lg ml-5 mr-4 pt-1"> </i
        ></NuxtLink>
        <div>
          <p class="font-bold text-lg">Invoice no 375/A/2024/3</p>
          <p>Pt. Sinergi Indonesia</p>
        </div>
      </div>
      <div class="ml-2">
        <div
          class="main-container bg-black p-0 py-1 mb-2 justify-center rounded-2xl"
        >
          <p class="text-white flex-1 text-center">Belum dikunci</p>
        </div>
        <div
          class="main-container bg-purple-400 p-0 py-1 px-3 flex justify-evenly items-center"
        >
          <i class="pi pi-lock text-white mr-1"> </i>
          <p class="text-white">Simpan akhir</p>
        </div>
      </div>
    </div>

    <!-- STEPPER SECTION -->
    <div class="flex main-container mt-8">
      <InvoiceStepper :activeIndex="4" class="flex-1" />
    </div>

    <!-- PRODUCT SECTION -->
    <div class="flex main-container mt-5">
      <DataTable
        :value="product"
        scrollable
        scrollHeight="18rem"
        tableStyle="min-width: 2rem"
        class="flex-1 w-0"
      >
        <template #header>
          <div class="flex justify-between">
            <div
              class="main-container bg-purple-400 p-0 flex items-center shadow-md"
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
        <Column field="" header="Menu">
          <template #body="{}">
            <div class="flex">
              <div
                class="shrink main-container bg-slate-100 p-0 px-6 py-1 mr-2"
              >
                <p class="font-semibold">Edit</p>
              </div>
              <div class="shrink main-container bg-red-400 p-0 px-6 py-1">
                <p class="font-semibold">Hapus</p>
              </div>
            </div>
          </template>
        </Column>
      </DataTable>
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
            />
            <label for="faktur1" class="ml-2">Ya</label>
          </div>
          <div class="flex align-items-center">
            <RadioButton
              v-model="faktur"
              inputId="tidak"
              name="faktur"
              value="tidak"
            />
            <label for="faktur2" class="ml-2">Tidak</label>
          </div>
        </div>
        <!-- DISCOUNT SECTION -->
        <div class="flex items-end">
          <FloatLabel class="mt-8">
            <InputText id="discount" v-model="discount" class="w-96 md:w-80" />
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
            />
            <label for="jangkaPembayaran">Jangka pembayaran</label>
          </FloatLabel>
          <p class="ml-4 text-lg text-gray-500">hari</p>
        </div>

        <div
          class="main-container bg-purple-400 p-0 py-1 px-3 flex justify-center items-center mt-10"
        >
          <p class="text-white">Simpan</p>
        </div>
      </div>
    </div>

    <div class="main-container flex mt-5">
      <div class="flex-1">
        <FloatLabel class="mt-4">
          <InputText id="poCode" v-model="poCode" class="lg:w-96 md:w-64" />
          <label for="poCode">kode pre-order</label>
        </FloatLabel>
        <FloatLabel class="mt-8">
          <InputText
            id="namaPenjual"
            v-model="namaPenjual"
            class="md:w-64 lg:w-96"
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
          />
          <label for="metodePembayaran">Metode pembayaran</label>
        </FloatLabel>
        <FloatLabel class="mt-8">
          <InputText
            id="platformPembayran"
            v-model="platformPembayran"
            class="md:w-64 lg:w-96"
          />
          <label for="platformPembayran">Platform pembayaran</label>
        </FloatLabel>
        <FloatLabel class="mt-8">
          <InputText
            id="nomorRekening"
            v-model="nomorRekening"
            class="md:w-64 lg:w-96"
          />
          <label for="nomorRekening">Nomor rekening</label>
        </FloatLabel>
        <FloatLabel class="mt-8">
          <InputText
            id="deskripsiPlatform"
            v-model="deskripsiPlatform"
            class="md:w-64 lg:w-96"
          />
          <label for="deskripsiPlatform">Deskripsi platform</label>
        </FloatLabel>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, onMounted } from "vue";
import { DummyService } from "@/service/DummyService";
import "primeicons/primeicons.css";

onMounted(() => {
  product.value = DummyService.getInvoiceProduct();
});

const onAdvancedUpload = () => {
  toast.add({
    severity: "info",
    summary: "Success",
    detail: "File Uploaded",
    life: 3000,
  });
};

const product = ref();
const faktur = ref("");
const discount = ref(null);
const jangkaPembayaran = ref(null);
const poCode = ref(null);
const metodePembayaran = ref(null);
const platformPembayran = ref(null);
const nomorRekening = ref(null);
const deskripsiPlatform = ref(null);
const namaPenjual = ref(null);
const catatan = ref(null);
</script>