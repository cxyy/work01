<template>
  <div id="car_yard">
    <div class="car_yard-search">
      <div class="header-search">
        <div class="input-box">
          <el-input placeholder="请输入停车场名称" v-model="form.pname">
            <template slot="append">
              <el-button class="ddddd" type="primary" @click="search">搜 索</el-button>
            </template>
          </el-input>
        </div>
      </div>
      <div class="area-search">
        <!--<checkbox-search :formArr="checkboxList" @click="getArea"></checkbox-search>-->
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
      <!--<div class="search-box">-->
      <!--<div class="search-form-item">-->
      <!--<label>乡镇/街道：</label>-->
      <!--<el-select v-model="form.pstreet" placeholder="请选择" @change="changeStreet(form.pstreet)">-->
      <!--<el-option v-for="item in streetList" :label="item.value" :value="item.id" :key="item.id"></el-option>-->
      <!--</el-select>-->
      <!--</div>-->
      <!--&lt;!&ndash;<div class="search-form-item">&ndash;&gt;-->
      <!--&lt;!&ndash;<label>所属路段：</label>&ndash;&gt;-->
      <!--&lt;!&ndash;<el-select v-model="form.proad" placeholder="请选择">&ndash;&gt;-->
      <!--&lt;!&ndash;<el-option v-for="item in roadList" :label="item.value" :value="item.id" :key="item.id"></el-option>&ndash;&gt;-->
      <!--&lt;!&ndash;</el-select>&ndash;&gt;-->
      <!--&lt;!&ndash;</div>&ndash;&gt;-->
      <!--<div class="search-form-btn">-->
      <!--<el-button type="primary" @click="search">搜索</el-button>-->
      <!--<el-button @click="reset">重置</el-button>-->
      <!--</div>-->
      <!--</div>-->
    </div>
    <div class="car_yard-list">
      <el-row :gutter="30">
        <el-col :span="6">
          <div class="add-card-box" @click="addPark">
            <i class="el-icon-plus vertical-center"></i>
          </div>
        </el-col>
        <el-col :span="6" v-for="(item, index) in tableData" :key="index">
          <div class="card-box">
            <div class="box-area">
              <div class="left">
                <i class="w-icon-parking"></i>
              </div>
              <div class="right">
                <div class="header">
                  <div class="title">{{item.PNAME}}</div>
                  <div class="opt">
                    <i class="w-icon-edit" @click="editPark(item)"></i>
                    <i class="w-icon-del" @click="delPark(item)"></i>
                  </div>
                </div>
                <div class="content">
                  <p class="info" v-auto-title>负责人：{{item.LINKMAN}}</p>
                  <p class="info" v-auto-title>联系方式：{{item.LINKPHONE}}</p>
                  <p class="info" v-auto-title>规则：{{item.FNAME}}</p>
                  <p class="info" v-auto-title>车位总数：{{item.TOTALNUM}}</p>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <component :is="visited.page" :visited="visited" :comData="comData" @refresh="init"></component>
  </div>
</template>

