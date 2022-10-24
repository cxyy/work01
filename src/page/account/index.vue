<template>
  <div id="account" class="com-bgcolor">
    <div class="search-box">
      <div class="search-form-item">
        <label>账户状态：</label>
        <div class="form-item-content">
          <el-select v-model="form.state" placeholder="请选择账户状态">
            <el-option v-for="item in stateList" :label="item.label" :value="item.key" :key="item.key"></el-option>
          </el-select>
        </div>
      </div>
      <div class="search-form-btn">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </div>
    <div class="search-content">
      <div class="operate-box">
        <el-button type="primary" @click="addAccount"><i class="w-icon-build"></i>新建</el-button>
        <el-button type="warning" @click="delAccount"><i class="w-icon-del"></i>删除</el-button>
      </div>
      <div class="table-box">
        <el-table :data="tableData" ref="multipleTable" @selection-change="selectionData">
          <el-table-column type="selection" :width="GLOBALWIDTH"></el-table-column>
          <el-table-column prop="sortIndex" label="序号"></el-table-column>
          <el-table-column prop="name" label="账户名称"></el-table-column>
          <el-table-column label="微信">
            <template slot-scope="scope">
              <i :class="{'w-icon-bound color-blue': scope.row.wxAppid==='', 'w-icon-bounded color-green': scope.row.wxAppid!=='' && scope.row.wxCanEdit===true, 'w-icon-edit color-blue': scope.row.wxCanEdit==='editing'}"
                 @click="editWeixin(scope.row)" @mouseover="wxIconHover(scope.row)" @mouseleave="wxIconHoverLeave(scope.row)"></i>
            </template>
          </el-table-column>
          <el-table-column label="支付宝">
            <template slot-scope="scope">
              <i :class="{'w-icon-bound color-blue': scope.row.alAppid==='', 'w-icon-bounded color-green': scope.row.alAppid!=='' && scope.row.zfbCanEdit===true, 'w-icon-edit color-blue': scope.row.zfbCanEdit==='editing'}"
                 @click="editZhifubao(scope.row)" @mouseover="zfbIconHover(scope.row)" @mouseleave="zfbIconHoverLeave(scope.row)"></i>
            </template>
          </el-table-column>
          <el-table-column label="启用状态">
            <template slot-scope="scope">
              <span class="color-green" v-if="scope.row.state===1">启用</span>
              <span class="color-red" v-if="scope.row.state===0">未启用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="editAccount(scope.row)">编辑</el-button>
              <el-button type="text" @click="changeState(scope.row)" v-if="scope.row.state===0">启用</el-button>
              <el-button type="text" @click="changeState(scope.row)" v-if="scope.row.state===1">停用</el-button>
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
  import accountModel from './module/accountModel'
  import weixinModel from './module/weixinModel'
  import zhifubaoModel from './module/zhifubaoModel'
  import Axios from '@/common/Axios/interface'
  import mixin from '@/common/mixins'

  export default {
    name: 'account',
    mixins: [mixin],
    components: {
      'accountModel': accountModel,
      'weixinModel': weixinModel,
      'zhifubaoModel': zhifubaoModel
    },
    data () {
      return {
        stateList: [
          {key: 0, label: '未启用'},
          {key: 1, label: '启用'}
        ],
        form: {
          state: ''
        },
        currentPage: 1,
        pageSize: 10,
        total: 0,
        tableData: [],
        multipleSelection: [],
        visited: {
          page: null
        },
        comData: {}
      }
    },
    methods: {
      wxIconHover (row) {
        if (row.wxAppid !== '') {
          row.wxCanEdit = 'editing'
        }
      },
      wxIconHoverLeave (row) {
        row.wxCanEdit = true
      },
      zfbIconHover (row) {
        if (row.alAppid !== '') {
          row.zfbCanEdit = 'editing'
        }
      },
      zfbIconHoverLeave (row) {
        row.zfbCanEdit = true
      },
      changeState (row) {
        let params = {
          id: row.id,
          state: row.state === 0 ? 1 : 0
        }
        Axios.editAccount(params).then(data => {
          this.$message({
            type: 'info',
            message: data.rtnMsg
          })
          if (data.rtnCode === '1') {
            this.init()
          }
        })
      },
      addAccount () {
        this.comData = {}
        this.visited.page = 'accountModel'
      },
      editAccount (row) {
        this.comData = row
        this.visited.page = 'accountModel'
      },
      editWeixin (row) {
        this.comData = row
        this.visited.page = 'weixinModel'
      },
      editZhifubao (row) {
        this.comData = row
        this.visited.page = 'zhifubaoModel'
      },
      delAccount () {
        if (!this.multipleSelection.length){
          this.$message('请选择数据')
        } else {
          this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let idsArr = ''
            this.multipleSelection.forEach(val => {
              idsArr = idsArr + val.id + ','
            })
            idsArr = idsArr.substring(0, idsArr.length - 1)
            Axios.delAccount({ids: idsArr}).then(data => {
              if (data.rtnCode === '1') {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.init()
              } else {
                this.$message({
                  type: 'error',
                  message: '网络错误，删除失败!'
                })
              }
            })
          }).catch(() => {})
        }
      },
      search (){
        this.init()
      },
      reset (){
        this.form = {
          state: ''
        }
      },
      pageSizeChange(val) {
        this.pageSize = val
        this.init()
      },
      currentPageChange(val) {
        this.currentPage = val
        this.init()
      },
      selectionData(val) {
        this.multipleSelection = val
      },
      init () {
        let params = {
          pageNum: this.currentPage,
          pageLength: this.pageSize
        }
        params = Object.assign(params, this.form)
        Axios.getAccount(params).then(data => {
          if (data.rtnCode === '1') {
            let res = data.rtnMap
            res.result.forEach(val => {
              if (val.wxAppid !== '') {
                val.wxCanEdit = true
              }
              if (val.alAppid !== '') {
                val.zfbCanEdit = true
              }
            })
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
  #account{
    .color-blue{
      color: #4084FF;
      cursor: pointer;
    }
    .color-green{
      color: #61AF42;
    }
    .color-red{
      color: #DA2E2E;
    }
  }
</style>
