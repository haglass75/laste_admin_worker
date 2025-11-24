<template>
  <div class="communication-page">
    <h2 class="text-3xl font-bold mb-6">고객 소통 관리</h2>

    <!-- 대시보드 통계 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div
        v-for="card in statCards"
        :key="card.id"
        :class="[card.backgroundClass, 'rounded-lg shadow-lg p-6 text-white']">
        <div class="flex items-center justify-between">
          <div>
            <p :class="[card.labelClass, 'text-sm mb-1']">{{ card.label }}</p>
            <p class="text-3xl font-bold">
              {{ card.value }}<span v-if="card.suffix">{{ card.suffix }}</span>
            </p>
          </div>
          <div
            class="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <i :class="[card.iconClass, 'text-2xl', card.iconColor]"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- 필터 및 검색 -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex flex-wrap gap-2 flex-1">
          <button
            v-for="filter in filters"
            :key="filter.value"
            @click="currentFilter = filter.value"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              currentFilter === filter.value
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
            ]">
            <!-- 현재 반복 중인 필터 객체를 콘솔로 확인 -->
            <!-- console.log("filter", filter) -->
            <i :class="[filter.icon, 'mr-2']"></i>
            {{ filter.label }}
          </button>
        </div>
        <div class="flex gap-2">
          <input
            v-model="searchQuery"
            @input="handleInput"
            type="text"
            placeholder="고객명으로 검색..."
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <!-- 현재 선택된 대화와 검색어 상태를 즉시 확인 -->
          <!-- console.log("selectedConversation", selectedConversation, "searchQuery", searchQuery) -->
        </div>
      </div>
    </div>

    <!-- 대화 목록 -->
    <div class="bg-white rounded-lg shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                대화 시작일
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                고객명
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                마지막 메시지
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                응답 시간
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                만족도
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                관리
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="conversation in filteredConversations"
              :key="conversation.id"
              class="hover:bg-gray-50 transition-colors">
              <!-- 필터링 결과가 의도대로인지 확인 -->
              <!-- console.log("filtered conversation row", conversation) -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(conversation.startDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    :class="[
                      'w-10 h-10 rounded-full flex items-center justify-center text-white font-bold',
                      getCustomerAvatarBg(conversation.customerName),
                    ]">
                    {{ conversation.customerName[0] }}
                  </div>
                  <span class="ml-3 text-sm text-gray-900">
                    {{ conversation.customerName }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                <div class="flex items-center">
                  <span>{{ conversation.lastMessage }}</span>
                  <span
                    v-if="conversation.unreadCount > 0"
                    class="ml-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {{ conversation.unreadCount }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    conversation.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : conversation.status === 'waiting'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800',
                  ]">
                  {{ getStatusText(conversation.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ conversation.responseTime }}분
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex">
                    <i
                      v-for="i in 5"
                      :key="i"
                      :class="[
                        'fas fa-star text-xs',
                        i <= conversation.rating
                          ? 'text-yellow-400'
                          : 'text-gray-300',
                      ]"></i>
                  </div>
                  <span
                    v-if="conversation.rating"
                    class="ml-2 text-xs text-gray-600">
                    ({{ conversation.rating }})
                  </span>
                  <span v-else class="ml-2 text-xs text-gray-400">미평가</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="openConversation(conversation)"
                  class="text-indigo-600 hover:text-indigo-900">
                  <i class="fas fa-comment-dots mr-1"></i>
                  대화 보기
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 빈 상태 -->
      <div v-if="filteredConversations.length === 0" class="text-center py-12">
        <i class="fas fa-comments text-6xl text-gray-300 mb-4"></i>
        <p class="text-gray-500 text-lg">대화 내역이 없습니다.</p>
      </div>
    </div>

    <!-- 대화 상세 모달 -->
    <div
      v-if="selectedConversation"
      class="fixed inset-0 bg-black bg-opacity-3 z-50 flex items-center justify-center p-4 dark:bg-black dark:text-white">
      <div
        class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col dark:bg-black dark:text-white">
        <div class="p-6 border-b flex justify-between items-center">
          <div class="flex items-center">
            <div
              :class="[
                'w-12 h-12 rounded-full flex items-center justify-center text-white font-bold',
                getCustomerAvatarBg(selectedConversation.customerName),
              ]">
              {{ selectedConversation.customerName[0] }}
            </div>
            <div class="ml-4">
              <h3 class="text-xl font-bold">
                {{ selectedConversation.customerName }}
              </h3>
              <p class="text-sm text-gray-500">
                {{ selectedConversation.email }}
              </p>
            </div>
          </div>
          <button
            @click="selectedConversation = null"
            class="text-gray-400 hover:text-gray-600 cursor-pointer">
            <i class="fas fa-times text-2xl"></i>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          <div
            v-for="message in conversationMessages"
            :key="message.id"
            :class="[
              'flex',
              message.sender === 'customer' ? 'justify-start' : 'justify-end',
            ]">
            <!-- 메시지 정렬 및 데이터 확인 -->
            <!-- console.log("message row", message) -->
            <div
              :class="[
                'max-w-lg',
                message.sender === 'customer'
                  ? 'bg-white'
                  : 'bg-indigo-600 text-white',
                'rounded-lg p-4 shadow-sm',
              ]">
              <div class="text-xs mb-1 opacity-70">
                {{
                  message.sender === "customer"
                    ? selectedConversation.customerName
                    : "관리자"
                }}
              </div>
              <div class="text-sm">{{ message.content }}</div>
              <div class="text-xs mt-2 opacity-70">
                {{ formatDateTime(message.timestamp) }}
              </div>
            </div>
          </div>
        </div>

        <div class="p-6 border-t bg-white">
          <div class="flex flex-col md:flex-row md:items-center gap-3">
            <input
              v-model="newMessage"
              type="text"
              placeholder="메시지를 입력하세요..."
              @keyup.enter="sendMessage"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <div class="flex flex-wrap gap-2">
              <button
                @click="openQuickResponseModal"
                class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <i class="fas fa-bolt mr-2"></i>
                빠른 답변
              </button>
              <button
                @click="sendMessage"
                class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                <i class="fas fa-paper-plane mr-2"></i>
                전송
              </button>
              <button
                @click="markConversationAsAnswered"
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <i class="fas fa-check-circle mr-2"></i>
                답변 완료
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 빠른 답변 모달 -->
    <div
      v-if="showQuickResponse"
      class="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
      <div class="bg-white rounded-lg max-w-2xl w-full">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-2xl font-bold">빠른 답변 템플릿</h3>
            <button
              @click="showQuickResponse = false"
              class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              v-for="template in quickTemplates"
              :key="template.id"
              @click="selectTemplate(template)"
              class="p-4 border border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-left">
              <h4 class="font-semibold mb-2">{{ template.title }}</h4>
              <p class="text-sm text-gray-600">{{ template.content }}</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const filters = [
  { label: "전체", value: "all", icon: "fas fa-list" },
  { label: "활성", value: "active", icon: "fas fa-comment-dots" },
  { label: "대기중", value: "waiting", icon: "fas fa-clock" },
  { label: "완료", value: "closed", icon: "fas fa-check-circle" },
];

