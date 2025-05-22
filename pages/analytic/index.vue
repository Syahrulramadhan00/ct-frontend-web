<template>
  <div class="mt-24 lg:mt-20 flex flex-col items-center justify-center w-full h-3/4 space-y-8">
    <div class="flex flex-col lg:flex-row justify-center w-full gap-8">
      <div class="w-full lg:w-[60%] min-w-[20rem]">
        <BarChart :chartData="chartDataBar" />
      </div>
      <div class="w-full lg:w-[40%] min-w-[15rem]">
        <DoughnutChart :chartData="chartDataDoughnut" />
      </div>
    </div>

    <div class="w-full flex flex-col space-y-5 justify-center">
      <div class="flex flex-row justify-end items-end w-full space-x-3">
        <Dropdown 
          class="w-[15%] flex justify-between px-2 items-center" 
          v-model="dateStartLine.selected"
          :options="dateStartLine.options" 
          optionLabel="label" 
        />

        <Dropdown 
          class="w-[15%] flex justify-between px-2 items-center" 
          v-model="dateEndLine.selected" 
          :options="dateEndLine.options" 
          optionLabel="label" 
        />
      </div>
      <LineChart :chartData="chartDataLine" class="w-[100%] min-w-[30rem]" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import BarChart from "~/components/charts/BarChart.vue";
import LineChart from "~/components/charts/LineChart.vue";
import DoughnutChart from "~/components/charts/DoughnutChart.vue";
import { AnalyticApi } from "~/composables/AnalyticApi";
import { DropdownApi } from "~/composables/DropdownApi";
import Dropdown from "primevue/dropdown";

const chartDataBar = ref({});
const chartDataLine = ref({});
const chartDataDoughnut = ref({});
const dateStartLine = ref({ options: [], selected: null });
const dateEndLine = ref({ options: [], selected: null });

const { getRevenueStream, getTopSpenders, getHighestSales, getExpenses } = AnalyticApi();
const { getDropdownData } = DropdownApi();

const fetchChartData = async () => {
  const startDate = dateStartLine.value.selected?.value || null;
  const endDate = dateEndLine.value.selected?.value || null;

  console.log("startDate:", startDate); // Debugging to check values
  console.log("endDate:", endDate);

  if (!startDate || !endDate) return;
  
  const revenueData = await getRevenueStream(startDate, endDate);
  const expensesData = await getExpenses(startDate, endDate);

  if (revenueData && expensesData) {
    chartDataLine.value = {
      labels: revenueData.labels,
      datasets: [
        { label: "Revenue", data: revenueData.datasets[0].data },
        { label: "Expenses", data: expensesData.datasets[0].data },
      ],
    };
  }
};

const updateEndDateOptions = (newStartDate) => {
  if (!newStartDate || !dateStartLine.value.options.length) return;
  
  const startIndex = dateStartLine.value.options.findIndex(opt => opt.value === newStartDate);
  if (startIndex === -1) return;
  
  dateEndLine.value.options = dateStartLine.value.options.slice(startIndex + 1);
  dateEndLine.value.selected = dateEndLine.value.options.length > 0 ? dateEndLine.value.options[0] : null;
};

onMounted(async () => {
  const monthsData = await getDropdownData();
  if (monthsData.length) {
    dateStartLine.value.options = monthsData.map(item => ({ label: item.label, value: item.value }));
    dateStartLine.value.selected = dateStartLine.value.options[0] || null;
    updateEndDateOptions(dateStartLine.value.selected?.value);
  }

  fetchChartData();

  const stockData = await getTopSpenders();
  if (stockData) {
    chartDataDoughnut.value = {
      labels: stockData.labels,
      datasets: stockData.datasets,
    };
  }

  const highestSalesData = await getHighestSales();
  if (highestSalesData) {
    chartDataBar.value = {
      labels: highestSalesData.labels,
      datasets: highestSalesData.datasets,
    };
  }
});

watch(
  () => dateStartLine.value.selected,
  (newStartDate) => {
    updateEndDateOptions(newStartDate?.value);
    fetchChartData();
  }
);

watch(
  () => dateEndLine.value.selected,
  () => {
    fetchChartData();
  }
);
</script>
