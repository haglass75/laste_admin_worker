<template>
  <div
    class="space-y-6 text-gray-800 dark:bg-black dark:text-gray-200 p-4 rounded">
    <!-- 페이지 헤더 -->
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
          예약 관리
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          예약 정보를 관리하고 상태를 확인할 수 있습니다.
        </p>
      </div>
    </div>

    <!-- 통계 카드 -->
    <!-- 통계 카드 -->
    <DashboardStats :stats="stats" />
    <!-- <Admin_dash /> -->
    <SearchTable
      :data="reservations"
      :columns="reservationColumns"
      search-placeholder="고객명 또는 예약번호로 검색..."
      :search-fields="['customerName', 'user', 'id']"
      :filter-options="reservationFilterOptions"
      :filter-fn="reservationFilterFn"
      :items-per-page="itemsPerPage"
      table-title="예약 목록"
      total-label="건의 예약"
      @row-click="handleReservationRowClick" />

    <!-- 예약 상세 모달 -->
    <div
      v-if="selectedReservation"
      class="modal fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
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
                    <span class="text-sm text-gray-900 dark:text-white"
                      >#{{ selectedReservation.id }}</span
                    >
                  </div>
                  <div class="flex items-center">
                    <label
                      class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300"
                      >상태</label
                    >
                    <span
                      :class="getStatusClass(selectedReservation.status)"
                      class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                      {{ getStatusText(selectedReservation.status) }}
                    </span>
                  </div>
                  <div class="flex items-center">
                    <label
                      class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300"
                      >카페명</label
                    >
                    <span class="text-sm text-gray-900 dark:text-white">{{
                      selectedReservation.cafeName
                    }}</span>
                  </div>
                  <div class="flex items-center">
                    <label
                      class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300"
                      >사업자등록번호</label
                    >
                    <span class="text-sm text-gray-900 dark:text-white">{{
                      selectedReservation.businessNumber
                    }}</span>
                  </div>
                  <div class="flex items-center">
                    <label
                      class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300"
                      >회원명</label
                    >
                    <span class="text-sm text-gray-900 dark:text-white">{{
                      selectedReservation.user
                    }}</span>
                  </div>
                  <div class="flex items-center">
                    <label
                      class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300"
                      >연락처</label
                    >
                    <span class="text-sm text-gray-900 dark:text-white">{{
                      selectedReservation.phone
                    }}</span>
                  </div>
                  <div class="flex items-center">
                    <label
                      class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300"
                      >이메일</label
                    >
                    <span class="text-sm text-gray-900 dark:text-white">{{
                      selectedReservation.email
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
                      selectedReservation.modelName
                    }}</span>
                  </div>
                  <div class="flex items-center">
                    <label
                      class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300"
                      >견적금액</label
                    >
                    <span class="text-sm text-gray-900 dark:text-white"
                      >{{ selectedReservation.estimatedPrice }}원</span
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
                        v-for="(photo, index) in selectedReservation.photos"
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
                      formatDate(selectedReservation.createdAt)
                    }}</span>
                  </div>
                  <div class="flex items-center">
                    <label
                      class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300"
                      >희망일시</label
                    >
                    <span class="text-sm text-gray-900 dark:text-white">{{
                      formatDate(selectedReservation.preferredDateTime)
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
                        v-model="technicianSearch"
                        @click="openTechnicianSearchModal"
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
                      {{ selectedReservation.requirements }}
                    </p>
                  </div>
                  <div>
                    <label
                      class="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >특별 요청사항</label
                    >
                    <p class="mt-1 text-sm text-gray-900 dark:text-white">
                      {{ selectedReservation.specialRequests }}
                    </p>
                  </div>
                  <div>
                    <label
                      class="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >메모</label
                    >
                    <p class="mt-1 text-sm text-gray-900 dark:text-white">
                      {{ selectedReservation.memo }}
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
            @click="closeModal"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
            닫기
          </button>
          <button
            @click="saveTechnicianAssingnment"
            class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            기사 배정 저장
          </button>
        </div>
      </div>
    </div>

    <!-- 취소 확인 모달 -->
    <div
      v-if="showCancelModal"
      class="modal fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">예약 취소 확인</h3>
            <button
              @click="closeCancelModal"
              class="text-gray-400 hover:text-gray-500">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        <div class="p-6">
          <p class="text-sm text-gray-900">
            정말로 이 예약을 취소하시겠습니까?
          </p>
          <p class="text-sm text-gray-500 mt-1">
            취소된 예약은 복구할 수 없습니다.
          </p>
        </div>
        <div class="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
          <button
            @click="closeCancelModal"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            아니오
          </button>
          <button
            @click="cancelReservation"
            class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700">
            예, 취소합니다
          </button>
        </div>
      </div>
    </div>

    <!-- 기사 검색 모달 -->
    <div
      v-if="showTechnicianSearchModal"
      class="modal fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div
        class="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        @click.stop>
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">기사 검색</h3>
            <button
              class="text-gray-400 hover:text-gray-500"
              @click="closeTechnicianSearchModal">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        <div class="p-6 text-gray-700">
          <!-- 기사 목록 테이블 -->
          <SearchTable
            :data="technicians"
            :columns="technicianColumns"
            search-placeholder="기사명 또는 전화번호로 검색..."
            :search-fields="['name', 'phone']"
            :filter-options="technicianFilterOptions"
            :filter-fn="technicianFilterFn"
            :items-per-page="techniciansPerPage"
            table-title=""
            total-label="명의 기사"
            @row-click="handleTechnicianRowClick" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import DashboardStats from "@/components/DashboardStats.vue";
import SearchTable from "@/components/SearchTable.vue";
import { ref, computed, onMounted } from "vue";
import { resersData } from "@/data/resers.js";
import { workersData } from "@/data/workers.js";
// 통계 더미
const stats = [
  {
    title: "전체 예약",
    value: "24건",
    change: "+5건",
    icon: "fas fa-calendar-check",
    bg: "bg-blue-100 dark:bg-blue-900",
    color: "text-blue-600 dark:text-blue-300",
  },
  {
    title: "확정 예약",
    value: "18건",
    change: "+3건",
    icon: "fas fa-check-circle",
    bg: "bg-green-100 dark:bg-green-900",
    color: "text-green-600 dark:text-green-300",
  },
  {
    title: "대기 예약",
    value: "6건",
    change: "+2건",
    icon: "fas fa-clock",
    bg: "bg-yellow-100 dark:bg-yellow-900",
    color: "text-yellow-600 dark:text-yellow-300",
  },
];
// 기사 검색 관련 상태
const showTechnicianSearchModal = ref(false);
const selectedReservation = ref(null);
const showCancelModal = ref(false);

// 페이지네이션 상태
const itemsPerPage = ref(5);
const reservationColumns = [
  {
    label: "예약번호",
    key: "id",
    render: (item) => `${item.id}`,
  },
  {
    label: "고객명",
    key: "customerName",
    render: (item) =>
      `<span class="cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400">${
        item.customerName || item.user || ""
      }</span>`,
  },
  {
    label: "연락처",
    key: "phone",
    render: (item) => item.phone || "-",
  },
  {
    label: "예약일시",
    key: "date",
    render: (item) => {
      if (!item.date) return "-";
      const dateStr = formatDate(item.date);
      const timeStr = item.time || item.date.split(" ")[1] || "";
      return `${dateStr} ${timeStr}`;
    },
  },
  {
    label: "희망일시",
    key: "preferredDate",
    render: (item) => {
      if (!item.preferredDate) return "-";
      const dateStr = formatDate(item.preferredDate);
      const timeStr =
        item.preferredTime || item.preferredDate.split(" ")[1] || "";
      return `${dateStr} ${timeStr}`;
    },
  },
  {
    label: "상태",
    key: "status",
    render: (item) =>
      `<span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
        item.status
      )}">${getStatusText(item.status)}</span>`,
  },
  {
    label: "액션",
    key: "action",
    render: (item) => {
      const detailBtn = `<button onclick="window.handleReservationDetail('${item.id}')" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-3"><i class="fas fa-eye mr-1"></i>상세</button>`;
      const cancelBtn =
        item.status !== "cancelled" && item.status !== "취소"
          ? `<button onclick="window.handleReservationCancel('${item.id}')" class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"><i class="fas fa-ban mr-1"></i>취소</button>`
          : "";
      return detailBtn + cancelBtn;
    },
  },
];

// 예약목록
const reservations = ref([...resersData]);

// 기사 컬럼 정의
const technicianColumns = [
  {
    label: "번호",
    key: "id",
  },
  {
    label: "기사명",
    key: "name",
  },
  {
    label: "구분",
    key: "type",
    render: (item) => getTechnicianTypeText(item.type),
  },
  {
    label: "휴대전화",
    key: "phone",
  },
  {
    label: "정산율",
    key: "settlementRate",
    render: (item) => `${item.settlementRate}%`,
  },
  {
    label: "활동지역",
    key: "area",
    render: (item) => getAreaText(item.area) || item.area,
  },
  {
    label: "선택",
    key: "action",
    render: (item) =>
      `<button onclick="window.handleSelectTechnician('${item.id}')" class="text-indigo-600 hover:text-indigo-900">선택</button>`,
  },
];

// 기사 필터 옵션
const technicianFilterOptions = [
  {
    key: "type",
    options: [
      { value: "all", label: "전체" },
      { value: "executive", label: "임원" },
      { value: "employee", label: "사원" },
    ],
  },
  {
    key: "settlementRate",
    options: [
      { value: "all", label: "전체" },
      { value: "70", label: "70%" },
      { value: "75", label: "75%" },
      { value: "80", label: "80%" },
      { value: "85", label: "85%" },
      { value: "90", label: "90%" },
    ],
  },
  {
    key: "area",
    options: [
      { value: "all", label: "전체" },
      { value: "seoul", label: "서울" },
      { value: "gyeonggi", label: "경기" },
      { value: "incheon", label: "인천" },
      { value: "busan", label: "부산" },
    ],
  },
];

// 기사 필터 함수
const technicianFilterFn = (data, filters) => {
  let result = [...data];

  // 타입 필터링
  if (filters.type && filters.type !== "all") {
    result = result.filter((tech) => tech.type === filters.type);
  }

  // 정산율 필터링
  if (filters.settlementRate && filters.settlementRate !== "all") {
    result = result.filter(
      (tech) => tech.settlementRate.toString() === filters.settlementRate
    );
  }

  // 지역 필터링
  if (filters.area && filters.area !== "all") {
    result = result.filter((tech) => {
      if (!tech.area) return false;
      return (
        tech.area === filters.area ||
        tech.area.includes(filters.area) ||
        (filters.area === "seoul" && tech.area.includes("서울")) ||
        (filters.area === "gyeonggi" && tech.area.includes("경기")) ||
        (filters.area === "incheon" && tech.area.includes("인천")) ||
        (filters.area === "busan" && tech.area.includes("부산"))
      );
    });
  }

  return result;
};

// 필터 옵션
const reservationFilterOptions = [
  {
    key: "statusFilter",
    options: [
      { value: "all", label: "전체 상태" },
      { value: "예약완료", label: "예약완료" },
      { value: "진행중", label: "진행중" },
      { value: "대기중", label: "대기중" },
    ],
  },
  {
    key: "sortBy",
    options: [
      { value: "date-desc", label: "날짜순 (최신순)" },
      { value: "date-asc", label: "날짜순 (오래된순)" },
      { value: "name-asc", label: "이름순" },
    ],
  },
];

// 커스텀 필터 함수
const reservationFilterFn = (data, filters) => {
  let result = [...data];

  // 상태 필터링
  if (filters.statusFilter && filters.statusFilter !== "all") {
    result = result.filter((r) => r.status === filters.statusFilter);
  }

  // 정렬
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case "date-asc":
        result.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "date-desc":
        result.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "name-asc":
        result.sort((a, b) => {
          const nameA = a.customerName || a.user || "";
          const nameB = b.customerName || b.user || "";
          return nameA.localeCompare(nameB);
        });
        break;
    }
  }

  return result;
};

