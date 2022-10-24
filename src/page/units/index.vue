<template>
  <div id="units" class="com-bgcolor">
    <div class="search-box">
      <div class="search-form-item">
        <label>单位名称：</label>
        <div class="form-item-content">
          <el-input v-model="form.account" placeholder="请输入单位名称"></el-input>
        </div>
      </div>
      <div class="search-form-item">
        <label>单位类型：</label>
        <el-select v-model="form.unitType" placeholder="请选择单位类类型">
          <el-option v-for="item in unitList" :label="item.value" :value="item.datakey" :key="item.datakey"></el-option>
        </el-select>
      </div>
      <div class="search-form-btn">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </div>

    <div class="search-content">
      <div class="operate-box">
        <el-button type="primary" @click="addUnit"><i class="w-icon-build"></i>新建</el-button>
        <el-button type="warning" @click="delUnit"><i class="w-icon-del"></i>删除</el-button>
      </div>
      <div class="table-box">
        <el-table :data="tableData" @selection-change="selectionData">
          <el-table-column type="selection" :width="GLOBALWIDTH"></el-table-column>
          <el-table-column prop="sortIndex" label="序号"></el-table-column>
          <el-table-column prop="NAME" label="单位名称"></el-table-column>
          <el-table-column prop="VALUE" label="单位类型"></el-table-column>
          <el-table-column prop="OWNER" label="单位法人"></el-table-column>
          <el-table-column prop="TEL" label="联系方式"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="editUser(scope.row)">
                <span>编辑</span>
              </el-button>
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
  import unitsModule from './module/unitsModule'
  import service from './service/service'
  import mixin from '@/common/mixins'

  export default {
    name: 'unitsManage',
    mixins: [mixin],
    components: {
      'unitsModule': unitsModule
    },
    data () {
      return {
        unitList: [],
        multipleSelection: [],
        form: {
          account: '',
          unitType: ''
        },
        currentPage: 1,
        pageSize: 10,
        total: 0,
        tableData: [],
        visited: {
          page: null
        },
        comData: {}
      }
    },
    methods: {
      addUnit () {
        this.comData = {}
        this.visited.page = 'unitsModule'
      },
      editUser (row) {
        this.comData = row
        this.visited.page = 'unitsModule'
      },
      delUnit () {
        if (!this.multipleSelection.length){
          this.$message('请选择数据');
        } else {
          this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let data = ``;
            this.multipleSelection.forEach((val) => {
              data += `${val.ID},`
            })
            data = data.substring(0, data.length - 1)
            service.deleteUnit({ids: data}).then(data => {
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
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }
      },
      search () {
        let data = {
          name: this.form.account,
          type: this.form.unitType,
          pageNum: this.currentPage,
          pageLength: this.pageSize
        }
        if (data.type === '' && data.name === ''){
          service.getParkinfo().then((e) => {
            this.tableData = e.rtnMap.result
          })
        } else {
          service.getParkinfo(data).then((e) => {
            this.tableData = e.rtnMap.result
          })
        }
      },
      reset () {
        this.form = {
          account: '',
          unitType: ''
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
        service.getParkinfo(params).then((e) => {
          this.total = e.rtnMap.num;
          this.tableData = e.rtnMap.result;
        })
      }
    },
    mounted () {
      this.init()
      service.getdatadict({type: 'DEPTTYPE'}).then((e) => {
        this.unitList = e
      })
    }
  }
</script>

<style lang="scss">
  #units {}
</style>
