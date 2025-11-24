<template>
  <div
    class="space-y-6 bg-white text-black dark:bg-black dark:text-white p-4 rounded">
    <!-- Font Awesome CDN 추가 -->
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

    <h1 class="text-3xl font-bold text-gray-800 dark:text-white">
      관리자 대시보드
    </h1>

    <!-- 통계 카드 -->

    <DashboardStats :stats="stats" />
    <!-- 예약 현황 -->
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow text-gray-700 dark:text-gray-300">
      <!-- 검색 필터 -->
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          예약 현황
        </h2>
        <!-- space-y-4 -->
        <!-- 세로(y축)로 요소 사이에 1rem(=16px) 만큼 간격을 줍니다.
🧱 4. xl:space-y-0
xl: → 1200px 이상일 때만 적용 (Tailwind 기본은 1280px, 사용자 설정에 따라 1200px로 가능)
즉, 큰 화면에서는 space-y-0이 되어 세로 간격 제거
이유: 이제 가로 정렬로 바뀌니까 세로 간격은 필요 없음.
🧱 5. xl:flex-row
1200px 이상일 때는 가로(row) 방향으로 정렬
즉, 아래처럼 세로 → 가로로 바뀜
🧱 6. xl:items-center
가로 정렬 시 세로 가운데 정렬을 해줍니다.
즉, 높이가 다른 박스라도 세로 방향으로 중앙에 맞춰집니다.
🧱 7. xl:justify-between
가로로 나란히 배치된 요소들을 좌우로 일정하게 벌려서 정렬합니다.
→ 첫 번째 요소는 왼쪽 끝, 마지막 요소는 오른쪽 끝에 위치.
🧱 8. xl:space-x-4
가로(x축)로 요소 사이에 1rem(=16px) 만큼 간격을 줍니다.
세로 정렬 때는 space-y,
가로 정렬 때는 space-x를 쓰는 게 핵심입니다. -->
      </div>
      
      <Admin_dash />
    </div>

    <Worker_dash :show-stats="false" />
    <!-- 차트와 최근 예약 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 차트 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          예약 추이
        </h2>
        <div class="h-64">
          <Chart />
        </div>
      </div>

      <!-- 최근 예약 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          최근 예약
        </h2>
        <div class="space-y-4">
          <div
            v-for="reservation in recentReservations"
            :key="reservation.id"
            class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ reservation.customerName }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ reservation.date }}
              </p>
            </div>
            <span
              :class="getStatusClass(reservation.status)"
              class="px-2 py-1 text-xs font-semibold rounded-full">
              {{ reservation.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import Chart from "@/components/Chart.vue";
import DashboardStats from "@/components/DashboardStats.vue";
import { ref, computed } from "vue";
import Worker_dash from "@/pages/admin/Worker_dash.vue";
import Admin_dash from "@/pages/admin/admin_dash.vue";
// 통계카드 더미
const stats = [
  {
    title: "전체 예약",
    value: "120",
    change: "+12%",
    icon: "fas fa-calendar-check",
    // bgColor: "bg-blue-100 dark:bg-blue-900",
    // textColor: "text-blue-600 dark:text-blue-300",
    bg: "bg-blue-100",
    color: "text-blue-600",
  },
  {
    title: "전체 사용자",
    value: "50",
    change: "+5%",
    icon: "fas fa-users",
    // bgColor: "bg-green-100 dark:bg-green-900",
    // textColor: "text-green-600 dark:text-green-300",
    bg: "bg-green-100",
    color: "text-green-600",
  },
  {
    title: "평균 평점",
    value: "4.8",
    change: "+0.2",
    icon: "fas fa-star",
    // bgColor: "bg-yellow-100 dark:bg-yellow-900",
    // textColor: "text-yellow-600 dark:text-yellow-300",
    bg: "bg-yellow-100",
    color: "text-yellow-600",
  },
];

// 최근예약
const recentReservations = ref([
  { id: 1, customerName: "김철수", date: "2024-03-20", status: "확정" },
  { id: 2, customerName: "이영희", date: "2024-03-21", status: "대기" },
  { id: 3, customerName: "박민수", date: "2024-03-22", status: "취소" },
  { id: 4, customerName: "정지은", date: "2024-03-23", status: "확정" },
]);
const getStatusClass = (status) => {
  const statusClasses = {
    예약완료:
      "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300",
    진행중: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300",
    대기중: "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300",
    확정: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300",
    대기: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300",
    취소: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300",
    활동중: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300",
  };
  return (
    statusClasses[status] ||
    "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300"
  );
};
</script>
