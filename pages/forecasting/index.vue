<template>
  <div class="flex">
    <div class="main-container grow w-56 flex justify-center flex-col items-center">
      <div class="flex">
        <div class="pr-4">
          <div class="flex items-end mb-4 w-full">
            <FloatLabel class="mt-8 mr-4 w-full">
              <InputText
                  type="number"
                  :min="100"
                  :invalid="!minimalTreshold"
                  v-tooltip.focus.top="'contoh : 100'"
                  id="minimalTreshold"
                  v-model="minimalTreshold"
                  class="w-full"
              />
              <label for="minimalTreshold">Minimal penjualan produk</label>
            </FloatLabel>

            <div>
              <Button label="cari produk" @click="getProducts" class="w-32"/>
            </div>
          </div>
          <div v-if="products.length > 0">
          <p>Pilih produk yang ingin di forecast</p>
          <Dropdown
              v-model="selectedProduct"
              :options="products"
              optionLabel="name"
              placeholder="pilihan produk"
              class="flex justify-between w-full items-center px-2 mt-2"
              panelClass="bg-white rounded-lg px-2 hover:cursor-pointer drop-shadow-lg"
              :virtualScrollerOptions="{ itemSize: 38 }"
          />
          <p class="mt-4">Pilih rentang forecast</p>
          <Dropdown
              v-model="selectedMode"
              :options="modes"
              placeholder="pilihan mode"
              class="flex justify-between w-full items-center px-2 mt-2"
              panelClass="bg-white rounded-lg px-2 hover:cursor-pointer drop-shadow-lg"
              :virtualScrollerOptions="{ itemSize: 38 }"
          />
          </div>
          <div v-else class="flex w-full justify-center text-red-500 font-semibold">*produk tidak ada</div>
          <accordion v-if="selectedProduct" class="mt-6" :activeIndex="-1">
              <AccordionTab header="Pengaturan Fuzzy">
                <div class="flex">
                  <!--       INPUT FUZZY RULES           -->
                  <div>
                    <FloatLabel class="mt-8">
                      <InputText
                          type="number"
                          :min="1"
                          :max="+sisaStokAverage - 1"
                          :invalid="!sisaStokLow"
                          v-tooltip.focus.top="'contoh : 80'"
                          id="sisaStokLow"
                          v-model="sisaStokLow"
                          class="md:w-64 lg:w-96"
                      />
                      <label for="sisaStokLow">Nilai sisa stok low</label>
                    </FloatLabel>

                    <FloatLabel class="mt-8">
                      <InputText
                          type="number"
                          :min="+sisaStokLow + 1"
                          :max="+sisaStokHigh - 1"
                          :invalid="!sisaStokAverage"
                          v-tooltip.focus.top="'contoh : 80'"
                          id="sisaStokAverage"
                          v-model="sisaStokAverage"
                          class="md:w-64 lg:w-96"
                      />
                      <label for="sisaStokAverage">Nilai sisa stok average</label>
                    </FloatLabel>

                    <FloatLabel class="mt-8">
                      <InputText
                          type="number"
                          :min="+sisaStokAverage + 1"
                          :max="2000"
                          :invalid="!sisaStokHigh"
                          v-tooltip.focus.top="'contoh : 80'"
                          id="sisaStokHigh"
                          v-model="sisaStokHigh"
                          class="md:w-64 lg:w-96"
                      />
                      <label for="sisaStokHigh">Nilai sisa stok high</label>
                    </FloatLabel>

                    <FloatLabel class="mt-8">
                      <InputText
                          type="number"
                          :min="1"
                          :max="+forecastAverage - 1"
                          :invalid="!forecastLow"
                          v-tooltip.focus.top="'contoh : 80'"
                          id="forecastLow"
                          v-model="forecastLow"
                          class="md:w-64 lg:w-96"
                      />
                      <label for="forecastLow">Nilai forecast low</label>
                    </FloatLabel>

                    <FloatLabel class="mt-8">
                      <InputText
                          type="number"
                          :min="+forecastLow + 1"
                          :max="+forecastHigh - 1"
                          :invalid="!forecastAverage"
                          v-tooltip.focus.top="'contoh : 80'"
                          id="forecastAverage"
                          v-model="forecastAverage"
                          class="md:w-64 lg:w-96"
                      />
                      <label for="forecastAverage">Nilai forecast average</label>
                    </FloatLabel>

                    <FloatLabel class="mt-8">
                      <InputText
                          type="number"
                          :min="+forecastAverage + 1"
                          :max="2000"
                          :invalid="!forecastHigh"
                          v-tooltip.focus.top="'contoh : 80'"
                          id="forecastHigh"
                          v-model="forecastHigh"
                          class="md:w-64 lg:w-96"
                      />
                      <label for="forecastHigh">Nilai forecast high</label>
                    </FloatLabel>

                    <FloatLabel class="mt-8">
                      <InputText
                          type="number"
                          :min="1"
                          :max="+hasilAverage - 1"
                          v-tooltip.focus.top="'contoh : 80'"
                          id="hasilLow"
                          v-model="hasilLow"
                          class="md:w-64 lg:w-96"
                      />
                      <label for="hasilLow">Nilai hasil low</label>
                    </FloatLabel>

                    <FloatLabel class="mt-8">
                      <InputText
                          type="number"
                          :min="+hasilLow + 1"
                          :max="+hasilHigh - 1"
                          :invalid="!hasilAverage"
                          v-tooltip.focus.top="'contoh : 80'"
                          id="hasilAverage"
                          v-model="hasilAverage"
                          class="md:w-64 lg:w-96"
                      />
                      <label for="hasilAverage">Nilai hasil average</label>
                    </FloatLabel>

                    <FloatLabel class="mt-8">
                      <InputText
                          type="number"
                          :min="+hasilAverage + 1"
                          :max="2000"
                          :invalid="!hasilHigh"
                          v-tooltip.focus.top="'contoh : 80'"
                          id="hasilHigh"
                          v-model="hasilHigh"
                          class="md:w-64 lg:w-96"
                      />
                      <label for="hasilHigh">Nilai hasil high</label>
                    </FloatLabel>
                  </div>
                  <!--       GRAPH FOR FUZZY MEMBER           -->
                  <div class="ml-6">
                    <p class="font-semibold mt-6">Sisa Stok Chart</p>
                    <Chart type="line" :data="stockChart" :options="stockChartOptions" class="h-48 w-96" />
                    <p class="font-semibold">Forecast Chart</p>
                    <Chart type="line" :data="forecastChart" :options="forecastChartOptions" class="h-48 w-96" />
                    <p class="font-semibold mt-6">Jumlah Beli Chart</p>
                    <Chart type="line" :data="sellCountChart" :options="sellCountChartOPtions" class="h-48 w-96" />
                  </div>
                </div>
              </AccordionTab>
          </accordion>
          <div
              v-if="selectedProduct && selectedMode"
              @click="getForecats()"
              class="main-container bg-purple-400 p-0 pt-1 pb-1 w-full mt-6 flex items-center justify-center shadow-md hover:cursor-pointer"
          >
            <p class="font-semibold mx-3 text-white">Forecast!</p>
          </div>
          <div
              v-else
              class="main-container bg-zinc-300 p-0 pt-1 pb-1 w-full mt-6 flex items-center justify-center shadow-md hover:cursor-pointer"
          >
            <p class="font-semibold mx-3 text-zinc-400">Forecast!</p>
          </div>
        </div>
      </div>
    </div>

    <Dialog
        v-model:visible="modal"
        modal
        header="Hasil Forecast"
        :style="{ width: '25rem' }"
    >
      <div class="flex flex-col">
        <template v-if="result">
          <div v-for="item in result">
            <div class="mt-3 text-lg">
              Nama Produk :
              <span class="font-semibold"> {{ item.nama }}</span>
            </div>
            <div class="mt-3 text-lg">
              prediksi permintaan stok :
              <span class="font-semibold"> {{ Math.ceil(stockForecasted) }}</span>
            </div>
            <div class="mt-3 text-lg">
              Jumlah beli :
              <span class="font-semibold">{{Math.ceil(sellCountForecasted)}}</span>
            </div>
          </div>
        </template>
      </div>
      <div class="w-full flex justify-between mt-6">
        <Button label="Lihat detail" @click="toDetail()" class="w-4/5 mr-1"/>
        <Button label="Kembali" @click="() => modal = false" class="w-4/5 ml-1" severity="secondary" outlined/>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Chart from 'primevue/chart';
