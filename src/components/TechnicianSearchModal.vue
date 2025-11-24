<template>
  <div
    v-if="show"
    class="modal fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50"
    @click.self="$emit('close')">
    <div
      class="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
      @click.stop>
      <div class="p-6 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">기사 검색</h3>
          <button
            class="text-gray-400 hover:text-gray-500"
            @click="$emit('close')">
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
              v-model="localFilter.type"
              @change="$emit('filter-change', localFilter)"
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
              v-model="localFilter.settlementRate"
              @change="$emit('filter-change', localFilter)"
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
              v-model="localFilter.area"
              @change="$emit('filter-change', localFilter)"
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
              v-model="localFilter.keyword"
              @input="handleKeywordInput"
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
                    @click="$emit('select', tech)"
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
              :disabled="currentPage === 1"
              @click="$emit('prev-page')"
              class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              <i class="fas fa-chevron-left"></i>
            </button>
            <button
              v-for="page in totalPages"
              :key="page"
              @click="$emit('go-to-page', page)"
              :class="[
                'px-3 py-1 border rounded',
                currentPage === page
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'border-gray-300 hover:bg-gray-50',
              ]">
              {{ page }}
            </button>
            <button
              :disabled="currentPage === totalPages"
              @click="$emit('next-page')"
              class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  technicians: {
    type: Array,
    default: () => [],
  },
  filter: {
    type: Object,
    default: () => ({
      type: "all",
      settlementRate: "all",
      area: "all",
      keyword: "",
    }),
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  itemsPerPage: {
    type: Number,
    default: 5,
  },
});

const emit = defineEmits([
  "close",
  "select",
  "filter-change",
  "prev-page",
  "next-page",
  "go-to-page",
]);

const localFilter = ref({ ...props.filter });

watch(
  () => props.filter,
  (newFilter) => {
    localFilter.value = { ...newFilter };
  },
  { deep: true }
);

const handleKeywordInput = (event) => {
  localFilter.value.keyword = event.target.value;
  emit("filter-change", localFilter.value);
};

const getTechnicianTypeText = (type) => {
  const typeMap = {
    executive: "임원",
    employee: "사원",
  };
  return typeMap[type] || type;
};

const getAreaText = (area) => {
  const areaMap = {
    seoul: "서울",
    gyeonggi: "경기",
    incheon: "인천",
    busan: "부산",
  };
  return areaMap[area] || area;
};

const filteredTechnicians = computed(() => {
  return props.technicians.filter((tech) => {
    const matchesType =
      localFilter.value.type === "all" || tech.type === localFilter.value.type;
    const matchesRate =
      localFilter.value.settlementRate === "all" ||
      tech.settlementRate.toString() === localFilter.value.settlementRate;
    const matchesArea =
      localFilter.value.area === "all" || tech.area === localFilter.value.area;
    const matchesKeyword =
      !localFilter.value.keyword ||
      tech.name.includes(localFilter.value.keyword) ||
      tech.phone.includes(localFilter.value.keyword);

    return matchesType && matchesRate && matchesArea && matchesKeyword;
  });
});

const totalPages = computed(() => {
  return Math.ceil(filteredTechnicians.value.length / props.itemsPerPage);
});

const paginatedTechnicians = computed(() => {
  const start = (props.currentPage - 1) * props.itemsPerPage;
  const end = start + props.itemsPerPage;
  return filteredTechnicians.value.slice(start, end);
});
</script>

