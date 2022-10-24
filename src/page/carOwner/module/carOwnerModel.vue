<template>
  <el-dialog class="small" :title="title" :visible.sync="model" :before-close="closeDialog"
             :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" ref="form" label-width="80px">
      <el-form-item label="车主姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入车主姓名"></el-input>
      </el-form-item>
      <el-form-item label="车牌信息" prop="carid">
        <el-input v-model="form.carid" placeholder="请输入车牌信息"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="tel">
        <el-input v-model="form.tel" placeholder="请输入联系方式"></el-input>
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
    data () {
      return {
        title: '新建车主',
        model: true,
        form: {
          name: '',
          carid: '',
          tel: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入车主姓名', trigger: 'blur'}
          ],
          carid: [
            {required: true, message: '请输入车牌信息', trigger: 'blur'},
            {
              pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/,
              message: '请输入正确的车牌号'
            }
          ],
          tel: [
            {required: true, message: '请输入联系方式', trigger: 'blur'},
            {pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号码'}
          ]
        }
      }
    },
    methods: {
      submit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (JSON.stringify(this.comData) === '{}') {
              Axios.driveradd(this.form).then(data => {
                if (data.rtnCode === '1') {
                  this.$message({
                    type: 'success',
                    message: '添加成功!'
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
            } else {
              Axios.driverupdate(this.form).then(data => {
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
        })
      },
      closeDialog () {
        this.visited.page = null
      }
    },
    mounted () {
      this.LOADING()
      if (JSON.stringify(this.comData) !== '{}') {
        this.title = '编辑车主'
        this.form = {
          id: this.comData.ID,
          name: this.comData.NAME,
          carid: this.comData.CARID,
          tel: this.comData.TEL
        }
      }
    }
  }
</script>

<style lang="scss">
</style>
