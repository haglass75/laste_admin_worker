<template>
  <SearchTable
    :data="filteredReservaions"
    :columns="reservationColumns"
    search-placeholder="고객명 또는 예약번호로 검색..."
    :search-fields="['customerName', 'id']"
    :filter-options="dashboardFilterOptions"
    :filter-fn="dashboardFilterFn"
    :items-per-page="itemsPerPage"
    table-title="예약 목록"
    total-label="개"
    @row-click="handleRowClick" />

  <!-- 예약 상세 모달 -->
  <div
    v-if="selectedReservation"
    class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      @click.stop>
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            예약 상세 정보
          </h3>
          <button
            @click="closeModal"
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
                  <span class="text-sm text-gray-900 dark:text-white">{{
                    selectedReservation.id
                  }}</span>
                </div>
                <div class="flex items-center">
                  <label
                    class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >고객명</label
                  >
                  <input
                    v-model="selectedReservation.customerName"
                    type="text"
                    class="ml-2 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div class="flex items-center">
                  <label
                    class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >청소유형</label
                  >
                  <select
                    v-model="selectedReservation.type"
                    class="ml-2 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="일반청소">일반청소</option>
                    <option value="입주청소">입주청소</option>
                    <option value="이사청소">이사청소</option>
                  </select>
                </div>
                <div class="flex items-center">
                  <label
                    class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >예약일시</label
                  >
                  <input
                    v-model="selectedReservation.date"
                    type="datetime-local"
                    class="ml-2 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <!-- datetime-local 란 예약일시를 선택할 수 있는 날짜와 시간을 선택할 수 있는 필드입니다. -->
              </div>
            </div>
          </div>

          <!-- 상태 정보 -->
          <div class="space-y-6">
            <div>
              <h4
                class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                상태 정보
              </h4>
              <div class="space-y-2">
                <div class="flex items-center">
                  <label
                    class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >상태</label
                  >
                  <select
                    v-model="selectedReservation.status"
                    class="ml-2 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="예약완료">예약완료</option>
                    <option value="진행중">진행중</option>
                    <option value="대기중">대기중</option>
                  </select>
                </div>
                <div class="flex items-center">
                  <label
                    class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >담당기사</label
                  >
                  <select
                    v-model="selectedReservation.worker"
                    class="ml-2 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="-">미배정</option>
                    <option value="이지은">이지은</option>
                    <option value="최윤호">최윤호</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h4
                class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                메모
              </h4>
              <textarea
                v-model="selectedReservation.memo"
                rows="3"
                class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="예약에 대한 메모를 입력하세요"></textarea>
            </div>
          </div>
        </div>
      </div>
      <div
        class="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3">
        <button
          @click="closeModal"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
          닫기
        </button>
        <button
          @click="saveReservaton"
          class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
          저장
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import SearchTable from "@/components/SearchTable.vue";
import { ref, computed } from "vue";
import { resersData } from "@/data/resers.js";

// 예약 정보
const reservations = ref([...resersData]);
const selectedReservation = ref(null);
// 날짜 범위 필터
const dateRange = ref({
  start: "", // 시작일
  end: "", // 종료일
});
// 날짜 문자열에서 YYYY-MM-DD 형식만 추출하는 함수
//  "YYYY-MM-DD" 형식입니다. 시간 문제를 피하기 위해 날짜 문자열만 비교하도록 변경합니다.
const extractDateOnly = (dateString) => {
  // "2025-11-17 10:00" 형식에서 "2025-11-17"만 추출
  // 또는 이미 "2025-11-17" 형식이면 그대로 반환
  if (!dateString) return "";
  return dateString.split(" ")[0].split("T")[0];
};

// 필터링된 예약 목록 계산
const filteredReservaions = computed(() => {
  let result = [...reservations.value]; // 예약목록을 복사


  return result;
});
// 페이지네이션 상태
const itemsPerPage = ref(5);

// 테이블 컬럼 정의
const reservationColumns = [
  { label: "예약번호", key: "id" },
  { label: "고객명", key: "customerName" },
  { label: "청소유형", key: "type" },
  {
    label: "예약일시",
    key: "date",

    render: (item) => formatDate(item.date),
  },
  {
    label: "상태",
    key: "status",
    render: (item) =>
      `<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
        item.status
      )}">${item.status}</span>`,
  },
  { label: "담당기사", key: "worker" },
  {
    label: "액션",
    key: "action",
    render: (item) =>
      `<button onclick="window.handleReservationClick('${item.id}')" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-3"><i class="fa-solid fa-eye mr-1"></i> 상세</button>`,
  },
];

// 필터 옵션
const dashboardFilterOptions = [
  {
    key: "serviceType",
    options: [
      { value: "all", label: "전체" },
      { value: "일반청소", label: "일반청소" },
      { value: "입주청소", label: "입주청소" },
      { value: "이사청소", label: "이사청소" },
    ],
  },
  {
    key: "receiptStatus",
    options: [
      { value: "all", label: "전체" },
      { value: "예약완료", label: "예약완료" },
      { value: "진행중", label: "진행중" },
      { value: "대기중", label: "대기중" },
    ],
  },
];

// 커스텀 필터 함수 (날짜 범위 포함)
const dashboardFilterFn = (data, filters) => {
  let result = [...data];

  // 날짜 범위 필터링
  if (dateRange.value.start && dateRange.value.end) {
    const startDateStr = extractDateOnly(dateRange.value.start);
    const endDateStr = extractDateOnly(dateRange.value.end);

    result = result.filter((reservation) => {
      const reservationDateStr = extractDateOnly(reservation.date);
      // 문자열 비교로 날짜 범위 확인 (종료일 포함)
      return (
        reservationDateStr >= startDateStr && reservationDateStr <= endDateStr
      );
    });
  }

  // 서비스 유형 필터링
  if (filters.serviceType && filters.serviceType !== "all") {
    result = result.filter(
      (reservation) => reservation.type === filters.serviceType
    );
  }

  // 접수 상태 필터링
  if (filters.receiptStatus && filters.receiptStatus !== "all") {
    result = result.filter(
      (reservation) => reservation.status === filters.receiptStatus
    );
  }

  return result;
};

// 행 클릭 핸들러
const handleRowClick = (item) => {
  showReservationDetails(item);
};

// 전역 함수로 등록 (컴포넌트 내부에서 사용)
window.handleReservationClick = (id) => {
  const reservation = reservations.value.find((r) => r.id === id);
  if (reservation) {
    showReservationDetails(reservation);
  }
};

// 날짜 포맷을 변경하는 함수
// 입력된 날짜 값을 'yyyy년 MM월 dd일 (요일)' 형식으로 변환
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric", // 년도
    month: "long", // 월 (한글 월 이름)
    day: "numeric", // 일
    weekday: "long", // 요일 (한글 요일 이름)
  });
};
// 상태 css
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

// 예약관리 상세 모달
const showReservationDetails = (reservation) => {
  selectedReservation.value = { ...reservation, memo: reservation.memo || "" };
};
// 예약상세 모달 닫기
const closeModal = () => {
  selectedReservation.value = null;
};
// 예약 정보 저장 함수
const saveReservaton = () => {
  // 입력값 유효성 검사
  if (
    !selectedReservation.value.customerName ||
    !selectedReservation.value.date
  ) {
    alert("고객명과 예약일시는 필수 입력 항목입니다.");
    return;
  }
  const index = reservations.value.findIndex(
    (r) => r.id === selectedReservation.value.id
  );
  if (index !== -1) {
    reservations.value[index] = { ...selectedReservation.value };
  }
  //   모달닫기
  closeModal();
};
</script>
