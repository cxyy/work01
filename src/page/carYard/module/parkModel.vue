<template>
  <el-dialog :title="title" :visible.sync="model" :before-close="closeDialog" :close-on-click-modal="false"
             class="park-model">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="停车场名称" prop="pname">
        <el-input v-model="form.pname" placeholder="请输入停车场名称"></el-input>
      </el-form-item>
      <el-form-item label="负责人" prop="linkman">
        <el-input v-model="form.linkman" placeholder="请输入负责人"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="linkphone">
        <el-input v-model="form.linkphone" placeholder="请输入联系方式"></el-input>
      </el-form-item>
      <el-form-item label="收费规则" prop="feesid">
        <el-select v-model="form.feesid" placeholder="请选择收费规则">
          <el-option v-for="item in ruleList" :label="item.NAME" :value="item.FEESID" :key="item.FEESID"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="账户" prop="accountid">
        <el-select v-model="form.accountid" placeholder="请选择账户">
          <el-option v-for="item in accountList" :label="item.name" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="车位总数" prop="totalnum">
        <el-input v-model="form.totalnum" placeholder="请输入车位总数"></el-input>
      </el-form-item>
      <el-form-item label="停车场地址" class="is-required" style="margin-bottom: 5px" :error="addrError">
        <div class="form-box">
          <div class="form-child">
            <el-select v-model="form.province" placeholder="请选择省" class="qy-block"
                       @change="getNextData('province', form.province)">
              <el-option v-for="item in provinceList" :label="item.value" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </div>
          <div class="form-child">
            <el-select v-model="form.city" placeholder="请选择市" class="qy-block" @change="getNextData('city', form.city)">
              <el-option v-for="item in cityList" :label="item.value" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </div>
          <div class="form-child">
            <el-select v-model="form.pdistrict" placeholder="请选择区" class="qy-block"
                       @change="getNextData('pdistrict', form.pdistrict)">
              <el-option v-for="item in pdistrictList" :label="item.value" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </div>
          <div class="form-child">
            <el-select v-model="form.pstreet" placeholder="请选择街道" class="qy-block" @change="clearAddrError">
              <el-option v-for="item in pstreetList" :label="item.value" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </div>
        </div>
        <el-input v-model="form.paddr" placeholder="请输入具体地址" @blur="clearAddrError"></el-input>
      </el-form-item>
      <el-form-item label="停车场坐标" class="is-required margin-top-10" :error="plocationError">
        <p v-if="form.plocation===''" style="color: #87cefa">点击地图获取坐标</p>
        <p>{{form.plocation}}</p>
        <div id="park_model_map"></div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="submit('form')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import BMap from 'BMap'
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
        title: '新建停车场',
        model: true,
        ruleList: [],
        accountList: [],
        provinceList: [],
        cityList: [],
        pdistrictList: [],
        pstreetList: [],
        addrError: '',
        plocationError: '',
        form: {
          id: '',
          pname: '',
          linkman: '',
          linkphone: '',
          feesid: '',
          accountid: '',
          totalnum: '',
          province: '',
          city: '',
          pdistrict: '',
          pstreet: '',
          paddr: '',
          plocation: ''
        },
        rules: {
          pname: [
            {required: true, message: '请输入停车场名称', trigger: 'blur'}
          ],
          linkman: [
            {required: true, message: '请输入负责人', trigger: 'blur'},
            {pattern: /^[\u0391-\uFFE5]+$/, message: '请输入中文字符', trigger: 'blur'}
          ],
          linkphone: [
            {required: true, message: '请输入联系方式', trigger: 'blur'},
            {pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号码'}
          ],
          feesid: [
            {required: true, message: '请选择收费规则', trigger: 'change'}
          ],
          accountid: [
            {required: true, message: '请选择账户', trigger: 'change'}
          ],
          totalnum: [
            {required: true, message: '请输入车位总数', trigger: 'blur'},
            {pattern: /^\+?[1-9][0-9]*$/, message: '请输入整数', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      buildMap (plocation) {
        let [map, vm] = [new BMap.Map('park_model_map'), this]
        map.centerAndZoom(new BMap.Point(120.311611, 31.506261), 13)
        map.addControl(new BMap.NavigationControl())
        map.enableScrollWheelZoom(true);
        map.addEventListener('click', setPoint)
        function setPoint (e) {
          vm.clearAddrError()
          map.clearOverlays()
          let marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat))
          map.addOverlay(marker)
          vm.form.plocation = e.point.lng.toString() + ', ' + e.point.lat.toString()
          vm.plocationError = ''
        }
        if (plocation !== '') {
          let pointArr = plocation.split(',')
          let marker = new BMap.Marker(new BMap.Point(pointArr[0], pointArr[1]))
          map.addOverlay(marker)
        }
      },
      submit (formName) {
        this.$refs[formName].validate((valid) => {
          let res = true
          if (this.form.province === '' || this.form.city === '' || this.form.pdistrict === '' || this.form.pstreet === '' || this.form.paddr === '') {
            this.addrError = '请填写完整停车场地址'
            res = false
          } else {
            this.addrError = ''
          }
          if (this.form.plocation === '') {
            this.plocationError = '请选择停车场坐标'
            res = false
          } else {
            this.plocationError = ''
          }
          if (valid && res) {
            if (JSON.stringify(this.comData) === '{}') {
              delete this.form.id
              Axios.addpark(this.form).then(data => {
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
              Axios.updateParksById(this.form).then(data => {
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
        });
      },
      closeDialog () {
        this.visited.page = null
      },
      clearAddrError () {
        if (this.form.province === '' || this.form.city === '' || this.form.pdistrict === '' || this.form.pstreet === '' || this.form.paddr === '') {
          this.addrError = '请填写完整停车场地址'
        } else {
          this.addrError = ''
        }
      },
      getNextData (name, data) {
        let params = {}
        if (name === undefined) {
          params = {
            type: 'SHENG'
          }
        }
        if (name === 'province') {
          params = {
            type: 'SHI',
            pid: data
          }
          this.cityList = []
          this.pdistrictList = []
          this.pstreetList = []
          this.form.city = ''
          this.form.pdistrict = ''
          this.form.pstreet = ''
          this.clearAddrError()
        }
        if (name === 'city') {
          params = {
            type: 'QU',
            pid: data
          }
          this.pdistrictList = []
          this.pstreetList = []
          this.form.pdistrict = ''
          this.form.pstreet = ''
          this.clearAddrError()
        }
        if (name === 'pdistrict') {
          params = {
            type: 'JD',
            pid: data
          }
          this.pstreetList = []
          this.form.pstreet = ''
          this.clearAddrError()
        }
        Axios.getdatadict(params).then(data => {
          if (data.rtnCode === '1') {
            if (name === undefined) {
              this.provinceList = data.rtnMap.result
            }
            if (name === 'province') {
              this.cityList = data.rtnMap.result
            }
            if (name === 'city') {
              this.pdistrictList = data.rtnMap.result
            }
            if (name === 'pdistrict') {
              this.pstreetList = data.rtnMap.result
            }
          }
        })
      },
      getRuleList () {
        Axios.getfees({pageLength: 'all'}).then(data => {
          if (data.rtnCode === '1') {
            this.ruleList = data.rtnMap.result
          }
        })
      },
      editGetNextData () {
        Axios.getdatadict({type: 'SHENG'}).then(data => {
          this.provinceList = data.rtnMap.result
        })
        Axios.getdatadict({type: 'SHI', pid: this.comData.PROVINCE}).then(data => {
          this.cityList = data.rtnMap.result
        })
        Axios.getdatadict({type: 'QU', pid: this.comData.CITY}).then(data => {
          this.pdistrictList = data.rtnMap.result
        })
        Axios.getdatadict({type: 'JD', pid: this.comData.PDISTRICT}).then(data => {
          this.pstreetList = data.rtnMap.result
        })
      },
      getAccountList () {
        Axios.getAccount({pageLength: 'all', state: 1}).then(data => {
          if (data.rtnCode === '1') {
            this.accountList = data.rtnMap.result
          }
        })
      }
    },
    mounted () {
      let vm = this
      vm.LOADING(800)
      vm.getAccountList()
      if (JSON.stringify(vm.comData) !== '{}') {
        vm.title = '编辑停车场'
        vm.form = {
          id: vm.comData.ID,
          pname: vm.comData.PNAME,
          linkman: vm.comData.LINKMAN,
          linkphone: vm.comData.LINKPHONE,
          feesid: vm.comData.FEESID,
          accountid: vm.comData.ACCOUNTID,
          totalnum: vm.comData.TOTALNUM,
          province: vm.comData.PROVINCE,
          city: vm.comData.CITY,
          pdistrict: vm.comData.PDISTRICT,
          pstreet: vm.comData.PSTREET,
          paddr: vm.comData.PADDR,
          plocation: vm.comData.PLOCATION
        }
        vm.editGetNextData()
      }
      setTimeout(function () {
        vm.buildMap(vm.form.plocation)
      }, 0)
      vm.getRuleList()
      vm.getNextData()
    }
  }
</script>

<style lang="scss">
  .park-model {
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
    #park_model_map {
      width: 100%;
      height: 240px;
    }
    .el-dialog {
      margin-top: 68px !important;
    }
  }
</style>