import { useForecastStore } from '~/store/forecastStore'


const {getForecast, getProduct} = ForecastApi();

const forecast = ref();

onMounted(() => {
  init();
});

async function init() {
  forecast.value = await getForecast();
  forecastChart.value = setChartData(forecastLow.value, forecastAverage.value, forecastHigh.value);
  stockChart.value = setChartData(sisaStokLow.value, sisaStokAverage.value, sisaStokHigh.value);
  sellCountChart.value = setChartData(hasilLow.value, hasilAverage.value, hasilHigh.value);
  forecastChartOptions.value = setChartOptions();
  sellCountChartOPtions.value = setChartOptions();
  stockChartOptions.value = setChartOptions();
}

const selectedProduct = ref();
const products = ref([]);

const selectedMode = ref('monthly');
const modes = ref(['weekly', 'monthly']);

watch(selectedProduct, (newValue) => {
  result.value = null;
  stockForecasted.value = 0;
  sellCountForecasted.value = 0;
});

const sisaStokHigh = ref(1400);
const sisaStokLow = ref(100);
const sisaStokAverage = ref(300);
const forecastHigh = ref(700);
const forecastLow = ref(100);
const forecastAverage = ref(300);
const hasilHigh = ref(1000);
const hasilLow = ref(50);
const hasilAverage = ref(300);

