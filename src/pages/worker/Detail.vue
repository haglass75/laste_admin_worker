<template>
  <section class="">
    <!-- 로딩 중 -->
    <div v-if="!job" class="p-4 text-center text-gray-500">
      작업 정보를 불러오는 중...
    </div>

    <!-- 작업 정보 요약 카드 -->
    <!-- <div class="bg-[linear-gradient(to right, #a78bfa, #ec4899, #60a5fa, #22d3ee)] h-40 w-full"></div> -->
    <div
      v-else
      class="bg-linear-to-t from-purple-600 via-pink-400 to-blue-500 p-5 text-white shadow-lg">
      <div class="flex items-start justify-between mb-4">
        <div>
          <p class="text-sm opacity-90 mb-1">청소 작업</p>
          <p class="text-2xl font-bold">{{ job.storeName }}</p>
        </div>
        <div
          class="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-2xl">
          🧹
        </div>
      </div>
      <div class="bg-white/20 rounded-lg p-3 text-sm">
        <p class="font-medium mb-1">📍 {{ job.address }}</p>
        <p class="text-xs opacity-90">🕐 {{ job.time }}</p>
      </div>
    </div>

    <!-- 작업 정보 상세 -->
    <!-- v-if="job" 쓰는 이유: job 객체가 존재하는 경우에만 작업 정보 상세를 표시한다. -->
    <div v-if="job" class="bg-white border border-gray-200 p-4 space-y-3">
      <p class="font-semibold mb-3">📋 작업 정보</p>

      <div class="grid grid-cols-2 gap-2 text-sm">
        <div class="bg-blue-50 rounded-lg p-3">
          <p class="text-gray-500 text-xs mb-1">매장 유형</p>
          <p class="font-semibold text-blue-700">
            {{ job.type === "store" ? "매장" : "오피스" }}
          </p>
        </div>
        <div class="bg-green-50 rounded-lg p-3">
          <p class="text-gray-500 text-xs mb-1">청소 금액</p>
          <p class="font-semibold text-green-700">₩{{ job.price.toLocaleString() }}</p>
        </div>
      </div>

      <div
        v-if="job.memo"
        class="bg-orange-50 border border-orange-200 rounded-lg p-3">
        <p class="text-orange-600 text-xs mb-1">📌 특이사항</p>
        <p class="text-sm font-medium text-gray-900">{{ job.memo }}</p>
      </div>
    </div>

    <!-- 길찾기 및 상태 변경 버튼 -->
    <div
      v-if="job && job.status !== 'done'"
      class="bg-white border border-gray-200 p-4">
      <div class="grid grid-cols-2 gap-3">
        <a
          :href="mapLink(job.address)"
          target="_blank"
          class="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white font-medium shadow active:scale-[0.98] transition-transform">
          <span>🗺️</span>
          <span class="text-white">길찾기</span>
        </a>
        <button
          @click="changeJobStatus"
          class="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-50 text-blue-700 font-medium border border-blue-200 active:scale-[0.98] transition-transform">
          <span>↻</span>
          <span>{{ getNextStatusText(job.status) }}</span>
        </button>
      </div>
    </div>

    <!-- 청소 사진 업로드 -->
    <div v-if="job" class="bg-white border border-gray-200 p-4">
      <div class="flex items-center justify-between mb-3">
        <p class="font-semibold">📷 청소 완료 사진</p>
        <span class="text-xs text-gray-500">{{ photos.length }}장</span>
      </div>

      <!-- 사진 그리드 -->
      <div class="grid grid-cols-3 gap-2 mb-3">
        <div
          v-for="(photo, index) in photos"
          :key="index"
          class="aspect-square rounded-lg overflow-hidden border-2 border-blue-200 relative">
          <img
            :src="photo"
            class="w-full h-full object-cover"
            alt="청소 사진" />
          <button
            @click="removePhoto(index)"
            class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
            ✕
          </button>
        </div>
        <label
          v-if="photos.length < 9"
          class="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 active:scale-[0.98] transition-transform">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            @change="onFilesSelected"
            class="hidden" />
          <div class="text-center">
            <span class="text-2xl block mb-1">📸</span>
            <span class="text-xs text-gray-500">추가</span>
          </div>
        </label>
      </div>

      <p class="text-xs text-gray-500">
        작업 완료 후 사진을 촬영해주세요 (최대 9장)
      </p>
    </div>

    <!-- 고객 서명 -->
    <div v-if="job" class="bg-white border border-gray-200 p-4">
      <div class="flex items-center justify-between mb-3">
        <p class="font-semibold">✍️ 고객 확인 서명</p>
        <button
          v-if="signature"
          @click="clearSignature"
          class="text-xs text-red-600">
          삭제
        </button>
      </div>
      <!-- <canvas> 태그
