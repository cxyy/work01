<template>
  <el-dialog class="mini" title="密码修改" :visible.sync="model" :before-close="closeDialog" :close-on-click-modal="false">
    <el-form :model="form" :rules="formRules" ref="form" label-width="100px">
      <el-form-item label="原密码" prop="oldPwd">
        <el-input v-model="form.oldPwd" placeholder="请输入原始密码" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPwd">
        <el-input v-model="form.newPwd" placeholder="请输入新密码" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirmNewPwd">
        <el-input v-model="form.confirmNewPwd" placeholder="请再次输入新密码" type="password"></el-input>
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
      },
      comData: {
        type: Object,
        required: true
      }
    },
    data() {
      var newPwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.form.newPwd.length >= 6 && this.form.newPwd.length <= 18) {
            this.$refs.form.validateField('confirmNewPwd')
            callback()
          } else {
            callback(new Error('请输入6-18位密码'))
          }
        }
      }
      var confirmNewPwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.form.newPwd) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        model: true,
        form: {
          id: '',
          oldPwd: '',
          newPwd: '',
          confirmNewPwd: ''
        },
        formRules: {
          oldPwd: [
            { required: true, message: '请输入原密码', trigger: 'blur' }
          ],
          newPwd: [
            { validator: newPwd, trigger: 'blur' }
          ],
          confirmNewPwd: [
            { validator: confirmNewPwd, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      submit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              id: this.form.id,
              oldpwd: this.form.oldPwd,
              newpwd: this.form.newPwd,
              confimpwd: this.form.confirmNewPwd
            }
            Axios.updatepassword(params).then(data => {
              if (data.rtnCode === '1') {
                this.$message({
                  type: 'success',
                  message: '修改成功!'
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
          }
        });
      },
      closeDialog (){
        this.visited.page = null
      }
    },
    mounted() {
      this.form.id = this.comData.ID
    }
  }
</script>

<style lang="scss">
</style>
