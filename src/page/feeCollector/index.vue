<template>
  <div id="fee_collector" class="com-bgcolor">
    <div class="search-box">
      <div class="search-form-item">
        <label>收费员：</label>
        <div class="form-item-content">
          <el-input v-model="form.name" placeholder="请输入收费员姓名"></el-input>
        </div>
      </div>
      <div class="search-form-item">
        <label>停车场：</label>
        <el-select v-model="form.parkname" placeholder="请输入停车场名称">
          <el-option v-for="item in getparksDataList"
                     :label="item.PNAME"
                     :value="item.PNAME"
                     :key="item.ID"></el-option>
        </el-select>
      </div>
      <div class="search-form-btn">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </div>
    <div class="search-content">
      <div class="operate-box">
        <el-button type="primary" @click="addCollector"><i class="w-icon-build"></i>新建</el-button>
        <el-button type="warning" @click="delCollector"><i class="w-icon-del"></i>删除</el-button>
      </div>
      <div class="table-box">
        <el-table :data="tableData" ref="multipleTable" @selection-change="selectionData">
          <el-table-column type="selection" :width="GLOBALWIDTH"></el-table-column>
          <el-table-column prop="sortIndex" label="序号"></el-table-column>
          <el-table-column prop="NAME" label="收费员"></el-table-column>
          <el-table-column prop="DNAME" label="所属单位"></el-table-column>
          <el-table-column prop="TEL" label="联系方式"></el-table-column>
          <el-table-column prop="PNAME" label="所属停车场"></el-table-column>
          <el-table-column prop="SEX" :formatter="formatRole" label="性别"></el-table-column>
          <el-table-column prop="EQPT" label="设备"></el-table-column>
          <el-table-column prop="ISONLINE" label="状态"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="editCollector(scope.row)">编辑</el-button>
              <el-button type="text" @click="workCard(scope.row)">工作证</el-button>
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
  import editModel from './module/editModel'
  import cardModel from './module/cardModel'
  import Axios from '@/common/Axios/interface'
  import mixin from '@/common/mixins'

  export default {
    name: 'feeCollector',
    mixins: [mixin],
    components: {
      'editModel': editModel,
      'cardModel': cardModel
    },
    data () {
      return {
        form: {
          name: '',
          parkname: ''
        },
        currentPage: 1,
        pageSize: 10,
        total: 0,
        tableData: [],
        multipleSelection: [],
        getparksDataList: [],
        visited: {
          page: null
        },
        comData: {}
      }
    },
    methods: {
      addCollector () {
        this.comData = {}
        this.visited.page = 'editModel'
      },
      editCollector (row) {
        this.comData = row
        this.visited.page = 'editModel'
      },
      workCard (row) {
        this.comData = row
        this.visited.page = 'cardModel'
      },
      delCollector () {
        if (!this.multipleSelection.length) {
          this.$message('请选择数据')
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
            let str = {
              ids: data
            }
            Axios.delToll(str).then(data => {
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
          collectorName: '',
          parkName: ''
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
        Axios.getToll(this.form).then(data => {
          this.tableData = data.rtnMap.result
        })
      },
      formatRole: function (row) {
        return row.SEX === 0 ? '男' : row.SEX === 1 ? '女' : '无'
      }
    },
    mounted () {
      this.$router.push({name: 'page404'})
//      this.init()
//      Axios.getparks().then(data => {
//        this.getparksDataList = data.rtnMap.result
//      })
    }
  }
</script>

<style lang="scss">
  #fee_collector {}
</style>
