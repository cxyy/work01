<template>
  <el-dialog class="bigger" :title="title" :visible.sync="model" :before-close="closeDialog"
             :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" ref="form" label-width="80px" v-show="step===1">
      <el-form-item label="规则名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入规则名称"></el-input>
      </el-form-item>
      <el-form-item label="规则简介" prop="description">
        <el-input v-model="form.description" type="textarea" :autosize="{ minRows: 4, maxRows: 4}"
                  placeholder="请输入规则简介"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" v-show="step===1">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="next">下一步</el-button>
    </div>
    <el-form :model="form2" :rules="rules2" ref="form2" v-show="step===2">
      <p class="rule-title">规则配置</p>
      <el-row :gutter="15">
        <el-col :span="4">
          <el-form-item prop="feeStart">
            <el-input v-model="form2.feeStart" placeholder="开始时长/小时"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4" class="park-time">
          <i class="el-icon-arrow-left"></i>
          <span>停车时长</span>
          <i class="el-icon-arrow-left"></i>
        </el-col>
        <el-col :span="4">
          <el-tooltip class="item" effect="dark" content="不输入默认为最大上限" placement="top">
            <el-form-item prop="feeEnd">
              <el-input v-model="form2.feeEnd" placeholder="结束时长/小时"></el-input>
            </el-form-item>
          </el-tooltip>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="feeType">
            <el-select v-model="form2.feeType" placeholder="金额元/时" class="qy-block">
              <el-option v-for="item in feeTypeList" :label="item.label" :value="item.key" :key="item.key"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="price">
            <el-input v-model="form2.price" placeholder="收费标准元/时"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" class="qy-block" @click="addTmpRule">增加</el-button>
        </el-col>
      </el-row>
      <p class="rule-title" style="margin-top: 20px">规则列表</p>
      <el-table :data="ruleData">
        <el-table-column prop="rule_label" label="规则"></el-table-column>
        <el-table-column prop="fee_label" label="收费标准"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="delRule(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <div slot="footer" class="dialog-footer" v-show="step===2">
      <el-button @click="prev">上一步</el-button>
      <el-button type="primary" @click="submit">完 成</el-button>
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
      var feeStartNumber = (rule, value, callback) => {
        var re = /^[0-9]*(\.[0-9]{1})?$/
        if (re.test(value)) {
          callback()
        } else {
          callback(new Error('请输入数字，支持一位小数'))
        }
      }
      var feeEndNumber = (rule, value, callback) => {
        if (value === '') {
          callback()
        } else {
          if (/^[0-9]*(\.[0-9]{1})?$/.test(value)) {
            callback()
          } else {
            callback(new Error('请输入数字，支持一位小数'))
          }
        }
      }
      var priceNumber = (rule, value, callback) => {
        if (/^[0-9]*(\.[0-9]{1})?$/.test(value)) {
          callback()
        } else {
          callback(new Error('请输入数字，支持一位小数'))
        }
      }
      return {
        title: '新建规则',
        model: true,
        step: 1,
        form: {
          id: '',
          name: '',
          description: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入规则名称', trigger: 'blur'}
          ],
          description: [
            {required: true, message: '请输入规则简介', trigger: 'blur'}
          ]
        },
        form2: {
          feeStart: '',
          feeEnd: '',
          feeType: '',
          price: ''
        },
        rules2: {
          feeStart: [
            {required: true, message: '请输入开始时长', trigger: 'blur'},
            {validator: feeStartNumber, trigger: 'blur'}
          ],
          feeEnd: [
            {validator: feeEndNumber, trigger: 'blur'}
          ],
          feeType: [
            {required: true, message: '请选择收费规则', trigger: 'submit'}
          ],
          price: [
            {required: true, message: '请输入收费标准', trigger: 'blur'},
            {validator: priceNumber, trigger: 'blur'}
          ]
        },
        feeTypeList: [
          {key: 0, label: '固定金额'},
          {key: 1, label: '按时间收费/时'}
        ],
        ruleData: []
      }
    },
    methods: {
      next () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.step = 2
          }
        })
      },
      prev () {
        this.step = 1
      },
      closeDialog () {
        this.visited.page = null
      },
      addTmpRule () {
        this.$refs.form2.validate((valid) => {
          if (valid) {
            let [ruleLabel, feeLabel] = ['', '']
            if (this.form2.feeEnd === '') {
              ruleLabel = this.form2.feeStart.toString() + ' < 停车时长 < ' + '无限制'
            } else {
              ruleLabel = this.form2.feeStart.toString() + ' < 停车时长 < ' + this.form2.feeEnd.toString()
            }
            if (this.form2.feeType === 0) {
              feeLabel = '总计 ' + this.form2.price + '元'
            } else if (this.form2.feeType === 1) {
              feeLabel = '每小时 ' + this.form2.price + ' 元'
            }
            let data = {
              idx: this.ruleData.length + 1,
              timestart: this.form2.feeStart,
              timeend: (this.form2.feeEnd === '') ? -1 : this.form2.feeEnd,
              type: this.form2.feeType,
              price: this.form2.price,
              rule_label: ruleLabel,
              fee_label: feeLabel
            }
            this.ruleData.push(data)
            this.form2 = {
              feeStart: '',
              feeEnd: '',
              feeType: '',
              price: ''
            }
          }
        })
      },
      submit () {
        if (this.ruleData.length) {
          let fees = JSON.parse(JSON.stringify(this.ruleData))
          fees.forEach(val => {
            delete val.rule_label
            delete val.fee_label
            delete val.idx
            val.timestart = val.timestart * 60
            if (val.timeend !== -1) {
              val.timeend = val.timeend * 60
            }
          })
          if (JSON.stringify(this.comData) === '{}') {
            let params = {
              name: this.form.name,
              description: this.form.description,
              fees: JSON.stringify(fees)
            }
            Axios.addfees(params).then(data => {
              if (data.rtnCode === '1') {
                this.$message({
                  type: 'success',
                  message: '添加成功'
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
              feeid: this.form.id,
              name: this.form.name,
              description: this.form.description,
              fees: JSON.stringify(fees)
            }
            Axios.updateFees(params).then(data => {
              if (data.rtnCode === '1') {
                this.$message({
                  type: 'success',
                  message: '修改成功'
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
        } else {
          this.$message({
            type: 'warning',
            message: '请先添加规则'
          })
        }
      },
      delRule (row) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          for (let i = 0; i < this.ruleData.length; i++) {
            if (row.idx === this.ruleData[i].idx) {
              this.ruleData.splice(i, 1)
              break
            }
          }
        }).catch(() => {
        });
      }
    },
    mounted () {
      this.LOADING()
      if (JSON.stringify(this.comData) !== '{}') {
        let vm = this
        vm.title = '编辑规则'
        vm.form = {
          id: vm.comData.FEESID,
          name: vm.comData.NAME,
          description: vm.comData.DESCRIPTION
        }
        vm.comData.data.forEach((val, idx) => {
          let [ruleLabel, feeLabel, timeend] = ['', '', '']
          if (val.TIMEEND === -1) {
            ruleLabel = (val.TIMESTART / 60).toString() + '/小时 < 停车时长 < ' + '无限制'
            timeend = -1
          } else {
            ruleLabel = (val.TIMESTART / 60).toString() + '/小时 < 停车时长 < ' + (val.TIMEEND / 60).toString() + '/小时'
            timeend = val.TIMEEND / 60
          }
          if (val.TYPE === 0) {
            feeLabel = '总计 ' + val.PRICE + '元'
          } else if (val.TYPE === 1) {
            feeLabel = '每小时 ' + val.PRICE + ' 元'
          }
          let data = {
            idx: idx + 1,
            type: val.TYPE,
            timestart: val.TIMESTART / 60,
            timeend: timeend,
            price: val.PRICE,
            rule_label: ruleLabel,
            fee_label: feeLabel
          }
          vm.ruleData.push(data)
        })
      }
    }
  }
</script>

<style lang="scss">
  .rule-title {
    font-size: 16px;
    font-weight: bold;
    margin: 15px 0;
  }

  .park-time {
    line-height: 40px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
