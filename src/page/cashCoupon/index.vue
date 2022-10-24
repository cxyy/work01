<template>
  <div id="cash_coupon" class="com-bgcolor">
    <div class="search-box">
      <div class="search-form-item">
        <label>代金券名称：</label>
        <div class="form-item-content">
          <el-input v-model="form.name" placeholder="请输入代金券名称"></el-input>
        </div>
      </div>
      <div class="search-form-item">
        <label>代金券种类：</label>
        <div class="form-item-content">
          <el-select v-model="form.type" placeholder="请选择代金券种类">
            <el-option v-for="item in typeList" :label="item.label" :value="item.key" :key="item.key"></el-option>
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
        <el-button type="primary" @click="addCash"><i class="w-icon-build"></i>新建</el-button>
        <el-button type="warning" @click="delCash"><i class="w-icon-del"></i>删除</el-button>
      </div>
      <div class="table-box">
        <el-table :data="tableData" ref="multipleTable" @selection-change="selectionData">
          <el-table-column type="selection" :width="GLOBALWIDTH"></el-table-column>
          <el-table-column prop="sortIndex" label="序号"></el-table-column>
          <el-table-column prop="NAME" label="代金券名称"></el-table-column>
          <el-table-column prop="RES" label="代金券种类"></el-table-column>
          <el-table-column prop="USED" label="已使用"></el-table-column>
          <el-table-column prop="NUM" label="代金券数量"></el-table-column>
          <el-table-column prop="PNAME" label="停车场"></el-table-column>
          <el-table-column prop="DUETIME" label="过期时间"></el-table-column>
          <el-table-column prop="VAL" label="金额/小时/次数" width="140"></el-table-column>
          <el-table-column label="操作" width="140">
            <template slot-scope="scope">
              <el-button type="text" @click="editCash(scope.row)">编辑</el-button>
              <el-button type="text" @click="qrcode(scope.row)">二维码</el-button>
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
    <component :is="visited.page" :visited="visited" :comData="comData" :typeList="typeList"
               @refresh="init"></component>
  </div>
</template>

<script>
  import cashModel from './module/cashModel'
  import codeModel from './module/codeModel'
  import Axios from '@/common/Axios/interface'
  import mixin from '@/common/mixins'

  export default {
    name: 'cashCoupon',
    mixins: [mixin],
    components: {
      'cashModel': cashModel,
      'codeModel': codeModel
    },
    data () {
      return {
        typeList: [
          {key: 0, label: '时长券'},
          {key: 1, label: '代金券'},
          {key: 2, label: '次卡'}
        ],
        form: {
          name: '',
          type: ''
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
      addCash () {
        this.comData = {}
        this.visited.page = 'cashModel'
      },
      editCash (row) {
        this.comData = row
        this.visited.page = 'cashModel'
      },
      qrcode (row) {
        this.comData = row
        this.visited.page = 'codeModel'
      },
      delCash () {
        if (!this.multipleSelection.length) {
          this.$message('请选择数据')
        } else {
          this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let idsArr = ''
            this.multipleSelection.forEach(val => {
              idsArr = idsArr + val.ID + ','
            })
            idsArr = idsArr.substring(0, idsArr.length - 1)
            Axios.deldis({ids: idsArr}).then(data => {
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
          }).catch(() => {
          })
        }
      },
      search () {
        this.init()
      },
      reset () {
        this.form = {
          name: '',
          type: ''
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
      selectionData (val) {
        this.multipleSelection = val
      },
      init () {
        let params = {
          pageNum: this.currentPage,
          pageLength: this.pageSize
        }
        params = Object.assign(params, this.form)
        Axios.getdis(params).then(data => {
          if (data.rtnCode === '1') {
            let res = data.rtnMap
            this.tableData = res.result
            console.log(this.tableData)
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
  #cash_coupon {
  }
</style>
