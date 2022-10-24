<template>
  <el-dialog class="small" :title="title" :visible.sync="model" :before-close="closeDialog" :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="小票名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入小票名称"></el-input>
      </el-form-item>
      <el-form-item label="小票详情" prop="detail">
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" placeholder="请输入小票详情" v-model="form.detail"></el-input>
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
      return {
        title: '新建小票',
        model: true,
        form: {
          name: '',
          detail: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入小票名称', trigger: 'blur' }
          ],
          detail: [
            { required: true, message: '请输入小票详情', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      submit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (JSON.stringify(this.comData) === '{}'){
              Axios.addReceipt(this.form).then(data => {
                if (data.rtnCode === '1') {
                  this.$message({
                    type: 'success',
                    message: '添加成功!'
                  })
                  this.$emit('refresh')
                  this.visited.page = null
                }
              })
            } else {
              Axios.updateReceipt(this.form).then(data => {
                if (data.rtnCode === '1') {
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  })
                  this.$emit('refresh')
                  this.visited.page = null
                }
              })
            }
          }
        })
      },
      closeDialog (){
        this.visited.page = null
      }
    },
    mounted() {
      this.LOADING()
      if (JSON.stringify(this.comData) !== '{}'){
        this.title = '编辑小票'
        this.form = {
          id: this.comData.ID,
          name: this.comData.NAME,
          detail: this.comData.DETAIL
        }
      }
    }
  }
</script>

<style lang="scss">
</style>
