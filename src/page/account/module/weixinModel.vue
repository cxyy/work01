<template>
  <el-dialog class="small" :title="title" :visible.sync="model" :before-close="closeDialog" :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="开发者ID" prop="wxAppid">
        <el-input v-model="form.wxAppid" placeholder="请输入开发者ID（APPID）"></el-input>
      </el-form-item>
      <el-form-item label="开发者密码" prop="appsecret">
        <el-input v-model="form.appsecret" placeholder="请输入开发者密码（APPSECRET）"></el-input>
      </el-form-item>
      <el-form-item label="商户号" prop="wxMchid">
        <el-input v-model="form.wxMchid" placeholder="请输入商户号"></el-input>
      </el-form-item>
      <el-form-item label="商户api密钥" prop="apikey">
        <el-input v-model="form.apikey" placeholder="请输入商户api密钥"></el-input>
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
        title: '绑定微信账户',
        model: true,
        form: {
          id: '',
          wxAppid: '',
          appsecret: '',
          wxMchid: '',
          apikey: ''
        },
        rules: {
          wxAppid: [
            { required: true, message: '请输入开发者ID（APPID）', trigger: 'blur' }
          ],
          appsecret: [
            { required: true, message: '请输入开发者密码（APPSECRET）', trigger: 'blur' }
          ],
          wxMchid: [
            { required: true, message: '请输入商户号', trigger: 'blur' }
          ],
          apikey: [
            { required: true, message: '请输入商户api密钥', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      submit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            Axios.editAccount(this.form).then(data => {
              if (data.rtnCode === '1') {
                this.$message({
                  type: 'success',
                  message: '编辑成功!'
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
        })
      },
      closeDialog (){
        this.visited.page = null
      }
    },
    mounted() {
      this.LOADING()
      this.form.id = this.comData.id
      if (this.comData.wxAppid !== '') {
        this.form = {
          id: this.comData.id,
          wxAppid: this.comData.wxAppid,
          appsecret: this.comData.appsecret,
          wxMchid: this.comData.wxMchid,
          apikey: this.comData.apikey
        }
      }
    }
  }
</script>

<style lang="scss">
</style>
