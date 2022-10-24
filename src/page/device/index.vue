<template>
  <div id="device" class="com-bgcolor">
    <div class="search-box">
      <div class="search-form-item">
        <label>设备名称：</label>
        <div class="form-item-content">
          <el-input v-model="form.devName" placeholder="请输入设备名称"></el-input>
        </div>
      </div>
      <div class="search-form-item">
        <label>停车场：</label>
        <div class="form-item-content">
          <el-input v-model="form.parkName" placeholder="请输入停车场名称"></el-input>
        </div>
      </div>
      <div class="search-form-item">
        <label>设备状态：</label>
        <el-select v-model="form.online" placeholder="请选择设备状态">
          <el-option v-for="item in deviceonline" :label="item.label" :value="item.key" :key="item.key"></el-option>
        </el-select>
      </div>
      <div class="search-form-btn">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </div>
    <div class="search-content">
      <div class="operate-box">
        <el-button type="primary" @click="addDevice"><i class="w-icon-build"></i>新建</el-button>
        <el-button type="warning" @click="delDevice"><i class="w-icon-del"></i>删除</el-button>
      </div>
      <div class="table-box">
        <el-table :data="tableData" ref="multipleTable" @selection-change="selectionData">
          <el-table-column type="selection" :width="GLOBALWIDTH"></el-table-column>
          <el-table-column prop="sortIndex" label="序号"></el-table-column>
          <el-table-column prop="NAME" label="设备名称"></el-table-column>
          <el-table-column prop="PNAME" label="所属停车场"></el-table-column>
          <el-table-column label="入场/出场">
            <template slot-scope="scope">
              <span v-if="scope.row.INOROUT===1">入场</span>
              <span v-if="scope.row.INOROUT===2">出场</span>
            </template>
          </el-table-column>
          <el-table-column prop="STATE" label="设备状态"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="editDevice(scope.row)">编辑</el-button>
              <el-button type="text" @click="upDevice(scope.row)">抬杆</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange"
                         :current-page.sync="currentPage" :page-size="pageSize"
                         :page-sizes="[10, 15, 20, 50]" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <component :is="visited.page" :visited="visited" :comData="comData" :deviceonline="deviceonline"
               @refresh="init"></component>
  </div>
</template>

<script>
  import deviceModel from './module/deviceModel'
  import Axios from '@/common/Axios/interface'
  import mixin from '@/common/mixins'

  export default {
    name: 'device',
    mixins: [mixin],
    components: {
      'deviceModel': deviceModel
    },
    data () {
      return {
        deviceonline: [
          {key: '0', label: '离线'},
          {key: '1', label: '在线'}
        ],
        form: {
          devName: '',
          parkName: '',
          online: ''
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
      addDevice () {
        this.comData = {}
        this.visited.page = 'deviceModel'
      },
      delDevice () {
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
            Axios.deleteEqpt({DevIds: idsArr}).then(data => {
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
      editDevice (row) {
        this.comData = row
        this.visited.page = 'deviceModel'
      },
      upDevice (row) {
        if (row.STATE === '离线') {
          this.$message({
            type: 'warning',
            message: '该设备离线状态'
          })
        } else {
          this.$confirm('确定让设备抬杆, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            Axios.sendcmd({devcode: row.ID}).then(data => {
              if (data.rtnCode === '1') {
                this.$message({
                  type: 'success',
                  message: '抬杆成功!'
                })
                this.init()
              } else {
                this.$message({
                  type: 'warning',
                  message: data.rtnCode
                })
                this.init()
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
          devName: '',
          parkName: '',
          online: ''
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
        Axios.queryEqpt(params).then(data => {
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
  #device {
  }
</style>