그림판이야!사용자가 마우스나 손가락으로 그림을 그릴 수 있는 공간. 
@mousedown	마우스로 꾹 누르기 시작할 때 → 그림 시작
@mousemove	마우스를 움직일 때 → 선이 따라 그려짐
@mouseup	마우스에서 손을 뗄 때 → 그리기 끝
@mouseleave	캔버스 밖으로 나갔을 때 → 그리기 끝
@touchstart	손가락으로 탭할 때 → 그림 시작
@touchmove	손가락을 움직이면 → 선이 그려짐
@touchend	손가락을 떼면 → 끝  
style="touch-action: none 
화면이 움직이지 않도록,
줌이 되지 않도록
하는 설정이야.
그렇지 않으면 그림 그리다가 화면이 움직여 버려.
-->
      <!-- 서명 캔버스 -->
      <div class="border-2 border-dashed border-gray-300 rounded-lg p-2 mb-3">
        <canvas
          ref="canvasRef"
          @mousedown="startDrawing"
          @mousemove="draw"
          @mouseup="stopDrawing"
          @mouseleave="stopDrawing"
          @touchstart="startDrawing"
          @touchmove="draw"
          @touchend="stopDrawing"
          class="w-full bg-white rounded border"
          style="touch-action: none"></canvas>
      </div>

      <p class="text-xs text-gray-500 text-center">
        작업 완료 확인을 위해 고객님께 서명을 받아주세요
      </p>
    </div>

    <!-- 작업 완료 버튼 -->
    <div v-if="job" class="space-y-3 pb-4">
      <button
        @click="submitWork"
        :disabled="!canSubmit"
        class="w-full py-4 bg-green-600 text-white rounded-xl font-semibold shadow-lg active:scale-[0.98] transition-transform disabled:bg-gray-300 disabled:cursor-not-allowed">
        🎉 작업 완료 및 제출
      </button>

      <button
        @click="saveDraft"
        class="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium">
        임시 저장
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getJobById, updateJob } from "@/stores/jobsStore";

const route = useRoute();
const router = useRouter();

// 라우터 쿼리에서 jobId 가져와서 작업 데이터 로드
const job = ref(null);

// jobId 변경 시 작업 데이터 로드
function loadJob() {
  const jobId = route.query.jobId;
  if (jobId) {
    const foundJob = getJobById(jobId);
    if (foundJob) {
      // 깊은 복사로 참조 분리
      // parsef란 문자열을 객체로 변환하는 메서드이다.
      // stringify란 객체를 문자열로 변환하는 메서드이다.
      // parse 메서드를 사용하면 문자열을 객체로 변환할 수 있다.
      // stringify 메서드를 사용하면 객체를 문자열로 변환할 수 있다.
      job.value = JSON.parse(JSON.stringify(foundJob));
      // 사진 초기화 (저장된 사진이 있으면 표시)
      photos.value = job.value.photos ? [...job.value.photos] : [];
      // 서명 초기화
      signature.value = null;
    } else {
      // 작업을 찾을 수 없으면 목록으로 이동
      router.push({ name: "MobileJobs" });
    }
  } else {
    // jobId가 없으면 목록으로 이동
    router.push({ name: "MobileJobs" });
  }
}

// 초기 로드 및 라우트 변경 감지
onMounted(() => {
  loadJob();
});

watch(
  () => route.query.jobId,
  () => {
    loadJob();
  }
);

const photos = ref([]);
const signature = ref(null);
const canvasRef = ref(null);
const isDrawing = ref(false);

const step = computed(() => {
  if (!job.value) return 1;
  if (job.value.status === "scheduled") return 1;
  if (job.value.status === "onroute") return 2;
  if (job.value.status === "working") return 3;
  if (job.value.status === "done") return 4;
  return 1;
});

