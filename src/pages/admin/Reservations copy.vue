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
    <Admin_dash />

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
          <!-- 검색 조건 -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >구분</label
              >
              <select
                v-model="technicianSearchFilter.type"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500">
                <option value="all">전체</option>
                <option value="executive">임원</option>
                <option value="employee">사원</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >정산율</label
              >
              <select
                v-model="technicianSearchFilter.settlementRate"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500">
                <option value="all">전체</option>
                <option value="70">70%</option>
                <option value="75">75%</option>
                <option value="80">80%</option>
                <option value="85">85%</option>
                <option value="90">90%</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >활동지역</label
              >
              <select
                v-model="technicianSearchFilter.area"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500">
                <option value="all">전체</option>
                <option value="seoul">서울</option>
                <option value="gyeonggi">경기</option>
                <option value="incheon">인천</option>
                <option value="busan">부산</option>
              </select>
            </div>
          </div>

          <!-- 검색어 입력 -->
          <div class="mb-6">
            <div class="relative">
              <input
                v-model="technicianSearchFilter.keyword"
                @input="handleInput1"
                type="text"
                placeholder="기사명 또는 전화번호로 검색"
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
              <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
          </div>

          <!-- 기사 목록 테이블 -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    번호
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    기사명
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    구분
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    휴대전화
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    정산율
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    활동지역
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    선택
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="tech in paginatedTechnicians"
                  :key="tech.id"
                  class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ tech.id }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ tech.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ getTechnicianTypeText(tech.type) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ tech.phone }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ tech.settlementRate }}%
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ getAreaText(tech.area) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      @click="selectTechnician(tech)"
                      class="text-indigo-600 hover:text-indigo-900">
                      선택
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 페이지네이션 -->
          <div class="flex justify-between items-center mt-6">
            <div class="text-sm text-gray-700">
              총
              <span class="font-medium">{{ filteredTechnicians.length }}</span
              >명의 기사
            </div>
            <div class="flex gap-2">
              <button
                :disabled="currentTechnicianPage === 1"
                @click="goToTechnicianPage(currentTechnicianPage - 1)"
                class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <i class="fas fa-chevron-left"></i>
              </button>
              <button
                v-for="page in totalTechnicianPages"
                :key="page"
                @click="goToTechnicianPage(page)"
                :class="[
                  'px-3 py-1 border rounded',
                  currentTechnicianPage === page
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'border-gray-300 hover:bg-gray-50',
                ]">
                {{ page }}
              </button>
              <button
                :disabled="currentTechnicianPage === totalTechnicianPages"
                @click="goToTechnicianPage(currentTechnicianPage + 1)"
                class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import DashboardStats from "@/components/DashboardStats.vue";
import { resersData } from "@/data/resers.js";
import { ref, computed } from "vue";
import Admin_dash from "./admin_dash.vue";
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
const itemsPerPage = ref(5);

// 테이블 컬럼 정의
const reservationColumns = [
  {
    label: "예약번호",
    key: "id",
    render: (item) => `#${item.id}`,
  },
  {
    label: "고객명",
    key: "user",
    render: (item) =>
      `<span class="cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400">${item.user}</span>`,
  },
  { label: "연락처", key: "phone" },
  {
    label: "예약일시",
    key: "date",
    render: (item) => `${formatDate(item.date)} ${item.time}`,
  },
  {
    label: "희망일시",
    key: "preferredDate",
    render: (item) => `${formatDate(item.preferredDate)} ${item.preferredTime}`,
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
      const technicianBtn = `<button onclick="window.handleTechnicianSearch('${item.id}')" class="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 mr-3"><i class="fas fa-search mr-1"></i>기사 검색</button>`;
      const cancelBtn =
        item.status !== "cancelled"
          ? `<button onclick="window.handleReservationCancel('${item.id}')" class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"><i class="fas fa-ban mr-1"></i>취소</button>`
          : "";
      return detailBtn + technicianBtn + cancelBtn;
    },
  },
];

// 전역 함수 등록
window.handleReservationDetail = (id) => {
  const reservation = reservations.value.find((r) => r.id === parseInt(id));
  if (reservation) {
    showReservationDetails(reservation);
  }
};

window.handleReservationCancel = (id) => {
  const reservation = reservations.value.find((r) => r.id === parseInt(id));
  if (reservation) {
    comfirmCancel(reservation);
  }
};

window.handleTechnicianSearch = (id) => {
  const reservation = reservations.value.find((r) => r.id === parseInt(id));
  if (reservation) {
    showReservationDetails(reservation);
    openTechnicianSearchModal();
  }
};
// 예약목록

