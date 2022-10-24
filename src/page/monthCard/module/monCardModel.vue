<template>
  <el-dialog class="small" :title="title" :visible.sync="model" :before-close="closeDialog" :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="月卡名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入月卡名称"></el-input>
      </el-form-item>
      <el-form-item label="月卡类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择月卡类型" :disabled="JSON.stringify(this.comData) !== '{}'">
          <el-option v-for="item in typeList" :label="item.label" :value="item.key" :key="item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="有效时长" prop="value">
        <el-input v-model="form.value" placeholder="请输入有效时长" :disabled="JSON.stringify(this.comData) !== '{}'"></el-input>
      </el-form-item>
      <el-form-item label="优惠价格" prop="money">
        <el-input v-model="form.money" placeholder="请输入优惠价格"></el-input>
      </el-form-item>
      <el-form-item label="所属停车场" prop="parkid">
        <el-select v-model="form.parkid" placeholder="请选择停车场" :disabled="JSON.stringify(this.comData) !== '{}'">
          <el-option v-for="item in parkList" :label="item.PNAME" :value="item.ID" :key="item.ID"></el-option>
        </el-select>
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
      typeList: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        title: '新建月卡',
        model: true,
        parkList: [],
        form: {
          name: '',
          type: '',
          value: '',
          money: '',
          parkid: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入月卡名称', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请选择月卡类型', trigger: 'change' }
          ],
          value: [
            { required: true, message: '请输入有效时长', trigger: 'blur' },
            { pattern: /^\+?[1-9][0-9]*$/, message: '请输入整数', trigger: 'blur' }
          ],
          money: [
            { required: true, message: '请输入优惠价格', trigger: 'blur' },
            { pattern: /^\+?[1-9][0-9]*$/, message: '请输入整数', trigger: 'blur' }
          ],
          parkid: [
            { required: true, message: '请选择停车场', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      submit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (JSON.stringify(this.comData) === '{}'){
              Axios.addmon(this.form).then(data => {
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
              Axios.updatemon(this.form).then(data => {
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
      closeDialog (){
        this.visited.page = null
      },
      getparks () {
        Axios.getparks().then(data => {
          if (data.rtnCode === '1') {
            this.parkList = data.rtnMap.result
          }
        })
      }
    },
    mounted() {
      this.getparks()
      this.LOADING()
      if (JSON.stringify(this.comData) !== '{}'){
        this.title = '编辑月卡'
        this.form = {
          id: this.comData.ID,
          name: this.comData.NAME,
          type: this.comData.TYPE,
          value: this.comData.VALUE,
          money: this.comData.MONEY,
          parkid: this.comData.PARKID
        }
      }
    }
  }
</script>

<style lang="scss">
</style>