const currentFilter = ref("all");
const searchQuery = ref("");
const selectedConversation = ref(null);
const showQuickResponse = ref(false);
const newMessage = ref("");
// const handleInput = () => {
//   console.log("handleInput", searchQuery.value);
// };
function handleInput(event) {
  // 입력창에 적은 글자를 localSearchQuery에 저장
  searchQuery.value = event.target.value;
  // 검색할 때는 첫 번째 페이지부터 다시 보기
  // currentPage.value = 1;
  console.log("handleInput: searchQuery", searchQuery.value);
}

// 샘플 데이터
const conversations = ref([
  {
    id: 1,
    customerName: "김철수",
    email: "kim@example.com",
    startDate: new Date("2025-11-10"),
    lastMessage: "감사합니다. 다음에도 이용하겠습니다!",
    status: "closed",
    responseTime: 15,
    rating: 5,
    unreadCount: 0,
  },
  {
    id: 2,
    customerName: "이영희",
    email: "lee@example.com",
    startDate: new Date("2025-11-09"),
    lastMessage: "청소 후 확인을 받아볼 수 있나요?",
    status: "active",
    responseTime: 8,
    rating: 4,
    unreadCount: 2,
  },
  {
    id: 3,
    customerName: "박민수",
    email: "park@example.com",
    startDate: new Date("2025-11-12"),
    lastMessage: "혹시 시간 변경이 가능한가요?",
    status: "waiting",
    responseTime: null,
    rating: null,
    unreadCount: 1,
  },
]);

