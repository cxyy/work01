<template>
  <el-dialog class="medium" :title="title" :visible.sync="model" :before-close="closeDialog" :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" ref="form" label-width="80px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="form.roleName" placeholder="请输入角色名称"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="note">
        <el-input v-model="form.note" placeholder="请输入备注"></el-input>
      </el-form-item>
      <el-form-item label="功能权限" class="is-required" :error="treeError">
        <el-tree :data="treeData" :props="powerPerProps" show-checkbox node-key="id" ref="powerTree" @check-change="checkChange" highlight-current></el-tree>
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
        title: '新建角色',
        model: true,
        treeError: '',
        form: {
          id: '',
          roleName: '',
          note: ''
        },
        rules: {
          roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' }
          ],
          note: [
            { required: true, message: '请输入角色备注', trigger: 'blur' }
          ]
        },
        treeData: [],
        powerPerProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    methods: {
      checkChange () {
        if (!this.$refs.powerTree.getCheckedKeys().length) {
          this.treeError = '请选择选择权限'
        } else {
          this.treeError = ''
        }
      },
      submit(formName) {
        this.$refs[formName].validate((valid) => {
          if (!this.$refs.powerTree.getCheckedKeys().length) {
            this.treeError = '请选择选择权限'
          } else {
            this.treeError = ''
          }
          valid = valid && this.$refs.powerTree.getCheckedKeys().length
          if (valid) {
            if (JSON.stringify(this.comData) === '{}'){
              let menuIds = ''
              this.$refs.powerTree.getCheckedKeys().forEach(val => {
                menuIds = menuIds + val + ','
              })
              this.$refs.powerTree.getHalfCheckedKeys().forEach(val => {
                menuIds = menuIds + val + ','
              })
              menuIds = menuIds.substring(0, menuIds.length - 1)
              let params = {
                name: this.form.roleName,
                comment: this.form.note,
                menuIds: menuIds
              }
              Axios.addrole(params).then(data => {
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
              let menuIds = ''
              this.$refs.powerTree.getCheckedKeys().forEach(val => {
                menuIds = menuIds + val + ','
              })
              this.$refs.powerTree.getHalfCheckedKeys().forEach(val => {
                menuIds = menuIds + val + ','
              })
              menuIds = menuIds.substring(0, menuIds.length - 1)
              let params = {
                id: this.form.id,
                name: this.form.roleName,
                comment: this.form.note,
                menuIds: menuIds
              }
              Axios.updaterolemenu(params).then(data => {
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
      },
      closeDialog (){
        this.visited.page = null
      },
      getmenu () {
        return Axios.getmenu().then(data => {
          if (data.rtnCode === '1') {
            this.treeData = data.rtnMap.result.children
          }
        })
      }
    },
    async mounted() {
      await this.getmenu()
      this.LOADING()
      if (JSON.stringify(this.comData) !== '{}'){
        this.title = '编辑角色'
        this.form = {
          id: this.comData.id,
          roleName: this.comData.name,
          note: this.comData.comment
        }
        Axios.getmenubyid({id: this.form.id}).then(data => {
          if (data.rtnCode === '1') {
            this.$refs.powerTree.setCheckedKeys(data.rtnMap.result)
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .el-tree{
    margin-top: 7px;
  }
</style>
