<template>
  <div>
    <a-drawer
      title="河南省洪涝分析"
      :width="600"
      :visible="visible"
      :bodyStyle="{ paddingBottom: '80px' }"
      :maskClosable="false"
      :mask="false"
      :placement="'right'"
      :wrapStyle="{ paddingTop: '55px' }"
      @close="onClose"
    >
      <a-tabs v-model="tabs" size="small" :tabBarGutter="0" @change="tabsChange" class="tabstitle">
        <a-tab-pane key="tab1" :tab="'提交分析'">
          <a-tabs default-active-key="1" tab-position="bottom" class="tabsbottom">
            <a-tab-pane key="1" :tab="title" class="panetitle">
              <submit-form
                :initData="initData"
                @calDone="onCalDone"
                ref="form"
                :title="title"
                :type="type"
                :productNeeded="productNeeded"
                style="padding-top: 20px"
              >
              </submit-form>
            </a-tab-pane>
            <a-tab-pane key="2" tab="OLAP" class="panetitle">
              <olap-submit-form :title="title" olapType="olapndwi" @calDone="onCalDone" />
            </a-tab-pane>
          </a-tabs>
        </a-tab-pane>
        <a-tab-pane key="tab2" :tab="'分析结果'" :disabled="resultTabDisable">
          <results-table @renderAnalysisResult="renderAnalysisResult"> </results-table>
        </a-tab-pane>
      </a-tabs>
      <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: '55px',
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
      >
        <a-button :style="{ marginRight: '8px' }" @click="onClose"> 取消 </a-button>
      </div>
    </a-drawer>
  </div>
</template>
<script>
import ShrinkView from './ShrinkView'
import SubmitForm from './OnlineAnalysisSbumit/AnalysisSubmitForm.vue'
import CesiumViewer from './CesiumViewer'
import ResultsTable from './OnlineAnalysisSbumit/AnalysisReslutTable.vue'
import OLAPSubmitForm from './OnlineAnalysisSbumit/OLAPSubmitForm.vue'
export default {
  components: {
    ShrinkView,
    CesiumViewer,
    SubmitForm,
    ResultsTable,
    'olap-submit-form': OLAPSubmitForm,
  },
  data() {
    return {
      visible: false,
      status: false,
      tabs: 'tab2', //当前激活的tabs页面 notice:必须先初始化tab2面板，否则出错，之后mounted中设置真正的默认tab
      resultTabDisable: true,
      imgLoader: null,
      shapeDrawer: null,
      title: '河南省洪涝分析',
      type: 'flood',
      //设置form的默认数据
      initData: {
        minLon: 108.46494046724021,
        maxLon: 111.02181165740333,
        minLat: 18.073457222586285,
        maxLat: 20.2597805438586,
        startTime: '2016-06-01',
        endTime: '2016-09-01',
      },
      productNeeded: ['GF_Hainan_Daguangba_NDWI_EO', 'Hainan_Daguangba_Bridge_Vector'],
    }
  },
  computed: {
    resultTabDisabled() {
      return this.activeTabKey == '1' ? true : false
    },
  },
  methods: {
    showDrawer() {
      this.visible = true
    },
    onClose() {
      this.visible = false
      this.$emit('update', 0)
    },
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.visible = false
          alert('成功提交！')
          this.$emit('update', 0)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    // this.timeInterval = e.currentTarget.value
    //子组件form，分析完成后被回调
    onCalDone() {
      this.resultTabDisable = false //enable 分析表组件
      this.currentTab('tab2')
      this.imgLoader.removeAllImage() //移除cesium中所有图层 TODO:或者改成，将新的分析结果拼接到table下面，不清空之前的分析结果。
    },

    //tabs被手动点击时回调
    tabsChange(activeKey) {
      if (activeKey == 'tab1') {
        this.shapeDrawer.switch(true)
      } else {
        this.shapeDrawer.switch(false)
      }
    },

    //设置当前显示的tab
    currentTab(str, bool) {
      if (str == 'tab1') {
        this.tabs = str
        if (bool == true) {
          this.shapeDrawer.switch(true)
        }
      } else {
        this.tabs = str
        this.shapeDrawer.switch(false)
      }
    },

    //在子组件中被调用，之后又调用别的子组件
    renderAnalysisResult(renderItem) {
      if (renderItem.addRemove) {
        //为add该item
        console.log('在ceisum中add该图片')
        if (renderItem.item.path.indexOf('.png') != -1) {
          //为png类型
          let arr = renderItem.item.extent.split(',')
          arr = arr.map(Number)
          this.imgLoader.loadImage(renderItem.item.path, arr[0], arr[1], arr[2], arr[3])
        } else if (renderItem.item.path.indexOf('.geojson') != -1) {
          //GeoJson类型
          this.imgLoader.loadGeojson(renderItem.item.path)
        }
      } else {
        console.log('在cesium中remove该图片')
        this.imgLoader.removeImageByURL(renderItem.item.path)
      }
    },
  },
  mounted() {},
}
</script>

<style scoped>
.ant-tabs-bar {
  margin: 0 0 0px 0;
}
.ant-tabs .ant-tabs-small-bar .ant-tabs-tab {
  padding: 0px 0px;
}
.tabstitle {
  text-align: center;
}
</style>
