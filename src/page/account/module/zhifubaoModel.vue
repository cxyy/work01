<template>
  <el-dialog class="small" :title="title" :visible.sync="model" :before-close="closeDialog" :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="生活号ID" prop="alAppid">
        <el-input v-model="form.alAppid" placeholder="请输入生活号ID（APPID）"></el-input>
      </el-form-item>
      <el-form-item label="支付宝公钥" prop="alPublickey">
        <el-input v-model="form.alPublickey" placeholder="请输入支付宝公钥"></el-input>
      </el-form-item>
      <el-form-item label="支付宝私钥" prop="alPrivatekey">
        <el-input v-model="form.alPrivatekey" placeholder="支付宝私钥"></el-input>
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
        title: '绑定支付宝账户',
        model: true,
        form: {
          id: '',
          alAppid: '',
          alPublickey: '',
          alPrivatekey: ''
        },
        rules: {
          alAppid: [
            { required: true, message: '请输入生活号ID（APPID）', trigger: 'blur' }
          ],
          alPublickey: [
            { required: true, message: '请输入支付宝公钥', trigger: 'blur' }
          ],
          alPrivatekey: [
            { required: true, message: '支付宝私钥', trigger: 'blur' }
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
        })
      },
      closeDialog (){
        this.visited.page = null
      }
    },
    mounted() {
      this.LOADING()
      this.form.id = this.comData.id
      if (this.comData.alAppid !== '') {
        this.form = {
          id: this.comData.id,
          alAppid: this.comData.alAppid,
          alPublickey: this.comData.alPublickey,
          alPrivatekey: this.comData.alPrivatekey
        }
      }
    }
  }
</script>

<style lang="scss">
</style>
