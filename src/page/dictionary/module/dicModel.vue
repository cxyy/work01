<template>
  <el-dialog class="mini" :title="title" :visible.sync="model" :before-close="closeDialog"
             :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" ref="form" label-width="80px">
      <el-form-item label="字典名称" prop="name">
        <el-input v-model="form.name" :disabled="dis" placeholder="请输入字典名称"></el-input>
      </el-form-item>
      <el-form-item label="字典类型" prop="type">
        <el-input v-model="form.type" :disabled="dis" placeholder="请输入字典类型"></el-input>
      </el-form-item>
      <!--<el-form-item label="字典码" prop="account">-->
      <!--<el-input v-model="form.account" :disabled="dis" placeholder="请输入字典码"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item label="字典值" prop="value">
        <el-input v-model="form.value" placeholder="请输入字典值"></el-input>
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
        title: '新建字典',
        model: true,
        form: {
          name: '',
          type: '',
          // account: '',
          value: ''
        },
        dis: false,
        rules: {
          name: [
            {required: true, message: '请输入字典名称', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '请输入字典类型', trigger: 'blur'}
          ],
          // account: [
          //   {required: true, message: '请输入字典码', trigger: 'blur'}
          // ],
          value: [
            {required: true, message: '请输入字典值', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      submit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (JSON.stringify(this.comData) === '{}') {
              Axios.adddatadict(this.form).then(data => {
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
              Axios.updatedatadict(this.form).then(data => {
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
      closeDialog () {
        this.visited.page = null
      }
    },
    mounted () {
      this.LOADING(700)
      if (JSON.stringify(this.comData) !== '{}') {
        this.title = '编辑字典'
        this.dis = true
        this.form = {
          id: this.comData.id,
          name: this.comData.name,
          type: this.comData.type,
          // account: this.comData.datakey,
          value: this.comData.value
        }
      }
    }
  }
</script>

<style lang="scss">
  .mini {
    .el-dialog {
      width: 520px;
    }
  }
</style>
