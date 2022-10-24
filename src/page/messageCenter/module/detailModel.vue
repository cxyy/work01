<template>
  <el-dialog class="bigger message-detail-dialog" title="公告详情" :visible.sync="model" :before-close="closeDialog" :close-on-click-modal="false">
    <div id="notice"></div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">关 闭</el-button>
      <el-button type="primary" @click="release" v-if="comData.STATUS===0">发 布</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import Axios from '@/common/Axios/interface'

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
    data() {
      return {
        model: true
      }
    },
    methods: {
      release () {
        this.$confirm('此操作将发布该条公告, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Axios.messagePublish({id: this.comData.ID}).then(data => {
            if (data.rtnCode === '1') {
              this.$message({
                type: 'success',
                message: '发布成功!'
              })
              this.$emit('refresh')
              this.visited.page = null
            }
          })
        }).catch(() => {})
      },
      closeDialog (){
        this.visited.page = null
      }
    },
    mounted() {
      this.$nextTick(function () {
        document.getElementById('notice').innerHTML = this.comData.CONTENT
      })
    }
  }
</script>

<style lang="scss">
  .message-detail-dialog{
    #notice{
      width: 100%;
      min-height: 200px;
      overflow-x: auto;
    }
  }
</style>
