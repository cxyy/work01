<template>
  <el-dialog class="mini" :title="title" :visible.sync="model" :before-close="closeDialog"
             :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" ref="form" label-width="80px">
      <el-form-item label="账户" prop="account">
        <el-input v-model="form.account" :disabled="JSON.stringify(comData)!=='{}'" placeholder="请输入账户"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" v-if="JSON.stringify(comData)==='{}'">
        <el-input v-model="form.password" placeholder="请输入密码" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="passwordTwo" v-if="JSON.stringify(comData)==='{}'">
        <el-input v-model="form.passwordTwo" v-model.trim="form.passwordTwo" placeholder="请再次输入密码"
                  type="password"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="tel">
        <el-input v-model="form.tel" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="角色类型" prop="roleid">
        <el-select v-model="form.roleid" placeholder="请选择角色类型" :disabled="JSON.stringify(comData)!=='{}'">
          <el-option v-for="item in roleList" :label="item.VALUE" :value="item.DATAKEY" :key="item.DATAKEY"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属组织" prop="roleid" style="margin-bottom: 15px" v-if="form.roleid!==0">
        <el-select v-model="form.deptid" placeholder="请选择所属组织" :disabled="JSON.stringify(comData)!=='{}'">
          <el-option v-for="item in deptList" :label="item.NAME" :value="item.ID" :key="item.ID"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-radio-group v-model="form.state">
          <el-radio label="0">正常</el-radio>
          <el-radio label="1">禁用</el-radio>
        </el-radio-group>
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
      },
      roleList: {
        type: Array,
        required: true
      }
    },
    data () {
      let accountFun = (rule, value, callback) => {
        let userRe = /[\u4e00-\u9fa5_a-zA-Z0-9_]{5,15}/;
        if (value === '') {
          callback(new Error('请输入用户名!'));
        } else if (!userRe.test(value)) {
          callback(new Error('请输入正确的用户名!'));
        }
        callback();
      }
      let passwordFun = (rule, value, callback) => {
        let pwRe = /^[A-Za-z0-9]{5,20}$/;
        if (value === '') {
          callback(new Error('请输入密码!'));
        } else if (!pwRe.test(value)) {
          callback(new Error('请输入正确的密码!'));
        }
        callback();
      }
      let passwordTwoFun = (rule, value, callback) => {
        let pwRe = /^[A-Za-z0-9]{5,20}$/;
        if (value === '') {
          callback(new Error('请输入密码!'));
        } else if (!pwRe.test(value)) {
          callback(new Error('请输入正确的密码!'));
        } else if (this.form.password !== this.form.passwordTwo) {
          callback(new Error('您两次输入的密码不一致!'));
        }
        callback();
      }

      return {
        title: '新建用户',
        model: true,
        deptList: [],
        form: {
          account: '',
          name: '',
          password: '',
          passwordTwo: '',
          tel: '',
          email: '',
          roleid: '',
          deptid: '',
          state: ''
        },
        rules: {
          account: [
            {validator: accountFun, trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ],
          password: [
            {validator: passwordFun, trigger: 'blur'}
          ],
          passwordTwo: [
            {validator: passwordTwoFun, trigger: 'blur'}
          ],
          tel: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号码'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {
              pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
              message: '请输入正确的邮箱'
            }
          ],
          roleid: [
            {required: true, message: '请选择角色类型', trigger: 'change'}
          ],
          deptid:
            [
              {required: true, message: '请输入所属组织', trigger: 'blur'}
            ],
          state:
            [
              {required: true, message: '请选择状态', trigger: 'change'}
            ]
        }
      }
    },
    methods: {
      submit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.form.roleid === 0) {
              this.form.deptid = ''
            }
            if (JSON.stringify(this.comData) === '{}') {
              Axios.adduser(this.form).then(data => {
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
              Axios.updateuser(this.form).then(data => {
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
      },
      getdept () {
        return Axios.getdept().then(data => {
          if (data.rtnCode === '1') {
            this.deptList = data.rtnMap.result
          }
        })
      }
    },
    async mounted () {
      this.LOADING(700)
      await this.getdept()
      if (JSON.stringify(this.comData) !== '{}') {
        this.title = '编辑用户'
        this.form = {
          id: this.comData.ID,
          account: this.comData.ACCOUNT,
          name: this.comData.NAME,
          tel: this.comData.TEL,
          email: this.comData.EMAIL,
          roleid: this.comData.ROLEID,
          deptid: this.comData.DEPTID,
          state: this.comData.STAUSKEY.toString()
        }
      }
    }
  }
</script>

<style lang="scss">
</style>
