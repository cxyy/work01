<template>
  <div id="role_manage" class="com-bgcolor">
    <div class="search-box">
      <div class="search-form-item">
        <label>角色：</label>
        <div class="form-item-content">
          <el-input v-model="form.name" placeholder="请输入角色"></el-input>
        </div>
      </div>
      <div class="search-form-btn">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </div>
    <div class="search-content">
      <div class="operate-box">
        <el-button type="primary" @click="addRole"><i class="w-icon-build"></i>新建</el-button>
        <el-button type="warning" @click="delRole"><i class="w-icon-del"></i>删除</el-button>
      </div>
      <div class="table-box">
        <el-table :data="tableData" ref="multipleTable" @selection-change="selectionData">
          <el-table-column type="selection" :width="GLOBALWIDTH"></el-table-column>
          <el-table-column prop="sortIndex" label="序号"></el-table-column>
          <el-table-column prop="name" label="角色名称"></el-table-column>
          <el-table-column prop="time" label="创建时间"></el-table-column>
          <el-table-column prop="comment" label="备注"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="editRole(scope.row)"><span>编辑</span></el-button>
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
  import roleModel from './module/roleModel'
  import Axios from '@/common/Axios/interface'
  import mixin from '@/common/mixins'

  export default {
    name: 'roleManage',
    mixins: [mixin],
    components: {
      'roleModel': roleModel
    },
    data () {
      return {
        form: {
          name: ''
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
      addRole () {
        this.comData = {}
        this.visited.page = 'roleModel'
      },
      editRole (row) {
        this.comData = row
        this.visited.page = 'roleModel'
      },
      delRole () {
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
              idsArr = idsArr + val.id + ','
            })
            idsArr = idsArr.substring(0, idsArr.length - 1)
            Axios.delrole({ids: idsArr}).then(data => {
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
          name: ''
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
        Axios.getrole(params).then(data => {
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
  #role_manage{}
</style>
