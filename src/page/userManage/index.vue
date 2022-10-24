<template>
  <div id="user_manage" class="com-bgcolor">
    <div class="search-box">
      <div class="search-form-item">
        <label>账户：</label>
        <div class="form-item-content">
          <el-input v-model="form.account" placeholder="请输入账户"></el-input>
        </div>
      </div>
      <div class="search-form-item">
        <label>角色类型：</label>
        <el-select v-model="form.roleId" placeholder="请选择角色类型">
          <el-option v-for="item in roleList" :label="item.VALUE" :value="item.DATAKEY" :key="item.DATAKEY"></el-option>
        </el-select>
      </div>
      <div class="search-form-btn">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </div>
    <div class="search-content">
      <div class="operate-box">
        <el-button type="primary" @click="addUser"><i class="w-icon-build"></i>新建</el-button>
        <el-button type="warning" @click="delUser"><i class="w-icon-del"></i>删除</el-button>
      </div>
      <div class="table-box">
        <el-table :data="tableData" ref="multipleTable" @selection-change="selectionData">
          <el-table-column type="selection" :width="GLOBALWIDTH"></el-table-column>
          <el-table-column prop="sortIndex" label="序号"></el-table-column>
          <el-table-column prop="ACCOUNT" label="账户"></el-table-column>
          <el-table-column prop="NAME" label="姓名"></el-table-column>
          <el-table-column prop="ROLE" label="角色类型"></el-table-column>
          <el-table-column prop="DEPT" label="所属组织"></el-table-column>
          <el-table-column prop="EMAIL" label="邮箱"></el-table-column>
          <el-table-column prop="TEL" label="手机号"></el-table-column>
          <el-table-column prop="STATUS" label="状态"></el-table-column>
          <el-table-column prop="CREATETIME" label="创建时间"></el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" @click="editUser(scope.row)">编辑</el-button>
              <el-button type="text" @click="modPwd(scope.row)">修改密码</el-button>
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
    <component :is="visited.page" :visited="visited" :comData="comData" @refresh="init"
               :roleList="roleList"></component>
  </div>
</template>

<script>
  import userModel from './module/userModel'
  import modPwd from './module/modPwd'
  import Axios from '@/common/Axios/interface'
  import mixin from '@/common/mixins'

  export default {
    name: 'userManage',
    mixins: [mixin],
    components: {
      'userModel': userModel,
      'modPwd': modPwd
    },
    data () {
      return {
        roleList: [],
        form: {
          account: '',
          roleId: ''
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
      getRoleList () {
        Axios.getroletype().then(data => {
          if (data.rtnCode === '1') {
            this.roleList = data.rtnMap.result
          }
        })
      },
      modPwd (row) {
        this.comData = row
        this.visited.page = 'modPwd'
      },
      addUser () {
        this.comData = {}
        this.visited.page = 'userModel'
      },
      editUser (row) {
        this.comData = row
        this.visited.page = 'userModel'
      },
      delUser () {
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
            Axios.deluser({ids: idsArr}).then(data => {
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
          account: '',
          roleId: ''
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
        Axios.getuser(params).then(data => {
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
      this.getRoleList()
    }
  }
</script>

<style lang="scss">
  .mini {
    .el-dialog {
      width: 540px;
    }
  }
</style>
