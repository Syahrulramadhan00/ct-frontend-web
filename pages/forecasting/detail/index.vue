<template>
  <div class="main-container grow flex justify-center flex-col items-start w-full p-6">
    <p class="text-2xl font-bold mb-6">PRODUK {{forecastDetail?.nama}}</p>

    <!--  CHART PENJUALAN PRODUK  -->
    <Chart type="line" :data="salesChart" :options="salesChartOptions" class="h-72 w-full mb-4" />

    <p class="text-xl font-semibold mb-2 mt-6">Tabel Hasil</p>
    <!--  TABEL HASIL  -->
    <table class="w-full border border-gray-300 text-left">
      <thead class="bg-gray-100">
      <tr>
        <th class="p-3 border">Metode</th>
<!--        <th class="p-3 border">MAE</th>-->
<!--        <th class="p-3 border">MSE</th>-->
<!--        <th class="p-3 border">R² Score</th>-->
<!--        <th class="p-3 border">RMSE</th>-->
        <th class="p-3 border">Prediksi Penjualan</th>
        <th class="p-3 border">Jumlah Beli</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="row in tableData" :key="row.name" :class="{
            'bg-green-100 text-green-800 font-semibold': row.rmse === minRSAE
          }">
        <td class="p-3 border font-semibold">{{ row.name }}</td>
<!--        <td class="p-3 border">{{ row.mae }}</td>-->
<!--        <td class="p-3 border">{{ row.mse }}</td>-->
<!--        <td class="p-3 border">{{ row.r2 }}</td>-->
<!--        <td class="p-3 border">{{ row.rmse }}</td>-->
        <td class="p-3 border">{{ Math.ceil(row.forecast) }}</td>
        <td class="p-3 border">{{ Math.ceil(row.buyCount) }}</td>
      </tr>
      </tbody>
    </table>

    <!--  CARD  -->
    <div class="flex w-full justify-between mt-6">
        <Card
            v-for="content in cardContents"
            :key="content.title"
            class="h-56 border border-transparent hover:border-green-500 cursor-pointer transition mx-2"
            @click="openModal(content)"
        >
          <template #subtitle>
            <p class="font-bold">{{ content.title }}</p>
          </template>
          <template #content>
            <p class="m-0 h-36 overflow-hidden text-ellipsis">
              {{ content.description }}
            </p>
          </template>
        </Card>
      </div>

    <p class="text-xl font-semibold mb-2 mt-8">Keanggotaan Fuzzy</p>
    <!--  GRAFIK ANGGOTA FUZZY  -->
    <div class="flex w-full justify-between">
      <div>
        <p class="mb-2 font-medium">Keanggotaan forecast</p>
        <Chart type="line" :data="forecastChart" :options="forecastChartOptions" class="h-72" />
      </div>
      <div>
        <p class="mb-2 font-medium">Keanggotaan sisa stok</p>
        <Chart type="line" :data="stockChart" :options="stockChartOptions" class="h-72" />
      </div>
      <div>
      <p class="mb-2 font-medium">Keanggotaan jumlah beli</p>
      <Chart type="line" :data="sellCountChart" :options="sellCountChartOptions" class="h-72" />
    </div>
    </div>

    <!-- MODAL DETAIL CARD  -->
    <Dialog
        v-model:visible="modal"
        modal
        header="Detail Penjelasan"
        :style="{ width: '25rem' }"
    >
      <div class="flex flex-col">
      <p class="text-lg font-semibold mb-2">{{ selectedCard?.title }}</p>
      <p class="text-sm">{{ selectedCard?.description }}</p>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import Chart from 'primevue/chart';
import { useForecastStore } from '~/store/forecastStore'

const forecastStore = useForecastStore()
const forecast = forecastStore.getValue
const forecastDetail = forecast.data[0] || {};
console.log(forecastDetail);

onMounted(() => {
  salesChart.value = setChartData(forecastDetail.sales, forecastDetail.monthly_sales);
  salesChartOptions.value = setChartOptions();
  sellCountChart.value = forecast.sellCountChart;
  stockChart.value = forecast.stockChart;
  forecastChart.value = forecast.forecastChart;
  sellCountChartOptions.value = forecast.sellChartOptions;
  stockChartOptions.value = forecast.stockChartOptions;
  forecastChartOptions.value = forecast.forecastChartOptions;
});

const salesChart = ref();
const salesChartOptions = ref();

const sellCountChart = ref();
const stockChart = ref();
const forecastChart = ref();
const sellCountChartOptions = ref();
const stockChartOptions = ref();
const forecastChartOptions = ref();

