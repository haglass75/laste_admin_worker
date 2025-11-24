<script setup>

import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const links = [
  { name: "대시보드", path: "/admin/dashboard", icon: "fas fa-chart-line" },
  {
    name: "예약관리",
    path: "/admin/reservations",
    icon: "fas fa-calendar-check",
  },
  { name: "기사관리", path: "/admin/workers", icon: "fas fa-user-tie" },
  { name: "고객관리", path: "/admin/customers", icon: "fas fa-users" },
  { name: "문의관리", path: "/admin/inquiries", icon: "fas fa-inbox" },
  { name: "고객 소통", path: "/admin/customer-communication", icon: "fas fa-comments" },
  { name: "설정", path: "/admin/settings", icon: "fas fa-cog" },
];

// 현재 경로에 따른 활성화 상태 계산
const isActive = (path) => route.path === path;

const logout = () => {
  // 로그아웃 처리
  router.push("/admin");
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Font Awesome CDN 추가 -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
    <!-- 사이드바 -->
    <div class="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg">
      <div class="flex flex-col h-full">
        <!-- 로고 -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 class="text-xl font-bold text-gray-800 dark:text-white">관리자 대시보드</h1>
        </div>

        <!-- 네비게이션 메뉴 -->
        <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
          <router-link
            v-for="link in links"
            :key="link.path"
            :to="link.path"
            class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            :class="{
              'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300': isActive(link.path),
            }">
            <i :class="[link.icon, 'mr-3']"></i>
            {{ link.name }}
          </router-link>
        </nav>

        <!-- 로그아웃 버튼 -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="logout"
            class="w-full flex items-center justify-center px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <i class="fas fa-sign-out-alt mr-3"></i>
            로그아웃
          </button>
        </div>
      </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="ml-64 min-h-screen">
      <div class="p-8">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 기본 스타일 */
.min-h-screen {
  min-height: 100vh;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .fixed {
    position: relative;
    width: 100%;
    height: auto;
  }

  .ml-64 {
    margin-left: 0;
  }

  .w-64 {
    width: 100%;
  }

  .p-8 {
    padding: 1rem;
  }
}

/* 스크롤 스타일 */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f7fafc;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 3px;
}

/* 다크모드 스크롤 스타일 */
.dark .overflow-y-auto {
  scrollbar-color: #4b5563 #1f2937;
}

.dark .overflow-y-auto::-webkit-scrollbar-track {
  background: #1f2937;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #4b5563;
}

/* 전환 효과 */
.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* 호버 효과 */
.hover\:bg-gray-100:hover {
  background-color: #e7e7e9;
}

.dark .hover\:bg-gray-700:hover {
  background-color: #374151;
}

/* 활성화 상태 */
.bg-indigo-100 {
  background-color: #e0e7ff;
}

.dark .bg-indigo-900 {
  background-color: #312e81;
}

.text-indigo-700 {
  color: #4338ca;
}

.dark .text-indigo-300 {
  color: #a5b4fc;
}
</style>
