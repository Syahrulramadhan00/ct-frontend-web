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
          :key="dateStartLine.selected"  
          :options="dateStartLine.options" 
          optionLabel="label" 
        />

        <Dropdown 
          class="w-[15%] flex justify-between px-2 items-center" 
          v-model="dateEndLine.selected" 
          :key="dateEndLine.selected" 
          :options="dateEndLine.options" 
          optionLabel="label" 
        />
      </div>
      <LineChart :chartData="chartDataLine" :options1="dateStartLine" :options2="dateEndLine" class="w-[100%] min-w-[30rem]" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
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

const updateEndDateOptions = (selectedValue) => {
  if (!selectedValue || !dateStartLine.value.options.length) {
    console.warn("updateEndDateOptions: Start date is not selected or options are empty.");
    return;
  }

  const selectedRaw = selectedValue.value || selectedValue; // Ensure raw value is extracted
  console.log("Updating end date options for start date:", selectedRaw);
  console.log("Available Start Date Options:", dateStartLine.value.options.map(opt => opt.value));

  // Find index of the selected start date
  const startIndex = dateStartLine.value.options.findIndex(
    (option) => option.value === selectedRaw
  );

  if (startIndex === -1) {
    console.warn(`❌ Selected start date "${selectedRaw}" NOT found in options!`);
    return;
  }

  console.log(`✅ Selected value "${selectedRaw}" is at index:`, startIndex);

  // Update end date options
  const updatedEndDateOptions = dateStartLine.value.options.slice(startIndex + 1);
  dateEndLine.value.options = updatedEndDateOptions;
  dateEndLine.value.selected = updatedEndDateOptions.length > 0 ? updatedEndDateOptions[0].value : null;

  console.log("✅ Updated End Date Options:", updatedEndDateOptions.map(opt => opt.value));
  console.log("✅ New Selected End Date:", dateEndLine.value.selected);
  console.log("✅ New Selected Start Date:", dateStartLine.value.selected);
};

onMounted(async () => {
  const revenueData = await getRevenueStream();
  const expensesData = await getExpenses();

  if (revenueData && expensesData) {
    chartDataLine.value = {
      labels: revenueData.labels,
      datasets: [
        { label: "Revenue", data: revenueData.datasets[0].data },
        { label: "Expenses", data: expensesData.datasets[0].data },
      ],
    };
  }

  const monthsData = await getDropdownData();
  console.log("Fetched Dropdown Data:", monthsData);

  if (monthsData.length) {
    dateStartLine.value.options = monthsData.map(item => ({ label: item.label, value: item.value }));
    dateStartLine.value.selected = dateStartLine.value.options[0]?.value || null;

    console.log("Initialized Start Date Options:", dateStartLine.value.selected);

    // Ensure end date options are set correctly
    updateEndDateOptions(dateStartLine.value.selected);
  }

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
  async (newStartDate) => {
    if (!newStartDate) {
      dateEndLine.value.selected = null;
      return;
    }

    console.log("New Start Date Selected:", newStartDate);

    await nextTick();

    if (!dateStartLine.value.options.length) {
      console.warn("updateEndDateOptions: Options are still empty, skipping update.");
      return;
    }

    updateEndDateOptions(newStartDate);
  },
  { immediate: true }
);
</script>
