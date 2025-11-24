<template>
  <div class="content" v-if="!isSpecialPage">
    <Header_w :isDark="isDarkHeader" :logoSrc="isDarkHeader ? '/images/favicon_192.png' : '/images/link.png'" />
    <!-- <Header_w :isDark="isDarkHeader" :logoSrc="isDarkHeader ?  '/images/favicon_192.png':'/images/link.png' " /> -->
    <!-- 페이지 내용 -->
    <router-view></router-view>
    <QuickTop />
  </div>
  <!-- 헤더 -->
  <div v-else :class="{ 'special-content': isSpecialPage }">
    <router-view></router-view>
  </div>
</template>
<script setup>
import { computed } from "vue";
import Header_w from "./components/Header_w.vue";
import QuickTop from "./components/QuickTop.vue";
import { useRoute } from "vue-router";
const route = useRoute();
const isDarkHeader = computed(() => ["ReserVue", "ReviewVue"].includes(route.name));
// 기사 관리자 페이지 레이아웃
const isSpecialPage = computed(() => {
  //startsWith() 문자열.startsWith(검색할문자열, 시작위치);
  return route.path.startsWith("/admin") || route.path.startsWith("/worker");
});
</script>

<style lang="scss" scoped>
.special-content  {
  body{
  background-color: aliceblue;
 }
  #app{
    // margin: 0;
  }
  // padding: 0;
  // border-radius: 0;
  // box-shadow: none;
  // width: 100vw;
 
}
</style>
