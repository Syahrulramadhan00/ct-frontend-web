<template>
  <div class="flex">
    <ConfirmDialog></ConfirmDialog>
    <div class="main-container grow h-[35rem] w-56 items-center justify-center">
      <div v-if="purchasePending" class="w-full h-full flex items-center justify-center">
        <ProgressSpinner/>
      </div>
      <DataTable
      v-else
        v-model:filters="filters"
        :value="pembelian"
        scrollable
        scrollHeight="28rem"
        tableStyle="min-width: 50rem"
        :globalFilterFields="['no', 'nama', 'harga', 'total', 'tanggal']"
      >
        <template #header>
          <div class="flex justify-between">
            <div
            @click="buyModal = true"
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
        <!-- no : 10,
                nama : 'Longdrut 3/4"',
                jumlah : '190',
                harga : '100.000',
                total : '19.000.000',
                tanggal : '21/12/2024', -->
        <Column
          filterField="no"
          field="no"
          header="No"
          style="width: 5%"
        ></Column>
        <Column filterField="nama" field="nama" header="Nama"></Column>
        <Column
          filterField="jumlah"
          field="jumlah"
          header="Jumlah"
          style="width: 15%"
        ></Column>
        <Column filterField="harga" field="harga" header="Harga"></Column>
        <Column filterField="total" field="total" header="Total"></Column>
        <Column filterField="tanggal" field="tanggal" header="Tanggal"></Column>
        <Column filterField="lunas" field="lunas" header="Status">
          <template #body="{data}">
            <span v-if="data.lunas" class="text-green-500">Lunas</span>
            <span v-else class="text-red-500">Belum lunas</span>
          </template>
        </Column>
        <Column field="" header="Menu">
          <template #body="{data}">
            <div class="flex">
              <div
              v-if="!data.lunas"
              @click="confirmPayDebt(data.id)"
                class="shrink main-container bg-slate-100 p-0 px-6 py-1 mr-2 hover:cursor-pointer"
              >
                <p class="font-semibold">Bayar</p>
              </div>
              <div @click="confirmDelete(data.id)" class="shrink main-container bg-red-400 p-0 px-6 py-1 hover:cursor-pointer">
                <p class="font-semibold">Hapus</p>
              </div>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>


        <Dialog
      v-model:visible="buyModal"
      modal
      :header=" isUpdate ? 'Ubah pembelian' : 'Tambah pembelian' "
      :style="{ width: '25rem' }"
    >
      <div class="flex flex-col">
        <p v-if="!isUpdate" class="mb-3">Pilih barang :</p>
        <div v-if="!isUpdate" class="w-80 ml-4">
          <Dropdown
            v-model="selectedProduct"
            :options="products"
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

        <div class="flex-1 mt-4">
        <p class="mb-2">Apakah sudah terbayar?</p>
        <div class="flex flex-wrap gap-3">
          <div class="flex align-items-center">
            <RadioButton
              v-model="paid"
              inputId="ya"
              name="paid"
              value="ya"
            />
            <label for="paid1" class="ml-2">Ya</label>
          </div>
          <div class="flex align-items-center">
            <RadioButton
              v-model="paid"
              inputId="tidak"
              name="paid"
              value="tidak"
            />
            <label for="paid2" class="ml-2">Belum</label>
          </div>
        </div>
      </div>

        <div
          @click="
          addPurchase({
            productId: selectedProduct.id,
            count: productCount,
            price: productPrice,
            isPaid: paid === 'ya'
          }, async () => {
            buyModal = false;
            resetForm();
            pembelian = await getAllPurchase();
          })
          "
          class="main-container bg-purple-400 p-0 flex items-center justify-center h-10 shadow-md mt-5 hover:cursor-pointer"
        >
          <div v-if="purchasePending" class="pt-1">
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
</template>

<script setup>
import { FilterMatchMode } from "primevue/api";
import { PurchaseApi } from "~/composables/PurchaseApi";

onMounted(() => {
  init();
});

async function init(){
  products.value = await getAllProduct();
  pembelian.value = await getAllPurchase();
}

const { pending: productPending, getAllProduct } = ProductApi();
const { pending: purchasePending, addPurchase, getAllPurchase, deletePurchase, payDebt } = PurchaseApi();


const pembelian = ref();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  no: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  nama: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  harga: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  total: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  tanggal: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});

const buyModal = ref(false);
const isUpdate = ref(false);
const selectedProduct = ref(null);
const products = ref([]);
const productCount = ref(null);
const productPrice = ref(null);
const paid = ref(null);
function resetForm() {
  selectedProduct.value = null;
  productCount.value = null;
  productPrice.value = null;
  paid.value = null;
}

const confirm = useConfirm();
const confirmDelete = (id) => {
    confirm.require({
        message: 'Apakah ingin menghapus catatan pembelian ini?',
        header: 'Hapus pembelian',
        icon: 'pi pi-info-circle mr-2',
        rejectLabel: 'Cancel',
        acceptLabel: 'Delete',
        rejectClass: 'bg-white border-none hover:border-solid hover:border-green-500 hover:bg-white',
        acceptClass: 'bg-red-400 border-none focus:ring-0 hover:border-solid hover:border-green-500 hover:bg-red-400 hover:border-[3px]',
        accept: () => {
          deletePurchase(id, async () => {
            pembelian.value = await getAllPurchase();
          });
        },
        reject: () => {
        }
    });
};

const confirmPayDebt = (id) => {
    confirm.require({
        message: 'Apakah ingin membayar pembelian ini?',
        header: 'Bayar pembelian',
        icon: 'pi pi-info-circle mr-2',
        rejectLabel: 'Cancel',
        acceptLabel: 'Bayar',
        rejectClass: 'bg-white border-none hover:border-solid hover:border-green-500 hover:bg-white',
        acceptClass: 'bg-green-400 border-none focus:ring-0 hover:border-solid hover:border-green-500 hover:bg-green-400 hover:border-1',
        accept: () => {
          payDebt(id, async () => {
            pembelian.value = await getAllPurchase();
          });
        },
        reject: () => {
        }
    });
};
</script>