const tableData = [
  {
    name: 'MA',
    mae: Number(forecastDetail.ma_metrics.mae.toFixed(2)),
    mse: Number(forecastDetail.ma_metrics.mse.toFixed(2)),
    r2: Number(forecastDetail.ma_metrics.r2.toFixed(2)),
    rmse: Number(forecastDetail.ma_metrics.rmse.toFixed(2)),
    forecast: Number(forecastDetail.prediksi_ma.toFixed(2)),
    buyCount: Number(forecastDetail.jumlah_beli_ma.toFixed(2)),
  },
  {
    name: 'SES',
    mae: Number(forecastDetail.ses_metrics.mae.toFixed(2)),
    mse: Number(forecastDetail.ses_metrics.mse.toFixed(2)),
    r2: Number(forecastDetail.ses_metrics.r2.toFixed(2)),
    rmse: Number(forecastDetail.ses_metrics.rmse.toFixed(2)),
    forecast: Number(forecastDetail.prediksi_ses.toFixed(2)),
    buyCount: Number(forecastDetail.jumlah_beli_ses.toFixed(2)),
  },
  {
    name: 'HOLT',
    mae: Number(forecastDetail.holt_metrics.mae.toFixed(2)),
    mse: Number(forecastDetail.holt_metrics.mse.toFixed(2)),
    r2: Number(forecastDetail.holt_metrics.r2.toFixed(2)),
    rmse: Number(forecastDetail.holt_metrics.rmse.toFixed(2)),
    forecast: Number(forecastDetail.prediksi_holt.toFixed(2)),
    buyCount: Number(forecastDetail.jumlah_beli_holt.toFixed(2)),
  }
]

const minRSAE = Math.min(...tableData.map(row => row.rmse))

const cardContents = [
  {
    title: "MA",
    description: "MA (Moving Average) adalah metode peramalan yang menghitung rata-rata dari data sebelumnya untuk memprediksi nilai di masa depan. Cocok untuk data yang tidak terlalu fluktuatif."
  },
  {
    title: "SES",
    description: "SES (Simple Exponential Smoothing) adalah teknik peramalan yang memberikan bobot lebih besar pada data terbaru. Ini membantu menangkap tren jangka pendek lebih baik dibanding rata-rata biasa."
  },
  {
    title: "WINTER",
    description: "Metode Winter (Triple Exponential Smoothing) digunakan untuk data yang punya pola tren dan musiman. Cocok untuk data yang berulang setiap periode, seperti penjualan bulanan."
  },
  // {
  //   title: "MAE",
  //   description: "MAE (Mean Absolute Error) mengukur seberapa besar kesalahan rata-rata antara nilai prediksi dan nilai sebenarnya, tanpa memperhatikan arah kesalahan. Nilai lebih kecil berarti prediksi lebih akurat."
  // },
  // {
  //   title: "MSE",
  //   description: "MSE (Mean Squared Error) adalah rata-rata dari kuadrat selisih antara prediksi dan data asli. Karena selisihnya dikuadratkan, kesalahan besar akan lebih mempengaruhi nilai ini."
  // },
  // {
  //   title: "R² Score",
  //   description: "R² (R-squared) menunjukkan seberapa baik model prediksi menjelaskan variasi data asli. Nilai 1 berarti sempurna, sedangkan 0 berarti model tidak menjelaskan apapun."
  // },
  // {
  //   title: "RMSE",
  //   description: "RMSE (Root Mean Squared Error) adalah akar dari MSE, sehingga satuannya sama dengan data asli. Ini memberikan gambaran seberapa jauh prediksi rata-rata dari nilai sebenarnya."
  // }
];

const modal = ref(false);

const selectedCard = ref(null);

const openModal = (card) => {
  selectedCard.value = card;
  modal.value = true;
};

const setChartData = (salesData, monthlySalesData) => {
  const documentStyle = getComputedStyle(document.documentElement);

  const allLabels = [...salesData.map(i => i.week), ...monthlySalesData.map(i => i.month + '-01')];
  const uniqueLabels = Array.from(new Set(allLabels)).sort();

  const weeklyMap = Object.fromEntries(salesData.map(item => [item.week, item.quantity]));
  const monthlyMap = Object.fromEntries(monthlySalesData.map(item => [item.month + '-01', item.quantity]));

  return {
    labels: uniqueLabels,
    datasets: [
      {
        label: 'Penjualan per Minggu',
        data: uniqueLabels.map(label => weeklyMap[label] ?? null),
        borderColor: documentStyle.getPropertyValue('--cyan-500'),
        fill: false,
        tension: 0.4,
        spanGaps: true
      },
      {
        label: 'Penjualan per Bulan',
        data: uniqueLabels.map(label => monthlyMap[label] ?? null),
        borderColor: documentStyle.getPropertyValue('--orange-500'),
        fill: false,
        tension: 0.4,
        spanGaps: true
      }
    ]
  };
}
const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          color: textColor
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary
        },
        grid: {
          color: surfaceBorder
        }
      },
      y: {
        ticks: {
          color: textColorSecondary
        },
        grid: {
          color: surfaceBorder
        }
      }
    }
  };
}
</script>