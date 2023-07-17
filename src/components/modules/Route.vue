<template>
  <div>
    <a-drawer :title="$t('shortestpathquery')" :width="600" :visible="visible" :bodyStyle="{ paddingBottom: '80px' }"
      :maskClosable="false" :mask="false" :placement="'right'" :wrapStyle="{ paddingTop: '55px' }" @close="onClose">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item :label="$t('selectdisasterevent')" prop="disasterEvent" has-feedback>
          <a-select v-model="form.disasterEvent" :placeholder="$t('pleaseselectdisasterevent')" :allowClear="true"
            @select="onSelect">
            <a-select-option v-for="disaster in disasters" :key="disaster.id">
              {{ disaster.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- <a-form-model-item :wrapper-col="{ offset: 5 }">
          <a-button type="primary" @click="onProcess"> {{ $t('handleroadsintheevent') }} </a-button>
          <a-button type="primary" style="margin-left: 20px" @click="onRestore">
            {{ $t('resetroadsintheevent') }}
          </a-button>
        </a-form-model-item> -->
        <a-form-model-item ref="routeCoordinateStart" :label="$t('startcoordinate')" prop="routeCoordinateStart"
          has-feedback>
          <a-input-group compact>
            <a-input-number v-model="form.RouteCoordinateStartX" style="width: 150px; text-align: center"
              :placeholder="$t('xcoordinate')" />
            <a-input style="width: 30px; border-left: 0; pointer-events: none; backgroundcolor: #fff" placeholder=","
              disabled />
            <a-input-number v-model="form.RouteCoordinateStartY" style="width: 150px; text-align: center; border-left: 0"
              :placeholder="$t('ycoordinate')" />
            <a-button type="primary" shape="circle" icon="environment" @click="routeStartSelect" />
          </a-input-group>
        </a-form-model-item>
        <a-form-model-item ref="routeCoordinateEnd" :label="$t('endcoordinate')" prop="routeCoordinateEnd" has-feedback>
          <a-input-group compact>
            <a-input-number v-model="form.RouteCoordinateEndX" style="width: 150px; text-align: center"
              :placeholder="$t('xcoordinate')" />
            <a-input style="width: 30px; border-left: 0; pointer-events: none; backgroundcolor: #fff" placeholder=","
              disabled />
            <a-input-number v-model="form.RouteCoordinateEndY" style="width: 150px; text-align: center; border-left: 0"
              :placeholder="$t('ycoordinate')" />
            <a-button type="primary" shape="circle" icon="environment" @click="routeEndSelect" />
          </a-input-group>
        </a-form-model-item>
        <a-form-model-item ref="selectRouteKind" :label="$t('shortestpathclass')" prop="selectRouteKind" has-feedback>
          <a-radio-group v-model="radioValue" @change="onChange">
            <a-radio :style="radioStyle" :value="1"> {{ $t('disatancepreference') }} </a-radio>
            <a-radio :style="radioStyle" :value="2"> {{ $t('timepreference') }} </a-radio>
            <a-radio :style="radioStyle" :value="3"> {{ $t('roadprioritypreference') }} </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <!-- <a-form-model-item ref="inputMaxSpeed" :label="$t('expectedmaxspeed')" prop="inputMaxSpeed" has-feedback>
          <a-input-group compact>
            <a-input-number v-model="form.inputMaxSpeed" style="width: 260px; text-align: center;"
              v-decorator="['inputMaxSpeed']" :allowClear="true" :placeholder="$t('pleaseinputexpectedmaxspeed')">
            </a-input-number>
            <a-input style="width: 80px; border-left: 0; pointer-events: none; backgroundcolor: transparent"
              placeholder="Km/h" readOnly />
          </a-input-group>
        </a-form-model-item> -->
        <a-form-model-item ref="outputDisatance" :label="$t('pathdistance')" prop="outputDisatance" has-feedback>
          <a-input-group compact>
            <a-input v-model="form.outputDisatance" v-decorator="['outputDisatance']" readOnly :allowClear="true"
              style="width: 260px">
            </a-input>
            <a-input style="width: 80px; border-left: 0; pointer-events: none; backgroundcolor: transparent"
              placeholder="Km" readOnly />
          </a-input-group>
        </a-form-model-item>
        <a-form-model-item ref="outputTime" :label="$t('pathtime')" prop="outputTime" has-feedback>
          <a-input-group compact>
            <a-input v-model="form.outputTime" v-decorator="['outputTime']" readOnly :allowClear="true"
              style="width: 260px">
            </a-input>
            <a-input style="width: 80px; border-left: 0; pointer-events: none; backgroundcolor: transparent"
              placeholder="min" readOnly />
          </a-input-group>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 10 }">
          <a-button style="margin-left: 10px" @click="resetForm"> {{ $t('reset') }} </a-button>
        </a-form-model-item>
      </a-form-model>
      <div :style="{
        position: 'absolute',
        right: 0,
        bottom: '55px',
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 1,
      }">
        <a-button :style="{ marginRight: '8px' }" @click="onClose"> {{ $t('cancel') }} </a-button>
        <a-button type="primary" @click="onSubmit"> {{ $t('submit') }} </a-button>
      </div>
    </a-drawer>
  </div>
