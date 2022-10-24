<template>
  <el-dialog class="mini" :title="title" :visible.sync="model" :before-close="closeDialog"
             :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" ref="form" label-width="80px">
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入菜单名称"></el-input>
      </el-form-item>
      <el-form-item label="父级菜单" prop="pLabel">
        <el-input v-model="form.pLabel" disabled></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择类型" disabled>
          <el-option v-for="item in typeList" :label="item.label" :value="item.key" :key="item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序号" prop="order">
        <el-input v-model="form.order" placeholder="请输入排序号"></el-input>
      </el-form-item>
      <el-form-item label="菜单Key" prop="mkey">
        <el-input v-model="form.mkey" placeholder="请输入菜单Key"></el-input>
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
        title: '新建菜单',
        model: true,
        typeList: [
          {key: 0, label: '目录'},
          {key: 1, label: '菜单'},
          {key: 2, label: '按钮'}
        ],
        form: {
          id: '',
          name: '',
          pid: '',
          pLabel: '',
          type: '',
          order: '',
          mkey: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入菜单名称', trigger: 'blur'}
          ],
          pLabel: [
            {required: true, message: '请输入父级菜单', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '请选择类型', trigger: 'change'}
          ],
          order: [
            {required: true, message: '请输入排序号', trigger: 'blur'}
          ],
          mkey: [
            {required: true, message: '请输入菜单Key', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      submit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid){
            if (this.comData.type === 'edit'){
              let params = {
                id: this.form.id,
                name: this.form.name,
                pid: this.form.pid,
                type: this.form.type,
                mkey: this.form.mkey,
                mindex: this.form.order
              }
              Axios.updatemenuinfo(params).then(data => {
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
            } else {
              let params = {
                name: this.form.name,
                pid: this.form.pid,
                type: this.form.type,
                mkey: this.form.mkey,
                mindex: this.form.order
              }
              if (this.comData.menuType === -1) {
                delete params.pid
              }
              Axios.addmenu(params).then(data => {
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
            }
          }
        });
      },
      closeDialog () {
        this.visited.page = null
      }
    },
    mounted () {
      let vm = this
      if (vm.comData.type === 'edit'){
        vm.title = '编辑菜单'
        vm.form = {
          id: vm.comData.id,
          name: vm.comData.label,
          pid: vm.comData.pid,
          pLabel: vm.comData.plabel,
          type: vm.comData.menuType,
          order: vm.comData.index,
          mkey: vm.comData.mkey
        }
      } else {
        let type = ''
        if (vm.comData.menuType === -1) {
          type = 0
        } else if (vm.comData.menuType === 0) {
          type = 1
        } else if (vm.comData.menuType === 1) {
          type = 2
        }
        vm.form = {
          id: '',
          name: '',
          pid: vm.comData.id,
          pLabel: vm.comData.label,
          type: type,
          order: '',
          mkey: ''
        }
      }
    }
  }
</script>

<style lang="scss">
</style>
