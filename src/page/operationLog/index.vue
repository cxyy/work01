<template>
  <div id="operation_log" class="com-bgcolor">
    <div class="search-box">
      <div class="search-form-item">
        <label>用户操作：</label>
        <div class="form-item-content">
          <el-input v-model="form.content" placeholder="用户操作、用户名"></el-input>
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
          <el-table-column prop="ID" label="Id"></el-table-column>
          <el-table-column prop="NAME" label="用户名"></el-table-column>
          <el-table-column prop="WEBLOG" label="用户操作"></el-table-column>
          <el-table-column prop="TAKETIMES" label="执行时长(毫秒)"></el-table-column>
          <el-table-column prop="IP" label="IP地址"></el-table-column>
          <el-table-column prop="TIME" label="操作时间" width="180"></el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="currentPage"
                         :page-size="pageSize"
                         :page-sizes="[10, 15, 20, 50]" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Axios from '@/common/Axios/interface'
  import mixin from '@/common/mixins'

  export default {
    name: 'operationLog',
    mixins: [mixin],
    data () {
      return {
        form: {
          content: ''
        },
        currentPage: 1,
        pageSize: 10,
        total: 0,
        tableData: []
      }
    },
    methods: {
      search () {
        this.init()
      },
      reset () {
        this.form = {
          content: ''
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
        Axios.getoperation(params).then(data => {
          if (data.rtnCode === '1') {
            let res = data.rtnMap
            this.tableData = res.result
            this.total = res.num
          }
        })
      }
    },
    mounted () {
      this.init()
    }
  }
</script>

<style lang="scss">
  #operation_log {}
</style>
