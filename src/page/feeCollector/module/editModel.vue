<template>
  <el-dialog class="small" :title="title" :visible.sync="model" :before-close="closeDialog"
             :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="收费员" prop="name">
        <el-input v-model="form.name" placeholder="请输入收费员姓名"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入联系方式"></el-input>
      </el-form-item>
      <el-form-item label="所属停车场" prop="parkname">
        <el-select v-model="form.parkname" placeholder="请输入停车场名称">
          <el-option v-for="item in getparksDataList"
                     :label="item.PNAME"
                     :value="item.ID"
                     :key="item.ID"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备" prop="eqptid">
        <el-select v-model="form.eqptid" placeholder="请输入设备名称">
          <el-option v-for="items in PDAList"
                     :label='items.NAME'
                     :value='items.ID'
                     :key='items.ID'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="form.sex">
          <el-radio :label="0">男</el-radio>
          <el-radio :label="1">女</el-radio>
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
  import Axios from '@/common/Axios/interface';

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
        title: '新建收费员',
        model: true,
        form: {
          name: '',
          unit: '',
          phone: '',
          parkname: '',
          PDA: '',
          eqptid: '',
          sex: 0,
          radio: ''
        },
        PDAList: '',
        getparksDataList: '',
        rules: {
          name: [
            {required: true, message: '请输入收费员姓名', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入联系方式', trigger: 'blur'},
            {pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号码'}
          ],
          parkname: [
            {required: true, message: '请输入所属停车场', trigger: 'change'}
          ],
          eqptid: [
            {required: true, message: '请输入设备', trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      submit (formName) {
        this.$refs[formName].validate((valid) => {
          if (JSON.stringify(this.comData) !== '{}') {
            let str = {
              id: this.comData.ID,
              name: this.form.name,
              parkid: this.form.parkname,
              eqptid: this.form.eqptid,
              tel: this.form.phone,
              sex: this.form.sex
            }
            Axios.editToll(str).then(data => {
              this.$emit('refresh')
              this.visited.page = null
            })
          } else {
            if (valid) {
              let str = {
                name: this.form.name,
                parkid: this.form.parkname,
                eqptid: this.form.eqptid,
                tel: this.form.phone,
                sex: this.form.sex
              }
              Axios.addToll(str).then(data => {
                this.$emit('refresh')
                this.visited.page = null
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
      this.LOADING()
      Axios.getparks().then(data => {
        this.getparksDataList = data.rtnMap.result
      })
      Axios.getPDA().then(data => {
        console.log(data)
        this.PDAList = data.rtnMap.list
      })
      if (JSON.stringify(this.comData) !== '{}') {
        this.title = '编辑收费员'
        this.form = {
          name: this.comData.NAME,
          phone: this.comData.TEL,
          unit: this.comData.unit,
          parkname: this.comData.PARKID,
          eqptid: parseInt(this.comData.EQPTID),
          sex: this.comData.SEX
        }
      }
    }
  }
</script>

<style lang="scss">
</style>
