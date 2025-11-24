<template>
  <div class="chart-container">
    <PolarArea :data="data" :options="options" />
  </div>
</template>

<script setup>
// Chart.js 필요한 도구들 가져오기
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
} from "chart.js";
import { PolarArea } from "vue-chartjs";

// Chart.js에 사용할 도구들 등록하기
ChartJS.register(ArcElement, Tooltip, Legend, RadialLinearScale);

// 차트 데이터
const data = {
  labels: ["Red", "Orange", "Yellow", "Green", "Blue"],
  datasets: [
    {
      label: "My First Dataset",
      data: [300, 50, 100, 200, 150],
      backgroundColor: [
        "rgb(255, 99, 132)",
        "rgb(255, 159, 64)",
        "rgb(255, 205, 86)",
        "rgb(75, 192, 192)",
        "rgb(54, 162, 235)",
      ],
      hoverOffset: 4,
    },
  ],
};

// 차트 옵션 설정
const options = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
}
</style>
