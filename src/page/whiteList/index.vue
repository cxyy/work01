<template>
  <div id="white_list" class="com-bgcolor">
    <div class="search-box">
      <div class="search-form-item">
        <label>车牌号：</label>
        <div class="form-item-content">
          <el-input v-model="form.carId" placeholder="请输入车牌号"></el-input>
        </div>
      </div>
      <div class="search-form-item">
        <label>车辆类型：</label>
        <div class="form-item-content">
          <el-select v-model="form.type" placeholder="请选择车辆类型">
            <el-option v-for="item in carTypeList" :label="item.value" :value="item.datakey" :key="item.datakey"></el-option>
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
        <el-button type="primary" @click="addList"><i class="w-icon-build"></i>新建</el-button>
        <el-button type="warning" @click="delList"><i class="w-icon-del"></i>删除</el-button>
        <el-button type="success" @click="exportData"><i class="w-icon-import"></i>导出</el-button>
      </div>
      <div class="table-box">
        <el-table :data="tableData" ref="multipleTable" @selection-change="selectionData">
          <el-table-column type="selection" :width="GLOBALWIDTH"></el-table-column>
          <el-table-column prop="sortIndex" label="序号"></el-table-column>
          <el-table-column prop="CARID" label="车牌号"></el-table-column>
          <el-table-column prop="VALUE" label="车辆类型"></el-table-column>
          <el-table-column prop="PNAME" label="停车场"></el-table-column>
          <el-table-column prop="COMMENT" label="备注"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="editList(scope.row)">编辑</el-button>
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
    <component :is="visited.page" :visited="visited" :comData="comData" @refresh="init" :carTypeList="carTypeList"></component>
  </div>
</template>

<script>
  import exportModel from './module/exportModel'
  import listModel from './module/listModel'
  import Axios from '@/common/Axios/interface'
  import mixin from '@/common/mixins'

  export default {
    name: 'whiteList',
    mixins: [mixin],
    components: {
      'exportModel': exportModel,
      'listModel': listModel
    },
    data () {
      return {
        carTypeList: [],
        form: {
          markedType: 0,
          carId: '',
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
      exportData () {
        this.visited.page = 'exportModel'
      },
      getCarTypeList () {
        Axios.getdatadict({type: 'CARTYPE'}).then(data => {
          if (data.rtnCode === '1') {
            this.carTypeList = data.rtnMap.result
          }
        })
      },
      addList () {
        this.comData = {}
        this.visited.page = 'listModel'
      },
      editList (row) {
        this.comData = row
        this.visited.page = 'listModel'
      },
      delList () {
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
              idsArr = idsArr + val.ID + ','
            })
            idsArr = idsArr.substring(0, idsArr.length - 1)
            Axios.deletecar({ids: idsArr}).then(data => {
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
      search () {
        this.init()
      },
      reset () {
        this.form = {
          markedType: 0,
          carId: '',
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
      this.getCarTypeList()
      this.init()
    }
  }
</script>

<style lang="scss">
  #white_list {}
</style>
