<template>
  <div class="pt-0">
    <!-- MAIN MENU SECTION -->
    <div class="flex gap-4 flex-wrap">
      <DashboardMenuButton icon="pi-shopping-bag" title="Tambah stok baru" />
      <DashboardMenuButton icon="pi-receipt" title="Buat invoice" />
      <DashboardMenuButton icon="pi-truck" title="Buat surat jalan" />
      <DashboardMenuButton icon="pi-credit-card" title="Buat pembayaran" />
    </div>

    <div class="flex gap-4 flex-wrap">
      <!-- TOKOPEDIA ORDER SECTION -->
      <!-- <div class="flex gap-4 flex-wrap flex-1 mt-8">
        <div class="main-container grow h-80">
          <div class="flex items-center gap-1">
            <p class="font-semibold text-lg">Tokopedia</p>
            <p class="text-sm text-gray-500">(pesanan)</p>
          </div>
          <div class="overflow-y-scroll h-64 mt-2 flex flex-wrap gap-2">
            <DashboardMenuTokopedia />
            <DashboardMenuTokopedia />
            <DashboardMenuTokopedia />
            <DashboardMenuTokopedia />
            <DashboardMenuTokopedia />
            <DashboardMenuTokopedia />
            <DashboardMenuTokopedia />
          </div>
        </div>
      </div> -->

      <!-- TAGIHAN TABLE SECTION -->
      <div class="flex gap-4 flex-wrap flex-1 mt-8">
        <div class="main-container grow h-140 w-56">
          <p
            class="font-semibold text-lg overflow-hidden whitespace-nowrap mb-1"
          >
            Tagihan Terakhir
          </p>
          <DataTable
            :value="tagihan"
            scrollable
            scrollHeight="400px"
            tableStyle="min-width: 50rem"
          >
            <Column
              field="code"
              header="Tanda terima"
              style="width: 20%"
            ></Column>
            <Column field="name" header="Klien"></Column>
            <Column field="amount" header="Jumlah"></Column>
            <Column field="contact" header="Kontak"></Column>
      <Column field="status" header="Status">
        <template #body="slotProps">
          <span
            :class="{
              'text-green-500': slotProps.data.status === 'Lunas',
              'text-red-500': slotProps.data.status !== 'Lunas',
            }"
            class="font-bold"
          >
            {{ slotProps.data.status }}
          </span>
        </template>
      </Column>
          </DataTable>
        </div>
      </div>
    </div>

    <div class="flex gap-4 flex-wrap">
      <!-- TOKOPEDIA CONNECT SECTION -->
      <!-- <div class="flex-1 main-container bg-green-400 max-w-80 h-80 mt-8">
        <div class="flex flex-col items-center">
          <p class="font-semibold text-4xl text-gray-800">Tokopedia</p>
          <NuxtImg
            src="images/logo-tokopedia.png"
            width="128"
            height="128"
            class="my-10"
          />
          <div class="main-container shadow-none p-0 rounded-2xl">
            <p class="text-sm px-12 py-1 font-semibold">Hubungkan</p>
          </div>
        </div>
      </div> -->

      <!-- NEED TO DELIVER SECTION -->
      <!-- <div class="flex gap-4 flex-wrap flex-1 mt-8">
        <div class="main-container grow h-80 w-56">
          <p
            class="font-semibold text-lg overflow-hidden whitespace-nowrap mb-1"
          >
            Tagihan Sudah Lunas
          </p>
          <DataTable
            :value="tagihan"
            scrollable
            scrollHeight="256px"
            tableStyle="min-width: 50rem"
          >
            <Column field="kode" header="Tanda terima"></Column>
            <Column field="klien" header="Klien"></Column>
            <Column field="jumlah" header="Jumlah"></Column>
            <Column field="kontak" header="Kontak"></Column>
          </DataTable>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
// Remove DummyService as you'll be fetching real data
// import { DummyService } from "@/service/DummyService"; 
import { AnalyticApi } from "~/composables/AnalyticApi"; // Import AnalyticApi

const { getLatestBill } = AnalyticApi(); // Destructure getLatestBill

const tagihan = ref([]); // Initialize as an empty array

onMounted(async () => {
  // Fetch actual data using your composable
  const data = await getLatestBill();
  if (data) {
    tagihan.value = data; // Assign fetched data to tagihan
  } else {
    // Handle error or no data case
    console.error("Failed to fetch latest bills.");
    tagihan.value = []; // Ensure tagihan is an empty array on error
  }
});
</script>