// 행 클릭 핸들러
const handleReservationRowClick = (item) => {
  showReservationDetails(item);
};

// 기사 행 클릭 핸들러
const handleTechnicianRowClick = (item) => {
  selectTechnician(item);
};

// 날짜 수정
const formatDate = (date) => {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  } catch (e) {
    return date;
  }
};
// 상태 글자 변환
const getStatusText = (status) => {
  // 상태가 이미 한글이면 그대로 반환
  return status || "";
};

// 상태 클래스 적용
const getStatusClass = (status) => {
  const statusClasses = {
    예약완료:
      "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300",
    진행중: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300",
    대기중:
      "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300",
    // 영어 상태도 지원 (호환성)
  };
  return (
    statusClasses[status] ||
    "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300"
  );
};

// 상세내용

const showReservationDetails = (reservation) => {
  selectedReservation.value = {
    ...reservation, //기존 예약 데이터를 모두 복사
    // 카페이름이 없으면 "카페명 미입력" 으로 설정
    // 카페 이름이 없으면 "카페명 미입력"으로 설정
    cafeName: reservation.cafeName || "카페명 미입력",

    // 사업자번호가 없으면 "사업자번호 미입력"으로 설정
    businessNumber: reservation.businessNumber || "사업자번호 미입력",

    // 모델명이 없으면 "모델명 미입력"으로 설정
    modelName: reservation.modelName || "모델명 미입력",

    // 예상 금액이 없으면 "0"으로 설정
    estimatedPrice: reservation.estimatedPrice || "0",
    // 생성일이 없으면 현재 날짜와 시간으로 설정 (ISO 포맷, 'yyyy-mm-ddThh:mm')
    createdAt: reservation.createdAt || new Date().toISOString().slice(0, 16),

    // 희망 시간도 없으면 현재 날짜와 시간으로 설정 (ISO 포맷, 'yyyy-mm-ddThh:mm')
    preferredDateTime:
      reservation.preferredDateTime || new Date().toISOString().slice(0, 16),

    // 사진이 없으면 기본 이미지 3개로 설정
    photos: reservation.photos || [
      "/images/ice_cream.jpg",
      "/images/ice_cream2.jpg",
      "/images/ice_cream3.png",
    ], // 요구사항이 없으면 "요구사항 없음"으로 설정
    requirements: reservation.requirements || "요구사항 없음",

    // 메모가 없으면 "메모 없음"으로 설정
    memo: reservation.memo || "메모 없음",

    // 지정된 기사가 없으면 null로 설정 (아직 배정되지 않은 상태)
    technician: reservation.technician || null,

    // 이메일이 없으면 "이메일 미입력"으로 설정
    email: reservation.email || "이메일 미입력",

    // 특별 요청사항이 없으면 "특별 요청사항 없음"으로 설정
    specialRequests: reservation.specialRequests || "특별 요청사항 없음",
  };
};
// 모달창 닫기 함수
const closeModal = () => {
  selectedReservation.value = null;
};
// 기사 검색 모달 열기
const openTechnicianSearchModal = () => {
  showTechnicianSearchModal.value = true;
};
// 기사 검색 모달 닫기
const closeTechnicianSearchModal = () => {
  showTechnicianSearchModal.value = false; //모달 숨기기;
};
// 기사 목록
const technicians = ref([...workersData]);
// 기사 페이지네이션 관련 상태
const techniciansPerPage = ref(5);
const technicianSearch = ref("");
// 기사 유형 텍스트 변환
const getTechnicianTypeText = (type) => {
  const typeMap = {
    executive: "임원",
    employee: "사원",
  };
  return typeMap[type] || type;
};
// 지역 텍스트 변환
const getAreaText = (area) => {
  if (!area) return "";
  // 이미 한글이 포함되어 있으면 그대로 반환
  // if (
  //   typeof area === "string" &&
  //   (area.includes("서울") ||
  //     area.includes("경기") ||
  //     area.includes("인천") ||
  //     area.includes("부산"))
  // ) {
  //   return area;
  // }
  const areaMap = {
    seoul: "서울",
    gyeonggi: "경기",
    incheon: "인천",
    busan: "부산",
  };
  return areaMap[area] || area;
};
// 기사 선택시 실행되는 함수

