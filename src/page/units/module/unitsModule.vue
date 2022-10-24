<template>
  <el-dialog class="medium" :title="title" :visible.sync="model" :before-close="closeDialog"
             :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" ref="form" label-width="80px">
      <div class="line">
        <el-form-item label="单位名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入单位名称"></el-input>
        </el-form-item>
        <el-form-item label="单位类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择单位类型">
            <el-option v-for="item in unitList" :label="item.value" :value="item.datakey"
                       :key="item.datakey"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="line">
        <el-form-item label="单位法人" prop="owner">
          <el-input v-model="form.owner" placeholder="请输入单位法人"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="tel">
          <el-input v-model="form.tel" placeholder="请输入联系方式"></el-input>
        </el-form-item>
      </div>
      <div class="city">
        <el-form-item label="详细地址" class="is-required">
          <div class="form-box">
            <div class="form-child">
              <el-select v-model="form.province" @change="choseProvince" placeholder="请选择省">
                <el-option v-for="item in provinceData" :label="item.value" :value="item.id" :key="item.id"></el-option>
              </el-select>
            </div>
            <div class="form-child">
              <el-select v-model="form.city" @change="choseCity" placeholder="请选择市">
                <el-option v-for="item in cityData" :label="item.value" :value="item.id" :key="item.id"></el-option>
              </el-select>
            </div>
            <div class="form-child">
              <el-select v-model="form.district" @change="choseArea" placeholder="请选择区">
                <el-option v-for="item in areaData" :label="item.value" :value="item.id" :key="item.id"></el-option>
              </el-select>
            </div>
            <div class="form-child">
              <el-select v-model="form.street" placeholder="请选择街道">
                <el-option v-for="item in streetData" :label="item.value" :value="item.id" :key="item.id"></el-option>
              </el-select>
            </div>
          </div>
          <el-form-item class="is-required" :error="addrError">
            <el-input class="textarea" placeholder="请输入详细地址" v-model="form.address" type="textarea"></el-input>
          </el-form-item>
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="submit('form')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import service from '../service/service'

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
        title: '新建单位',
        model: true,
        unitList: [],
        provinceData: [],
        cityData: [],
        areaData: [],
        streetData: [],
        addrError: '',
        id: '',
        form: {
          name: '',
          type: '',
          owner: '',
          tel: '',
          province: '',
          city: '',
          district: '',
          street: '',
          address: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入单位名称', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '请选择单位类型', trigger: 'change'}
          ],
          tel: [
            {required: true, message: '请输入手机号码', trigger: 'blur'},
            {pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号码'}
          ],
          owner: [
            {required: true, message: '请输入单位法人', trigger: 'blur'},
            {pattern: /^[\u0391-\uFFE5]+$/, message: '请输入中文字符', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      // 省数据 请求市数据
      choseProvince () {
        service.getdatadict({type: 'SHI', pid: this.form.province}).then((e) => {
          this.cityData = e
          this.form.city = '';
          this.form.district = '';
          this.form.street = '';
        })
      },
      // 市数据 请求区数据
      choseCity () {
        service.getdatadict({type: 'QU', pid: this.form.city}).then((e) => {
          this.areaData = e
          this.form.district = '';
          this.form.street = '';
        })
      },
      // 区数据 请求街道数据
      choseArea () {
        service.getdatadict({type: 'JD', pid: this.form.district}).then((e) => {
          this.streetData = e
          this.form.street = '';
        })
      },
      submit (formName) {
        this.$refs[formName].validate((valid) => {
          let res = true
          if (this.form.province === '' || this.form.city === '' || this.form.district === '' || this.form.street === '' || this.form.address === '') {
            this.addrError = '请填写完整单位地址'
            res = false
          } else {
            this.addrError = ''
          }
          if (valid && res) {
            if (JSON.stringify(this.comData) === '{}') {
              service.addUnit(this.form).then((e) => {
                if (e.rtnCode === '1') {
                  this.$message({
                    type: 'success',
                    message: '添加成功!'
                  })
                  this.$emit('refresh')
                  this.visited.page = null
                } else {
                  this.$message({
                    type: 'error',
                    message: e.rtnMsg
                  })
                }
              })
            } else {
              let data = {
                id: this.id,
                ...this.form
              }
              service.updateUnit(data).then((e) => {
                if (e.rtnCode === '1') {
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  })
                  this.$emit('refresh')
                  this.visited.page = null
                } else {
                  this.$message({
                    type: 'error',
                    message: e.rtnMsg
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
      this.LOADING(800)
      service.getdatadict({type: 'DEPTtype'}).then((e) => {
        this.unitList = e
      })
      if (JSON.stringify(this.comData) !== '{}') {
        // 编辑用户
        this.title = '编辑单位';
        this.form = {
          name: this.comData.NAME,
          type: this.comData.TYPE,
          owner: this.comData.OWNER,
          tel: this.comData.TEL,
          province: this.comData.PROVINCE,
          city: this.comData.CITY,
          district: this.comData.DISTRICT,
          street: this.comData.STREET,
          address: this.comData.ADDRESS
        }
        this.id = this.comData.ID
        service.getdatadict({type: 'SHENG'}).then((e) => {
          this.provinceData = e
          service.getdatadict({type: 'SHI', pid: this.comData.PROVINCE}).then((e) => {
            this.cityData = e
          })
          service.getdatadict({type: 'QU', pid: this.comData.CITY}).then((e) => {
            this.areaData = e
          })
          service.getdatadict({type: 'JD', pid: this.comData.DISTRICT}).then((e) => {
            this.streetData = e
          })
        })
      } else {
        // 新建用户
        service.getdatadict({type: 'SHENG'}).then((e) => {
          this.provinceData = e
        })
      }
    }
  }
</script>

<style lang="scss">
  .medium {
    .el-dialog {
      width: 650px
    }

    .line {
      .el-form-item {
        display: inline-block;
        width: 48%;

        &:last-child {
          float: right;
        }
      }
    }

    .city {
      .form-box {
        display: flex;
        margin-bottom: 10px;

        .form-child {
          width: 25%;
          padding-left: 2.5px;
          padding-right: 2.5px;
        }

        .form-child:first-child {
          padding-left: 0;
        }

        .form-child:last-child {
          padding-right: 0;
        }
      }
    }
  }

  .textarea {
    margin-top: 10px;

    .el-textarea__inner {
      resize: none !important;
    }
  }
</style>
