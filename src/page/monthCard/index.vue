<template>
  <div id="month_card" class="com-bgcolor">
    <div class="search-box">
      <div class="search-form-item">
        <label>月卡名称：</label>
        <div class="form-item-content">
          <el-input v-model="form.name" placeholder="请输入月卡名称"></el-input>
        </div>
      </div>
      <div class="search-form-item">
        <label>月卡类型：</label>
        <div class="form-item-content">
          <el-select v-model="form.type" placeholder="请选择月卡类型">
            <el-option v-for="item in typeList" :label="item.label" :value="item.key" :key="item.key"></el-option>
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
        <el-button type="primary" @click="addMonthCard"><i class="w-icon-build"></i>新建</el-button>
        <el-button type="warning" @click="delMonthCard"><i class="w-icon-del"></i>删除</el-button>
      </div>
      <div class="table-box">
        <el-table :data="tableData" ref="multipleTable" @selection-change="selectionData">
          <el-table-column type="selection" :width="GLOBALWIDTH"></el-table-column>
          <el-table-column prop="sortIndex" label="序号"></el-table-column>
          <el-table-column prop="NAME" label="月卡名称"></el-table-column>
          <el-table-column prop="VAL" label="月卡类型"></el-table-column>
          <el-table-column prop="VALUE" label="有效时长（月/季/年）"></el-table-column>
          <el-table-column prop="MONEY" label="优惠价格（元）"></el-table-column>
          <el-table-column prop="PNAME" label="所属停车场"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="editMonthCard(scope.row)">编辑</el-button>
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
    <component :is="visited.page" :visited="visited" :comData="comData" @refresh="init" :typeList="typeList"></component>
  </div>
</template>

<script>
  import monCardModel from './module/monCardModel'
  import Axios from '@/common/Axios/interface'
  import mixin from '@/common/mixins'

  export default {
    name: 'monthCard',
    mixins: [mixin],
    components: {
      'monCardModel': monCardModel
    },
    data () {
      return {
        typeList: [
          {key: 1, label: '月卡'},
          {key: 2, label: '季卡'},
          {key: 3, label: '年卡'}
        ],
        form: {
          name: '',
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
      addMonthCard () {
        this.comData = {}
        this.visited.page = 'monCardModel'
      },
      editMonthCard (row) {
        this.comData = row
        this.visited.page = 'monCardModel'
      },
      delMonthCard () {
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
            Axios.delmon({ids: idsArr}).then(data => {
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
          name: '',
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
        Axios.getmon(params).then(data => {
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
  #month_card {}
</style>
