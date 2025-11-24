<template>
  <div
    class="p-4 rounded space-y-6 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
    <!-- 페이지 헤더 -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
          기사 관리
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          기사 정보를 관리하고 상태를 확인할 수 있습니다.
        </p>
      </div>
    </div>

    <!-- 기사 목록 (공통 컴포넌트 사용) -->
    <Worker_dash :workers="workers" />
  </div>
</template>
<script setup>

import Worker_dash from "@/pages/admin/Worker_dash.vue";


// 통계를 computed로 만들어서 workers가 변경될 때 자동으로 업데이트되도록 함
</script>
