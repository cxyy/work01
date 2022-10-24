<template>
  <div id="parking" class="com-bgcolor">
    <div class="search-box">
      <div class="search-form-item">
        <label>车位编号：</label>
        <div class="form-item-content">
          <el-input v-model="form.stallid" placeholder="请输入车位编号"></el-input>
        </div>
      </div>
      <div class="search-form-item">
        <label>停车场名称：</label>
        <div class="form-item-content">
          <el-input v-model="form.parkname" placeholder="请输入停车场名称"></el-input>
        </div>
      </div>
      <div class="search-form-item">
        <label>车位状态：</label>
        <el-select v-model="form.state" placeholder="请选择车位状态">
          <el-option v-for="item in stateList" :label="item.label" :value="item.key" :key="item.key"></el-option>
        </el-select>
      </div>
      <div class="search-form-btn">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </div>
    <div class="search-content">
      <div class="operate-box">
        <el-button type="primary" @click="addPark"><i class="w-icon-build"></i>新建</el-button>
        <el-button type="warning" @click="delPark"><i class="w-icon-del"></i>删除</el-button>
      </div>
      <div class="table-box">
        <el-table :data="tableData" ref="multipleTable" @selection-change="selectionData">
          <el-table-column type="selection" :width="GLOBALWIDTH"></el-table-column>
          <el-table-column prop="sortIndex" label="序号"></el-table-column>
          <el-table-column prop="STALLID" label="车位编号"></el-table-column>
          <el-table-column prop="PNAME" label="所属停车场"></el-table-column>
          <el-table-column prop="NAME" label="地磁名称"></el-table-column>
          <el-table-column prop="USED" label="车位状态"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="editPark(scope.row)">编辑</el-button>
              <!--<el-button type="text" @click="importInfo(scope.row)">导入</el-button>-->
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
  import parkModel from './module/parkModel'
  import Axios from '@/common/Axios/interface'
  import mixin from '@/common/mixins'

  export default {
    name: 'parking',
    mixins: [mixin],
    components: {
      'parkModel': parkModel
    },
    data () {
      return {
        stateList: [
          { key: '0', label: '空闲' },
          { key: '1', label: '使用中' }
        ],
        form: {
          stallid: '',
          parkname: '',
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
      addPark () {
        this.comData = {}
        this.visited.page = 'parkModel'
      },
      importInfo () {
        if (!this.multipleSelection.length){
          this.$message('请选择数据')
        }
      },
      editPark (row) {
        this.comData = row
        this.visited.page = 'parkModel'
      },
      delPark () {
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
            Axios.deleteCarports({ids: idsArr}).then(data => {
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
          stallid: '',
          parkname: '',
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
        Axios.getCarport(params).then(data => {
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
//      this.init()
    }
  }
</script>

<style lang="scss">
  #parking {}
</style>
