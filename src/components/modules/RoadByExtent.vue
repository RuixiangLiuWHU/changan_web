<template>
  <div>
    <a-drawer :title="$t('roadbyextent')" :width="600" :visible="visible" :bodyStyle="{ paddingBottom: '80px' }"
      :maskClosable="false" :mask="false" :placement="'right'" :wrapStyle="{ paddingTop: '55px' }" @close="onClose">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="lineEventStartCoordinate" :label="$t('leftdowncoordinate')"
          prop="lineEventStartCoordinate" has-feedback>
          <a-input-group compact>
            <a-input-number v-model="form.lineEventCoordinateStartX" style="width: 150px; text-align: center"
              :placeholder="$t('xcoordinate')" />
            <a-input style="width: 30px; border-left: 0; pointer-events: none; backgroundcolor: #fff" placeholder=","
              disabled />
            <a-input-number v-model="form.lineEventCoordinateStartY"
              style="width: 150px; text-align: center; border-left: 0" :placeholder="$t('ycoordinate')" />
            <a-button type="primary" shape="circle" icon="environment" @click="lineEventStartSelect" />
          </a-input-group>
        </a-form-model-item>
        <a-form-model-item ref="lineEventEndCoordinate" :label="$t('rightupcoordinate')" prop="lineEventEndCoordinate"
          has-feedback>
          <a-input-group compact>
            <a-input-number v-model="form.lineEventCoordinateEndX" style="width: 150px; text-align: center"
              :placeholder="$t('xcoordinate')" />
            <a-input style="width: 30px; border-left: 0; pointer-events: none; backgroundcolor: #fff" placeholder=","
              disabled />
            <a-input-number v-model="form.lineEventCoordinateEndY"
              style="width: 150px; text-align: center; border-left: 0" :placeholder="$t('ycoordinate')" />
            <a-button type="primary" shape="circle" icon="environment" @click="lineEventEndSelect" />
          </a-input-group>
        </a-form-model-item>
      </a-form-model>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 10 }">
        <a-button style="margin-left: 10px" @click="resetForm"> {{ $t('reset') }} </a-button>
      </a-form-model-item>
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
      affectedpoi: '',
      numofaffectedpoi: '',
      pois: [],
      disasterID: '',
      disasters: [],
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
      }
    },
    submitsuccess() {
      return this.$t('submitsuccess')
    },
    submiterror() {
      return this.$t('submiterror')
    },
    querysuccess() {
      return this.$t('querysuccess')
    },
    queryerror() {
      return this.$t('queryerror')
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
    onSelect(key) {
      this.disasterID = key
    },
    onChange(key) {
      this.pois = key
    },
    showDrawer() {
      this.visible = true
    },
    onClose() {
      this.$refs.ruleForm.resetFields()
      this.visible = false
      this.$emit('update', 0)
    },
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let url = baseURL.baseURL + 'getroadsbyextent?x1=' + this.form.lineEventCoordinateStartX + '&x2=' + this.form.lineEventCoordinateEndX + '&y1=' + this.form.lineEventCoordinateStartY + '&y2=' + this.form.lineEventCoordinateEndY
          axios.get(url).then(
            (response) => {
              alert(this.querysuccess)
              console.log('提交请求成功！')
              let a = document.createElement('a');
              a.target = '_blank';
              a.href = url;
              a.click();
              this.window.open(url, _blank)
              return response.data
            },
            (response) => {
              alert(this.queryerror)
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
        console.log(_this.form.lineEventCoordinateStartX)
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