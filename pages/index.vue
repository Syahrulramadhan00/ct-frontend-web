<template>
  <div class="pt-0">
    <!-- MAIN MENU SECTION -->
    <div class="flex gap-4 flex-wrap">
      <DashboardMenuButton icon="pi-shopping-bag" title="Tambah stok baru" to="/buy" />
      <DashboardMenuButton icon="pi-receipt" title="Buat invoice" to="/invoice" />
      <DashboardMenuButton icon="pi-truck" title="Buat surat jalan" to="/delivery" />
      <DashboardMenuButton icon="pi-credit-card" title="Buat pembayaran" to="receipt"/>
    </div>

    <div class="flex gap-4 flex-wrap">


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

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

import { AnalyticApi } from "~/composables/AnalyticApi"; 

const { getLatestBill } = AnalyticApi(); 

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