watch(sisaStokHigh, (newValue) => {
  stockChart.value = setChartData(sisaStokLow.value, sisaStokAverage.value, newValue);
});

watch(sisaStokLow, (newValue) => {
  stockChart.value = setChartData(newValue, sisaStokAverage.value, sisaStokHigh.value);
});

watch(sisaStokAverage, (newValue) => {
  stockChart.value = setChartData(sisaStokLow.value, newValue, sisaStokHigh.value);
});

watch(forecastHigh, (newValue) => {
  forecastChart.value = setChartData(forecastLow.value, forecastAverage.value, newValue);
});

watch(forecastLow, (newValue) => {
  forecastChart.value = setChartData(newValue, forecastAverage.value, forecastHigh.value);
});

watch(forecastAverage, (newValue) => {
  forecastChart.value = setChartData(forecastLow.value, newValue, forecastHigh.value);
});

watch(hasilHigh, (newValue) => {
  sellCountChart.value = setChartData(hasilLow.value, hasilAverage.value, newValue);
});

watch(hasilLow, (newValue) => {
  sellCountChart.value = setChartData(newValue, hasilAverage.value, hasilHigh.value);
});

watch(hasilAverage, (newValue) => {
  sellCountChart.value = setChartData(hasilLow.value, newValue, hasilHigh.value);
});

const result = ref()
const stockForecasted = ref(0)
const sellCountForecasted = ref(0)

const minimalTreshold = ref(300);

