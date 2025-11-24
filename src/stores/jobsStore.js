// 작업 목록 전역 상태 관리 (간단한 데모용)
import { ref } from "vue";

// 작업 목록 데이터
export const jobs = ref([
  {
    id: 1,
    type: "store",
    storeName: "스타벅스 강남점",
    phone: "01012345678",
    address: "서울시 강남구 테헤란로 123",
    time: "09:00",
    status: "scheduled",
    memo: "주차장 2층",
    photos: [],

    price: 120000,
  },
  {
    id: 2,
    type: "office",
    storeName: "이디야커피 홍대점",
    phone: "01098765432",
    address: "서울시 마포구 연남동 456",
    time: "11:00",
    status: "onroute",
    memo: "엘리베이터 이용",
    photos: [],
    price: 120000,
  },
  {
    id: 3,
    type: "store",
    storeName: "메가커피 브라이트",
    phone: "01055553333",
    address: "서울시 송파구 올림픽로 789",
    time: "14:00",
    status: "working",
    memo: "",
    photos: [],
  },
  {
    id: 4,
    type: "office",
    storeName: "빙수카페",
    phone: "01022221111",
    address: "서울시 용산구 한강대로 321",
    time: "16:00",
    status: "done",
    memo: "청소 후 사진 필수",
    photos: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&h=300&fit=crop",
    ],
  },

  {
    id: 6,
    type: "store",
    storeName: "메가커피 브라이트",
    phone: "01055553333",
    address: "서울시 송파구 올림픽로 789",
    time: "14:00",
    status: "working",
    memo: "",
    photos: [],
  },
]);

// ID로 작업 찾기
export function getJobById(id) {
  return jobs.value.find((job) => job.id === Number(id));
}

// 작업 업데이트
export function updateJob(id, updates) {
console.log(id, updates);
  // getJobById 란 작업 ID를 찾는 함수이다.
  // getJobById 함수를 사용하면 작업 ID를 찾을 수 있다.
  const job = getJobById(id);
  if (job) {
    // Object.assign(job, updates);
    // Object.assign 란 객체를 병합하는 메서드이다.
    // Object.assign 메서드를 사용하면 객체를 병합할 수 있다.
    // job 객체에 updates 객체를 병합한다.
    // 즉, job 객체에 updates 객체의 속성을 추가한다.
    Object.assign(job, updates);
  }
}
