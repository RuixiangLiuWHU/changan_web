<template>
  <div>
    <a-drawer
      :title="$t('viewlineevent')"
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
        <a-descriptions-item :label="$t('lineeventnumber')" span="1"> {{ lineEventNum }} </a-descriptions-item>
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
      lineEventNum: null,
    }
  },
  computed: {
    rules() {
      return {
        disasterEvent: [{ required: true, message: this.$t('pleaseinputdisastername'), trigger: 'blur' }],
      }
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
      this.lineEventNum = ''
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
      let url2 = baseURL.baseURL + 'getlineeventlist?id=' + this.disasterID
      axios.get(url2).then(
        (response) => {
          console.log('提交请求成功！')
          this.lineEventNum = response.data.length
          // this.lineEventList = response.data
          for (var i = 0; i < response.data.length; i++) {
            var polyline = new Cesium.PolylineGraphics({
              positions: Cesium.Cartesian3.fromDegreesArray(
                response.data[i].geom
                  .substring(11, response.data[i].geom.length - 1)
                  .replaceAll(' ', ',')
                  .split(',')
              ),
              width: 10,
              material: Cesium.Color.RED,
              clampToGround: true,
            })
            var entity = {
              id: 'lineevent' + response.data[i].id,
              // name: '',
              polyline: polyline,
            }
            entity.description = `<table class="cesium-infoBox-defaultTable">
                    <tbody>
                        <tr>
                            <th>线事件ID</th>
                            <th>${response.data[i].id}</th>
                        </tr>
                        <tr>
                            <th>起始M值</th>
                            <th>${response.data[i].fromm}</th>
                        </tr>
                        <tr>
                            <th>终止M值</th>
                            <th>${response.data[i].tom}</th>
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
