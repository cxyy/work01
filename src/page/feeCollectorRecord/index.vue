<template>
  <div id="fee_collector_record" class="com-bgcolor">
    <div class="search-box">
      <div class="search-form-item">
        <label>时间段：</label>
        <div class="form-item-content">
          <el-date-picker v-model="form.timeChoose" type="datetimerange" align="right" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['12:00:00', '08:00:00']"></el-date-picker>
        </div>
      </div>
      <div class="search-form-item">
        <label>姓名：</label>
        <div class="form-item-content">
          <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
        </div>
      </div>
      <div class="search-form-item">
        <label>所属单位：</label>
        <div class="form-item-content">
          <el-select v-model="form.account" placeholder="请选择所属单位">
            <el-option v-for="item in accountList" :label="item.value" :value="item.datakey" :key="item.datakey"></el-option>
          </el-select>
        </div>
      </div>
      <div class="search-form-btn">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </div>
    <div class="search-content">
      <div class="table-box">
        <el-table :data="tableData">
          <el-table-column prop="sortIndex" label="序号"></el-table-column>
          <el-table-column prop="name" label="姓名"></el-table-column>
          <el-table-column prop="unit" label="所属单位"></el-table-column>
          <el-table-column prop="revenue" label="总收入"></el-table-column>
          <el-table-column prop="cash" label="现金"></el-table-column>
          <el-table-column prop="online" label="线上"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="details(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="currentPage" :page-size="pageSize"
                         :page-sizes="[10, 15, 20, 50]" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <component :is="visited.page" :visited="visited" :comData="comData" @refresh="init"></component>
  </div>
</template>

<script>
  import detailModule from './module/detailModule'
  import Axios from '@/common/Axios/interface'
  import mixin from '@/common/mixins'

  export default {
    name: 'feeCollectorRecord',
    mixins: [mixin],
    components: {
      'detailModule': detailModule
    },
    data () {
      return {
        accountList: [],
        form: {
          name: '',
          account: '',
          timeChoose: ''
        },
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
      details (row) {
        this.comData = row
        this.visited.page = 'detailModule'
      },
      search () {
        this.init()
      },
      reset () {
        this.form = {
          name: '',
          account: '',
          timeChoose: ''
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
      init () {
        let params = {
          pageNum: this.currentPage,
          pageLength: this.pageSize
        }
        params = Object.assign(params, this.form)
        Axios.getmarkedcars(params).then(data => {
          if (data.rtnCode === '1') {
            let res = data.rtnMap
            this.tableData = res.result
            this.total = res.num
          }
        })
      }
    },
    mounted () {
      this.$router.push({name: 'page404'})
    }
  }
</script>

<style lang="scss">
  #fee_collector_record {}
</style>
