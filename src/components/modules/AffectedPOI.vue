<template>
  <div>
    <a-drawer
      :title="$t('poiaffectedbydisasters')"
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
            <a-select-option key="2">
              {{ $t('henanflood0720') }}
            </a-select-option>
            <a-select-option key="3">
              {{ $t('henanflood0722') }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item :label="$t('selectpoiclasses')" prop="poiclasses" has-feedback>
          <a-select
            mode="multiple"
            v-model="form.poiclasses"
            :placeholder="$t('pleaseselectpoiclasses')"
            :allowClear="true"
            @change="onChange"
          >
            <a-select-option key="1">
              {{ $t('educationpoi') }}
            </a-select-option>
            <a-select-option key="2">
              {{ $t('transportationpoi') }}
            </a-select-option>
            <a-select-option key="3">
              {{ $t('hotelpoi') }}
            </a-select-option>
            <a-select-option key="4">
              {{ $t('travelpoi') }}
            </a-select-option>
            <a-select-option key="5">
              {{ $t('medicalpoi') }}
            </a-select-option>
            <a-select-option key="6">
              {{ $t('governmentpoi') }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ offset: 10 }">
          <a-button type="primary" @click="onProcess"> {{ $t('starttoquery') }} </a-button>
        </a-form-model-item>
        <a-descriptions
          layout="vertical"
          size="small"
          :title="$t('queryresult')"
          bordered
          :column="1"
          style="white-space: pre-wrap"
        >
          <a-descriptions-item :label="$t('numberofaffectedpoi')" span="1">
            {{ numofaffectedpoi }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('affectedpoi')" span="1">
            {{ affectedpoi }}
          </a-descriptions-item>
        </a-descriptions>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 10 }">
          <a-button style="margin-left: 10px" @click="resetForm"> {{ $t('reset') }} </a-button>
        </a-form-model-item>
      </a-form-model>
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
        disasterEvent: [],
        poiclasses: [],
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
        disasterEvent: [{ required: true, message: this.$t('pleaseselectdisasterevent'), trigger: 'blur' }],
        poiclasses: [{ required: true, message: this.$t('pleaseselectpoiclasses'), trigger: 'blur' }],
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
      this.affectedpoi = ''
      this.numofaffectedpoi = ''
      for (var i = viewer.dataSources._dataSources.length - 1; i >= 0; i--) {
        if (viewer.dataSources._dataSources[i].name == 'affectedpoi') {
          viewer.dataSources.remove(viewer.dataSources._dataSources[i])
        }
      }
      this.visible = false
      this.$emit('update', 0)
    },
    onProcess() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          for (var i = viewer.dataSources._dataSources.length - 1; i >= 0; i--) {
            if (viewer.dataSources._dataSources[i].name == 'affectedpoi') {
              viewer.dataSources.remove(viewer.dataSources._dataSources[i])
            }
          }
          var datasourceTmp = new Cesium.CustomDataSource('affectedpoi')
          viewer.dataSources.add(datasourceTmp)
          this.affectedpoi = ''
          let url = baseURL.baseURL + 'getpoiaffected?pois=' + this.pois + '&disasterid=' + this.disasterID
          axios.get(url).then(
            (response) => {
              alert(this.querysuccess)
              this.numofaffectedpoi = response.data.length
              for (var i = 0; i < response.data.length; i++) {
                this.affectedpoi =
                  this.affectedpoi +
                  '(' +
                  (i + 1) +
                  ') ' +
                  '名称：' +
                  response.data[i].name +
                  '，地址：' +
                  response.data[i].address +
                  '，行业大类：' +
                  response.data[i].industryclass +
                  '，行业子类：' +
                  response.data[i].industrysubclass +
                  '\n '
              }
              for (var i = 0; i < response.data.length; i++) {
                var entity = new Cesium.Entity({
                  id: response.data[i].name,
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
                  // point: {
                  //   pixelSize: 10,
                  //   color: Cesium.Color.RED,
                  // },
                  billboard: {
                    // 图像地址，URI或Canvas的属性
                    image: require('../../static/image/locate.png'),
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
                entity.description = `<table class="cesium-infoBox-defaultTable">
                    <tbody>
                        <tr>
                            <th>名称</th>
                            <th>${response.data[i].name}</th>
                        </tr>
                        <tr>
                            <th>地址</th>
                            <th>${response.data[i].address}</th>
                        </tr>
                        <tr>
                            <th>行业大类</th>
                            <th>${response.data[i].industryclass}</th>
                        </tr>
                        <tr>
                            <th>行业子类</th>
                            <th>${response.data[i].industrysubclass}</th>
                        </tr>
                    </tbody>
                    </table>`
                datasourceTmp.entities.add(entity)
              }
              console.log('提交请求成功！')
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
  },
}
</script>