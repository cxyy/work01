<template>
  <div id="dictionary" class="com-bgcolor">
    <div class="search-box">
      <div class="search-form-item">
        <label>字典名称：</label>
        <div class="form-item-content">
          <el-input v-model="form.account" placeholder="请输入字典名称"></el-input>
        </div>
      </div>
      <div class="search-form-btn">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </div>
    <div class="search-content">
      <div class="operate-box">
        <el-button type="primary" @click="addDictionary"><i class="w-icon-build"></i>新建</el-button>
        <!--<el-button type="warning" @click="delDictionary"><i class="w-icon-del"></i>删除</el-button>-->
      </div>
      <div class="table-box">
        <el-table :data="tableData" ref="multipleTable" @selection-change="selectionData">
          <el-table-column type="selection" :width="GLOBALWIDTH"></el-table-column>
          <el-table-column prop="sortIndex" label="序号"></el-table-column>
          <el-table-column prop="name" label="字典名称"></el-table-column>
          <el-table-column prop="type" label="字典类型"></el-table-column>
          <!--<el-table-column prop="datakey" label="字典码"></el-table-column>-->
          <el-table-column prop="value" label="字典值"></el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" @click="editDictionary(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="currentPage"
                         :page-size="pageSize" :page-sizes="[10, 15, 20, 50]"
                         layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <component :is="visited.page" :visited="visited" :comData="comData" @refresh="init"></component>
  </div>
</template>

<script>
  import dicModel from './module/dicModel'
  import Axios from '@/common/Axios/interface'
  import mixin from '@/common/mixins'

  export default {
    name: 'dictionary',
    mixins: [mixin],
    components: {
      'dicModel': dicModel
    },
    data () {
      return {
        form: {
          account: ''
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
      addDictionary () {
        this.comData = {}
        this.visited.page = 'dicModel'
      },
      editDictionary (row) {
        this.comData = row
        this.visited.page = 'dicModel'
      },
      // delDictionary () {
      //   if (!this.multipleSelection.length) {
      //     this.$message('请选择数据')
      //   } else {
      //     this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消',
      //       type: 'warning'
      //     }).then(() => {
      //       let idsArr = ''
      //       this.multipleSelection.forEach(val => {
      //         idsArr = idsArr + val.id + ','
      //       })
      //       idsArr = idsArr.substring(0, idsArr.length - 1)
      //       Axios.deluser({ids: idsArr}).then(data => {
      //         console.log(data)
      //         if (data.rtnCode === '1') {
      //           this.$message({
      //             type: 'success',
      //             message: '删除成功!'
      //           })
      //           this.init()
      //         } else {
      //           this.$message({
      //             type: 'error',
      //             message: '网络错误，删除失败!'
      //           })
      //         }
      //       })
      //     }).catch(() => {
      //     })
      //   }
      // },
      search () {
        this.init()
      },
      reset () {
        this.form = {
          account: ''
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
          pageLength: this.pageSize,
          name: this.form.account
        }
        params = Object.assign(params, this.form)
        Axios.getall(params).then(data => {
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
  #dictionary {
  }
</style>