function onFilesSelected(e) {
  const files = Array.from(e.target.files || []);
  const readers = files.map(
    (file) =>
    // Promise 란 비동기 작업을 처리하는 객체이다.
    // Promise 객체를 생성하면 비동기 작업을 처리하는 객체를 생성할 수 있다.
      new Promise((resolve) => {
        // resolve (해결) 란 Promise 객체를 처리한 결과를 반환하는 메서드이다.
        // resolve 메서드를 사용하면 Promise 객체를 처리한 결과를 반환할 수 있다.
        // FileReader 란 파일을 읽어오는 객체이다.
        // FileReader 객체를 생성하면 파일을 읽어오는 객체를 생성할 수 있다.
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      })
  );
  // Promise.all 란 모든 Promise 객체를 처리하는 메서드이다.
  // Promise.all 메서드를 사용하면 모든 Promise 객체를 처리할 수 있다.
  Promise.all(readers).then((list) => {
    // list 는 Promise 객체를 처리한 결과를 배열로 반환한다.
    // photos.value 는 청소 사진을 저장하는 배열이다.
    // ...list 는 list 배열을 펼쳐서 배열로 반환한다.
    // .slice(0, 9) 는 list 배열을 0부터 9까지 자른다.
    // 즉, photos.value 배열에 list 배열을 추가하고, 9개까지 자른다.
    photos.value = [...photos.value, ...list].slice(0, 9);
  });
}

function removePhoto(index) {
  photos.value.splice(index, 1);
}

// 캔버스 초기화
onMounted(() => {
  nextTick(() => {
    if (canvasRef.value) {
      const canvas = canvasRef.value;
      const ctx = canvas.getContext("2d");

      // 캔버스 크기 설정
      canvas.width = 400;
      canvas.height = 200;

      // 초기 배경
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 그리기 설정
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
  });
});

// 서명 기능
function startDrawing(e) {
  isDrawing.value = true;
  const canvas = canvasRef.value;
  const ctx = canvas.getContext("2d");

  const rect = canvas.getBoundingClientRect();
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

  ctx.beginPath();
  ctx.moveTo(x, y);
}

function draw(e) {
  if (!isDrawing.value) return;

  const canvas = canvasRef.value;
  const ctx = canvas.getContext("2d");

  const rect = canvas.getBoundingClientRect();
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

  ctx.lineTo(x, y);
  ctx.stroke();

  signature.value = canvas.toDataURL();
}

function stopDrawing() {
  isDrawing.value = false;
  if (canvasRef.value) {
    signature.value = canvasRef.value.toDataURL();
  }
}

function clearSignature() {
  const canvas = canvasRef.value;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  signature.value = null;
}

const canSubmit = computed(() => {
  return photos.value.length > 0 && signature.value !== null;
});

function submitWork() {
  if (!canSubmit.value) {
    alert("청소 사진과 고객 서명이 필요합니다.");
    return;
  }

  if (!job.value) return;

  // 작업 완료 처리 및 공통 상태 업데이트
  updateJob(job.value.id, {
    status: "done",
    photos: [...photos.value],
  });

  alert("작업이 완료되었습니다! 정산 내역에서 확인할 수 있습니다.");

  // 작업 목록으로 이동
  router.push({ name: "MobileJobs" });
}

function saveDraft() {
  alert("임시 저장되었습니다.");
}

// 길찾기 링크 생성
function mapLink(address) {
  // encodeURIComponent 란 문자열을 URL 인코딩하는 메서드이다.
  // encodeURIComponent 메서드를 사용하면 문자열을 URL 인코딩할 수 있다.
  // URL 인코딩은 문자열을 URL 형식으로 변환하는 것이다.
  // URL 인코딩을 사용하면 문자열을 URL 형식으로 변환할 수 있다.
  const q = encodeURIComponent(address);
  return `https://map.kakao.com/?q=${q}`;
}

// 상태 텍스트 변환
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

// 작업 상태 변경 함수
function changeJobStatus() {
  if (!job.value) return;

  const statusOrder = ["scheduled", "onroute", "working", "done"];
  const currentIndex = statusOrder.indexOf(job.value.status);

  if (currentIndex < statusOrder.length - 1) {
    const newStatus = statusOrder[currentIndex + 1];
    job.value.status = newStatus;

    // 공통 상태도 업데이트
    updateJob(job.value.id, { status: newStatus });

    alert(`작업 상태가 "${statusText(newStatus)}"로 변경되었습니다.`);
  }
}

// 다음 상태 텍스트 가져오기
function getNextStatusText(currentStatus) {
  const statusOrder = ["scheduled", "onroute", "working", "done"];
  const currentIndex = statusOrder.indexOf(currentStatus);

  if (currentIndex < statusOrder.length - 1) {
    const nextStatus = statusOrder[currentIndex + 1];
    return `→ ${statusText(nextStatus)}`;
  }
  return "완료됨";
}
</script>

<style scoped>
canvas {
  cursor: crosshair;
}
</style>
