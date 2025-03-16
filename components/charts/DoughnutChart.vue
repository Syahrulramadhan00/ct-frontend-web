<template>
    <div class="bg-blur-lg backdrop-filter backdrop-blur-xl bg-white/65 rounded-2xl p-2 shadow-lg w-full h-full max-w-full max-h-full">
      <div class="card flex justify-center w-full h-full">
        <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full h-full" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import Chart from "primevue/chart";
  
  const props = defineProps({
    chartData: Object,
  });
  
  const chartOptions = ref(null);
  
  const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
  
    return {
    responsive: true,
      plugins: {
        legend: {
          labels: {
            cutout: '60%',
            color: textColor
          }
        }
      }
    };
  };
  
  onMounted(() => {
    chartOptions.value = setChartOptions();
  });
  </script>
  