// 샘플 메시지 데이터
const allMessages = ref([
  {
    id: 1,
    conversationId: 1,
    sender: "customer",
    content: "청소 잘 해주셔서 감사합니다!",
    timestamp: new Date("2025-11-11T10:30:00"),
  },
  {
    id: 2,
    conversationId: 1,
    sender: "admin",
    content: "감사합니다! 다음에도 이용해주세요.",
    timestamp: new Date("2025-11-10T10:45:00"),
  },
  {
    id: 3,
    conversationId: 2,
    sender: "customer",
    content: "청소는 언제 시작되나요?",
    timestamp: new Date("2025-11-11T09:00:00"),
  },
  {
    id: 4,
    conversationId: 2,
    sender: "admin",
    content: "예약하신 시간인 오후 2시에 시작됩니다.",
    timestamp: new Date("2025-11-10T09:15:00"),
  },
  {
    id: 5,
    conversationId: 2,
    sender: "customer",
    content: "청소 후 확인을 받아볼 수 있나요?",
    timestamp: new Date("2025-11-12T14:30:00"),
  },
  {
    id: 6,
    conversationId: 3,
    sender: "customer",
    content: "혹시 시간 변경이 가능한가요?",
    timestamp: new Date("2025-11-11T08:00:00"),
  },
]);

const messageIdCounter = ref(
  allMessages.value.length
    ? // Math.max(...allMessages.value.map((m) => m.id)) 자세히 설명하면,
      // allMessages.value 배열의 모든 요소의 id 값 중 가장 큰 값을 반환하는 함수이다.
      // max란 최대값을 반환하는 함수이다.
      // ...allMessages.value.map((m) => m.id) 는 allMessages.value 배열의 모든 요소의 id 값을 배열로 변환하는 함수이다.
      // map((m) => m.id) 는 allMessages.value 배열의 모든 요소의 id 값을 배열로 변환하는 함수이다.
      // id 는 allMessages.value 배열의 모든 요소의 id 값이다.
      // 즉, allMessages.value 배열의 모든 요소의 id 값 중 가장 큰 값을 반환하는 함수이다.
      // 하는이유는 새로운 메시지를 추가할 때 id 값을 증가시키기 위해서이다.
      // Math.max(...allMessages.value.map((m) => m.id)) + 1 는 allMessages.value 배열의 모든 요소의 id 값 중 가장 큰 값을 반환하는 함수에 1을 더하는 함수이다.
      // 1 은 새로운 메시지를 추가할 때 id 값을 증가시키기 위해서이다.
      // 즉, allMessages.value 배열의 모든 요소의 id 값 중 가장 큰 값을 반환하는 함수에 1을 더하는 함수이다.
      // 하는이유는 새로운 메시지를 추가할 때 id 값을 증가시키기 위해서이다.
      // Math.max(...allMessages.value.map((m) => m.id)) + 1 는 allMessages.value 배열의 모든 요소의 id 값 중 가장 큰 값을 반환하는 함수에 1을 더하는 함수이다.
      // 1 은 새로운 메시지를 추가할 때 id 값을 증가시키기 위해서이다.
      // 즉, allMessages.value 배열의 모든 요소의 id 값 중 가장 큰 값을 반환하는 함수에 1을 더하는 함수이다.
      // 하는이유는 새로운 메시지를 추가할 때 id 값을 증가시키기 위해서이다.
      Math.max(...allMessages.value.map((m) => m.id)) + 1
    : //  : 1란 새로운 메시지를 추가할 때 id 값을 증가시키기 위해서이다.`
      1
);