async function getForecats() {
  result.value = await getForecast({
    name : selectedProduct.value?.name ?? "-",
    forecast_low : forecastLow.value ?? 100,
    forecast_high : forecastHigh.value ?? 700,
    forecast_average : forecastAverage.value ?? 300,
    sisa_stok_low : sisaStokLow.value ?? 100,
    sisa_stok_high : sisaStokHigh.value ?? 1400,
    sisa_stok_average : sisaStokAverage.value ?? 300,
    jumlah_beli_low : hasilLow.value ?? 50,
    jumlah_beli_high : hasilHigh.value ?? 1000,
    jumlah_beli_average : hasilAverage.value ?? 300,
    mode : selectedMode.value ?? 'monthly',
  })

  if (result.value?.length > 0){
    if (result.value[0].ses_metrics.rmse < result.value[0].ma_metrics.rmse && result.value[0].ses_metrics.rmse < result.value[0].holt_metrics.rmse) {
      stockForecasted.value = result.value[0].prediksi_ses
      sellCountForecasted.value = result.value[0].jumlah_beli_ses
    } else if (result.value[0].holt_metrics.rmse < result.value[0].ma_metrics.rmse && result.value[0].holt_metrics.rmse < result.value[0].ses_metrics.rmse) {
      stockForecasted.value = result.value[0].prediksi_holt
      sellCountForecasted.value = result.value[0].jumlah_beli_holt
    } else {
      stockForecasted.value = result.value[0].prediksi_ma
      sellCountForecasted.value = result.value[0].jumlah_beli_ma
    }
  }

  modal.value = true;
}

async function getProducts() {
  products.value = [];
  selectedProduct.value = null;

  const response = await getProduct({
    minimal : minimalTreshold.value,
  });

  if (response.produk) {
    products.value = [];
    for (let i = 0; i < response.produk.length; i++) {
      products.value.push({
        id: i + 1,
        name: response.produk[i],
      });
    }
  }
}

const setChartData = (low, average, high) => {
  low = parseInt(low);
  average = parseInt(average);
  high = parseInt(high);

  const documentStyle = getComputedStyle(document.documentElement);

  const labels = Array.from({ length: 22 }, (_, i) => (i * 100).toString());

  const generateLow = () => {
    return labels.map((x) => {
      const val = parseInt(x);
      if (val <= low) return 1 - val / low;
      return 0;
    });
  };

  const generateAverage = () => {
    const left = low / 2;
    const right = high + ((2000 - high) / 2);
    return labels.map((x) => {
      const val = parseInt(x);
      if (val <= left || val >= right) return 0;
      if (val === average) return 1;
      if (val < average) return (val - left) / (average - left);
      return (right - val) / (right - average);
    });
  };

  const generateHigh = () => {
    return labels.map((x) => {
      const val = parseInt(x);
      if (val <= average) return 0;
      if (val >= high) return 1;
      return (val - average) / (high - average);
    });
  };

  return {
    labels,
    datasets: [
      {
        label: 'Low',
        data: generateLow(),
        fill: false,
        borderColor: documentStyle.getPropertyValue('--cyan-500'),
        tension: 0.1
      },
      {
        label: 'Average',
        data: generateAverage(),
        fill: false,
        borderColor: documentStyle.getPropertyValue('--yellow-500'),
        tension: 0.1
      },
      {
        label: 'High',
        data: generateHigh(),
        fill: false,
        borderColor: documentStyle.getPropertyValue('--red-500'),
        tension: 0.1
      }
    ]
  };
};

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

const forecastChart = ref()
const stockChart = ref()
const sellCountChart = ref()

const forecastChartOptions = ref()
const sellCountChartOPtions = ref()
const stockChartOptions = ref()

const modal = ref(false)

const forecastStore = useForecastStore()

function toDetail(){
  forecastStore.setForecast({
    data : result.value,
    sellCountChart : sellCountChart.value,
    stockChart : stockChart.value,
    forecastChart : forecastChart.value,
    sellChartOptions : sellCountChartOPtions.value,
    stockChartOptions : stockChartOptions.value,
    forecastChartOptions : forecastChartOptions.value,
  });
  navigateTo('/forecasting/detail');
}

</script>