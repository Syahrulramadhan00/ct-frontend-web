<template>
  <div class="flex-none bg-white shadow-2xl rounded-lg w-48 h-[34rem] mr-3 p-3">
    <!-- Brand Tag -->
    <div class="flex flex-row justify-evenly items-center mb-5">
      <div class="bg-black w-7 h-7"></div>
      <p class="text-lg font-semibold">CahayaTeknik</p>
    </div>
    <!-- Menu -->
    <div class="ml-2">
      <AppMenuItem icon="pi-home" title="Dashboard" link="/" />
      <AppMenuItem icon="pi-box" title="Stok produk" link="/product" />
      <AppMenuItem icon="pi-shopping-bag" title="Pembelian" link="/buy" />
      <Divider class="mb-8" />
      <p class="font-medium text-slate-400">Penjualan</p>
      <AppMenuItem icon="pi-receipt" title="Invoice" link="/invoice" />
      <AppMenuItem icon="pi-truck" title="Surat jalan" link="/delivery" />
      <AppMenuItem
        icon="pi-book"
        title="Tanda terima"
        class="mb-5"
        link="/receipt"
      />
      <Divider class="mb-8" />
      <AppMenuItem icon="pi-address-book" title="Klien" link="/client" />
      <AppMenuItem icon="pi-chart-pie" title="Analitik" link="/analytic" />
    </div>
  </div>
</template>