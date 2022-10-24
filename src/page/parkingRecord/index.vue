<template>
  <div id="parking_record" class="com-bgcolor">
    <div class="search-box">
      <div class="search-form-item">
        <label>车牌号码：</label>
        <div class="form-item-content">
          <el-input v-model="form.carId" placeholder="请输入车牌号码"></el-input>
        </div>
      </div>
      <div class="search-form-item">
        <label>停车场：</label>
        <div class="form-item-content">
          <el-select v-model="form.parkid" placeholder="请选择停车场">
            <el-option v-for="item in parkList" :label="item.PNAME" :value="item.ID" :key="item.ID"></el-option>
          </el-select>
        </div>
      </div>
      <div class="search-form-item">
        <label>订单状态：</label>
        <div class="form-item-content">
          <el-select v-model="form.payStatus" placeholder="请选择订单状态">
            <el-option v-for="item in payStatusList" :label="item.label" :value="item.key" :key="item.key"></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="search-box" style="padding-top: 0">
      <div class="search-form-item">
        <label>日期：</label>
        <div class="form-item-content">
          <el-date-picker v-model="form.date" value-format="timestamp" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </div>
      </div>
      <div>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
        <el-button type="success" @click="exportData"><i class="w-icon-import"></i>导出</el-button>
      </div>
    </div>
    <div class="search-content">
      <div class="table-box">
        <el-table :data="tableData">
          <el-table-column prop="sortIndex" label="序号"></el-table-column>
          <el-table-column prop="CARID" label="车牌号码"></el-table-column>
          <el-table-column prop="PNAME" label="停车场名称"></el-table-column>
          <el-table-column prop="ENTRYTIME" label="入场时间"></el-table-column>
          <el-table-column prop="DEPARTURETIME" label="出场时间"></el-table-column>
          <el-table-column prop="PAYRESULT" label="订单状态"></el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="currentPage"
                         :page-size="pageSize"
                         :page-sizes="[10, 15, 20, 50]" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <component :is="visited.page" :visited="visited"></component>
  </div>
</template>

<script>
  import exportModel from './module/exportModel'
  import Axios from '@/common/Axios/interface'
  import mixin from '@/common/mixins'

  export default {
    name: 'parkingRecord',
    mixins: [mixin],
    components: {
      'exportModel': exportModel
    },
    data () {
      return {
        payStatusList: [
          {key: '0', label: '未缴费'},
          {key: '1', label: '已缴费'}
        ],
        parkList: [],
        form: {
          carId: '',
          parkid: '',
          payStatus: '',
          date: ''
        },
        currentPage: 1,
        pageSize: 10,
        total: 0,
        tableData: [],
        visited: {
          page: null
        }
      }
    },
    methods: {
      exportData () {
        let exportTime = ''
        if (this.form.date === '' || this.form.date === null) {
          exportTime = ''
        }
        if (this.form.date !== '' && this.form.date !== null) {
          exportTime = JSON.stringify(this.form.date)
        }
        let params = {
          carId: this.form.carId,
          parkid: this.form.parkid,
          payStatus: this.form.payStatus,
          date: exportTime
        }
        Axios.parkrecordsexcel(params).then(res => {
          if (res.status !== 200) {
            this.$message({
              type: 'error',
              message: '网络错误,导出失败,请稍后重试!'
            })
          }
        })
      },
      search () {
        this.init()
      },
      reset () {
        this.form = {
          carId: '',
          parkid: '',
          payStatus: '',
          date: ''
        }
      },
      pageSizeChange (val) {
        this.pageSize = val
        this.init()
      },
      currentPageChange (val) {
        this.currentPage = val
        this.init()
      },
      getparks () {
        Axios.getparks().then(data => {
          if (data.rtnCode === '1') {
            this.parkList = data.rtnMap.result
          }
        })
      },
      init () {
        let params = {
          pageNum: this.currentPage,
          pageLength: this.pageSize
        }
        params = Object.assign(params, this.form)
        Axios.parkrecords(params).then(data => {
          if (data.rtnCode === '1') {
            let res = data.rtnMap
            let startIndex = (this.currentPage - 1) * this.pageSize
            res.result.forEach(val => {
              val.sortIndex = ++startIndex
            })
            this.tableData = res.result
            this.total = res.num
          }
        })
      }
    },
    mounted () {
      this.init()
      this.getparks()
    }
  }
</script>

<style lang="scss">
  #parking_record {}
</style>