</template>
<script>
let Cesium = require('cesium/Cesium')
require('cesium/Widgets/widgets.css')
import axios from 'axios'
import baseURL from '../../modules/apiConfig'
export default {
  data() {
    return {
      disasterID: '',
      disasters: [],
      radioValue: 1,
      radioStyle: {
        display: 'block',
        height: '40px',
        lineHeight: '40px',
      },
      viewer: null,
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      other: '',
      form: {
        disasterEvent: '',
        RouteCoordinateStartX: '',
        RouteCoordinateStartY: '',
        RouteCoordinateEndX: '',
        RouteCoordinateEndY: '',
        inputMaxSpeed: '',
        outputDisatance: '',
        outputTime: '',
      },
      visible: false,
    }
  },
  components: {},
  mounted() {
    let self = this
    this.$bus.$on('viewer', function (val) {
      self.viewer = val
    })
  },
  computed: {
    rules() {
      return {
        // inputMaxSpeed: [{ required: true, message: this.$t('pleaseinputexpectedmaxspeed'), trigger: 'blur' }],
        disasterEvent: [{ required: true, message: this.$t('pleaseselectdisasterevent'), trigger: 'blur' }],
      }
    },
    submitsuccess() {
      return this.$t('submitsuccess')
    },
    submiterror() {
      return this.$t('submiterror')
    },
    handlesuccess() {
      return this.$t('handlesuccess')
    },
    resetsuccess() {
      return this.$t('resetsuccess')
    },
    shortestpathnotfound() {
      return this.$t('shortestpathnotfound')
    },
    shortestpathnotmeetconditions() {
      return this.$t('shortestpathnotmeetconditions')
    },
  },
  methods: {
    onSelect(value) {
      this.disasterID = value
      console.log(this.disasterID)
    },
    onChange(e) {
      this.radioValue = e.target.value
    },
    showDrawer() {
      this.visible = true
      let url = baseURL.baseURL + 'getalldisaster'
      axios.get(url).then(
        (response) => {
          console.log('提交请求成功！')
          this.disasters = response.data
          this.disasters.push({ id: 0, name: '无灾害场景' })
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
      this.form.RouteCoordinateStartX = ''
      this.form.RouteCoordinateStartY = ''
      this.form.RouteCoordinateEndX = ''
      this.form.RouteCoordinateEndY = ''
      this.form.outputDisatance = ''
      this.form.outputTime = ''
      var polylineTmp = viewer.entities.getById('pgrouting')
      viewer.entities.remove(polylineTmp)
      this.visible = false
      this.$emit('update', 0)
    },
    onProcess() {
      let url = baseURL.baseURL + 'updateroutecost?disasterid=' + this.disasterID
      axios.post(url).then(
        (response) => {
          alert(this.handlesuccess)
          console.log('提交请求成功！')
          return response.data
        },
        (response) => {
          console.log('提交请求失败！')
          return 'error'
        }
      )
    },
    onRestore() {
      let url = baseURL.baseURL + 'updateroutecostorigin?disasterid=' + this.disasterID
      axios.post(url).then(
        (response) => {
          alert(this.resetsuccess)
          console.log('提交请求成功！')
          return response.data
        },
        (response) => {
          console.log('提交请求失败！')
          return 'error'
        }
      )
    },
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let url =
            baseURL.baseURL +
            'getroute?' +
            'kind=' +
            this.radioValue +
            '&x1=' +
            this.form.RouteCoordinateStartX +
            '&y1=' +
            this.form.RouteCoordinateStartY +
            '&x2=' +
            this.form.RouteCoordinateEndX +
            '&y2=' +
            this.form.RouteCoordinateEndY +
            '&disasterid=' +
            this.disasterID
          axios.get(url).then(
            (response) => {
              console.log('提交请求成功！')
              if (response.data.length == 0) {
                alert(this.shortestpathnotfound)
              }
              this.form.outputDisatance = response.data.length
              this.form.outputTime = response.data.timing
              if (response.data.timing >= 1000000) {
                var polylineTmp = viewer.entities.getById('pgrouting')
                viewer.entities.remove(polylineTmp)
                alert(this.shortestpathnotmeetconditions)
              } else if (response.data.timing < 1000000) {
                alert(this.submitsuccess)
                var polylineTmp = viewer.entities.getById('pgrouting')
                viewer.entities.remove(polylineTmp)
                var polyline = new Cesium.PolylineGraphics({
                  positions: Cesium.Cartesian3.fromDegreesArray(
                    response.data.geom.split(',')
                  ),
                  width: 10,
                  material: Cesium.Color.RED,
                  clampToGround: true,
                })
                var entity = {
                  id: 'pgrouting',
                  // name: '',
                  polyline: polyline,
                }
                viewer.entities.add(entity)
                viewer.flyTo(entity, {
                  offset: {
                    heading: Cesium.Math.toRadians(0.0),
                    pitch: Cesium.Math.toRadians(-90),
                    range: 200,
                  },
                })
              }
              return response.data
            },
            (response) => {
              console.log('提交请求失败！')
              return 'error'
            }
          )
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    routeStartSelect() {
      //坐标存储
      let _this = this
      //坐标存储
      let n = 0
      var handler = new Cesium.ScreenSpaceEventHandler(_this.viewer.scene.canvas)
      //单击鼠标左键画点
      handler.setInputAction(function (movement) {
        var cartesian = _this.viewer.scene.camera.pickEllipsoid(movement.position, _this.viewer.scene.globe.ellipsoid)
        var cartographic = _this.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian)
        console.log(Cesium.Math.toDegrees(cartographic.longitude))
        console.log(Cesium.Math.toDegrees(cartographic.latitude))
        _this.form.RouteCoordinateStartX = Cesium.Math.toDegrees(cartographic.longitude)
        _this.form.RouteCoordinateStartY = Cesium.Math.toDegrees(cartographic.latitude)
        n = n + 1
        if (n > 0) {
          handler.destroy()
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },
    routeEndSelect() {
      //坐标存储
      let _this = this
      //坐标存储
      let n = 0
      var handler = new Cesium.ScreenSpaceEventHandler(_this.viewer.scene.canvas)
      //单击鼠标左键画点
      handler.setInputAction(function (movement) {
        var cartesian = _this.viewer.scene.camera.pickEllipsoid(movement.position, _this.viewer.scene.globe.ellipsoid)
        var cartographic = _this.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian)
        console.log(Cesium.Math.toDegrees(cartographic.longitude))
        console.log(Cesium.Math.toDegrees(cartographic.latitude))
        _this.form.RouteCoordinateEndX = Cesium.Math.toDegrees(cartographic.longitude)
        _this.form.RouteCoordinateEndY = Cesium.Math.toDegrees(cartographic.latitude)
        n = n + 1
        if (n > 0) {
          handler.destroy()
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },
  },
}
</script>
