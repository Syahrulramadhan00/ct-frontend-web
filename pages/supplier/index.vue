<template>
  <div class="flex">
    <ConfirmDialog></ConfirmDialog>
    <div class="main-container grow h-[35rem] w-56 items-center justify-center">
      <div v-if="supplierPending" class="w-full h-full flex items-center justify-center">
        <ProgressSpinner/>
      </div>
      <DataTable
        v-else
        v-model:filters="filters"
        :value="suppliers"
        scrollable
        scrollHeight="28rem"
        tableStyle="min-width: 50rem"
        :globalFilterFields="['no', 'name', 'company', 'address', 'telephone']"
      >
        <template #header>
          <div class="flex justify-between">
            <div
              @click="supplierModal = true; isUpdate = false;"
              class="main-container bg-purple-400 p-0 flex items-center shadow-md hover:cursor-pointer"
            >
              <p class="font-semibold mx-3 text-white">Tambah Supplier</p>
            </div>
            <IconField iconPosition="left">
              <InputIcon>
                <i class="pi pi-search"/>
              </InputIcon>
              <InputText
                v-model="filters['global'].value"
                placeholder="Cari..."
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
        <Column filterField="name" field="name" header="Nama"></Column>
        <Column filterField="company" field="company" header="Perusahaan"></Column>
        <Column filterField="address" field="address" header="Alamat"></Column>
        <Column filterField="telephone" field="telephone" header="Telepon"></Column>
        <Column field="" header="Menu">
          <template #body="{data}">
            <div class="flex">
              <div
                @click="() => {
                  isUpdate = true;
                  selectedId = data.id;
                  supplierName = data.name;
                  company = data.company; // Added company
                  address = data.address;
                  telephone = data.telephone;
                  supplierModal = true;
                }"
                class="shrink main-container bg-slate-100 p-0 px-6 py-1 mr-2 hover:cursor-pointer"
              >
                <p class="font-semibold">Edit</p>
              </div>
              </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="supplierModal"
      modal
      :header=" isUpdate ? 'Ubah Supplier' : 'Tambah Supplier' "
      :style="{ width: '25rem' }"
      @hide="resetFormOnHide"
    >
      <div class="flex flex-col">
        <FloatLabel class="mt-8">
          <InputText id="supplierName" v-model="supplierName" class="w-[22rem]"/>
          <label for="supplierName">Nama Supplier </label>
        </FloatLabel>
         <FloatLabel class="mt-8">
          <InputText id="company" v-model="company" class="w-[22rem]"/>
          <label for="company">Perusahaan </label>
        </FloatLabel>
        <FloatLabel class="mt-8">
          <InputText id="address" v-model="address" class="w-[22rem]"/>
          <label for="address">Alamat </label>
        </FloatLabel>
        <FloatLabel class="mt-8">
          <InputText id="telephone" v-model="telephone" class="w-[22rem]"/>
          <label for="telephone">No Telepon </label>
        </FloatLabel>
        <div
          @click="isUpdate ? onUpdateSupplier() : onAddSupplier()"
          class="main-container bg-purple-400 p-0 flex items-center justify-center h-10 shadow-md mt-5 hover:cursor-pointer"
        >
          <div v-if="supplierPendingAction" class="pt-1">
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
import { ref, onMounted } from 'vue'; // Ensure ref and onMounted are imported
import { FilterMatchMode } from "primevue/api";
import { SupplierApi } from '~/composables/SupplierApi'; // Assuming this is the correct path

// PrimeVue Components (usually auto-imported in Nuxt 3, or explicitly import if not)
// import DataTable from 'primevue/datatable';
// import Column from 'primevue/column';
// import InputText from 'primevue/inputtext';
// import Dialog from 'primevue/dialog';
// import ConfirmDialog from 'primevue/confirmdialog'; // If you use it
// import ProgressSpinner from 'primevue/progressspinner';
// import FloatLabel from 'primevue/floatlabel';
// import IconField from 'primevue/iconfield';
// import InputIcon from 'primevue/inputicon';

