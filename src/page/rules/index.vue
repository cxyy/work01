<template>
  <div id="rules" class="com-bgcolor">
    <div class="search-box">
      <div class="search-form-item">
        <label>规则名称：</label>
        <div class="form-item-content">
          <el-input v-model="form.name" placeholder="请输入规则名称"></el-input>
        </div>
      </div>
      <div class="search-form-item">
        <label>规则状态：</label>
        <el-select v-model="form.state" placeholder="请选择规则状态">
          <el-option v-for="item in typeList" :label="item.label" :value="item.key" :key="item.key"></el-option>
        </el-select>
      </div>
      <div class="search-form-btn">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </div>
    <div class="search-content">
      <div class="operate-box">
        <el-button type="primary" @click="addRule"><i class="w-icon-build"></i>新建</el-button>
        <el-button type="warning" @click="delRule"><i class="w-icon-del"></i>删除</el-button>
      </div>
      <div class="table-box">
        <el-table :data="tableData" ref="multipleTable" @selection-change="selectionData">
          <el-table-column type="selection" :width="GLOBALWIDTH"></el-table-column>
          <el-table-column prop="sortIndex" label="序号"></el-table-column>
          <el-table-column prop="NAME" label="规则名称"></el-table-column>
          <el-table-column prop="DNAME" label="所属公司"></el-table-column>
          <el-table-column prop="DESCRIPTION" label="规则简介"></el-table-column>
          <el-table-column prop="STATE" label="规则状态"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="editRule(scope.row)">编辑</el-button>
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
    <component :is="visited.page" :visited="visited" :comData="comData" @refresh="init"></component>
  </div>
</template>

<script>
  import ruleModel from './module/ruleModel'
  import Axios from '@/common/Axios/interface'
  import mixin from '@/common/mixins'

  export default {
    name: 'rules',
    mixins: [mixin],
    components: {
      'ruleModel': ruleModel
    },
    data () {
      return {
        typeList: [
          { key: 0, label: '启用' },
          { key: 1, label: '未启用' }
        ],
        form: {
          name: '',
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
      addRule () {
        this.comData = {}
        this.visited.page = 'ruleModel'
      },
      editRule (row) {
        this.comData = row
        this.visited.page = 'ruleModel'
      },
      delRule () {
        if (!this.multipleSelection.length){
          this.$message('请选择数据')
        } else {
          this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.multipleSelection.find(function (val) { return val.FLAG === '1' }) !== undefined) {
              this.$message({
                type: 'info',
                message: '使用中的规则不可以删除'
              })
            } else {
              let feesIds = ''
              this.multipleSelection.forEach(val => {
                feesIds = feesIds + val.FEESID + ','
              })
              feesIds = feesIds.substring(0, feesIds.length - 1)
              Axios.deletefees({feesIds: feesIds}).then(data => {
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
            }
          }).catch(() => {})
        }
      },
      search () {
        this.init()
      },
      reset () {
        this.form = {
          name: '',
          state: ''
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
        if (params.name === '') {
          delete params.name
        }
        if (params.state === '') {
          delete params.state
        }
        Axios.getfees(params).then(data => {
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
  #rules {
  }
</style>
