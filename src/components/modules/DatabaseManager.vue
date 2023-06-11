<template>
  <div>
    <a-table class="div_table" :columns="columns" :data-source="data" bordered>
      <template slot="title">
        <div style="font-size: 30px">灾害表</div>
      </template>
      <template
        v-for="col in ['disasterName', 'startTime', 'endTime', 'pointEventID', 'lineEventID']"
        :slot="col"
        slot-scope="text, record"
      >
        <div :key="col">
          <a-input
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            @change="(e) => handleChange(e.target.value, record.key, col)"
          />
          <template v-else>
            {{ text }}
          </template>
        </div>
      </template>
      <template slot="edit" slot-scope="text, record">
        <div class="editable-row-operations">
          <span v-if="record.editable">
            <a @click="() => save(record.key)">保存</a>
            <a-popconfirm title="确定取消？" ok-text="是" cancel-text="否" @confirm="() => cancel(record.key)">
              <a>取消</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a :disabled="editingKey !== ''" @click="() => edit(record.key)">编辑</a>
          </span>
        </div>
      </template>
      <template slot="delete" slot-scope="text, record">
        <span>
          <a-popconfirm
            v-if="data.length"
            title="确定删除？"
            ok-text="是"
            cancel-text="否"
            @confirm="() => onDelete(record.key)"
          >
            <a>删除</a>
          </a-popconfirm>
        </span>
      </template>
      <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
        {{ record.description }}
      </p>
    </a-table>
  </div>
</template>
<script>
const columns = [
  {
    title: '灾害名称',
    dataIndex: 'disasterName',
    width: '10%',
    scopedSlots: { customRender: 'disasterName' },
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    width: '15%',
    scopedSlots: { customRender: 'startTime' },
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    width: '15%',
    scopedSlots: { customRender: 'endTime' },
  },
  {
    title: '点事件ID列',
    dataIndex: 'pointEventID',
    width: '15%',
    scopedSlots: { customRender: 'pointEventID' },
  },
  {
    title: '线事件ID列',
    dataIndex: 'lineEventID',
    width: '15%',
    scopedSlots: { customRender: 'lineEventID' },
  },
  {
    title: '编辑',
    dataIndex: 'edit',
    width: '10%',
    scopedSlots: { customRender: 'edit' },
  },
  {
    title: '删除',
    dataIndex: 'delete',
    width: '10%',
    scopedSlots: { customRender: 'delete' },
  },
]
let count = 0
const data = []
for (let i = 0; i < 3; i++) {
  data.push({
    key: count.toString(),
    disasterName: `Disaster ${count}`,
    startTime: '2000-03-06 13:07:09',
    endTime: '2000-03-09 15:08:15',
    pointEventID: 2,
    lineEventID: 3,
    description:
      '这是描述信息这是描述信息这是描述信息这是描述信息这是描述信息这是描述信息这是描述信息这是描述信息这是描述信息这是描述信息这是描述信息这是描述信息这是描述信息这是描述信息这是描述信息这是描述信息这是描述信息这是描述信息这是描述信息这是描述信息这是描述信息这是描述信息这是描述信息这是描述信息这是描述信息这是描述信息这是描述信息',
  })
  count = count + 1
}
export default {
  data() {
    this.cacheData = data.map((item) => ({ ...item }))
    return {
      data,
      columns,
      editingKey: '',
      count,
    }
  },
  components: {},
  mounted() {
    let self = this
    this.$nextTick(() => {
      this.$bus.$on('insertForm', (val) => {
        console.log(val)
        const count = self.count
        console.log(count)
        const data = self.data
        const newData = {
          key: count.toString(),
          disasterName: val.disasterName,
          startTime: val.startTime.toString(),
          endTime: val.endTime.toString(),
          pointEventID: 2222,
          lineEventID: 5555,
          description: val.description,
        }
        self.data = [...data, newData]
        self.count = count + 1
        this.data = self.data
        this.count = self.count
        console.log(this.count)
      })
    })
  },
  methods: {
    handleChange(value, key, column) {
      const newData = [...this.data]
      const target = newData.filter((item) => key === item.key)[0]
      if (target) {
        target[column] = value
        this.data = newData
      }
    },
    edit(key) {
      const newData = [...this.data]
      const target = newData.filter((item) => key === item.key)[0]
      this.editingKey = key
      if (target) {
        target.editable = true
        this.data = newData
      }
    },
    save(key) {
      const newData = [...this.data]
      const newCacheData = [...this.cacheData]
      const target = newData.filter((item) => key === item.key)[0]
      const targetCache = newCacheData.filter((item) => key === item.key)[0]
      if (target && targetCache) {
        delete target.editable
        this.data = newData
        Object.assign(targetCache, target)
        this.cacheData = newCacheData
      }
      this.editingKey = ''
    },
    cancel(key) {
      const newData = [...this.data]
      const target = newData.filter((item) => key === item.key)[0]
      this.editingKey = ''
      if (target) {
        Object.assign(target, this.cacheData.filter((item) => key === item.key)[0])
        delete target.editable
        this.data = newData
      }
    },
    onDelete(key) {
      const newData = [...this.data]
      this.data = newData.filter((item) => item.key !== key)
    },
    beforeDestroy() {
      this.$bus.$off('insertForm') //销毁事件监听器
    },
  },
}
</script>
<style scoped>
.div_table {
  margin-left: 300px;
  margin-right: 300px;
  height: 50px;
}
.editable-row-operations a {
  margin-right: 8px;
}
</style>
