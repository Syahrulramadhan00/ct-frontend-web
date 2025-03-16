<!-- src/components/BarChart.vue -->
<template>
  <div class="w-full h-full bg-blur-lg backdrop-filter backdrop-blur-xl bg-white/65 rounded-2xl p-2 shadow-lg">
    <div class="w-full h-full">
      <Chart class="w-full h-full" type="bar" :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import Chart from "primevue/chart";

const props = defineProps({
  chartData: Object,
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
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
      beginAtZero: true,
      ticks: {
        color: "#666",
      },
      grid: {
        color: "#ddd",
      },
    },
  },
};
</script>
