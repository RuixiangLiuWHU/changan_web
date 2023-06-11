<template>
  <div>
    <a-drawer
      :title="$t('addpointlineeventbytext')"
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
        <a-form-model-item :label="$t('inputroadname')" prop="roadName" has-feedback>
          <a-select
            show-search
            v-model="form.roadName"
            :loading="loadingRoad"
            @select="onSelectRoad"
            @search="onSearchRoad"
            :filter-option="false"
            :placeholder="$t('pleaseinputroadname')"
            :allowClear="true"
          >
            <a-select-option v-for="valueRoad in roadnames" :key="valueRoad" :value="valueRoad">
              {{ valueRoad }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item :label="$t('inputpoiname')" prop="poiName" has-feedback>
          <a-select
            show-search
            v-model="form.poiName"
            :loading="loadingPOI"
            @select="onSelectPOI"
            @search="onSearchPOI"
            :filter-option="false"
            :placeholder="$t('pleaseinputpoiname')"
            :allowClear="true"
          >
            <a-select-option v-for="valuePOI in poinames" :key="valuePOI" :value="valuePOI">
              {{ valuePOI }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item :label="$t('selectageneraldirection')" prop="direction" has-feedback>
          <a-select
            v-model="form.direction"
            :placeholder="$t('pleaseselectageneraldirection')"
            :allowClear="true"
            @select="onSelectDirection"
          >
            <a-select-option key="1">
              {{ $t('north') }}
            </a-select-option>
            <a-select-option key="2">
              {{ $t('northeast') }}
            </a-select-option>
            <a-select-option key="3">
              {{ $t('east') }}
            </a-select-option>
            <a-select-option key="4">
              {{ $t('southeast') }}
            </a-select-option>
            <a-select-option key="5">
              {{ $t('south') }}
            </a-select-option>
            <a-select-option key="6">
              {{ $t('southwest') }}
            </a-select-option>
            <a-select-option key="7">
              {{ $t('west') }}
            </a-select-option>
            <a-select-option key="8">
              {{ $t('northwest') }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
      <a-tabs default-active-key="1" @change="callback" style="text-align: center">
        <a-tab-pane key="1" :tab="$t('addpointevent')">
          <a-form-model ref="ruleForm1" :model="form" :rules="rules1" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item :label="$t('inputdistance')" prop="distance" has-feedback>
              <a-input-group compact>
                <a-input-number
                  v-model="form.distance"
                  style="width: 299px; margin-left: 0"
                  :placeholder="$t('pleaseinputdistance')"
                  :min="0"
                />
                <a-input
                  style="width: 70px; border-left: 0; pointer-events: none; backgroundcolor: #fff"
                  placeholder="m"
                  disabled
                />
              </a-input-group>
            </a-form-model-item>
            <a-form-model-item :label="$t('textinformationgeneration')">
              <a-input v-model="textinformation" type="textarea" :auto-size="{ minRows: 4, maxRows: 6 }" />
            </a-form-model-item>
          </a-form-model>
        </a-tab-pane>
        <a-tab-pane key="2" :tab="$t('addlineevent')" force-render>
          <a-form-model ref="ruleForm2" :model="form" :rules="rules2" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item :label="$t('inputstartdistance')" prop="startdistance" has-feedback>
              <a-input-group compact>
                <a-input-number
                  v-model="form.startdistance"
                  style="width: 299px; margin-left: 0"
                  :placeholder="$t('pleaseinputstartdistance')"
                  :min="0"
                />
                <a-input
                  style="width: 70px; border-left: 0; pointer-events: none; backgroundcolor: #fff"
                  placeholder="m"
                  disabled
                />
              </a-input-group>
            </a-form-model-item>
            <a-form-model-item :label="$t('inputenddistance')" prop="enddistance" has-feedback>
              <a-input-group compact>
                <a-input-number
                  v-model="form.enddistance"
                  style="width: 299px; margin-left: 0"
                  :placeholder="$t('pleaseinputenddistance')"
                  :min="minLine"
                />
                <a-input
                  style="width: 70px; border-left: 0; pointer-events: none; backgroundcolor: #fff"
                  placeholder="m"
                  disabled
                />
              </a-input-group>
            </a-form-model-item>
            <a-form-model-item :label="$t('textinformationgeneration')">
              <a-input v-model="textinformationLine" type="textarea" :auto-size="{ minRows: 4, maxRows: 6 }" />
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
        distance: null,
        startdistance: null,
        enddistance: null,
        direction: '',
        roadName: '',
        poiName: '',
        disasterEvent: '',
      },
      direction: '',
      visible: false,
      disasters: [],
      loadingPOI: false,
      loadingRoad: false,
      key: 1,
      roadnames: [],
      poinames: [],
    }
  },
  components: {
    DatabaseManager,
  },
  computed: {
    minLine() {
      if (this.form.startdistance == null || this.form.startdistance == '') {
        return 1
      } else if (this.form.startdistance >= 0) {
        return this.form.startdistance + 1
      }
    },
    rules() {
      return {
        disasterEvent: [{ required: true, message: this.$t('pleaseselectdisasterevent'), trigger: 'blur' }],
        roadName: [{ required: true, message: this.$t('pleaseinputroadname'), trigger: 'blur' }],
        poiName: [{ required: true, message: this.$t('pleaseinputpoiname'), trigger: 'blur' }],
        direction: [{ required: true, message: this.$t('pleaseselectageneraldirection'), trigger: 'blur' }],
      }
    },
    rules1() {
      return {
        distance: [{ required: true, message: this.$t('pleaseinputdistance'), trigger: 'blur' }],
      }
    },
    rules2() {
      return {
        startdistance: [{ required: true, message: this.$t('pleaseinputdistance'), trigger: 'blur' }],
        enddistance: [{ required: true, message: this.$t('pleaseinputdistance'), trigger: 'blur' }],
      }
    },
    directionValue() {
      if (this.direction == 1) {
        return this.$t('north')
      } else if (this.direction == 2) {
        return this.$t('northeast')
      } else if (this.direction == 3) {
        return this.$t('east')
      } else if (this.direction == 4) {
        return this.$t('southeast')
      } else if (this.direction == 5) {
        return this.$t('south')
      } else if (this.direction == 6) {
        return this.$t('southwest')
      } else if (this.direction == 7) {
        return this.$t('west')
      } else if (this.direction == 8) {
        return this.$t('northwest')
      } else {
        return ''
      }
    },
    textinformation() {
      return (
        this.$t('startat') +
        this.form.poiName +
        this.$t('andgo') +
        this.directionValue +
        this.$t('along') +
        this.form.roadName +
        this.$t('about2') +
        this.form.distance +
        this.$t('metres')
      )
    },
    textinformationLine() {
      return (
        this.$t('startat') +
        this.form.poiName +
        this.$t('andgo') +
        this.directionValue +
        this.$t('along') +
        this.form.roadName +
        this.$t('about2') +
        this.form.startdistance +
        this.$t('to') +
        this.form.enddistance +
        this.$t('metres')
      )
    },
    submitsuccess() {
      return this.$t('submitsuccess')
    },
    submiterror() {
      return this.$t('submiterror')
    },
    thedistanceexceedsthepathlength() {
      return this.$t('thedistanceexceedsthepathlength')
    },
  },
  mounted() {
    let self = this
    this.$bus.$on('viewer', function (val) {
      self.viewer = val
    })
  },
  methods: {
    onSelectDirection(key) {
      this.direction = key
      console.log(this.direction)
    },
    onSearchRoad(searchRoad) {
      this.roadnames = []
      this.searchRoad = searchRoad
      this.loadingRoad = !!searchRoad
      this.loadRoads(searchRoad)
    },
    loadRoads(key) {
      if (!key) {
        this.roadnames = []
        return
      }
      let url = baseURL.baseURL + 'getlevenshtein?str1=' + key
      axios.get(url).then(
        (response) => {
          const { searchRoad } = this
          if (searchRoad !== key) return
          this.roadnames = response.data
          this.loadingRoad = false
          console.log('提交请求成功！')
          return response.data
        },
        (response) => {
          console.log('提交请求失败！')
          return 'error'
        }
      )
    },
    onSelectRoad(valueRoad) {
      for (var i = viewer.dataSources._dataSources.length - 1; i >= 0; i--) {
        if (viewer.dataSources._dataSources[i].name == 'selectroad') {
          viewer.dataSources.remove(viewer.dataSources._dataSources[i])
        }
      }
      var entityget = viewer.entities.getById('entityfly')
      viewer.entities.remove(entityget)
      var datasourceTmp = new Cesium.CustomDataSource('selectroad')
      viewer.dataSources.add(datasourceTmp)
      this.roadName = valueRoad
      let url = baseURL.baseURL + 'getroutebyname?name=' + valueRoad
      console.log(url)
      axios.get(url).then(
        (response) => {
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
              // id: response.data[i].name + i,
              // name: '',
              polyline: polyline,
            }
            datasourceTmp.entities.add(entity)
          }
          var X =
            (Number(
              response.data[Math.floor(response.data.length / 2)].geom
                .substring(11, response.data[Math.floor(response.data.length / 2)].geom.length - 1)
                .replaceAll(' ', ',')
                .split(',')[0]
            ) +
              Number(
                response.data[Math.floor(response.data.length / 2)].geom
                  .substring(11, response.data[Math.floor(response.data.length / 2)].geom.length - 1)
                  .replaceAll(' ', ',')
                  .split(',')[2]
              )) /
            2
          var Y =
            (Number(
              response.data[Math.floor(response.data.length / 2)].geom
                .substring(11, response.data[Math.floor(response.data.length / 2)].geom.length - 1)
                .replaceAll(' ', ',')
                .split(',')[1]
            ) +
              Number(
                response.data[Math.floor(response.data.length / 2)].geom
                  .substring(11, response.data[Math.floor(response.data.length / 2)].geom.length - 1)
                  .replaceAll(' ', ',')
                  .split(',')[3]
              )) /
            2
          var entityfly = new Cesium.Entity({
            id: 'entityfly',
            position: Cesium.Cartesian3.fromDegrees(X, Y),
            point: {
              pixelSize: 100,
              color: Cesium.Color.WHITE.withAlpha(0),
              outlineColor: Cesium.Color.WHITE.withAlpha(0),
              outlineWidth: 1,
            },
          })
          viewer.entities.add(entityfly)
          viewer.flyTo(entityfly, {
            offset: {
              heading: Cesium.Math.toRadians(0.0),
              pitch: Cesium.Math.toRadians(-90),
              range: 5000,
            },
          })
          console.log('提交请求成功！')
          return response.data
        },
        (response) => {
          console.log('提交请求失败！')
          return 'error'
        }
      )
    },
    onSearchPOI(searchPOI) {
      this.poinames = []
      this.searchPOI = searchPOI
      this.loadingPOI = !!searchPOI
      this.loadPOIs(searchPOI)
    },
    loadPOIs(key) {
      if (!key) {
        this.poinames = []
        return
      }
      let url = baseURL.baseURL + 'getlevenshteinpoi?str1=' + key
      axios.get(url).then(
        (response) => {
          const { searchPOI } = this
          if (searchPOI !== key) return
          this.poinames = response.data
          this.loadingPOI = false
          console.log('提交请求成功！')
          return response.data
        },
        (response) => {
          console.log('提交请求失败！')
          return 'error'
        }
      )
    },
    onSelectPOI(valuePOI) {
      var selectedpoi = viewer.entities.getById('Selected POI')
      viewer.entities.remove(selectedpoi)
      this.poiName = valuePOI
      let url = baseURL.baseURL + 'getpoibyname?name=' + valuePOI
      axios.get(url).then(
        (response) => {
          var entity = new Cesium.Entity({
            id: 'Selected POI',
            position: Cesium.Cartesian3.fromDegrees(
              response.data.geom
                .substring(6, response.data.geom.length - 1)
                .replaceAll(' ', ',')
                .split(',')[0],
              response.data.geom
                .substring(6, response.data.geom.length - 1)
                .replaceAll(' ', ',')
                .split(',')[1]
            ),
            point: {
              pixelSize: 10,
              color: Cesium.Color.RED,
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
          console.log('提交请求成功！')
          return response.data
        },
        (response) => {
          console.log('提交请求失败！')
          return 'error'
        }
      )
    },
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
      this.$refs.ruleForm1.resetFields()
      this.$refs.ruleForm2.resetFields()
      this.form.distance = null
      this.form.startdistance = null
      this.form.enddistance = null
      this.form.direction = ''
      this.form.roadName = ''
      this.form.poiName = ''
      this.form.disasterEvent = ''
      this.direction = ''
      for (var i = viewer.dataSources._dataSources.length - 1; i >= 0; i--) {
        if (viewer.dataSources._dataSources[i].name == 'selectroad') {
          viewer.dataSources.remove(viewer.dataSources._dataSources[i])
        }
      }
      var entityget = viewer.entities.getById('entityfly')
      viewer.entities.remove(entityget)
      var selectedpoi = viewer.entities.getById('Selected POI')
      viewer.entities.remove(selectedpoi)
      var newpoint = viewer.entities.getById('newPoint')
      viewer.entities.remove(newpoint)
      for (var i = viewer.dataSources._dataSources.length - 1; i >= 0; i--) {
        if (viewer.dataSources._dataSources[i].name == 'selectline') {
          viewer.dataSources.remove(viewer.dataSources._dataSources[i])
        }
      }
      var entityget = viewer.entities.getById('entitylinefly')
      viewer.entities.remove(entityget)
      this.visible = false
      this.$emit('update', 0)
    },
    onSubmit() {
      var newpoint = viewer.entities.getById('newPoint')
      viewer.entities.remove(newpoint)
      for (var i = viewer.dataSources._dataSources.length - 1; i >= 0; i--) {
        if (viewer.dataSources._dataSources[i].name == 'selectline') {
          viewer.dataSources.remove(viewer.dataSources._dataSources[i])
        }
      }
      var entityget = viewer.entities.getById('entitylinefly')
      viewer.entities.remove(entityget)
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.key == 1) {
            this.$refs.ruleForm1.validate((valid) => {
              if (valid) {
                let url =
                  baseURL.baseURL +
                  'insertpointbytext?disasterid=' +
                  this.form.disasterEvent +
                  '&routename=' +
                  this.form.roadName +
                  '&poiname=' +
                  this.form.poiName +
                  '&direction=' +
                  this.form.direction +
                  '&distance=' +
                  this.form.distance
                axios.post(url).then(
                  (response) => {
                    console.log('提交请求成功！')
                    if (response.data.length > 0) {
                      // this.visible = false
                      alert(this.submitsuccess)
                      // this.$emit('update', 0)
                      var entity = new Cesium.Entity({
                        id: 'newPoint',
                        position: Cesium.Cartesian3.fromDegrees(
                          response.data
                            .substring(6, response.data.length - 1)
                            .replaceAll(' ', ',')
                            .split(',')[0],
                          response.data
                            .substring(6, response.data.length - 1)
                            .replaceAll(' ', ',')
                            .split(',')[1]
                        ),
                        point: {
                          pixelSize: 10,
                          color: Cesium.Color.BLUE,
                        },
                      })
                      viewer.entities.add(entity)
                      viewer.flyTo(entity, {
                        offset: {
                          heading: Cesium.Math.toRadians(0.0),
                          pitch: Cesium.Math.toRadians(-90),
                          range: 500,
                        },
                      })
                    } else {
                      alert(this.thedistanceexceedsthepathlength)
                    }
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
          } else if (this.key == 2) {
            this.$refs.ruleForm2.validate((valid) => {
              if (valid) {
                var datasourceTmp = new Cesium.CustomDataSource('selectline')
                viewer.dataSources.add(datasourceTmp)
                let url =
                  baseURL.baseURL +
                  'insertlinebytext?disasterid=' +
                  this.form.disasterEvent +
                  '&routename=' +
                  this.form.roadName +
                  '&poiname=' +
                  this.form.poiName +
                  '&direction=' +
                  this.form.direction +
                  '&startdistance=' +
                  this.form.startdistance +
                  '&enddistance=' +
                  this.form.enddistance
                axios.post(url).then(
                  (response) => {
                    console.log('提交请求成功！')
                    // this.visible = false
                    alert(this.submitsuccess)
                    // this.$emit('update', 0)
                    for (var i = 0; i < response.data.length; i++) {
                      var polyline = new Cesium.PolylineGraphics({
                        positions: Cesium.Cartesian3.fromDegreesArray(
                          response.data[i]
                            .substring(11, response.data[i].length - 1)
                            .replaceAll(' ', ',')
                            .split(',')
                        ),
                        width: 10,
                        material: Cesium.Color.BLUE,
                        clampToGround: true,
                      })
                      var entity = {
                        // id: response.data[i].name + i,
                        // name: '',
                        polyline: polyline,
                      }
                      datasourceTmp.entities.add(entity)
                    }
                    var X =
                      (Number(
                        response.data[Math.floor(response.data.length / 2)]
                          .substring(11, response.data[Math.floor(response.data.length / 2)].length - 1)
                          .replaceAll(' ', ',')
                          .split(',')[0]
                      ) +
                        Number(
                          response.data[Math.floor(response.data.length / 2)]
                            .substring(11, response.data[Math.floor(response.data.length / 2)].length - 1)
                            .replaceAll(' ', ',')
                            .split(',')[2]
                        )) /
                      2
                    var Y =
                      (Number(
                        response.data[Math.floor(response.data.length / 2)]
                          .substring(11, response.data[Math.floor(response.data.length / 2)].length - 1)
                          .replaceAll(' ', ',')
                          .split(',')[1]
                      ) +
                        Number(
                          response.data[Math.floor(response.data.length / 2)]
                            .substring(11, response.data[Math.floor(response.data.length / 2)].length - 1)
                            .replaceAll(' ', ',')
                            .split(',')[3]
                        )) /
                      2
                    var entityfly = new Cesium.Entity({
                      id: 'entitylinefly',
                      position: Cesium.Cartesian3.fromDegrees(X, Y),
                      point: {
                        pixelSize: 100,
                        color: Cesium.Color.WHITE.withAlpha(0),
                        outlineColor: Cesium.Color.WHITE.withAlpha(0),
                        outlineWidth: 1,
                      },
                    })
                    viewer.entities.add(entityfly)
                    viewer.flyTo(entityfly, {
                      offset: {
                        heading: Cesium.Math.toRadians(0.0),
                        pitch: Cesium.Math.toRadians(-90),
                        range: 500,
                      },
                    })
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
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
      if (this.key == 1) {
        this.$refs.ruleForm1.resetFields()
      } else if (this.key == 2) {
        this.$refs.ruleForm2.resetFields()
      }
      this.direction = ''
    },
    callback(key) {
      this.key = key
    },
  },
}
</script>
