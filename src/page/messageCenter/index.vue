<template>
  <div id="message_center" class="com-bgcolor">
    <div class="search-box">
      <div class="search-form-item">
        <label>关键词：</label>
        <div class="form-item-content">
          <el-input v-model="form.title" placeholder="请输入消息标题"></el-input>
        </div>
      </div>
      <div class="search-form-item">
        <label>消息状态：</label>
        <el-select v-model="form.status" placeholder="请选择消息状态">
          <el-option v-for="item in statusList" :label="item.label" :value="item.key" :key="item.key"></el-option>
        </el-select>
      </div>
      <div class="search-form-btn">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </div>
    <div class="search-content">
      <div class="operate-box">
        <el-button type="primary" @click="addMessage"><i class="w-icon-build"></i>新建</el-button>
        <el-button type="warning" @click="delMessage"><i class="w-icon-del"></i>删除</el-button>
      </div>
      <div class="table-box">
        <el-table :data="tableData" ref="multipleTable" @selection-change="selectionData">
          <el-table-column type="selection" :width="GLOBALWIDTH"></el-table-column>
          <el-table-column prop="sortIndex" label="序号"></el-table-column>
          <el-table-column prop="TITLE" label="标题"></el-table-column>
          <el-table-column prop="PUBLISH" label="状态"></el-table-column>
          <el-table-column prop="SOURCERES" label="来源"></el-table-column>
          <el-table-column prop="TIME" label="创建时间"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="editMessage(scope.row)" v-if="scope.row.STATUS===0">编辑</el-button>
              <el-button type="text" @click="detail(scope.row)">查看</el-button>
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
  import messageModel from './module/messageModel'
  import detailModel from './module/detailModel'
  import Axios from '@/common/Axios/interface'
  import mixin from '@/common/mixins'

  export default {
    name: 'messageCenter',
    mixins: [mixin],
    components: {
      messageModel,
      detailModel
    },
    data () {
      return {
        statusList: [
          { key: 0, label: '未发布' },
          { key: 1, label: '已发布' }
        ],
        form: {
          title: '',
          status: ''
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
      addMessage () {
        this.comData = {}
        this.visited.page = 'messageModel'
      },
      detail (row) {
        this.comData = row
        this.visited.page = 'detailModel'
      },
      editMessage (row) {
        this.comData = row
        this.visited.page = 'messageModel'
      },
      delMessage () {
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
            Axios.messageDel({messageIds: idsArr}).then(data => {
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
      search (){
        this.init()
      },
      reset (){
        this.form = {
          title: '',
          status: ''
        }
      },
      pageSizeChange(val) {
        this.pageSize = val
        this.init()
      },
      currentPageChange(val) {
        this.currentPage = val
        this.init()
      },
      selectionData(val) {
        this.multipleSelection = val
      },
      init () {
        let params = {
          pageNum: this.currentPage,
          pageLength: this.pageSize
        }
        params = Object.assign(params, this.form)
        Axios.messageQuery(params).then(data => {
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
  #message_center{}
</style>