const reservations = ref([...resersData]);
// 기존 필터링 코드는 SearchTable 컴포넌트로 이동됨
// 날짜 수정
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
};
// 상태 글자 변환
const getStatusText = (status) => {
  const statusMap = {
    confirmed: "확정",
    pending: "대기",
    cancelled: "취소",
  };
  return statusMap[status] || status;
};
// 상태 클래스 적용
const getStatusClass = (status) => {
  const statusClasses = {
    confirmed:
      "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300",
    pending:
      "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300",
    cancelled: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300",
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
  // 기존에 배정된 기사가 있으면 검색 필드에 표시
  if (selectedReservation.value?.technician) {
    technicianSearch.value = selectedReservation.value.technician.name;
  } else {
    technicianSearch.value = "";
  }
  // 페이지를 1로 리셋
  currentTechnicianPage.value = 1;
  showTechnicianSearchModal.value = true;
};
// 기사 검색 모달 닫기
const closeTechnicianSearchModal = () => {
  showTechnicianSearchModal.value = false; //모달 숨기기;
};
// 기사 검색 관련 상태
const technicianSearchFilter = ref({
  type: "all",
  settlementRate: "all",
  area: "all",
  keyword: "",
});
// 기사 목록
const technicians = ref([
  {
    id: 1,
    name: "김기사",
    type: "executive",
    phone: "010-1111-2222",
    settlementRate: 80,
    area: "seoul",
  },
  {
    id: 2,
    name: "이기사",
    type: "employee",
    phone: "010-3333-4444",
    settlementRate: 75,
    area: "gyeonggi",
  },
  {
    id: 3,
    name: "박기사",
    type: "executive",
    phone: "010-5555-6666",
    settlementRate: 85,
    area: "incheon",
  },
  {
    id: 4,
    name: "최기사",
    type: "employee",
    phone: "010-7777-8888",
    settlementRate: 70,
    area: "busan",
  },
  {
    id: 5,
    name: "정기사",
    type: "executive",
    phone: "010-9999-0000",
    settlementRate: 90,
    area: "seoul",
  },
  {
    id: 6,
    name: "강기사",
    type: "employee",
    phone: "010-2222-3333",
    settlementRate: 75,
    area: "gyeonggi",
  },
  {
    id: 7,
    name: "조기사",
    type: "executive",
    phone: "010-4444-5555",
    settlementRate: 80,
    area: "incheon",
  },
  {
    id: 8,
    name: "윤기사",
    type: "employee",
    phone: "010-6666-7777",
    settlementRate: 85,
    area: "busan",
  },
  {
    id: 9,
    name: "장기사",
    type: "executive",
    phone: "010-8888-9999",
    settlementRate: 70,
    area: "seoul",
  },
  {
    id: 10,
    name: "임기사",
    type: "employee",
    phone: "010-0000-1111",
    settlementRate: 90,
    area: "gyeonggi",
  },
]);
// 기사 페이지 네이션 관련 상태
const currentTechnicianPage = ref(1);
const techniciansPerPage = ref(5);
const technicianSearch = ref("");
// 필터릴된 기사 목록
// computed로 필터링된 기사 리스크를 계산함
const filteredTechnicians = computed(() => {
  return technicians.value.filter((tech) => {
    // 타입이(type)dl "all" 이면 모두 포함 ,아니면 선택한 타입과 같은 기사만 포함
    const matchesType =
      technicianSearchFilter.value.type === "all" ||
      tech.type === technicianSearchFilter.value.type;
    //정산비율이(settlementRate) "all"이면 모두 포함, 아니면 선택한 비율과 같은 기사만 포함
    const matchesRate =
      technicianSearchFilter.value.settlementRate === "all" ||
      tech.settlementRate.toString() ===
        technicianSearchFilter.value.settlementRate;
    // 지역에 (area)"all"이면 모두 포삼, 아니면 선택한 지역과 같은 기사만 포함
    const matchesArea =
      technicianSearchFilter.value.area === "all" ||
      tech.area === technicianSearchFilter.value.area;
    // 키워드가 비어있으면 모두 포함 아니면 이름이나 전화번호에 키워드가 포함된 기사만 출력
    const matchesKeyword =
      !technicianSearchFilter.value.keyword || //키워드가 없으면 true
      tech.name.includes(technicianSearchFilter.value.keyword) || //이름에 키워드 포함
      tech.phone.includes(technicianSearchFilter.value.keyword); //전화번호에 키워드 포함
    //  위 4가지 조건을 모두 만족하는 기사만 필터링해서 반환

    return matchesType && matchesRate && matchesArea && matchesKeyword;
  });
});

// 기사페이지네이션
const totalTechnicianPages = computed(() => {
  return Math.ceil(filteredTechnicians.value.length / techniciansPerPage.value);
});
// 현재 페이지에 보여줄 기사 목록
const paginatedTechnicians = computed(() => {
  // 시작인덱스
  const start = (currentTechnicianPage.value - 1) * techniciansPerPage.value;

  // 끝 인덱스
  const end = start + techniciansPerPage.value;
  return filteredTechnicians.value.slice(start, end);
});
//
const goToTechnicianPage = (page) => {
  if (page >= 1 && page <= totalTechnicianPages.value) {
    currentTechnicianPage.value = page;
  }
};
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

// 기사검색 한글이슈
function handleInput1(event) {
  technicianSearchFilter.value.keyword = event.target.value;
}
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
