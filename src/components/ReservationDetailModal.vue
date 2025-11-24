<template>
  <div
    v-if="reservation"
    class="modal fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50"
    @click.self="$emit('close')">
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      @click.stop>
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            예약 상세 정보
          </h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 기본 정보 -->
          <div class="space-y-6">
            <div>
              <h4
                class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                기본 정보
              </h4>
              <div class="space-y-2">
                <div class="flex items-center">
                  <label
                    class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >예약번호</label
                  >
                  <span class="text-sm text-gray-900 dark:text-white"
                    >#{{ reservation.id }}</span
                  >
                </div>
                <div class="flex items-center">
                  <label
                    class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >상태</label
                  >
                  <span
                    :class="[statusClass, 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full']">
                    {{ statusText }}
                  </span>
                </div>
                <div class="flex items-center">
                  <label
                    class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >카페명</label
                  >
                  <span class="text-sm text-gray-900 dark:text-white">{{
                    reservation.cafeName
                  }}</span>
                </div>
                <div class="flex items-center">
                  <label
                    class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >사업자등록번호</label
                  >
                  <span class="text-sm text-gray-900 dark:text-white">{{
                    reservation.businessNumber
                  }}</span>
                </div>
                <div class="flex items-center">
                  <label
                    class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >회원명</label
                  >
                  <span class="text-sm text-gray-900 dark:text-white">{{
                    reservation.user
                  }}</span>
                </div>
                <div class="flex items-center">
                  <label
                    class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >연락처</label
                  >
                  <span class="text-sm text-gray-900 dark:text-white">{{
                    reservation.phone
                  }}</span>
                </div>
                <div class="flex items-center">
                  <label
                    class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >이메일</label
                  >
                  <span class="text-sm text-gray-900 dark:text-white">{{
                    reservation.email
                  }}</span>
                </div>
              </div>
            </div>

            <!-- 제빙기 정보 -->
            <div>
              <h4
                class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                제빙기 정보
              </h4>
              <div class="space-y-2">
                <div class="flex items-center">
                  <label
                    class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >모델명</label
                  >
                  <span class="text-sm text-gray-900 dark:text-white">{{
                    reservation.modelName
                  }}</span>
                </div>
                <div class="flex items-center">
                  <label
                    class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >견적금액</label
                  >
                  <span class="text-sm text-gray-900 dark:text-white"
                    >{{ reservation.estimatedPrice }}원</span
                  >
                </div>
                <div class="space-y-2">
                  <label
                    class="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >제빙기 사진</label
                  >
                  <div class="grid grid-cols-3 gap-2">
                    <div
                      class="relative"
                      v-for="(photo, index) in reservation.photos"
                      :key="index">
                      <img
                        :src="photo"
                        class="w-full h-32 object-cover rounded-md" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 일정 및 기타 정보 -->
          <div class="space-y-6">
            <div>
              <h4
                class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                일정 정보
              </h4>
              <div class="space-y-2">
                <div class="flex items-center">
                  <label
                    class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >접수일시</label
                  >
                  <span class="text-sm text-gray-900 dark:text-white">{{
                    formatDate(reservation.createdAt)
                  }}</span>
                </div>
                <div class="flex items-center">
                  <label
                    class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >희망일시</label
                  >
                  <span class="text-sm text-gray-900 dark:text-white">{{
                    formatDate(reservation.preferredDateTime)
                  }}</span>
                </div>
              </div>
            </div>

            <!-- 담당 정보 -->
            <div>
              <h4
                class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                담당 정보
              </h4>
              <div class="space-y-2">
                <div class="flex items-center">
                  <label
                    class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >담당기사</label
                  >
                  <div class="flex-1 relative">
                    <input
                      type="text"
                      readonly
                      :value="technicianName"
                      @click="$emit('open-technician-search')"
                      placeholder="기사 검색"
                      class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    <i
                      class="fas fa-search absolute right-3 top-3 text-gray-400"></i>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4
                class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                추가 정보
              </h4>
              <div class="space-y-2">
                <div>
                  <label
                    class="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >요구사항</label
                  >
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ reservation.requirements }}
                  </p>
                </div>
                <div>
                  <label
                    class="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >특별 요청사항</label
                  >
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ reservation.specialRequests }}
                  </p>
                </div>
                <div>
                  <label
                    class="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >메모</label
                  >
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ reservation.memo }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
          닫기
        </button>
        <button
          @click="$emit('save')"
          class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
          기사 배정 저장
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  reservation: {
    type: Object,
    default: null,
  },
  technicianName: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["close", "save", "open-technician-search"]);

const statusText = computed(() => {
  const statusMap = {
    confirmed: "확정",
    pending: "대기",
    cancelled: "취소",
  };
  return statusMap[props.reservation?.status] || props.reservation?.status;
});

const statusClass = computed(() => {
  const statusClasses = {
    confirmed:
      "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300",
    pending:
      "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300",
    cancelled: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300",
  };
  return (
    statusClasses[props.reservation?.status] ||
    "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300"
  );
});

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
};
</script>

