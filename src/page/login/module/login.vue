<template>
  <div class="login-main">
    <div class="login-bj"></div>
    <div class="login-log">
      <div class="login-logo">
        <img src="../../../../static/image/login_logo.png"/>
        <div class="logo-copy">
          <p>Copyright 2018</p>
          <p>无锡风凛网络科技有限公司 版权所有</p>
        </div>
      </div>
      <div class="login-form">
        <div class="login-tit">用户登录</div>
        <el-form label-position="left" status-icon :model="form" :rules="formRules" ref="form">
          <el-form-item class="userName" prop="userName">
            <em size="small" class="w-icon-head"></em>
            <el-input type="text" v-model="form.userName" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item class="password" prop="password">
            <em size="small" class="w-icon-pass"></em>
            <el-input type="password" v-model="form.password" placeholder="密码" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item class="validation" prop="verify">
            <em size="small" class="w-icon-vcode"></em>
            <img :src="codeImg" alt="" class="img-verify" @click="getCode">
            <el-input type="text" v-model="form.verify" placeholder="验证码" auto-complete="off" maxlength="4" @keyup.enter.native="signIn('form')"></el-input>
          </el-form-item>
          <el-form-item class="btn-login-all">
            <el-button class="btn-login" type="primary" @click="signIn('form')">登录</el-button>
            <el-button class="btn-reset" type="info" @click="reset()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import Axios from '@/common/Axios/interface'
  import cookie from '@/common/cookie/cookie'

  export default {
    data () {
      let userNameFun = (rule, value, callback) => {
        let userRe = /[\u4e00-\u9fa5_a-zA-Z0-9_]{5,15}/;
        if (value === ''){
          callback(new Error('请输入用户名!'));
        } else if (!userRe.test(value)){
          callback(new Error('请输入正确的用户名!'));
        }
        callback();
      }
      let passwordFun = (rule, value, callback) => {
        let pwRe = /^[A-Za-z0-9]{5,20}$/;
        if (value === ''){
          callback(new Error('请输入密码!'));
        } else if (!pwRe.test(value)){
          callback(new Error('请输入正确的密码!'));
        }
        callback();
      }
      return {
        form: {
          userName: '',
          password: '',
          verify: ''
        },
        formRules: {
          userName: [
            {validator: userNameFun, trigger: 'blur'}
          ],
          password: [
            {validator: passwordFun, trigger: 'blur'}
          ],
          verify: [
            { required: true, message: '请输入验证码', trigger: 'blur' },
            { required: true, message: '请输入验证码', trigger: 'change' },
            { min: 4, max: 4, message: '请输入4位验证码', trigger: 'change' }
          ]
        },
        codeImg: ''
      };
    },
    methods: {
      signIn (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              account: this.form.userName,
              password: this.form.password,
              authCode: this.form.verify
            }
            Axios.login(params).then(data => {
              if (data.rtnCode === '1') {
                cookie.setCookie('token', data.rtnMap.token)
                this.$store.dispatch('saveAuth', JSON.stringify(data.rtnMap.role))
                this.$store.dispatch('saveName', JSON.stringify(data.rtnMap.name))
                sessionStorage.setItem('auth', JSON.stringify(data.rtnMap.role))
                sessionStorage.setItem('username', JSON.stringify(data.rtnMap.name))
                sessionStorage.setItem('userid', JSON.stringify(data.rtnMap.userid))
                this.$router.push({name: 'home'});
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
      reset () {
        this.form = {
          userName: '',
          password: '',
          verify: ''
        }
      },
      getCode () {
        Axios.getcode().then(data => {
          this.codeImg = 'data:image/jpg;base64, ' + data
        })
      }
    },
    mounted () {
      this.getCode()
    }
  }
</script>

<style lang="scss">
  $login-color: #517dcb;
  $reset-color:#999999;
  $grey-color:#666666;
  .login-main {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .login-bj {
      position: fixed;
      width: 100%;
      height: 100%;
      background: url("/static/image/demoBJ.jpg") center center;
      background-size: 100% 100%;
    }
    .login-log {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 978px;
      height: 400px;
      padding: 40px 66px 50px 66px;
      margin: auto;
      transform: translate(-50%, -50%);
      background: rgba(255, 255, 255, .65);
      .el-form-item__label {
        padding-bottom: 0;
      }
      .login-logo {
        float: left;
        width: 500px;
        height: 300px;
        position: relative;
        img {
          margin-top: 26px;
        }
        .logo-copy {
          position: absolute;
          bottom: 0;
          p {
            color: $grey-color;
            font-size: 14px;
            line-height: 22px;
          }
        }
      }
      .login-form {
        float: right;
        width: 332px;
        height: 300px;
        border-image: -webkit-linear-gradient( #e2e3e4, #516891, #cbced2) 30 30;
        border-left: 1px solid;
        .login-tit {
          text-align: center;
          color: $login-color;
          font-size: 24px;
          margin-bottom: 20px;
          margin-left: 30%;
        }
        .btn-login-all {
          text-align: center;
          padding-left: 32%;
        }
        .userName,
        .password,
        .validation {
          .el-form-item__label {
            float: left;
            width: 20%;
          }
          .el-form-item__content {
            float: right;
            width: 100%;
            line-height: 30px;
            em {
              float: left;
              color: $login-color;
              font-size: 32px;
              line-height: 40px;
              margin-left: 18%;
            }
            .el-form-item__error {
              left: 34%;
            }
            .el-input {
              float: right;
              width: 66%;
            }
          }
        }
        .validation {
          .el-form-item__content {
            .el-input {
              float: right;
              width: 40%;
            }
          }
          .img-verify {
            float: right;
            height: 40px;
            width: 75px;
            margin-left: 12px;
            canvas {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .btn-login {
        background-color: $login-color !important;
        border-color: $login-color !important;
      }
      .btn-reset {
        background: none !important;
        border-color: $reset-color !important;
        color: $grey-color !important;
      }
    }
  }
  @media screen and (max-width: 1200px) {
    .login-main .login-left {
      width: 100%;
    }
    .login-main .login-right {
      width: 100%;
    }
  }
</style>
