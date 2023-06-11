<template>
  <div>
    <a-drawer
      :title="$t('adddisasterevent')"
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
        <a-form-model-item ref="disasterName" :label="$t('disastername')" prop="disasterName" has-feedback>
          <a-input
            v-model="form.disasterName"
            v-decorator="['disasterName']"
            :allowClear="true"
            :placeholder="$t('pleaseinputdisastername')"
          />
        </a-form-model-item>
        <a-form-model-item :label="$t('disasterstarttime')" required prop="startTime" has-feedback>
          <a-date-picker
            v-model="form.startTime"
            type="date"
            :placeholder="$t('pleaseselecttime')"
            style="width: 100%"
            :allowClear="true"
            show-time
          />
        </a-form-model-item>
        <a-form-model-item :label="$t('disasterendtime')" required prop="endTime" has-feedback>
          <a-date-picker
            v-model="form.endTime"
            type="date"
            :placeholder="$t('pleaseselecttime')"
            style="width: 100%"
            :allowClear="true"
            show-time
          />
        </a-form-model-item>
        <a-form-model-item :label="$t('description')" prop="description" has-feedback>
          <a-input
            v-model="form.description"
            type="textarea"
            :auto-size="{ minRows: 4, maxRows: 6 }"
            :allowClear="true"
            :placeholder="$t('pleaseinputdescription')"
          />
        </a-form-model-item>
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
        <a-button type="primary" @click="onSubmit"> {{ $t('submit') }} </a-button>
      </div>
    </a-drawer>
  </div>
</template>
<script>
let Cesium = require('cesium/Cesium')
require('cesium/Widgets/widgets.css')
import DatabaseManager from './DatabaseManager.vue'
import moment from 'moment'
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
        disasterName: '',
        startTime: undefined,
        endTime: undefined,
        description: '',
      },
      visible: false,
    }
  },
  computed: {
    rules() {
      return {
        disasterName: [{ required: true, message: this.$t('pleaseinputdisastername'), trigger: 'blur' }],
        startTime: [{ required: true, message: this.$t('pleaseselectdisasterstarttime'), trigger: 'change' }],
        endTime: [{ required: true, message: this.$t('pleaseselectdisasterendtime'), trigger: 'change' }],
        description: [{ required: true, message: this.$t('pleaseinputdescription'), trigger: 'blur' }],
      }
    },
    submitsuccess() {
      return this.$t('submitsuccess')
    },
    submiterror() {
      return this.$t('submiterror')
    },
  },
  components: {
    DatabaseManager,
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
    },
    onClose() {
      this.$refs.ruleForm.resetFields()
      this.visible = false
      this.$emit('update', 0)
    },
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.visible = false
          alert(this.submitsuccess)
          this.$emit('update', 0)
          //console.log(moment(this.form.endTime).format('YYYY-MM-DD HH:mm:ss'))
          let url =
            baseURL.baseURL +
            'insertdisaster?name=' +
            this.form.disasterName +
            '&description=' +
            this.form.description +
            '&starttime=' +
            moment(this.form.startTime).format('YYYY/MM/DD HH:mm:ss') +
            '&endtime=' +
            moment(this.form.endTime).format('YYYY/MM/DD HH:mm:ss')
          axios.post(url).then(
            (response) => {
              console.log('提交请求成功！')
              return response.data
            },
            (response) => {
              console.log('提交请求失败！')
              return 'error'
            }
          )
        } else {
          alert(this.submiterror)
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