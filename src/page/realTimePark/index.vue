<template>
  <div id="real_time_park">
    <div class="header">
      <div class="header-item">
        <div class="box">
          <div class="title">全市停车场数</div>
          <div class="data">{{carAnalysis.parkingNum}}</div>
        </div>
      </div>
      <div class="header-item">
        <div class="box">
          <div class="title">全市车位总数</div>
          <div class="data">{{carAnalysis.parkNum}}</div>
        </div>
      </div>
      <div class="header-item">
        <div class="box">
          <div class="title">已用车位总数</div>
          <div class="data">{{carAnalysis.useDetail}}</div>
        </div>
      </div>
      <div class="header-item">
        <div class="box no-border">
          <div class="title">使用率</div>
          <div class="data">{{carAnalysis.useScale}}</div>
        </div>
      </div>
    </div>
    <div v-show="isList">
      <div class="real_time_park-search">
        <div class="area-search">
          <div class="top">
            <div class="top-opt" @click="changeMap">
              <i class="el-icon-refresh"></i>
              <span>切换为地图</span>
            </div>
          </div>
          <div class="search-box">
            <div class="search-form-item w100">
              <label>乡镇/街道：</label>
              <div class="form-box">
                <div class="form-child">
                  <el-select v-model="form.province" placeholder="请选择省" class="qy-block"
                             @change="getNextData('province', form.province)">
                    <el-option v-for="item in provinceList" :label="item.value" :value="item.id"
                               :key="item.id"></el-option>
                  </el-select>
                </div>
                <div class="form-child">
                  <el-select v-model="form.city" placeholder="请选择市" class="qy-block"
                             @change="getNextData('city', form.city)">
                    <el-option v-for="item in cityList" :label="item.value" :value="item.id" :key="item.id"></el-option>
                  </el-select>
                </div>
                <div class="form-child">
                  <el-select v-model="form.pdistrict" placeholder="请选择区" class="qy-block"
                             @change="getNextData('pdistrict', form.pdistrict)">
                    <el-option v-for="item in pdistrictList" :label="item.value" :value="item.id"
                               :key="item.id"></el-option>
                  </el-select>
                </div>
                <div class="form-child">
                  <el-select v-model="form.pstreet" placeholder="请选择街道" class="qy-block">
                    <el-option v-for="item in pstreetList" :label="item.value" :value="item.id"
                               :key="item.id"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="search-form-btn ml30">
                <el-button type="primary" @click="search">搜索</el-button>
                <el-button @click="reset">重置</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="data-card-list">
        <el-row :gutter="30">
          <el-col :span="6" v-for="(item, index) in tableData" :key="index">
            <div class="card-box">
              <div class="card-box-content">
                <div class="sign">
                  <i class="w-icon-parking"></i>
                </div>
                <div class="detail">
                  <div>
                    <p class="title" v-auto-title>{{item.PNAME}}</p>
                  </div>
                  <p class="info" v-auto-title>本月已经收款：{{item.MONEY}}元</p>
                  <p class="info" v-auto-title>负责人：{{item.LINKMAN}}</p>
                  <p class="info" v-auto-title>联系方式：{{item.LINKPHONE}}</p>
                  <p class="info" v-auto-title>设备：{{item.STATUS}}</p>
                </div>
                <div class="percent">
                  <el-progress type="circle" :percentage="item.percentage" :width="80" :stroke-width="10"
                               :color="item.color"></el-progress>
                </div>
              </div>
              <div class="card-box-footer">
                <div class="total">车位总数：{{item.TOTALNUM}}</div>
                <div class="separator">|</div>
                <div class="used">已用车位：{{item.USEDNUM}}</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <realTimeParkMap :isList="isList" @changeList="changeList" ref="comMap" v-show="!isList"></realTimeParkMap>
  </div>
</template>

