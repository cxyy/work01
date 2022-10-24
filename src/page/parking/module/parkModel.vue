<template>
  <el-dialog class="small" :title="title" :visible.sync="model" :before-close="closeDialog"
             :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="车位编号" prop="stallid">
        <el-input v-model="form.stallid" placeholder="请输入车位编号"></el-input>
      </el-form-item>
      <el-form-item label="所属停车场" prop="parkid">
        <el-select v-model="form.parkid" placeholder="请选择停车场" @change="parkidChange(form.parkid)">
          <el-option v-for="item in parkList" :label="item.PNAME" :value="item.ID" :key="item.ID"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地磁" prop="eqptid">
        <el-select v-model="form.eqptid" placeholder="请选择地磁">
          <el-option v-for="item in eqptidList" :label="item.NAME" :value="item.ID" :key="item.ID"></el-option>
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
      }
    },
    data () {
      return {
        title: '新建车位',
        model: true,
        parkList: [],
        eqptidList: [],
        form: {
          stallid: '',
          parkid: '',
          eqptid: ''
        },
        rules: {
          stallid: [
            {required: true, message: '请输入车位编号', trigger: 'blur'}
          ],
          parkid: [
            {required: true, message: '请选择停车场', trigger: 'change'}
          ],
          eqptid: [
            {required: true, message: '请选择地磁', trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      parkidChange (data) {
        this.form.eqptid = ''
        Axios.getGeoma({parkid: data}).then(data => {
          if (data.rtnCode === '1') {
            this.eqptidList = data.rtnMap.list
          } else {
            this.eqptidList = []
          }
        })
      },
      submit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (JSON.stringify(this.comData) === '{}') {
              Axios.addCarport(this.form).then(data => {
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
              Axios.updateCarport(this.form).then(data => {
                if (data.rtnCode === '1') {
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  });
                  this.$emit('refresh')
                  this.visited.page = null
                }
              })
            }
          }
        })
      },
      closeDialog () {
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
    mounted () {
      this.getparks()
      this.LOADING()
      if (JSON.stringify(this.comData) !== '{}') {
        this.title = '编辑车位'
        this.parkidChange(this.comData.PARKID)
        this.form = {
          id: this.comData.ID,
          stallid: this.comData.STALLID,
          parkid: this.comData.PARKID,
          eqptid: parseInt(this.comData.EQPTID)
        }
      }
    }
  }
</script>

<style lang="scss">
</style>
