<template>
  <el-dialog class="message-dialog" :title="title" :visible.sync="model" :before-close="closeDialog" :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" ref="form">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="公告标题" prop="title">
            <el-input v-model="form.title" placeholder="请输入公告标题"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="公告受众" prop="reach">
            <el-select v-model="form.reach" placeholder="请选择公告受众" :disabled="JSON.stringify(comData) !== '{}'">
              <el-option v-for="item in reachList" :label="item.label" :value="item.key" :key="item.key"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公告来源" prop="source">
            <el-select v-model="form.source" placeholder="请选择公告来源" :disabled="JSON.stringify(comData) !== '{}'">
              <el-option v-for="item in sourceList" :label="item.label" :value="item.key" :key="item.key"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row :gutter="20">
      <el-col :span="24">
        <p class="ms-content">公告内容</p>
        <el-form :model="formTinymce" ref="formTinymce">
          <el-form-item :error="requireContent">
            <Tinymce ref="tinymce" :height="280"></Tinymce>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="submit('form')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import Axios from '@/common/Axios/interface'

  export default {
    components: {
      Tinymce
    },
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
        title: '新建消息',
        requireContent: '',
        reachList: [
          { key: 0, label: '单位' }
        ],
        sourceList: [
          { key: 0, label: '系统' }
        ],
        model: true,
        formTinymce: {},
        form: {
          title: '',
          reach: '',
          source: '',
          content: ''
        },
        rules: {
          title: [
            { required: true, message: '请输入公告标题', trigger: 'blur' }
          ],
          reach: [
            { required: true, message: '请选择公告受众', trigger: 'change' }
          ],
          source: [
            { required: true, message: '请选择公告来源', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      closeDialog (){
        this.visited.page = null
      },
      submit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.$refs.tinymce.getContent() === '') {
              this.requireContent = '请输入消息内容'
              return
            } else {
              this.requireContent = ''
            }
            if (JSON.stringify(this.comData) === '{}'){
              this.form.content = this.$refs.tinymce.getContent()
              Axios.messageAdd(this.form).then(data => {
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
              this.form.content = this.$refs.tinymce.getContent()
              Axios.messageUpdate(this.form).then(data => {
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
          }
        })
      }
    },
    mounted() {
      if (JSON.stringify(this.comData) !== '{}'){
        this.title = '编辑消息'
        this.form = {
          id: this.comData.ID,
          title: this.comData.TITLE,
          reach: this.comData.REACH,
          source: this.comData.SOURCE,
          content: this.comData.CONTENT
        }
        this.$nextTick(function () {
          this.$refs.tinymce.setContent(this.comData.CONTENT)
        })
      }
    }
  }
</script>

<style lang="scss">
  .message-dialog{
    .el-form-item__error{
      position: relative;
    }
    .ms-content{
      font-size: 14px;
      color: #606266;
      line-height: 40px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
  }
</style>
