<template>
  <section class="w-full max-w-[480px] mx-auto dark:bg-gray-600">
    <!-- 필터: 상태별 보기 (큰 버튼, 가로 스크롤) -->
    <div class="px-4 pt-3">
      <div class="flex gap-2 overflow-auto">
        <button
          v-for="label in filterLabels"
          :key="label"
          @click="setFilter(label)"
          class="px-4 py-2 rounded-full text-sm border shadow-sm active:scale-[0.98] transition-colors"
          :class="buttonClass(label)"
          :aria-pressed="isActive(label)"
          type="button">
          {{ label }}
        </button>
      </div>
    </div>

    <!-- 작업 카드 리스트 -->
    <ul class="px-4 py-3 space-y-3" role="list">
      <li
        v-for="job in filteredJobs"
        :key="job.id"
        class="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 shadow-[0_1px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_8px_rgba(0,0,0,0.2)] cursor-pointer"
        tabindex="0"
        @click="goToWorkDetail(job)">
        <div class="flex items-start gap-3">
          <div
            class="w-11 h-11 rounded-xl flex items-center justify-center text-lg ring-1 ring-black/5"
            :class="
              job.type === 'store'
                ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                : 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
            "
            :aria-label="job.type === 'store' ? '매장' : '오피스'">
            🏪
          </div>
          <div class="flex-1">
            <p
              class="font-semibold text-base flex items-center justify-between text-gray-900 dark:text-white">
              <span
                >{{ job.storeName }}
                <span class="text-gray-400 dark:text-gray-500"
                  >· {{ job.time }}</span
                ></span
              >
              <span class="text-gray-300 dark:text-gray-600" aria-hidden
                >›</span
              >
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ job.address }}
            </p>
            <div class="mt-2 flex items-center gap-2">
              <span
                class="text-[11px] px-2 py-1 rounded-full font-medium"
                :class="statusBadge(job.status)"
                >{{ statusText(job.status) }}</span
              >
              <span
                v-if="job.memo"
                class="text-[11px] px-2 py-1 rounded-full bg-orange-100 text-orange-600"
                >📌 특이사항</span
              >
            </div>
            <!-- 선택/저장된 사진 썸네일 미리보기 -->
            <div
              v-if="job.photos && job.photos.length"
              class="mt-2 grid grid-cols-3 gap-1">
              <img
                v-for="(src, i) in job.photos"
                :key="i"
                :src="src"
                class="w-full h-12 object-cover rounded-md border"
                :alt="`저장된 사진 ${i + 1}`" />
            </div>
            <!-- 작업 시작 버튼 -->
            <div v-if="job.status !== 'done'" class="mt-2">
              <button
                type="button"
                class="text-xs px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 active:scale-[0.98]"
                @click="goToWorkDetail(job)">
                작업 시작
              </button>
            </div>
          </div>
        </div>
      </li>
    </ul>

    <!-- 비어있을 때 -->
    <div
      v-if="filteredJobs.length === 0"
      class="px-4 pb-4 text-center text-sm text-gray-500 dark:text-gray-400">
      할당된 청소 작업이 없습니다.
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { jobs } from "@/stores/jobsStore";

const router = useRouter();

// 1) 필터 라벨 (보기 쉽도록 상수)
const filterLabels = ["전체", "예약", "이동중", "작업중", "완료"];

// 3) 상태 맵 (글자 ↔ 코드)
const statusMap = {
  전체: "all",
  예약: "scheduled",
  이동중: "onroute",
  작업중: "working",
  완료: "done",
};

// 4) 현재 선택된 필터
const currentFilter = ref("전체");

// 5) 필터링된 목록
const filteredJobs = computed(() => {
  const key = statusMap[currentFilter.value];
  if (key === "all") return jobs.value;
  return jobs.value.filter((j) => j.status === key);
});

// 6) 퍼블리셔가 쓰기 쉬운 작고 단순한 함수
function setFilter(label) {
  // return사용안하는 이유: 값을 반환하지 않고, 변수에 값을 할당하기 위해서
  currentFilter.value = label;
}
function isActive(label) {
  return currentFilter.value === label;
}
function buttonClass(label) {
  return isActive(label)
    ? "bg-blue-600 dark:bg-blue-500 text-white border-blue-600 dark:border-blue-500"
    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600";
}

function statusText(status) {
  switch (status) {
    case "scheduled":
      return "예약";
    case "onroute":
      return "이동중";
    case "working":
      return "작업중";
    case "done":
      return "완료";
    default:
      return status;
  }
}
function statusBadge(status) {
  switch (status) {
    case "scheduled":
      return "bg-blue-50 text-blue-700";
    case "onroute":
      return "bg-yellow-50 text-yellow-700";
    case "working":
      return "bg-orange-50 text-orange-700";
    case "done":
      return "bg-green-50 text-green-700";
    default:
      return "bg-gray-50 text-gray-700";
  }
}

function goToWorkDetail(job) {
  // 작업 수행 페이지로 이동 (작업 ID를 쿼리 파라미터로 전달)
  router.push({
    name: "MobileDetail",
    query: { jobId: job.id },
  });
}
</script>

<style scoped>
/* .no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
@keyframes slideUp {
  from {
    transform: translateY(18px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.animate-slideUp {
  animation: slideUp 0.18s ease-out;
} */
</style>