// 빠른 답변 템플릿
const quickTemplates = ref([
  {
    id: 1,
    title: "안녕하세요",
    content: "안녕하세요. 고객님의 문의에 답변드리겠습니다.",
  },
  {
    id: 2,
    title: "예약 확인",
    content: "예약이 정상적으로 접수되었습니다. 담당 기사가 연락드리겠습니다.",
  },
  {
    id: 3,
    title: "감사 인사",
    content:
      "이용해 주셔서 감사합니다. 만족스러운 서비스 제공을 위해 노력하겠습니다.",
  },
  {
    id: 4,
    title: "대기 요청",
    content: "잠시만 기다려 주세요. 담당자가 확인 중입니다.",
  },
]);

// 계산된 속성
const filteredConversations = computed(() => {
  let result = conversations.value;

  if (currentFilter.value !== "all") {
    result = result.filter((c) => c.status === currentFilter.value);
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    // includes 란 문자열에 특정 문자열이 포함되어 있는지 확인하는 메서드이다.
    // toLowerCase 란 문자열을 소문자로 변환하는 메서드이다.
    // customerName.toLowerCase().includes(query) 란 고객명을 소문자로 변환하고 특정 문자열이 포함되어 있는지 확인하는 것이다.
    result = result.filter((c) => c.customerName.toLowerCase().includes(query));
  }

  return result.sort((a, b) => b.startDate - a.startDate);
});
// sort 란 정렬하는 것이다.
// a.timestamp - b.timestamp 란 오름차순 정렬이다.
// b.timestamp - a.timestamp 란 내림차순 정렬이다.
// 오름차순 정렬은 작은 수부터 큰 수로 정렬하는 것이다.
// 내림차순 정렬은 큰 수부터 작은 수로 정렬하는 것이다.
// 오름차순 정렬은 작은 수부터 큰 수로 정렬하는 것이다.
const conversationMessages = computed(() => {
  console.log(
    "conversationMessages: selectedConversation",
    selectedConversation.value
  );
  if (!selectedConversation.value) return []; // 선택된 대화가 없으면 빈 배열 반환
  return allMessages.value
    .filter((m) => m.conversationId === selectedConversation.value.id)
    .sort((a, b) => a.timestamp - b.timestamp);
});

const totalConversations = computed(() => conversations.value.length);
const activeConversations = computed(
  () => conversations.value.filter((c) => c.status === "active").length
);
//avgResponseTime-평균 응답 시간 계산
const avgResponseTime = computed(() => {
  const times = conversations.value
    .map((c) => c.responseTime)
    .filter((t) => t !== null);
  if (times.length === 0) return 0;
  // round 란 소수점 자리수를 반올림하는 함수이다.
  // times.reduce((a, b) => a + b, 0) 는 배열의 모든 요소를 더하는 함수이다.
  // times.length 는 배열의 길이이다.
  // 0 은 초기값이다.
  // times.reduce((a, b) => a + b, 0) / times.length 는 배열의 모든 요소를 더한 값을 배열의 길이로 나누는 함수이다.
  // Math.round 는 소수점 자리수를 반올림하는 함수이다.
  return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
});
// satisfactionRate-만족도 계산
const satisfactionRate = computed(() => {
  const rated = conversations.value
    .map((c) => c.rating)
    .filter((r) => r !== null);
  if (rated.length === 0) return 0;
  // reduce() 는 배열의 모든 요소를 더하는 함수이다.
  // a, b 는 배열의 요소이다.
  // a + b 는 배열의 요소를 더하는 함수이다.
  // 0 은 초기값이다.
  // rated.length 는 배열의 길이이다.
  // 20 은 만족도를 계산하는 비율이다.
  return Math.round(
    (rated.reduce((a, b) => {
      console.log(a, b);
      return a + b;
    }, 0) /
      rated.length) *
      20
  );

  console.log(`satisfactionRate: ${satisfactionRate.value}`);
  console.log(`rated: ${rated}`);
  console.log(`rated.length: ${rated.length}`);
  console.log(
    `rated.reduce((a, b) => a + b, 0): ${rated.reduce((a, b) => a + b, 0)}`
  );
  console.log(
    `rated.reduce((a, b) => a + b, 0) / rated.length: ${
      rated.reduce((a, b) => a + b, 0) / rated.length
    }`
  );
  console.log(
    `(rated.reduce((a, b) => a + b, 0) / rated.length) * 20: ${
      (rated.reduce((a, b) => a + b, 0) / rated.length) * 20
    }`
  );
  console.log(
    `Math.round((rated.reduce((a, b) => a + b, 0) / rated.length) * 20): ${Math.round(
      (rated.reduce((a, b) => a + b, 0) / rated.length) * 20
    )}`
  );
});

