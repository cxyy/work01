<template>
  <div id="receipts_record" class="com-bgcolor">
    <div class="search-box">
      <div class="search-form-item">
        <label>订单状态：</label>
        <el-select v-model="form.status" placeholder="请选择订单状态">
          <el-option v-for="item in statusList" :label="item.label" :value="item.key" :key="item.key"></el-option>
        </el-select>
      </div>
      <div class="search-form-item">
        <label>停车场：</label>
        <div class="form-item-content">
          <el-select v-model="form.parkid" placeholder="请选择停车场">
            <el-option v-for="item in parkList" :label="item.PNAME" :value="item.ID" :key="item.ID"></el-option>
          </el-select>
        </div>
      </div>
      <div class="search-form-item" style="width: 44%; padding-right: 0">
        <label>收款时间：</label>
        <div class="form-item-content">
          <el-date-picker align="right" v-model="form.time" value-format="timestamp" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </div>
      </div>
    </div>
    <div style="padding: 0 0 20px 30px">
      <el-button type="primary" @click="search">查询</el-button>
      <el-button @click="reset">重置</el-button>
      <el-button type="success" @click="exportData"><i class="w-icon-import" style="margin-right: 10px"></i>导出</el-button>
    </div>
    <div class="search-content">
      <div class="table-box">
        <el-table :data="tableData">
          <el-table-column prop="sortIndex" label="序号"></el-table-column>
          <el-table-column prop="TIME" label="订单时间"></el-table-column>
          <el-table-column prop="MONEY" label="订单金额"></el-table-column>
          <el-table-column prop="PNAME" label="停车场"></el-table-column>
          <el-table-column prop="NAME" label="收款人"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.STATUS===0">支付失败</span>
              <span v-if="scope.row.STATUS===1">支付成功</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="details(scope.row)" class="is-green">查款详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="currentPage"
                         :page-size="pageSize"
                         :page-sizes="[10, 15, 20, 50]" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <component :is="visited.page" :visited="visited" :comData="comData"></component>
  </div>
</template>

<script>
  import detailModel from './module/detailModel'
  import Axios from '@/common/Axios/interface'
  import mixin from '@/common/mixins'

  export default {
    name: 'receiptsRecord',
    mixins: [mixin],
    components: {
      'detailModel': detailModel
    },
    data () {
      return {
        statusList: [
          {key: 0, label: '支付失败'},
          {key: 1, label: '支付成功'}
        ],
        form: {
          status: '',
          parkid: '',
          time: ''
        },
        parkList: [],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        tableData: [],
        visited: {
          page: null
        },
        comData: {}
      }
    },
    methods: {
      exportData () {
        let exportTime = ''
        if (this.form.time === '' || this.form.time === null) {
          exportTime = ''
        }
        if (this.form.time !== '' && this.form.time !== null) {
          exportTime = JSON.stringify(this.form.time)
        }
        let params = {
          status: this.form.status,
          parkid: this.form.parkid,
          date: exportTime
        }
        Axios.payexcel(params).then(res => {
          if (res.status !== 200) {
            this.$message({
              type: 'error',
              message: '网络错误,导出失败,请稍后重试!'
            })
          }
        })
      },
      details (row) {
        this.comData = row
        this.visited.page = 'detailModel'
      },
      search () {
        this.init()
      },
      reset () {
        this.form = {
          status: '',
          parkid: '',
          time: ''
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
        if (params.time === '' || params.time === null) {
          params.startTime = ''
          params.endTime = ''
        }
        if (params.time !== '' && params.time !== null) {
          params.startTime = params.time[0]
          params.endTime = params.time[1]
        }
        delete params.time
        Axios.getPayManagement(params).then(data => {
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
      this.getparks()
      this.init()
    }
  }
</script>

<style lang="scss">
  #receipts_record {}
</style>
