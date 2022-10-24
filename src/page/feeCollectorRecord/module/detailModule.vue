<template>
  <el-dialog class="bigger" :title="title" :visible.sync="model" :before-close="closeDialog" :close-on-click-modal="false">
    <div class="table-box">
      <el-table :data="tableData">
        <el-table-column prop="serial" label="序号"></el-table-column>
        <el-table-column prop="id" label="订单编号"></el-table-column>
        <el-table-column prop="license" label="车牌号码"></el-table-column>
        <el-table-column prop="parking" label="停车场名称"></el-table-column>
        <el-table-column prop="startTime" label="入场时间"></el-table-column>
        <el-table-column prop="endTime" label="出场时间"></el-table-column>
        <el-table-column prop="payCost" label="缴费"></el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="currentPage" :page-size="pageSize"
                       :page-sizes="[10, 15, 20, 50]" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="closeDialog()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      visited: {
        type: Object,
        required: true
      },
      comData: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        title: '详细记录',
        model: true,
        tableData: [],
        pageSize: 10,
        currentPage: 1,
        total: 0
      }
    },
    methods: {
      closeDialog () {
        this.visited.page = null
      },
      pageSizeChange (val) {
        this.pageSize = val
        this.init()
      },
      currentPageChange (val) {
        this.currentPage = val
        this.init()
      }
    },
    mounted () {
    }
  }
</script>

<style lang="scss">
</style>
