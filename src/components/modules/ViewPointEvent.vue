<template>
  <div>
    <a-drawer
      :title="$t('viewpointevent')"
      :width="600"
      :visible="visible"
      :bodyStyle="{ paddingBottom: '80px' }"
      :maskClosable="false"
      :mask="false"
      :placement="'right'"
      :wrapStyle="{ paddingTop: '55px' }"
      @close="onClose"
    >
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item :label="$t('selectdisasterevent')" prop="disasterEvent" has-feedback>
          <a-select
            v-model="form.disasterEvent"
            :placeholder="$t('pleaseselectdisasterevent')"
            :allowClear="true"
            @select="onSelect"
          >
            <a-select-option v-for="disaster in disasters" :key="disaster.id">
              {{ disaster.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 1, offset: 10 }">
          <a-button type="primary" @click="onQuery"> {{ $t('view') }} </a-button>
        </a-form-model-item>
      </a-form-model>
      <a-descriptions
        layout="vertical"
        size="small"
        :title="$t('disastername') + ': ' + disasterName"
        bordered
        :column="2"
      >
        <a-descriptions-item :label="$t('disasterstarttime')" span="1"> {{ startTime }} </a-descriptions-item>
        <a-descriptions-item :label="$t('disasterendtime')" span="1"> {{ endTime }} </a-descriptions-item>
        <a-descriptions-item :label="$t('status')" span="2">
          <a-badge :status="statusOfDisaster" :text="textOfDisaster" />
        </a-descriptions-item>
        <a-descriptions-item :label="$t('description')" span="2"> {{ description }} </a-descriptions-item>
        <a-descriptions-item :label="$t('pointeventnumber')" span="2"> {{ pointEventNum }} </a-descriptions-item>
      </a-descriptions>
    </a-drawer>
  </div>
</template>
<script>
let Cesium = require('cesium/Cesium')
require('cesium/Widgets/widgets.css')
import moment from 'moment'
import axios from 'axios'
import baseURL from '../../modules/apiConfig'
export default {
  data() {
    return {
      viewer: null,
      visible: false,
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      form: {
        disasterEvent: '',
      },
      disasters: [],
      disasterName: '',
      disasterID: null,
      startTime: undefined,
      endTime: undefined,
      statusOfDisaster: 'default',
      textOfDisaster: 'Default',
      description: '',
      pointEventNum: null,
    }
  },
  computed: {
    rules() {
      return {
        disasterEvent: [{ required: true, message: this.$t('pleaseinputdisastername'), trigger: 'blur' }],
      }
    },
    querysuccess() {
      return this.$t('querysuccess')
    },
    queryerror() {
      return this.$t('queryerror')
    },
  },
  components: {},
  mounted() {
    let self = this
    this.$bus.$on('viewer', function (val) {
      self.viewer = val
    })
  },
  methods: {
    showDrawer() {
      this.visible = true
      let url = baseURL.baseURL + 'getalldisaster'
      axios.get(url).then(
        (response) => {
          console.log('提交请求成功！')
          this.disasters = response.data
          return response.data
        },
        (response) => {
          console.log('提交请求失败！')
          return 'error'
        }
      )
    },
    onClose() {
      this.$refs.ruleForm.resetFields()
      this.pointEventNum = ''
      this.statusOfDisaster = 'default'
      this.textOfDisaster = 'default'
      this.startTime = undefined
      this.endTime = undefined
      this.disasterName = ''
      this.description = ''
      for (var i = viewer.dataSources._dataSources.length - 1; i >= 0; i--) {
        if (viewer.dataSources._dataSources[i].name == 'events') {
          viewer.dataSources.remove(viewer.dataSources._dataSources[i])
        }
      }
      this.visible = false
      this.$emit('update', 0)
    },
    onSelect(value) {
      this.disasterID = value
    },
    onQuery() {
      for (var i = viewer.dataSources._dataSources.length - 1; i >= 0; i--) {
        if (viewer.dataSources._dataSources[i].name == 'events') {
          viewer.dataSources.remove(viewer.dataSources._dataSources[i])
        }
      }
      var datasourceTmp = new Cesium.CustomDataSource('events')
      viewer.dataSources.add(datasourceTmp)
      let url = baseURL.baseURL + 'getdisaster?id=' + this.disasterID
      axios.get(url).then(
        (response) => {
          console.log('提交请求成功！')
          this.disasterName = response.data.name
          this.startTime = moment(response.data.starttime).format('YYYY/MM/DD HH:mm:ss')
          this.endTime = moment(response.data.endtime).format('YYYY/MM/DD HH:mm:ss')
          var myDate = new Date()
          if (myDate.getTime() < Date.parse(this.endTime)) {
            this.statusOfDisaster = 'processing'
            this.textOfDisaster = 'Happening'
          } else if (myDate.getTime() >= Date.parse(this.endTime)) {
            this.statusOfDisaster = 'error'
            this.textOfDisaster = 'Ended'
          }
          this.description = response.data.description
          return response.data
        },
        (response) => {
          console.log('提交请求失败！')
          return 'error'
        }
      )
      let url2 = baseURL.baseURL + 'getpointeventlist?id=' + this.disasterID
      axios.get(url2).then(
        (response) => {
          console.log('提交请求成功！')
          this.pointEventNum = response.data.length
          // this.pointEventList = response.data
          for (var i = 0; i < response.data.length; i++) {
            var entity = new Cesium.Entity({
              id: '点事件' + response.data[i].id,
              position: Cesium.Cartesian3.fromDegrees(
                response.data[i].geom
                  .substring(6, response.data[i].geom.length - 1)
                  .replaceAll(' ', ',')
                  .split(',')[0],
                response.data[i].geom
                  .substring(6, response.data[i].geom.length - 1)
                  .replaceAll(' ', ',')
                  .split(',')[1]
              ),
              billboard: {
                // 图像地址，URI或Canvas的属性
                image: require('../../static/image/locate.png'),
                // 设置颜色和透明度
                color: Cesium.Color.WHITE.withAlpha(0.8),
                // 高度（以像素为单位）
                height: 50,
                // 宽度（以像素为单位）
                width: 50,
                // 逆时针旋转
                // rotation: 20,
                // 大小是否以米为单位
                sizeInMeters: false,
                // 相对于坐标的垂直位置
                verticalOrigin: Cesium.VerticalOrigin.CENTER,
                // 相对于坐标的水平位置
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER, //LEFT
                // 该属性指定标签在屏幕空间中距此标签原点的像素偏移量
                pixelOffset: new Cesium.Cartesian2(0, 0),
                // 应用于图像的统一比例。比例大于会1.0放大标签，而比例小于会1.0缩小标签。
                scale: 1.0,
                // 是否显示
                show: true,
              },
            })
            entity.description = `<table class="cesium-infoBox-defaultTable">
                    <tbody>
                        <tr>
                            <th>点事件ID</th>
                            <th>${response.data[i].id}</th>
                        </tr>
                        <tr>
                            <th>M值</th>
                            <th>${response.data[i].m}</th>
                        </tr>
                        <tr>
                            <th>灾害ID</th>
                            <th>${response.data[i].disasterid}</th>
                        </tr>
                        <tr>
                            <th>道路ID</th>
                            <th>${response.data[i].routeid}</th>
                        </tr>
                    </tbody>
                    </table>`
            datasourceTmp.entities.add(entity)
          }
          datasourceTmp.clustering.enabled = true
          datasourceTmp.clustering.pixelRange = 150
          datasourceTmp.clustering.minimumClusterSize = 5
          datasourceTmp.clustering.clusterEvent.addEventListener(function (clusteredEntities, cluster) {
            cluster.label.show = false
            cluster.billboard.show = true
            cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.CENTER
            if (clusteredEntities.length >= 256) {
              combineIconAndLabel(require('../../static/image/1.png'), clusteredEntities.length, 64).then((canvas) => {
                cluster.billboard.image = canvas
              })
              cluster.billboard.width = 72
              cluster.billboard.height = 72
            } else if (clusteredEntities.length >= 128) {
              combineIconAndLabel(require('../../static/image/2.png'), clusteredEntities.length, 64).then((canvas) => {
                cluster.billboard.image = canvas
              })

              cluster.billboard.width = 60
              cluster.billboard.height = 60
            } else if (clusteredEntities.length >= 64) {
              combineIconAndLabel(require('../../static/image/3.png'), clusteredEntities.length, 64).then((canvas) => {
                cluster.billboard.image = canvas
              })
              cluster.billboard.width = 50
              cluster.billboard.height = 50
            } else if (clusteredEntities.length >= 32) {
              combineIconAndLabel(require('../../static/image/4.png'), clusteredEntities.length, 64).then((canvas) => {
                cluster.billboard.image = canvas
              })
              cluster.billboard.width = 42
              cluster.billboard.height = 42
            } else if (clusteredEntities.length >= 16) {
              combineIconAndLabel(require('../../static/image/5.png'), clusteredEntities.length, 64).then((canvas) => {
                cluster.billboard.image = canvas
              })
              cluster.billboard.width = 38
              cluster.billboard.height = 38
            } else {
              combineIconAndLabel(require('../../static/image/6.png'), clusteredEntities.length, 64).then((canvas) => {
                cluster.billboard.image = canvas
              })
              cluster.billboard.width = 35
              cluster.billboard.height = 35
            }
          })
          function combineIconAndLabel(url, label, size) {
            return new Promise((resolve, reject) => {
              let canvas = document.createElement('canvas')
              canvas.width = size
              canvas.height = size
              let ctx = canvas.getContext('2d')
              var image = new Image()
              image.src = url
              image.onload = function () {
                ctx.drawImage(image, 0, 0)
                ctx.fillStyle = Cesium.Color.WHITE.toCssColorString()
                ctx.font = 'bold 20px Microsoft YaHei'
                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'
                ctx.fillText(label, size / 2, size / 2)
                resolve(canvas)
              }
            })
          }
          return response.data
        },
        (response) => {
          console.log('提交请求失败！')
          return 'error'
        }
      )
    },
  },
}
</script>
