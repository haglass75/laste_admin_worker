<template>
  <div class="rounded-2xl text-center">
    <!-- <h2 class="text-xl mb-2.5">🌤️ 현재 날씨</h2> -->

    <!-- 로딩 중 -->
    <div v-if="loading" class="text-gray-600">⏳ 불러오는 중...</div>

    <!-- 오류 -->
    <div v-else-if="error" class="text-red-600">{{ error }}</div>

    <!-- 성공 -->
    <div v-else class="flex flex-col items-center">
      <img
        :src="`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`"
        :alt="weather.weather[0].description"
        class="w-12 h-12" />
      <p class="text-base font-bold text-blue-900">
        {{ weather.main.temp.toFixed(0) }}°C
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const weather = ref(null);
const loading = ref(true);
const error = ref("");

const city = "Seoul";
const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

if (!apiKey) {
  console.error("날씨 API 키가 설정되지 않았습니다. .env 파일을 확인하세요.");
}

const getWeather = async () => {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=kr`;
    const res = await fetch(url);

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "날씨 데이터를 가져올 수 없습니다.");
    }

    const data = await res.json();
    weather.value = data;
    console.log(weather.value);
    
  } catch (err) {
    error.value = `❌ 오류: ${err.message}`;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getWeather();
});
</script>
