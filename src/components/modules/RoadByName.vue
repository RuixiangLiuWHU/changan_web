<template>
  <div>
    <a-drawer :title="$t('roadbyname')" :width="600" :visible="visible" :bodyStyle="{ paddingBottom: '80px' }"
      :maskClosable="false" :mask="false" :placement="'right'" :wrapStyle="{ paddingTop: '55px' }" @close="onClose">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="name" :label="$t('name')" prop="name" has-feedback>
          <a-input v-model="form.name" v-decorator="['name']" :allowClear="true" :placeholder="$t('pleaseinputname')" />
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
        name: '',
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
        name: [{ required: true, message: this.$t('pleaseinputrname'), trigger: 'blur' }],
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
          let url = baseURL.baseURL + 'getroadsbyname?name=' + this.form.name
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
  },
}
</script>