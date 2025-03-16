<template>
  <div class="flex flex-col w-full h-full">
      <div class="bg-blur-lg backdrop-filter backdrop-blur-xl bg-white/65 rounded-2xl p-2 shadow-lg w-full h-full">
        <div class="w-full h-full">
          <Chart type="line" :data="chartData" :options="chartOptions" class="h-[25rem] w-full" />
        </div>
      </div>
  </div>
  </template>
  
  <script setup>
  import { defineProps, ref, onMounted } from "vue";
  import Chart from "primevue/chart";


  const props = defineProps({
    chartData: Object, 
  });
  
  const chartOptions = ref();
  
  onMounted(() => {
    chartOptions.value = setChartOptions();
  });
  
  const setChartOptions = () => {
    return {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: "#333",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#666",
          },
          grid: {
            color: "#ddd",
          },
        },
        y: {
          ticks: {
            color: "#666",
          },
          grid: {
            color: "#ddd",
          },
        },
      },
    };
  };
  </script>
  