const statCards = computed(() => [
  {
    id: "total",
    label: "전체 대화",
    value: totalConversations.value,
    suffix: "",
    labelClass: "text-blue-100",
    backgroundClass: "bg-gradient-to-br from-blue-500 to-blue-600",
    iconClass: "fas fa-comments",
    iconColor: "text-blue-500",
  },
  {
    id: "active",
    label: "활성 대화",
    value: activeConversations.value,
    suffix: "",
    labelClass: "text-green-100",
    backgroundClass: "bg-gradient-to-br from-green-500 to-green-600",
    iconClass: "fas fa-comment-dots",
    iconColor: "text-green-500",
  },
  {
    id: "avg-response",
    label: "평균 응답 시간",
    value: avgResponseTime.value,
    suffix: "m",
    labelClass: "text-yellow-100",
    backgroundClass: "bg-gradient-to-br from-yellow-500 to-yellow-600",
    iconClass: "fas fa-clock",
    iconColor: "text-yellow-600",
  },
  {
    id: "satisfaction",
    label: "만족도",
    value: satisfactionRate.value,
    suffix: "%",
    labelClass: "text-purple-100",
    backgroundClass: "bg-linear-to-br from-purple-500 to-purple-600",
    iconClass: "fas fa-star",
    iconColor: "text-purple-500",
  },
]);

// 메서드
function getStatusText(status) {
  console.log(`getStatusText: status`, status);
  const statusMap = {
    active: "진행중",
    waiting: "대기중",
    closed: "답변완료",
  };
  return statusMap[status] || status;
}

function getCustomerAvatarBg(name) {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
  ];
  // charCodeAt 란 문자열의 첫 번째 문자의 유니코드 값을 반환하는 메서드이다.
  // colors.length 란 배열의 길이를 반환하는 메서드이다.
  const index = name.charCodeAt(0) % colors.length;
  console.log(`getCustomerAvatarBg: index`, index);

  return colors[index];
}

