<template>
  <header :class="[{ scrolled: isScrolled }, { dark: isDark }]">
    <div class="inner">
      <img :src="currentLogo" alt="logo" class="logo" @click="goHome" />
      <!-- <img src="/images/link.png" alt="logo" class="logo" @click="goHome" /> -->
      <div class="lang-select">
        <label class="" for="lang">{{ t("lang.label") }}</label>
        <select id="lang" v-model="currentLang" @change="onChangeLang">
          <option value="ko">{{ t("lang.ko") }}</option>
          <option value="en">{{ t("lang.en") }}</option>
          <option value="ja">{{ t("lang.ja") }}</option>
        </select>
      </div>
      <div class="hamburger" @click="toggleMenu">
        <div class="line" v-for="n in 3" :key="n"></div>
      </div>
    </div>
    <!-- 서브 메뉴 -->
    <SubMenu v-if="isMenuOpen" @close="isMenuOpen = false" />
  </header>
</template>
<script setup>
import { computed } from "vue";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import SubMenu from "./SubMenu.vue";
// 스크롤 상태 저장
const isScrolled = ref(false);
// 스크롤 하면 색 변경
const handelScroll = () => {
  isScrolled.value = window.scrollY > 50; // 50px 이상 스크롤 하면 ture
};
const router = useRouter();
const route = useRoute();
// (국제화 라이브러리)Vue I18n
// locale — 현재 언어 코드
// locale은 현재 사용 중인 언어(locale) 를 뜻해요.
// 예를 들어 'en', 'ko', 'ja' 같은 문자열이 들어 있어요.

// console.log(locale.value); // 'ko'  (현재 한국어)
// locale.value = 'en';       // 영어로 변경

// 즉, locale.value를 바꾸면 화면 언어가 실시간으로 바뀜!
// t — 번역 함수(translate)

// t는 문자열을 번역해주는 함수예요.
const { locale, t } = useI18n();
// 로고 클릭시 home이동
const goHome = () => {
  router.push("/");
};
// 페이지 켜질때 감시 시작
onMounted(() => {
  window.addEventListener("scroll", handelScroll);
});
// 부모(App.vue)에서 받은 값
const props = defineProps({
  isDark: Boolean,
  logoSrc: {
    type: String,
    default: "/images/link.png",
  },
});
// 현재 표시할 로고 이미지 계산
const currentLogo = computed(() => {
  // 1️⃣ 스크롤 상태 우선
  if (isScrolled.value) {
    return "/images/favicon_192.png"; // 스크롤 시 어두운 버전
  }

  // 2️⃣ 페이지별 변경
  if (["ReserVue", "ReviewVue"].includes(route.name)) {
    return "/images/favicon_192.png"; // 어두운 헤더 페이지
  }

  // 3️⃣ 기본 로고
  return props.logoSrc || "/images/link.png";
});
// 서브 메뉴
const isMenuOpen = ref(false);
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// 언어 전환
// 현재 언어를 담는 반응형 변수 생성
// 1. locale.value 값이 있으면 사용
// 2. 없으면 localStorage에 저장된 'language' 값 사용
// 3. 둘 다 없으면 기본값으로 'ko' (한국어) 사용
const currentLang = ref(locale.value || localStorage.getItem("language") || "ko");

// 언어 변경 시 실행되는 함수
const onChangeLang = () => {
  // locale.value를 현재 선택된 언어로 변경
  locale.value = currentLang.value;

  // 선택된 언어를 브라우저 localStorage에 저장
  localStorage.setItem("language", currentLang.value);
};

</script>

<style lang="scss" scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 15px 20px;
  background-color: transparent;
  transition: all 0.3s;
  z-index: 10;
  // 스크롤하면
  &.scrolled {
    background-color: #333;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    .line {
      background-color: #fff !important;
    }
    // img {
    //   filter: brightness(0) invert(1);
    // }
  }
  //   dark 더해지면
  &.dark {
    background-color: #333;
    .line {
      background-color: #fff !important;
    }
    // img{
    //     filter: brightness(0) invert(1);
    // }
  }
  .inner {
    max-width: 1280px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: auto;
    .logo {
      width: 50px;
      cursor: pointer;
    }

    .lang-select {
      margin-left: auto;
      margin-right: 16px;
      select {
        padding: 6px 8px;
        border-radius: 6px;
        border: 1px solid #ddd;
        background: #fff;
      }
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
      }
    }

    .hamburger {
      cursor: pointer;
      .line {
        width: 25px;
        height: 3px;
        background-color: #333;
        margin: 4px 0;
        border-radius: 2px;
        transition: all 0.3s;
      }
    }
  }
}
</style>
