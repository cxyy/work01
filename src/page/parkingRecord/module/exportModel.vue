<template>
  <el-dialog class="small" title="停车记录导出" :visible.sync="model" :before-close="closeDialog" :close-on-click-modal="false">
    <el-form :model="form" label-width="120px">
      <el-form-item label="导出时间范围" class="is-required" :error="dateError">
        <el-date-picker v-model="form.date" value-format="timestamp" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="submit('form')">确 定</el-button>
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
      }
    },
    data() {
      return {
        model: true,
        dateError: '',
        form: {
          date: ''
        }
      }
    },
    methods: {
      submit(formName) {
        if (this.form.date === '' || this.form.date === null) {
          this.dateError = '请选择导出时间范围'
        } else {
          this.dateError = ''
          let params = {
            date: JSON.stringify(this.form.date)
          }
          Axios.parkrecordsexcel(params).then(res => {
            if (res.status === 200) {
              this.visited.page = null
            } else {
              this.$message({
                type: 'error',
                message: '网络错误,导出失败,请稍后重试!'
              })
            }
          })
        }
      },
      closeDialog (){
        this.visited.page = null
      }
    },
    mounted() {
    }
  }
</script>

<style lang="scss">
</style>
