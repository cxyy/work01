<template>
  <el-dialog class="small" :title="title" :visible.sync="model" :before-close="closeDialog"
             :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" ref="form" label-width="150px">
      <el-form-item label="代金券名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入代金券名称"></el-input>
      </el-form-item>
      <el-form-item label="所属停车场" prop="parkid">
        <el-select v-model="form.parkid" placeholder="请选择所属停车场" @change="typeChange" v-if="JSON.stringify(this.comData) === '{}'">
          <el-option v-for="item in parkList" :label="item.PNAME" :value="item.ID" :key="item.ID"></el-option>
        </el-select>
        <el-input v-model="form.parkid" :disabled="true" v-if="JSON.stringify(this.comData) !== '{}'"></el-input>
      </el-form-item>
      <el-form-item label="代金券过期时间(天)" prop="date">
        <el-input v-model="form.date" :disabled="JSON.stringify(this.comData) !== '{}'"
                  placeholder="请选择代金券过期时间(天)"></el-input>
      </el-form-item>
      <el-form-item label="代金券种类" prop="type">
        <el-select v-model="form.type" placeholder="请选择代金券种类" @change="typeChange"
                   :disabled="JSON.stringify(this.comData) !== '{}'">
          <el-option v-for="item in typeList" :label="item.label" :value="item.key" :key="item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="代金券时长（小时）" prop="time" v-if="form.type===0">
        <el-input v-model="form.time" :disabled="JSON.stringify(this.comData) !== '{}'"
                  placeholder="请输入代金券时长（小时）"></el-input>
      </el-form-item>
      <el-form-item label="代金券金额（元）" prop="money" v-if="form.type===1">
        <el-input v-model="form.money" :disabled="JSON.stringify(this.comData) !== '{}'"
                  placeholder="请输入代金券金额（元）"></el-input>
      </el-form-item>
      <el-form-item label="代金卷数量" prop="num">
        <el-input v-model="form.num" :disabled="JSON.stringify(this.comData) !== '{}'"
                  placeholder="请输入代金券数量"></el-input>
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
    data () {
      return {
        title: '新建代金券',
        model: true,
        parkList: [],
        form: {
          name: '',
          type: '',
          money: '',
          time: '',
          date: '',
          res: '',
          parkid: '',
          num: ''
        }
      }
    },
    computed: {
      rules: function () {
        if (JSON.stringify(this.comData) === '{}') {
          return {
            name: [
              {required: true, message: '请输入代金券名称', trigger: 'blur'}
            ],
            type: [
              {required: true, message: '请选择代金券种类', trigger: 'change'}
            ],
            date: [
              {required: true, message: '请选择代金券过期时间', trigger: 'change'},
              {pattern: /^[0-9]*$/, message: '请输入正确的代金券过期时间'}
            ],
            time: [
              {required: true, message: '请输入代金券时长（小时）', trigger: 'blur'},
              {pattern: /^[0-9]*$/, message: '请输入正确的代金券时长'}
            ],
            money: [
              {required: true, message: '请输入代金券金额（元）', trigger: 'blur'},
              {pattern: /^\d+(\.\d+)?$/, message: '请输入正确的代金券金额'}
            ],
            num: [
              {required: true, message: '请输入代金券数量', trigger: 'blur'},
              {pattern: /^[0-9]*$/, message: '请输入正确的代金券数量'}
            ],
            parkid: [
              {required: true, message: '请选择所属停车场', trigger: 'change'}
            ]
          }
        } else {
          return {
            name: [
              {required: true, message: '请输入代金券名称', trigger: 'blur'}
            ],
            type: [
              {required: true, message: '请选择代金券种类', trigger: 'change'}
            ],
            date: [
              {required: true, message: '请选择代金券过期时间', trigger: 'change'}
            ],
            time: [
              {required: true, message: '请输入代金券时长（小时）', trigger: 'blur'}
            ],
            money: [
              {required: true, message: '请输入代金券金额（元）', trigger: 'blur'}
            ],
            num: [
              {required: true, message: '请输入代金券数量', trigger: 'blur'}
            ],
            parkid: [
              {required: true, message: '请选择所属停车场', trigger: 'change'}
            ]
          }
        }
      }
    },
    methods: {
      typeChange () {
        this.$refs['form'].clearValidate();
      },
      submit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (JSON.stringify(this.comData) === '{}') {
              Axios.adddis(this.form).then(data => {
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
              let params = {
                id: this.form.id,
                name: this.form.name
              }
              Axios.updatedis(params).then(data => {
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
      closeDialog () {
        this.visited.page = null
      }
    },
    mounted () {
      this.LOADING()
      Axios.getparks().then(data => {
        if (data.rtnCode === '1') {
          this.parkList = data.rtnMap.result
        }
      })
      if (JSON.stringify(this.comData) !== '{}') {
        this.title = '编辑代金券'
        this.form = {
          id: this.comData.ID,
          name: this.comData.NAME,
          type: this.comData.TYPE,
          money: this.comData.VAL,
          time: this.comData.VAL,
          res: this.comData.RES,
          // duetime: this.comData.DUETIME,
          parkid: this.comData.PNAME,
          num: this.comData.NUM,
          date: this.comData.DUETIME
        }
      }
    }
  }
</script>

<style lang="scss">
</style>