const selectTechnician = (technician) => {
  selectedReservation.value.technician = technician; //예약정보에 선택한 기사 저장
  technicianSearch.value = technician.name;
  closeTechnicianSearchModal();
};
//기사 배정 저장 클릭시
const saveTechnicianAssingnment = () => {
  if (!selectedReservation.value.technician) {
    alert("담당 기사를 선택해주세요.");
    return;
  }
  // 기사 배정 저장 로직
  const index = reservations.value.findIndex(
    (r) => r.id === selectedReservation.value.id
  );
  if (index !== -1) {
    reservations.value[index].technician = selectedReservation.value.technician;
    alert(
      `기사 배정이 완료되었습니다.\n배정된 기사:${selectedReservation.value.technician.name}\n예약번호:${selectedReservation.value.id}\n연락드리는 기사에게 예약번호를 알려주세요.
      
      `
    );
  }
  closeModal();
};

// 전역 함수 등록
window.handleSelectTechnician = (id) => {
  const technician = technicians.value.find(
    (t) => t.id === id || t.id === String(id)
  );
  if (technician) {
    selectTechnician(technician);
  }
};

// 전역 함수 등록
window.handleReservationDetail = (id) => {
  // id가 문자열일 수 있으므로 문자열로 비교
  const reservation = reservations.value.find(
    (r) => r.id === id || r.id === String(id)
  );
  if (reservation) {
    showReservationDetails(reservation);
  }
};

window.handleReservationCancel = (id) => {
  // id가 문자열일 수 있으므로 문자열로 비교
  const reservation = reservations.value.find(
    (r) => r.id === id || r.id === String(id)
  );
  if (reservation) {
    comfirmCancel(reservation);
  }
};

// 취소관련기능
const comfirmCancel = (reservation) => {
  // console.log(reservation);
  showCancelModal.value = true;
  reservationToCancel.value = reservation;
};
// 취소확인에서 닫기 버튼클릭시
const closeCancelModal = () => {
  showCancelModal.value = false;
  reservationToCancel.value = null;
};
const reservationToCancel = ref(null);
// 실제로 예약을 취소하는 기능
const cancelReservation = () => {
  if (reservationToCancel.value) {
    const index = reservations.value.findIndex(
      (r) => r.id === reservationToCancel.value.id
    );
    // console.log(index);
    console.log(reservations.value[index].status);
    // 해당 예약이 목록에 존재하면 (인덱스가 -1아니면)
    if (index !== -1) {
      reservations.value[index].status = "cancelled";
    }
    console.log(reservations.value[index].status);
  }
  closeCancelModal();
};
</script>
