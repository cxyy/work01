<template>
  <div id="password_mod">
    <div class="header">密码修改</div>
    <div class="content">
      <div class="form-warp">
        <el-form :model="form" :rules="formRules" ref="form" label-width="100px">
          <el-form-item label="原密码" prop="oldPwd">
            <el-input v-model="form.oldPwd" placeholder="请输入原始密码"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPwd">
            <el-input v-model="form.newPwd" placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirmNewPwd">
            <el-input v-model="form.confirmNewPwd" placeholder="请再次输入新密码"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="footer">
      <el-button @click="cancel('form')">重置</el-button>
      <el-button type="primary" @click="submit('form')">完成</el-button>
    </div>
  </div>
</template>

<script>
  import Axios from '@/common/Axios/interface'

  export default {
    name: 'passwordMod',
    data () {
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
        form: {
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
      cancel (formName) {
        this.$refs[formName].resetFields();
      },
      submit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              oldpwd: this.form.oldPwd,
              newpwd: this.form.newPwd,
              confimpwd: this.form.confirmNewPwd
            }
            Axios.updatepassword(params).then(data => {
              if (data.rtnCode === '1') {
                this.$message({
                  type: 'success',
                  message: '修改密码成功,请重新登录!'
                });
                this.$router.push({name: 'login'});
              } else {
                this.$message({
                  type: 'error',
                  message: data.rtnMsg
                });
              }
            })
          }
        })
      }
    },
    mounted () {
    }
  }
</script>

<style lang="scss">
  #password_mod{
    background: #fff;
    .header{
      height: 50px;
      line-height: 50px;
      padding: 0 30px;
      border-bottom: 1px solid #EBEBEB;
    }
    .content{
      padding: 20px 0;
      text-align: center;
      overflow: hidden;
      min-width: 600px;
      .form-warp{
        display: inline-block;
        width: 400px;
        .el-form .el-form-item:last-child{
          margin-bottom: 0;
        }
      }
    }
    .footer{
      padding: 20px 40px 20px 0;
      border-top: 1px solid #EBEBEB;
      text-align: right;
    }
  }
</style>
