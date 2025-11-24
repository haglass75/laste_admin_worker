<template>
  <!-- 상단 헤더 -->

    <!-- class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between"> -->
    <div class="flex items-center gap-3 justify-between">
      <div
        class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
        기
      </div>
      <div>
        <p class="text-sm text-gray-500">안녕하세요, 기사님</p>
        <h1 class="text-lg font-semibold">오늘도 안전하고 깔끔하게!</h1>
        <div class="text-sm text-gray-500">{{ todayText }}</div>
      </div>
      <Weather />
    </div>

</template>

<script setup>
import Weather from "@/components/Weather.vue";
import { computed, ref } from "vue";

const todayText = new Date().toLocaleDateString("ko-KR", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});
</script>

<style scoped>
/* 추가 스타일이 필요하면 여기에 작성하세요 */
</style>