onMounted(() => {
  init();
});

async function init() {
  suppliers.value = await getAllSuppliers() || []; // Ensure suppliers is an array
}

const {
  pending: supplierPending, // For loading table data
  getAllSuppliers,
  addSupplier,
  updateSupplier
} = SupplierApi();

// Separate pending state for modal actions to avoid spinner on whole table
const supplierPendingAction = ref(false);

async function onAddSupplier() {
  if (!supplierName.value || !company.value) {
    // Add more validation as needed, e.g., using a toast for notifications
    console.error("Supplier Name and Company are required.");
    alert("Nama Supplier dan Perusahaan wajib diisi."); // Basic alert, consider PrimeVue Toast
    return;
  }
  supplierPendingAction.value = true;
  await addSupplier({
    Name : supplierName.value,
    Company: company.value, // Added company
    Address : address.value,
    Telephone : telephone.value
  }, async () => {
    await resetForm();
    supplierPendingAction.value = false;
  });
}

async function onUpdateSupplier() {
  if (!supplierName.value || !company.value) {
    // Add more validation as needed
    console.error("Supplier Name and Company are required.");
    alert("Nama Supplier dan Perusahaan wajib diisi.");
    return;
  }
  supplierPendingAction.value = true;
  await updateSupplier({
    id: selectedId.value,
    Name: supplierName.value,
    Company: company.value, // Added company
    Address: address.value,
    Telephone: telephone.value
  }, async () => {
    await resetForm();
    supplierPendingAction.value = false;
  });
}

function resetFormOnHide() {
    // This function is called when the dialog is hidden, ensuring form is reset
    // even if the user closes the dialog using the 'x' button or escape key.
    supplierModal.value = false; // Ensure modal is marked as closed
    isUpdate.value = false; // Reset update flag
    supplierName.value = null;
    company.value = null; // Added company
    address.value = null;
    telephone.value = null;
    selectedId.value = null;
}

async function resetForm() {
  resetFormOnHide(); // Call the comprehensive reset
  suppliers.value = await getAllSuppliers() || []; // Refresh table data
}


const filters = ref({
  global: {value: null, matchMode: FilterMatchMode.CONTAINS},
  no: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
  name: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
  company: {value: null, matchMode: FilterMatchMode.STARTS_WITH}, // Added company filter
  address: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
  telephone: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
});

const supplierModal = ref(false);
const isUpdate = ref(false);
const suppliers = ref([]);
const supplierName = ref(null);
const company = ref(null); // Added company ref
const address = ref(null);
const telephone = ref(null);
const selectedId = ref(null);

// Example for delete (if you add a delete button)
// import { useConfirm } from "primevue/useconfirm";
// const confirm = useConfirm();
//
// async function deleteExistingSupplier(supplierId) {
//   supplierPendingAction.value = true; // Or a specific delete pending state
//   // Assuming you add a deleteSupplier function to your SupplierApi
//   // await deleteSupplierApi({ id: supplierId }, async () => {
//   //   await resetForm(); // To refresh the list
//   //   supplierPendingAction.value = false;
//   //   // Show success message
//   // });
// }

// const confirmDeleteSupplier = (data) => {
//   confirm.require({
//     message: `Apakah Anda yakin ingin menghapus supplier "${data.name}"?`,
//     header: 'Konfirmasi Hapus',
//     icon: 'pi pi-info-circle',
//     rejectClass: 'p-button-secondary p-button-outlined',
//     rejectLabel: 'Batal',
//     acceptLabel: 'Hapus',
//     acceptClass: 'p-button-danger',
//     accept: async () => {
//       // await deleteExistingSupplier(data.id);
//       // console.log(`Deleting supplier ${data.id}`);
//     },
//     reject: () => {
//       // Callback for reject action
//     }
//   });
// };
</script>