<script>
  import Axios from '@/common/Axios/interface'
  import checkboxSearch from '@/components/checkboxSearch/'
  import parkModel from './module/parkModel'
  import mixin from '@/common/mixins'

  export default {
    name: 'carYard',
    mixins: [mixin],
    components: {
      checkboxSearch,
      parkModel
    },
    data () {
      return {
        checkboxList: [],
        streetList: [],
        roadList: [],
        provinceList: [],
        cityList: [],
        pstreetList: [],
        pdistrictList: [],
        form: {
          pname: '',
          proad: '',
          province: '',
          city: '',
          pdistrict: '',
          pstreet: ''
        },
        type: '',
        tableData: [],
        visited: {
          page: null
        },
        comData: {}
      }
    },
    methods: {
      addPark () {
        this.comData = {}
        this.visited.page = 'parkModel'
      },
      editPark (item) {
        this.comData = item
        this.visited.page = 'parkModel'
      },
      delPark (item) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Axios.deleteParks({ids: item.ID}).then(data => {
            if (data.rtnCode === '1') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.init()
            }
          })
        }).catch(() => {
        })
      },
      carGetdatadict () {
        Axios.carGetdatadict().then(data => {
          if (data.rtnCode === '1') {
            this.checkboxList = data.rtnMap.result
          }
        })
      },
      getArea (data, type) {
        this.type = type
        this.form.pdistrict = data
        this.form.pstreet = ''
        this.form.proad = ''
        let params = {
          pid: data,
          type: 'JD'
        }
        Axios.getdatadict(params).then(data => {
          if (data.rtnCode === '1') {
            this.streetList = data.rtnMap.result
          }
        })
      },
      changeStreet (data) {
        this.form.proad = ''
        let params = {
          pid: data,
          type: 'ROAD'
        }
        Axios.getdatadict(params).then(data => {
          if (data.rtnCode === '1') {
            this.roadList = data.rtnMap.result
          }
        })
      },
      search () {
        this.init()
      },
      reset () {
        this.form.province = ''
        this.form.pstreet = ''
        this.form.proad = ''
        this.form.city = ''
        this.form.pdistrict = ''
        this.roadList = []
        this.cityList = []
        this.pstreetList = []
        this.pdistrictList = []
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
          // this.clearAddrError()
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
          // this.clearAddrError()
        }
        if (name === 'pdistrict') {
          params = {
            type: 'JD',
            pid: data
          }
          this.pstreetList = []
          this.form.pstreet = ''
          // this.clearAddrError()
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
      init () {
        let params = Object.assign({}, this.form)
        if (params.pdistrict === '') {
          delete params.pdistrict
        }
        if (params.pname === '') {
          delete params.pname
        }
        if (params.pstreet === '') {
          delete params.pstreet
        }
        if (params.proad === '') {
          delete params.proad
        }
        if (this.type === 'SHI') {
          params.city = params.pdistrict
          delete params.pdistrict
        }
        Axios.getparks(params).then(data => {
          if (data.rtnCode === '1') {
            this.tableData = data.rtnMap.result
          }
        })
      }
    },
    mounted () {
      this.init()
      this.getNextData()
    }
  }
</script>

<style lang="scss">
  #car_yard {
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

    .car_yard-search {
      margin-bottom: 20px;
      background: #fff;

      .header-search {
        padding: 30px 0;
        border-bottom: 1px solid #F2F2F2;
        text-align: center;

        .input-box {
          display: inline-block;
          width: 40%;
        }
      }

      .area-search {
        .checkbox-search {
          padding: 25px 30px 0;

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
      }

      .search-box {
        padding: 0 30px 0 !important;

        .search-form-item {
          label {
            color: #666666
          }
        }
      }
    }

    .car_yard-list {
      .el-col-6 {
        overflow: hidden;
      }

      .add-card-box {
        position: relative;
        height: 180px;
        line-height: 180px;
        text-align: center;
        background: #fff;
        border: 2px dashed #E5E5E5;
        color: #E5E5E5;
        cursor: pointer;

        i {
          font-size: 60px;
        }
      }

      .card-box {
        height: 180px;
        padding: 18px;
        margin-bottom: 20px;
        background: #fff;

        .box-area {
          position: relative;
          width: 100%;
          height: 100%;

          .left {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 40px;

            i {
              color: #4084FF;
              font-size: 40px;
            }
          }

          .right {
            position: absolute;
            left: 40px;
            right: 0;
            top: 0;
            bottom: 0;
            padding-left: 13px;
            padding-top: 8px;

            .header {
              display: flex;
              margin-bottom: 15px;

              .title {
                flex-grow: 1;
                font-size: 16px;
                font-weight: bold;
              }

              .opt {
                i {
                  cursor: pointer;
                  color: #999999;
                  font-size: 20px;
                }

                i:last-child {
                  margin-left: 8px;
                }
              }
            }

            .content {
              .info {
                width: 100%;
                margin-bottom: 5px;
                font-size: 14px;
                white-space: nowrap;
              }

              p {
                color: #666666;
              }
            }
          }
        }
      }
    }

    .el-input-group__append {
      border-radius: 0 3px 3px 0;
      border: 1px solid #4084FF;
      /*border-radius: 0;*/
    }

    .el-input-group__append .el-button {
      background: #4084FF;
      color: #fff;
      border-radius: 0;
    }

    .ddddd {
      float: left;
    }

    .w100 {
      width: 100% !important;
      margin-top: 20px;
      padding-right: 0 !important;
    }

    .search-form-btn.ml30{
      width: 20%;
      margin-left: 20px;
      text-align: right;
    }
  }
</style>
