<template>
  <el-dialog class="small" :title="title" :visible.sync="model" :before-close="closeDialog" :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" ref="form" label-width="80px">
      <el-form-item label="账户名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入账户名称"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="submit('form')">确定</el-button>
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
        title: '新建账户',
        model: true,
        form: {
          name: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入账户名称', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      submit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (JSON.stringify(this.comData) === '{}'){
              Axios.addAccount(this.form).then(data => {
                if (data.rtnCode === '1') {
                  this.$message({
                    type: 'success',
                    message: '添加成功!'
                  })
                  this.$emit('refresh')
                  this.visited.page = null
                } else {
                  this.$message({
                    type: 'error',
                    message: data.rtnMsg
                  })
                }
              })
            } else {
              Axios.editAccount(this.form).then(data => {
                if (data.rtnCode === '1') {
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  });
                  this.$emit('refresh')
                  this.visited.page = null
                } else {
                  this.$message({
                    type: 'error',
                    message: data.rtnMsg
                  })
                }
              })
            }
          }
        });
      },
      closeDialog (){
        this.visited.page = null
      }
    },
    mounted() {
      this.LOADING()
      if (JSON.stringify(this.comData) !== '{}'){
        this.title = '编辑账户'
        this.form = {
          id: this.comData.id,
          name: this.comData.name
        }
      }
    }
  }
</script>

<style lang="scss">
</style>
