<template>
  <div id="car_owner" class="com-bgcolor">
    <div class="search-box">
      <div class="search-form-item">
        <label>车主姓名：</label>
        <div class="form-item-content">
          <el-input v-model="form.name" placeholder="请输入车主姓名"></el-input>
        </div>
      </div>
      <div class="search-form-item">
        <label>车牌信息：</label>
        <div class="form-item-content">
          <el-input v-model="form.carid" placeholder="请输入车牌信息"></el-input>
        </div>
      </div>
      <div class="search-form-btn">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </div>
    <div class="search-content">
      <div class="operate-box">
        <!--<el-button type="primary" @click="addOwner"><i class="w-icon-build"></i>新建</el-button>-->
        <!--<el-button type="warning" @click="delOwner"><i class="w-icon-del"></i>删除</el-button>-->
      </div>
      <div class="table-box">
        <el-table :data="tableData" ref="multipleTable" @selection-change="selectionData">
          <el-table-column type="selection" :width="GLOBALWIDTH"></el-table-column>
          <el-table-column prop="sortIndex" label="序号"></el-table-column>
          <el-table-column prop="NAME" label="车主姓名"></el-table-column>
          <el-table-column prop="CARID" label="车牌信息"></el-table-column>
          <el-table-column prop="TEL" label="联系方式"></el-table-column>
          <el-table-column prop="NUM" label="代金券总数"></el-table-column>
          <el-table-column prop="TIME" label="月卡有效期"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="editOwner(scope.row)">编辑</el-button>
              <!--<el-button type="text" @click="importInfo(scope.row)">导入</el-button>-->
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
  import carOwnerModel from './module/carOwnerModel'
  import Axios from '@/common/Axios/interface'
  import mixin from '@/common/mixins'

  export default {
    name: 'carOwner',
    mixins: [mixin],
    components: {
      'carOwnerModel': carOwnerModel
    },
    data () {
      return {
        form: {
          name: '',
          carid: ''
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
      addOwner () {
        this.comData = {}
        this.visited.page = 'carOwnerModel'
      },
      importInfo () {
      },
      editOwner (row) {
        this.comData = row
        this.visited.page = 'carOwnerModel'
      },
      delOwner () {
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
            Axios.driverdel({ids: idsArr}).then(data => {
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
          carid: ''
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
        Axios.driverget(params).then(data => {
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
//      driveradd,
//        driverupdate,
//        driverdel
    }
  }
</script>

<style lang="scss">
  #car_owner {
  }
</style>
