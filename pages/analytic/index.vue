<template>
    <div class="flex flex-col items-center justify-center w-full h-full space-y-8">
      <!-- Row for BarChart & DoughnutChart -->
      <div class="flex flex-wrap justify-between w-full">
        <BarChart :chartData="chartDataBar" class=" w-[58%] min-w-[20rem]" />
        <DoughnutChart :chartData="chartDataDoughnut" class="w-[40%] min-w-[20rem]" />
      </div>
  
      <!-- Line Chart in separate row -->
      <div class="w-full flex justify-center">
        <LineChart :chartData="chartDataLine" class="w-[100%] min-w-[30rem]" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import BarChart from "~/components/charts/BarChart.vue";
  import LineChart from "~/components/charts/LineChart.vue";
  import DoughnutChart from "~/components/charts/DoughnutChart.vue";
  
  const chartDataBar = ref({});
  const chartDataLine = ref({});
  const chartDataDoughnut = ref({});
  
  onMounted(() => {
    chartDataBar.value = {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      datasets: [
        {
          label: "Sales",
          data: [540, 325, 702, 620],
          backgroundColor: [
            "rgba(249, 115, 22, 0.2)",
            "rgba(6, 182, 212, 0.2)",
            "rgb(107, 114, 128, 0.2)",
            "rgba(139, 92, 246, 0.2)",
          ],
          borderColor: [
            "rgb(249, 115, 22)",
            "rgb(6, 182, 212)",
            "rgb(107, 114, 128)",
            "rgb(139, 92, 246)",
          ],
          borderWidth: 1,
        },
      ],
    };
  
    chartDataLine.value = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "First Dataset",
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.4,
        },
        {
          label: "Second Dataset",
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          borderColor: "rgb(153, 102, 255)",
          tension: 0.4,
        },
      ],
    };
  
    chartDataDoughnut.value = {
      labels: ['A', 'B', 'C'],
      datasets: [
        {
          data: [540, 325, 702],
          backgroundColor: ["#06b6d4", "#f97316", "#6b7280"],
          hoverBackgroundColor: ["#0891b2", "#ea580c", "#4b5563"]
        }
      ]
    };
  });
  </script>
  