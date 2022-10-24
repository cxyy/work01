<template>
  <el-dialog class="small" :title="title" :visible.sync="model" :before-close="closeDialog" :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="公共机IP" prop="ip">
        <el-input v-model="form.ip" placeholder="请输入公共机IP"></el-input>
      </el-form-item>
      <el-form-item label="设备ID" prop="id">
        <el-input v-model="form.id" placeholder="请输入设备ID"></el-input>
      </el-form-item>
      <el-form-item label="设备名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入设备名称"></el-input>
      </el-form-item>
      <el-form-item label="设备状态" prop="online" v-if="JSON.stringify(this.comData) !== '{}'">
        <el-select v-model="form.online" placeholder="请选择设备状态">
          <el-option v-for="item in deviceonline" :label="item.label" :value="item.key" :key="item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="进出场类别" prop="inorout">
        <el-select v-model="form.inorout" placeholder="请选择进出场类别">
          <el-option v-for="item in inoroutList" :label="item.label" :value="item.key" :key="item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属停车场" prop="parkid">
        <el-select v-model="form.parkid" placeholder="请选择停车场">
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
      deviceonline: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        title: '新建设备',
        model: true,
        parkList: '',
        inoroutList: [
          { key: 1, label: '入场' },
          { key: 2, label: '出场' }
        ],
        form: {
          ip: '',
          id: '',
          name: '',
          inorout: '',
          parkid: ''
        },
        rules: {
          ip: [
            { required: true, message: '请输入公共机IP', trigger: 'blur' }
          ],
          id: [
            { required: true, message: '请输入设备ID', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入设备名称', trigger: 'blur' }
          ],
          online: [
            { required: true, message: '请选择设备状态', trigger: 'change' }
          ],
          inorout: [
            { required: true, message: '请选择进出场类别', trigger: 'change' }
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
              Axios.addEqpt(this.form).then(data => {
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
              Axios.updateEqpt(this.form).then(data => {
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
        let [vm, state] = [this, '']
        this.deviceonline.forEach(val => {
          if (val.label === vm.comData.STATE) {
            state = val.key
          }
        })
        this.title = '编辑设备'
        this.form = {
          uuid: this.comData.UUID,
          ip: this.comData.IP,
          id: this.comData.ID,
          name: this.comData.NAME,
          inorout: this.comData.INOROUT,
          parkid: this.comData.PARKID,
          online: state
        }
      }
    }
  }
</script>

<style lang="scss">
</style>
