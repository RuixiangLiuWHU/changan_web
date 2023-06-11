<template>
  <div class="mainBody">
    <a-layout>
      <a-layout-header class="headerLayout">
        <head-nav></head-nav>
      </a-layout-header>
      <a-layout-content class="contentLayout">
        <database-manager></database-manager>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
import HeadNav from './modules/HeadNav.vue'
import DatabaseManager from './modules/DatabaseManager.vue'
export default {
  components: {
    HeadNav,
    DatabaseManager,
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
.contentLayout {
  background: #fff;
  height: 100%;
  z-index: 1;
}
</style>



