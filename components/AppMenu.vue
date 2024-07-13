<template>
  <div class="flex-none bg-white shadow-2xl rounded-lg w-48 h-[34rem] mr-3 p-3">
    <!-- Brand Tag -->
    <div class="flex flex-row justify-evenly items-center mb-5">
      <div class="bg-black w-7 h-7"></div>
      <p class="text-lg font-semibold">CahayaTeknik</p>
    </div>
    <!-- Menu -->
    <div class="ml-2">
      <AppMenuItem icon="pi-home" title="Dashboard" :isActive="true" />
      <AppMenuItem icon="pi-box" title="Stok produk" />
      <AppMenuItem icon="pi-shopping-bag" title="Pembelian" />
      <Divider class="mb-8" />
      <p class="font-medium text-slate-400">Penjualan</p>
      <AppMenuItem icon="pi-receipt" title="Invoice" />
      <AppMenuItem icon="pi-truck" title="Surat jalan" />
      <AppMenuItem icon="pi-book" title="Tanda terima" class="mb-5" />
      <Divider class="mb-8" />
      <AppMenuItem icon="pi-address-book" title="Klien" />
      <AppMenuItem icon="pi-chart-pie" title="Analitik" />
    </div>
  </div>
</template>