<script>
  import Axios from '@/common/Axios/interface'
  import checkboxSearch from '@/components/checkboxSearch/'
  import realTimeParkMap from './module/realTimeParkMap'
  import mixin from '@/common/mixins'

  export default {
    name: 'realTimePark',
    mixins: [mixin],
    components: {
      checkboxSearch,
      realTimeParkMap
    },
    data () {
      return {
        provinceList: [],
        cityList: [],
        pstreetList: [],
        pdistrictList: [],
        form: {
          province: '',
          city: '',
          pdistrict: '',
          pstreet: ''
        },
        carAnalysis: {
          parkingNum: 0,
          parkNum: 0,
          useDetail: 0,
          useScale: 0
        },
        tableData: [],
        isList: true,
        checkboxList: []
      }
    },
    methods: {
      changeMap () {
        this.isList = false
        this.$refs.comMap.buildMap(this.tableData)
      },
      changeList () {
        this.isList = true
      },
      search () {
        this.initList()
      },
      reset () {
        this.form = {
          province: '',
          city: '',
          pdistrict: '',
          pstreet: ''
        }
        this.cityList = []
        this.pstreetList = []
        this.pdistrictList = []
      },
      carGetdatadict () {
        Axios.carGetdatadict().then(data => {
          if (data.rtnCode === '1') {
            this.checkboxList = data.rtnMap.result
          }
        })
      },
      getArea (data) {
        this.form.pdistrict = data
        this.form.pstreet = ''
        let params = {
          pid: data,
          type: 'JD'
        }
        Axios.getdatadict(params).then(data => {
          if (data.rtnCode === '1') {
            this.pstreetList = data.rtnMap.result
          }
        })
      },
      getData () {
        Axios.carportdata({city: this.form.city}).then(data => {
          if (data.rtnCode === '1') {
            this.carAnalysis = {
              parkingNum: data.rtnMap.result.PNUM,
              parkNum: data.rtnMap.result.TOTALNUM,
              useDetail: data.rtnMap.result.USEDNUM,
              useScale: data.rtnMap.result.USED
            }
          }
        })
      },
      initList () {
        this.getData()
        Axios.carportused(this.form).then(data => {
          if (data.rtnCode === '1') {
            data.rtnMap.result.forEach(val => {
              val.percentage = Number((val.USEDNUM / val.TOTALNUM * 100).toFixed(0))
              if (val.percentage >= 0 && val.percentage <= 60) {
                val.color = '#54A933'
              } else if (val.percentage > 60 && val.percentage <= 80) {
                val.color = '#799FE2'
              } else {
                val.color = '#F96670'
              }
            })
            this.tableData = data.rtnMap.result
          }
        })
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
        }
        if (name === 'pdistrict') {
          params = {
            type: 'JD',
            pid: data
          }
          this.pstreetList = []
          this.form.pstreet = ''
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
      }
    },
    mounted () {
      this.getNextData()
      this.initList()
    }
  }
</script>

<style lang="scss">
  #real_time_park {
    .header {
      display: flex;
      margin-bottom: 20px;
      background: #fff;
      .header-item {
        padding: 30px 0;
        flex-grow: 1;
        .box {
          text-align: center;
          border-right: 1px solid #ccc;
          .title {
            margin-bottom: 10px;
          }
          .data {
            font-size: 24px;
            font-weight: bold;
          }
        }
        .no-border {
          border-right: none;
        }
      }
    }
    .real_time_park-search {
      margin-bottom: 20px;
      padding: 30px 24px 0;
      background: #fff;
      .area-search {
        .checkbox-search {
          padding: 0 30px 0;
          .label {
            color: #666666;
          }
          .selectd {
            border-radius: 4px;
            background: #4084FF;
            color: #fff;
          }
          span {
            color: #999999;
          }
        }
        .top {
          text-align: right;
          color: #87cefa;
          margin-bottom: 15px;
          .top-opt {
            display: inline-block;
            cursor: pointer;
            color: #4084FF;
            i{
              font-size: 22px;
              vertical-align: middle;
            }
            span{
              margin-left: 2px;
            }
          }
        }
      }
      .search-box {
        padding: 0 !important;
        .search-form-item {
          label {
            color: #666
          }
        }
      }
    }
    .data-card-list {
      .el-col-6 {
        min-width: 245px;
        overflow: hidden;
      }
      .card-box {
        padding: 10px;
        margin-bottom: 30px;
        background: #fff;
        .card-box-content {
          position: relative;
          height: 165px;
          .sign {
            position: absolute;
            top: 0;
            left: 0;
            width: 42px;
            text-align: center;
            i {
              color: #4084FF;
              font-size: 38px
            }
          }
          .detail {
            position: absolute;
            top: 0;
            left: 54px;
            right: 80px;
            .title {
              width: 100%;
              margin: 10px 0;
              font-size: 16px;
              font-weight: bold;
            }
            .info {
              width: 100%;
              margin-bottom: 5px;
              font-size: 14px;
              color: #666;
            }
          }
          .percent {
            position: absolute;
            top: 0;
            right: 0;
            width: 80px;
            .el-progress__text {
              font-size: 17px !important;
              font-weight: bold;
            }
          }
        }
        .card-box-footer {
          display: flex;
          padding: 10px 6px 0;
          font-size: 14px;
          border-top: 1px solid #F2F2F2;
          color: #666;
          .total {
            flex-grow: 1;
            text-align: center;
          }
          .separator {
            width: 20px;
            text-align: center;
          }
          .used {
            flex-grow: 1;
            text-align: center;
          }
        }
      }
    }
    .less {
      color: #9acd32;
    }
    .much {
      color: #799FE2;
    }
    .high {
      color: #db7093;
    }
    .search-form-item.w100{
      display: flex;
      width: 100%;
      padding-right: 0;
      .form-box{
        flex-grow: 1;
        .form-child{
          float: left;
          width: 25%;
          padding-left: 2.5px;
          padding-right: 2.5px;
        }
      }
      .search-form-btn.ml30{
        width: 170px;
        min-width: 170px;
        text-align: right;
      }
    }
  }
</style>
