<template>
  <div>
    <a-drawer
      :title="$t('addpointlineeventbycoordinate')"
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
          <a-select v-model="form.disasterEvent" :placeholder="$t('pleaseselectdisasterevent')" :allowClear="true">
            <a-select-option v-for="disaster in disasters" :key="disaster.id">
              {{ disaster.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
      <a-tabs default-active-key="1" @change="callback" style="text-align: center">
        <a-tab-pane key="1" :tab="$t('addpointevent')">
          <a-form-model ref="ruleForm1" :model="form" :rules="rules1" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item
              ref="pointEventCoordinate"
              :label="$t('pointeventcoordinate')"
              prop="pointEventCoordinate"
              has-feedback
            >
              <a-input-group compact>
                <a-input-number
                  v-model="form.pointEventCoordinateX"
                  style="width: 150px; text-align: center"
                  :placeholder="$t('xcoordinate')"
                />
                <a-input
                  style="width: 30px; border-left: 0; pointer-events: none; backgroundcolor: #fff"
                  placeholder=","
                  disabled
                />
                <a-input-number
                  v-model="form.pointEventCoordinateY"
                  style="width: 150px; text-align: center; border-left: 0"
                  :placeholder="$t('ycoordinate')"
                />
                <a-button type="primary" shape="circle" icon="environment" @click="pointEventSelect" />
              </a-input-group>
            </a-form-model-item>
          </a-form-model>
        </a-tab-pane>
        <a-tab-pane key="2" :tab="$t('addlineevent')" force-render>
          <a-form-model ref="ruleForm2" :model="form" :rules="rules2" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item
              ref="lineEventRoute"
              :label="$t('selectlineeventroad')"
              prop="lineEventRoute"
              has-feedback
            >
              <a-input-group compact>
                <a-input
                  v-model="form.lineEventRouteID"
                  v-decorator="['lineEventRouteID']"
                  style="width: 328px"
                  :allowClear="true"
                />
                <a-button type="primary" shape="circle" icon="environment" @click="lineEventRouteIDSelect" />
              </a-input-group>
            </a-form-model-item>
            <a-form-model-item
              ref="lineEventStartCoordinate"
              :label="$t('startcoordinate')"
              prop="lineEventStartCoordinate"
              has-feedback
            >
              <a-input-group compact>
                <a-input-number
                  v-model="form.lineEventCoordinateStartX"
                  style="width: 150px; text-align: center"
                  :placeholder="$t('xcoordinate')"
                />
                <a-input
                  style="width: 30px; border-left: 0; pointer-events: none; backgroundcolor: #fff"
                  placeholder=","
                  disabled
                />
                <a-input-number
                  v-model="form.lineEventCoordinateStartY"
                  style="width: 150px; text-align: center; border-left: 0"
                  :placeholder="$t('ycoordinate')"
                />
                <a-button type="primary" shape="circle" icon="environment" @click="lineEventStartSelect" />
              </a-input-group>
            </a-form-model-item>
            <a-form-model-item
              ref="lineEventEndCoordinate"
              :label="$t('endcoordinate')"
              prop="lineEventEndCoordinate"
              has-feedback
            >
              <a-input-group compact>
                <a-input-number
                  v-model="form.lineEventCoordinateEndX"
                  style="width: 150px; text-align: center"
                  :placeholder="$t('xcoordinate')"
                />
                <a-input
                  style="width: 30px; border-left: 0; pointer-events: none; backgroundcolor: #fff"
                  placeholder=","
                  disabled
                />
                <a-input-number
                  v-model="form.lineEventCoordinateEndY"
                  style="width: 150px; text-align: center; border-left: 0"
                  :placeholder="$t('ycoordinate')"
                />
                <a-button type="primary" shape="circle" icon="environment" @click="lineEventEndSelect" />
              </a-input-group>
            </a-form-model-item>
          </a-form-model>
        </a-tab-pane>
      </a-tabs>

      <a-form-model-item :wrapper-col="{ span: 14, offset: 10 }">
        <a-button style="margin-left: 10px" @click="resetForm"> {{ $t('reset') }} </a-button>
      </a-form-model-item>
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
        <a-button :style="{ marginRight: '8px' }" @click="onClose"> {{ $t('cancel') }} </a-button>
        <a-button type="primary" @click="onSubmit"> {{ $t('submit') }} </a-button>
      </div>
    </a-drawer>
  </div>
</template>
<script>
let Cesium = require('cesium/Cesium')
require('cesium/Widgets/widgets.css')
import DatabaseManager from './DatabaseManager.vue'
import axios from 'axios'
import baseURL from '../../modules/apiConfig'
export default {
  data() {
    return {
      viewer: null,
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      other: '',
      form: {
        pointEventCoordinateX: '',
        pointEventCoordinateY: '',
        lineEventCoordinateStartX: '',
        lineEventCoordinateStartY: '',
        lineEventCoordinateEndX: '',
        lineEventCoordinateEndY: '',
        disasterEvent: '',
        lineEventRouteID: '',
      },
      visible: false,
      disasters: [],
      key: 1,
    }
  },
  components: {
    DatabaseManager,
  },
  computed: {
    rules() {
      return {
        disasterEvent: [{ required: true, message: this.$t('pleaseselectdisasterevent'), trigger: 'blur' }],
      }
    },
    rules1() {
      return {}
    },
    rules2() {
      return {}
    },
    submitsuccess() {
      return this.$t('submitsuccess')
    },
    submiterror() {
      return this.$t('submiterror')
    },
  },
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
      var start = viewer.entities.getById('start')
      viewer.entities.remove(start)
      var end = viewer.entities.getById('end')
      viewer.entities.remove(end)
      var point = viewer.entities.getById('point')
      viewer.entities.remove(point)
      this.$refs.ruleForm.resetFields()
      this.form.pointEventCoordinateX = ''
      this.form.pointEventCoordinateY = ''
      this.form.lineEventCoordinateStartX = ''
      this.form.lineEventCoordinateStartY = ''
      this.form.lineEventCoordinateEndX = ''
      this.form.lineEventCoordinateEndY = ''
      this.form.lineEventRouteID = ''
      var flyTmp = viewer.entities.getById('flyTmp')
      viewer.entities.remove(flyTmp)
      var polylineTmp = viewer.entities.getById('polyline')
      viewer.entities.remove(polylineTmp)
      this.visible = false
      this.$emit('update', 0)
    },
    onSubmit() {
      var start = viewer.entities.getById('start')
      viewer.entities.remove(start)
      var end = viewer.entities.getById('end')
      viewer.entities.remove(end)
      var point = viewer.entities.getById('point')
      viewer.entities.remove(point)
      var flyTmp = viewer.entities.getById('flyTmp')
      viewer.entities.remove(flyTmp)
      var polylineTmp = viewer.entities.getById('polyline')
      viewer.entities.remove(polylineTmp)
      if (this.key == 1) {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.$refs.ruleForm1.validate((valid) => {
              if (valid) {
                let url =
                  baseURL.baseURL +
                  'insertpoint?' +
                  'pointWKT=POINT(' +
                  this.form.pointEventCoordinateX +
                  ' ' +
                  this.form.pointEventCoordinateY +
                  ')' +
                  '&disasterid=' +
                  this.form.disasterEvent
                axios.post(url).then(
                  (response) => {
                    console.log('提交请求成功！')
                    this.visible = false
                    alert(this.submitsuccess)
                    this.$emit('update', 0)
                    return response.data
                  },
                  (response) => {
                    console.log('提交请求失败！')
                    alert(this.submiterror)
                    return 'error'
                  }
                )
              } else {
                console.log('error submit!!')
                return false
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else if (this.key == 2) {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.$refs.ruleForm2.validate((valid) => {
              if (valid) {
                let url =
                  baseURL.baseURL +
                  'insertline?' +
                  'pointWKTStart=POINT(' +
                  this.form.lineEventCoordinateStartX +
                  ' ' +
                  this.form.lineEventCoordinateStartY +
                  ')' +
                  '&pointWKTEnd=POINT(' +
                  this.form.lineEventCoordinateEndX +
                  ' ' +
                  this.form.lineEventCoordinateEndY +
                  ')' +
                  '&disasterid=' +
                  this.form.disasterEvent +
                  '&routeid=' +
                  this.form.lineEventRouteID
                axios.post(url).then(
                  (response) => {
                    console.log('提交请求成功！')
                    this.visible = false
                    alert(this.submitsuccess)
                    this.$emit('update', 0)
                    return response.data
                  },
                  (response) => {
                    console.log('提交请求失败！')
                    alert(this.submiterror)
                    return 'error'
                  }
                )
              } else {
                console.log('error submit!!')
                return false
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
      if (this.key == 1) {
        this.$refs.ruleForm1.resetFields()
      } else if (this.key == 2) {
        this.$refs.ruleForm2.resetFields()
      }
    },
    callback(key) {
      this.key = key
    },
    pointEventSelect() {
      var point = viewer.entities.getById('point')
      viewer.entities.remove(point)
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
        _this.form.pointEventCoordinateX = Cesium.Math.toDegrees(cartographic.longitude)
        _this.form.pointEventCoordinateY = Cesium.Math.toDegrees(cartographic.latitude)
        var entity = new Cesium.Entity({
          id: 'point',
          position: Cesium.Cartesian3.fromDegrees(_this.form.pointEventCoordinateX, _this.form.pointEventCoordinateY),
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
        viewer.entities.add(entity)
        viewer.flyTo(entity, {
          offset: {
            heading: Cesium.Math.toRadians(0.0),
            pitch: Cesium.Math.toRadians(-90),
            range: 5000,
          },
        })
        n = n + 1
        if (n > 0) {
          handler.destroy()
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },
    lineEventRouteIDSelect() {
      //坐标存储
      let _this = this
      //坐标存储
      let n = 0
      var X
      var Y
      var geom
      var handler = new Cesium.ScreenSpaceEventHandler(_this.viewer.scene.canvas)
      //单击鼠标左键画点
      handler.setInputAction(function (movement) {
        var cartesian = _this.viewer.scene.camera.pickEllipsoid(movement.position, _this.viewer.scene.globe.ellipsoid)
        var cartographic = _this.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian)
        X = Cesium.Math.toDegrees(cartographic.longitude)
        Y = Cesium.Math.toDegrees(cartographic.latitude)
        let url = baseURL.baseURL + 'getlineeventrouteid?' + 'x=' + X + '&y=' + Y
        axios.get(url).then(
          (response) => {
            console.log('提交请求成功！')
            _this.form.lineEventRouteID = response.data.gid
            geom = response.data.geom
            var flyTmp = viewer.entities.getById('flyTmp')
            viewer.entities.remove(flyTmp)
            var polylineTmp = viewer.entities.getById('polyline')
            viewer.entities.remove(polylineTmp)
            var entity = new Cesium.Entity({
              id: 'flyTmp',
              position: Cesium.Cartesian3.fromDegrees(X, Y),
              point: {
                pixelSize: 10,
                color: Cesium.Color.WHITE.withAlpha(0.9),
                outlineColor: Cesium.Color.WHITE.withAlpha(0.9),
                outlineWidth: 1,
              },
            })
            viewer.entities.add(entity)
            viewer.flyTo(entity, {
              offset: {
                heading: Cesium.Math.toRadians(0.0),
                pitch: Cesium.Math.toRadians(-90),
                range: 5000,
              },
            })
            var polyline = new Cesium.PolylineGraphics({
              positions: Cesium.Cartesian3.fromDegreesArray(
                geom
                  .substring(11, geom.length - 1)
                  .replaceAll(' ', ',')
                  .split(',')
              ),
              width: 10,
              material: Cesium.Color.RED,
              clampToGround: true,
            })
            viewer.entities.add({
              id: 'polyline',
              // name: '',
              polyline: polyline,
            })
            return response.data
          },
          (response) => {
            console.log('提交请求失败！')
            return 'error'
          }
        )
        n = n + 1
        if (n > 0) {
          handler.destroy()
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },
    lineEventStartSelect() {
      var start = viewer.entities.getById('start')
      viewer.entities.remove(start)
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
        _this.form.lineEventCoordinateStartX = Cesium.Math.toDegrees(cartographic.longitude)
        _this.form.lineEventCoordinateStartY = Cesium.Math.toDegrees(cartographic.latitude)
        var entity = new Cesium.Entity({
          id: 'start',
          position: Cesium.Cartesian3.fromDegrees(
            _this.form.lineEventCoordinateStartX,
            _this.form.lineEventCoordinateStartY
          ),
          billboard: {
            // 图像地址，URI或Canvas的属性
            image: require('../../static/image/locate2.png'),
            // 设置颜色和透明度
            color: Cesium.Color.WHITE.withAlpha(1),
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
        viewer.entities.add(entity)
        n = n + 1
        if (n > 0) {
          handler.destroy()
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },
    lineEventEndSelect() {
      var end = viewer.entities.getById('end')
      viewer.entities.remove(end)
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
        _this.form.lineEventCoordinateEndX = Cesium.Math.toDegrees(cartographic.longitude)
        _this.form.lineEventCoordinateEndY = Cesium.Math.toDegrees(cartographic.latitude)
        var entity = new Cesium.Entity({
          id: 'end',
          position: Cesium.Cartesian3.fromDegrees(
            _this.form.lineEventCoordinateEndX,
            _this.form.lineEventCoordinateEndY
          ),
          billboard: {
            // 图像地址，URI或Canvas的属性
            image: require('../../static/image/locate2.png'),
            // 设置颜色和透明度
            color: Cesium.Color.WHITE.withAlpha(1),
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
        viewer.entities.add(entity)
        n = n + 1
        if (n > 0) {
          handler.destroy()
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },
  },
}
</script>