function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function formatDateTime(date) {
  if (!date) return "";
  return new Date(date).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function openConversation(conversation) {
  selectedConversation.value = conversation;
  console.log(
    "openConversation: selectedConversation",
    selectedConversation.value
  );
  // 읽음 처리
  const idx = conversations.value.findIndex((c) => c.id === conversation.id);
  if (idx !== -1) {
    conversations.value[idx].unreadCount = 0;
    console.log(
      "openConversation: updated conversations",
      conversations.value[idx]
    );
  }
}

function sendMessage() {
  if (!newMessage.value.trim() || !selectedConversation.value) return;

  const message = {
    id: messageIdCounter.value++,
    conversationId: selectedConversation.value.id, // selectedConversation.value.id 는 선택된 대화의 id 값이다.
    sender: "admin", // sender 는 메시지 보낸이이다.
    content: newMessage.value,
    timestamp: new Date(), // timestamp 는 메시지 보낸 시간이다.
  };

  allMessages.value.push(message);
  // console.log("sendMessage: allMessages", allMessages.value);

  newMessage.value = "";
  // console.log("sendMessage: new admin message", message);

  // 대화 상태 업데이트
  const idx = conversations.value.findIndex(
    (c) => c.id === selectedConversation.value.id
  );
  if (idx !== -1) {
    if (conversations.value[idx].status === "waiting") {
      conversations.value[idx].status = "active";
    }
    conversations.value[idx].lastMessage = message.content;
    conversations.value[idx].lastMessageTime = message.timestamp;
    console.log(
      "sendMessage: updated conversation summary",
      conversations.value[idx]
    );
    const lastCustomerMsgTime = getLastCustomerMessageTime(
      selectedConversation.value.id
    );
    if (lastCustomerMsgTime) {
      const diffMinutes = Math.max(
        1,
        Math.round(
          (message.timestamp.getTime() -
            new Date(lastCustomerMsgTime).getTime()) /
            60000
        )
      );
      conversations.value[idx].responseTime = diffMinutes;
      console.log("sendMessage: calculated responseTime", diffMinutes);
    } else if (conversations.value[idx].responseTime === null) {
      conversations.value[idx].responseTime = 0;
      console.log("sendMessage: default responseTime set to 0");
    }
  }
}

function markConversationAsAnswered() {
  if (!selectedConversation.value) return;
  const idx = conversations.value.findIndex(
    (c) => c.id === selectedConversation.value.id
  );
  if (idx !== -1) {
    conversations.value[idx].status = "closed";
    conversations.value[idx].unreadCount = 0;
    unconfirmedConversations.value = unconfirmedConversations.value.filter(
      (c) => c.id !== selectedConversation.value.id
    );
    selectedConversation.value = null;
    newMessage.value = "";
    unconfirmedConversations.value = unconfirmedConversations.value.filter(
      (c) => c.id !== selectedConversation.value.id
    );
    console.log(
      "markConversationAsAnswered: conversation closed",
      conversations.value[idx]
    );
  }
  unconfirmedConversations.value = unconfirmedConversations.value.filter(
    (c) => c.id !== selectedConversation.value.id
  );
  console.log(
    "markConversationAsAnswered: unconfirmedConversations",
    unconfirmedConversations.value
  );
}
function openQuickResponseModal() {
  if (!selectedConversation.value) {
    window.alert("먼저 대화를 선택해 주세요.");
    return;
  }
  showQuickResponse.value = true;
  console.log(
    "openQuickResponseModal: showQuickResponse",
    showQuickResponse.value
  );
}

function selectTemplate(template) {
  if (selectedConversation.value) {
    newMessage.value = template.content;
    showQuickResponse.value = false;
    console.log("selectTemplate: applied template", template);
    // ?란 선택된 요소가 있으면 해당 요소를 선택하는 함수이다.
    // document.querySelector('input[v-model="newMessage"]') 는 newMessage 변수를 선택하는 함수이다.
    // v-model="newMessage" 는 newMessage 변수를 선택하는 함수이다.
    // newMessage 변수를 선택하는 함수이다.
    // newMessage 변수를 선택하는 함수이다.
    // ?.focus() 는 선택된 요소에 focus 속성을 추가하는 함수이다.
    // focus 속성은 선택된 요소에 포커스를 주는 속성이다.
    // focus 속성을 추가하는 함수이다.
    // focus 속성을 추가하는 함수이다.
    document.querySelector('input[v-model="newMessage"]')?.focus();
  }
}
// function getLastCustomerMessageTime(conversationId) {설명하면,
// conversationId 는 대화의 id 값이다.
// allMessages.value 는 모든 메시지 배열이다.
// filter((m) => m.conversationId === conversationId) 는 대화의 id 값과 일치하는 메시지를 필터링하는 함수이다.
// sort((a, b) => b.timestamp - a.timestamp) 는 메시지의 시간을 내림차순으로 정렬하는 함수이다.
// customerMessage 는 고객이 보낸 마지막 메시지이다.
// return customerMessage ? customerMessage.timestamp : null; 는 고객이 보낸 마지막 메시지가 있으면 해당 메시지의 시간을 반환하고, 없으면 null을 반환하는 함수이다.
// return customerMessage ? customerMessage.timestamp : null; 는 고객이 보낸 마지막 메시지가 있으면 해당 메시지의 시간을 반환하고, 없으면 null을 반환하는 함수이다. 
function getLastCustomerMessageTime(conversationId) {
  const messages = allMessages.value
    .filter((m) => m.conversationId === conversationId)
    .sort((a, b) => b.timestamp - a.timestamp);
  const customerMessage = messages.find((m) => m.sender === "customer");
  console.log(
    "getLastCustomerMessageTime: latest customer message",
    customerMessage
  );
  return customerMessage ? customerMessage.timestamp : null;
}
</script>

<style scoped>
.communication-page {
  max-width: 100%;
}

/* 스크롤바 스타일링 */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
