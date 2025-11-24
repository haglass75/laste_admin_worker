<template>
  <section class="px-4 w-full max-w-[480px] mx-auto dark:bg-gray-600">
    <!-- 상단: 월 이동 -->
    <div class="flex items-center justify-between mb-3">
      <button
        @click="prevMonth"
        class="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 shrink-0 min-w-[60px] text-center">
        이전
      </button>
      <div
        class="text-base font-semibold text-gray-900 dark:text-white flex-1 text-center">
        {{ year }}년 {{ month + 1 }}월
      </div>
      <button
        @click="nextMonth"
        class="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 shrink-0 min-w-[60px] text-center">
        다음
      </button>
    </div>

    <!-- 요일 헤더 -->
    <div
      class="grid grid-cols-7 text-center text-xs text-gray-500 dark:text-gray-400 mb-1">
      <div>일</div>
      <div>월</div>
      <div>화</div>
      <div>수</div>
      <div>목</div>
      <div>금</div>
      <div>토</div>
    </div>

    <!-- 달력 그리드 -->
    <div class="grid grid-cols-7 gap-1">
      <div
        v-for="d in calendarDays"
        :key="d.key"
        @click="selectDate(d)"
        class="aspect-square rounded-xl flex flex-col items-center justify-center text-sm cursor-pointer select-none"
        :class="dayClass(d)">
        <span>{{ d.date.getDate() }}</span>
        <span
          v-if="countByDateKey[d.key]"
          class="mt-1 text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
          {{ countByDateKey[d.key] }}건
        </span>
        <!-- v-if="countByDateKey[d.key]"key 값이 있는 경우 출력한다. -->
        <!-- countByDateKey[d.key] 는 날짜별 일정 건수를 나타내는 것이다. -->
        <!-- d.key 는 날짜를 나타내는 것이다. -->
        <!-- key속성이 업는데 어디에서 가지고 온거야? calendarDays 에서 가지고 온거야. -->
        <!-- countByDateKey[d.key] 는 날짜별 일정 건수를 나타내는 것이다. -->
      </div>
    </div>

    <!-- 선택 날짜 일정 리스트 -->
    <div class="mt-4">
      <div class="flex items-center justify-between mb-2">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ selectedDateLabel }} 일정
        </p>
        <select
          v-model="statusFilter"
          class="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
          <option value="all">전체</option>
          <option value="scheduled">예약</option>
          <option value="onroute">이동중</option>
          <option value="working">작업중</option>
          <option value="done">완료</option>
        </select>
      </div>

      <div
        v-if="filteredJobsOfSelected.length === 0"
        class="text-center text-gray-500 dark:text-gray-400 text-sm py-6">
        일정이 없습니다.
      </div>

      <ul class="space-y-2">
        <li
          v-for="job in filteredJobsOfSelected"
          :key="job.id"
          class="rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800">
          <div class="flex items-start gap-3">
            <div
              class="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold"
              :class="
                job.type === 'luggage'
                  ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                  : 'bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300'
              ">
              {{ job.type === "luggage" ? "수" : "제" }}
            </div>
            <div class="flex-1 min-w-0">
              <p
                class="text-sm font-semibold truncate text-gray-900 dark:text-white">
                {{ job.customerName }} ·
                <span class="text-gray-400 dark:text-gray-500">{{
                  job.time
                }}</span>
              </p>
              <p class="text-xs text-gray-600 dark:text-gray-400 truncate">
                {{ job.address }}
              </p>
              <div class="mt-2 flex items-center gap-1.5">
                <span
                  class="text-[10px] px-1.5 py-0.5 rounded-full"
                  :class="statusBadgeClass(job.status)"
                  >{{ statusText(job.status) }}</span
                >
                <!-- <span
                  v-if="job.memo"
                  class="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600"
                  >메모</span
                > -->
                <span class="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600" v-if="job.meno"
                >메모: {{ job.memo }}</span
              >
              </div>
            </div>
          </div>
          <div class="mt-3 grid grid-cols-3 gap-2 text-xs">
            <a
              :href="`tel:${job.phone}`"
              class="py-2 rounded-lg bg-blue-600 text-white text-center"
              >전화</a
            >
            <a
              :href="mapLink(job.address)"
              target="_blank"
              class="py-2 rounded-lg bg-gray-100 text-gray-700 text-center"
              >길찾기</a
            >
            <button
              @click="advance(job)"
              class="py-2 rounded-lg bg-yellow-500 text-white">
              상태변경
            </button>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import jobsData from "@/data/jobs.json";

// 일정 데이터 (JSON 파일에서 import)
const jobs = ref(jobsData);

const today = new Date();
// (today.getFullYear(), today.getMonth(), 1)) 설명: 오늘 날짜의 연도, 월, 1일을 나타내는 날짜 객체를 생성한다.
const viewDate = ref(new Date(today.getFullYear(), today.getMonth(), 1));
const selectedDate = ref(new Date(today));
const statusFilter = ref("all");

