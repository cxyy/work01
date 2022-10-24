<template>
  <el-dialog class="small" :title="title" :visible.sync="model" :before-close="closeDialog"
             :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="车牌号" prop="carid">
        <el-input v-model="form.carid" placeholder="请输入车牌号"></el-input>
      </el-form-item>
      <el-form-item label="车辆类型" prop="cartype">
        <el-select v-model="form.cartype" placeholder="请选择车辆类型">
          <el-option v-for="item in carTypeList" :label="item.value" :value="item.datakey"
                     :key="item.datakey"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属停车场" multiple prop="parkid">
        <el-select v-model="form.parkid" :disabled="JSON.stringify(this.comData) !== '{}'" multiple
                   placeholder="请选择停车场">
          <el-option v-for="item in parkList" :label="item.PNAME" :value="item.ID" :key="item.ID"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="comment">
        <el-input v-model="form.comment" type="textarea" :autosize="{ minRows: 4, maxRows: 4}"
                  placeholder="请输入备注"></el-input>
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
      carTypeList: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        title: '新建白名单',
        model: true,
        parkList: [],
        form: {
          iswhite: '1',
          carid: '',
          cartype: '',
          comment: '',
          parkid: ''
        },
        rules: {
          carid: [
            {required: true, message: '请输入车牌号', trigger: 'blur'},
            {
              pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/,
              message: '请输入正确的车牌号'
            }
          ],
          cartype: [
            {required: true, message: '请选择车辆类型', trigger: 'change'}
          ],
          parkid: [
            {required: true, message: '请选择停车场', trigger: 'change'}
          ],
          comment: [
            {required: true, message: '请输入备注', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      submit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (JSON.stringify(this.comData) === '{}') {
              let str = {
                iswhite: this.form.iswhite,
                carid: this.form.carid,
                cartype: this.form.cartype,
                comment: this.form.comment,
                parkIdList: this.form.parkid.toString()
              }
              console.log(str)
              Axios.addcar(str).then(data => {
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
              Axios.updatecarinfo(this.form).then(data => {
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
      closeDialog() {
        this.visited.page = null
      },
      getparks() {
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
      if (JSON.stringify(this.comData) !== '{}') {
        this.title = '编辑白名单'
        this.form = {
          iswhite: '1',
          id: this.comData.ID,
          carid: this.comData.CARID,
          cartype: this.comData.CARTYPE,
          parkid: this.comData.PARKID,
          comment: this.comData.COMMENT
        }
      }
    }
  }
</script>

<style lang="scss">
</style>
