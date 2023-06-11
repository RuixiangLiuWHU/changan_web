<template>
  <div class="mainBody">
    <a-layout>
      <a-layout-header class="headerLayout">
        <head-nav></head-nav>
      </a-layout-header>
      <a-layout-content class="contentLayout">
        <cesium-viewer></cesium-viewer>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
import HeadNav from './modules/HeadNav.vue'
import CesiumViewer from './modules/CesiumViewer.vue'
export default {
  components: {
    HeadNav,
    CesiumViewer,
  },
}
</script>

<style scoped>
.mainBody {
  margin: 0 auto;
  z-index: 0;
  width: 100%;
  height: 100%;
  position: relative;
}
.headerLayout {
  background-color: white;
  height: 55px;
  margin-top: 0;
  z-index: 2;
}
/* .siderLayout{
  background: #fff;
  z-index: 0;
｝ */
.contentLayout {
  background: #fff;
  /* height:1000px; */
  height: 100%;
  z-index: 1;
}
</style>