const year = computed(() => viewDate.value.getFullYear());
const month = computed(() => viewDate.value.getMonth());

function fmtKey(d) {
  const y = d.getFullYear();
  // padStart 란 문자열의 시작부분을 채우는 메서드이다.
  // 예를 들어, "1".padStart(2, "0") 은 "01"을 반환한다.
  // 예를 들어, "12".padStart(2, "0") 은 "12"을 반환한다.
  // 예를 들어, "123".padStart(2, "0") 은 "123"을 반환한다.
  // 예를 들어, "1234".padStart(2, "0") 은 "1234"을 반환한다.
  // 예를 들어, "12345".padStart(2, "0") 은 "12345"을 반환한다.
  // 예를 들어, "123456".padStart(2, "0") 은 "123456"을 반환한다.
  // 예를 들어, "1234567".padStart(2, "0") 은 "1234567"을 반환한다.
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const countByDateKey = computed(() => {
  const acc = {};
  for (const j of jobs.value) {
    acc[j.date] = (acc[j.date] || 0) + 1;
  }
  return acc;
});

const calendarDays = computed(() => {
  const start = new Date(year.value, month.value, 1);
  const end = new Date(year.value, month.value + 1, 0);
  const startWeekday = start.getDay();
  const days = [];
  // 이전 달 채우기
  for (let i = 0; i < startWeekday; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() - (startWeekday - i));
    days.push({ date: d, key: fmtKey(d), outside: true });
  }
  // 이번 달
  for (let d = 1; d <= end.getDate(); d++) {
    const cur = new Date(year.value, month.value, d);
    days.push({ date: cur, key: fmtKey(cur), outside: false });
  }
  // 다음 달 채우기 (42칸)
  while (days.length < 42) {
    const last = days[days.length - 1].date;
    const next = new Date(last);
    next.setDate(next.getDate() + 1);
    days.push({ date: next, key: fmtKey(next), outside: true });
  }
  return days;
});

function dayClass(d) {
  const isToday = fmtKey(d.date) === fmtKey(today);
  const isSelected = fmtKey(d.date) === fmtKey(selectedDate.value);
  return [
    // outside 는 이전 달 또는 다음 달의 날짜를 나타내는 것이다.
    d.outside
      ? "text-gray-400 dark:text-gray-600"
      : "text-gray-900 dark:text-gray-100",
    // isToday 는 오늘 날짜를 나타내는 것이다.
    isToday ? "ring-1 ring-blue-500 dark:ring-blue-400" : "",
    isSelected
      ? "bg-blue-600 dark:bg-blue-500 text-white"
      : "bg-white dark:bg-gray-800",
  ];
}

function selectDate(d) {
  selectedDate.value = new Date(d.date);
}
function prevMonth() {
  viewDate.value = new Date(year.value, month.value - 1, 1);
}
function nextMonth() {
  viewDate.value = new Date(year.value, month.value + 1, 1);
}

const selectedDateLabel = computed(() => {
  const d = selectedDate.value;
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
});

const jobsOfSelected = computed(() => {
  const key = fmtKey(selectedDate.value);
  return jobs.value.filter((j) => j.date === key);
});

const filteredJobsOfSelected = computed(() => {
  if (statusFilter.value === "all") return jobsOfSelected.value;
  return jobsOfSelected.value.filter((j) => j.status === statusFilter.value);
});

function mapLink(address) {
  // encodeURIComponent 란 문자열을 URL 인코딩하는 메서드이다.
  const q = encodeURIComponent(address);
  return `https://map.kakao.com/?q=${q}`;
}
function advance(job) {
  const order = ["scheduled", "onroute", "working", "done"];
  const idx = order.indexOf(job.status);
  console.log(`advance: idx`, idx);
  
  // indexOf 란 배열에서 주어진 값을 찾아서 인덱스를 반환하는 메서드이다.
  // 예를 들어, ["scheduled", "onroute", "working", "done"].indexOf("onroute") 은 1을 반환한다.
  // 예를 들어, ["scheduled", "onroute", "working", "done"].indexOf("working") 은 2를 반환한다.
  // 예를 들어, ["scheduled", "onroute", "working", "done"].indexOf("done") 은 3을 반환한다.
  // 예를 들어, ["scheduled", "onroute", "working", "done"].indexOf("scheduled") 은 0을 반환한다.
  // 예를 들어, ["scheduled", "onroute", "working", "done"].indexOf("scheduled") 은 0을 반환한다.
  job.status = order[(idx + 1) % order.length];
  console.log(`advance: job.status`, job.status);
  // 상태 변경 후 저장 코드 자세히 설명 주석으로
  // job.status = order[(idx + 1) % order.length];
  // 상태 변경 후 저장 코드 자세히 설명 주석으로
  // job.status = order[(idx + 1) % order.length];
  console.log(`advance: job`, job);
  // 간단한 코드
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
function statusBadgeClass(status) {
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
</script>

<style scoped></style>
