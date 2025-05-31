<template>
  <div class="flex">
    <ConfirmDialog></ConfirmDialog>
    <div class="main-container grow h-[35rem] w-56 items-center justify-center">
      <div v-if="clientPending" class="w-full h-full flex items-center justify-center">
        <ProgressSpinner/>
      </div>
      <DataTable
          v-else
          v-model:filters="filters"
          :value="clients"
          scrollable
          scrollHeight="28rem"
          tableStyle="min-width: 50rem"
          :globalFilterFields="['no', 'name']"
      >
        <template #header>
          <div class="flex justify-between">
            <div
                @click="clientModal = true"
                class="main-container bg-purple-400 p-0 flex items-center shadow-md hover:cursor-pointer"
            >
              <p class="font-semibold mx-3 text-white">Tambah</p>
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
        </template>
        <Column
            filterField="no"
            field="no"
            header="No"
            style="width: 5%"
        ></Column>
        <Column filterField="name" field="name" header="Name"></Column>
        <Column filterField="address" field="address" header="Alamat"></Column>
        <Column filterField="telephone" field="telephone" header="Telepon"></Column>
        <Column field="" header="Menu">
          <template #body="{data}">
            <div class="flex">
              <div
                  @click="() => {
                    isUpdate = true;
                    clientName = data.name;
                    selectedId = data.id;
                    address = data.address;
                    telephone = data.telephone;
                    clientModal = true;
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
        v-model:visible="clientModal"
        modal
        :header=" isUpdate ? 'Ubah client' : 'Tambah client' "
        :style="{ width: '25rem' }"
    >
      <div class="flex flex-col">
        <FloatLabel class="mt-8">
          <InputText id="clientName" v-model="clientName" class="w-[22rem]"/>
          <label for="clientName">Nama client </label>
        </FloatLabel>
        <FloatLabel class="mt-8">
          <InputText id="address" v-model="address" class="w-[22rem]"/>
          <label for="address">Alamat </label>
        </FloatLabel>
        <FloatLabel class="mt-8">
          <InputText id="telephone" v-model="telephone" class="w-[22rem]"/>
          <label for="telephone">No telephone </label>
        </FloatLabel>
        <div
            @click="isUpdate ? onUpdateClient() : onAddClient()"
            class="main-container bg-purple-400 p-0 flex items-center justify-center h-10 shadow-md mt-5 hover:cursor-pointer"
        >
          <div v-if="clientPending" class="pt-1">
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
import {FilterMatchMode} from "primevue/api";

onMounted(() => {
  init();
});

async function init() {
  clients.value = await getClients();
}

const {pending: clientPending, getClients, addClient, updateClient} = ClientApi();

async function onAddClient() {
  await addClient({
    name : clientName.value,
    address : address.value,
    telephone : telephone.value
  }, async () => {
    await resetForm();
  });
}

async function onUpdateClient() {
  await updateClient({
    id: selectedId.value,
    name: clientName.value,
    address: address.value,
    telephone: telephone.value
  }, async () => {
    await resetForm();
  });
}

async function resetForm() {
  clientModal.value = false;
  clientName.value = null;
  address.value = null;
  telephone.value = null;
  clients.value = await getClients();
}


const filters = ref({
  global: {value: null, matchMode: FilterMatchMode.CONTAINS},
  no: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
  name: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
});

const clientModal = ref(false);
const isUpdate = ref(false);
const clients = ref([]);
const clientName = ref(null);
const address = ref(null);
const telephone = ref(null);
const selectedId = ref(null);
</script>