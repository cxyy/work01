<template>
  <div id="personal_center">
    <div class="personal-center-header">
      <div class="left">个人信息</div>
      <div class="right" @click="editBaseInfo">
        <i class="w-icon-edit"></i>
      </div>
    </div>
    <div class="personal-center-content">
      <div class="detail-form" v-if="editState1===false">
        <div class="form-item">
          <div class="form-label">账户：</div>
          <div class="form-data">{{personalForm.account}}</div>
        </div>
        <div class="form-item">
          <div class="form-label">姓名：</div>
          <div class="form-data">{{personalForm.name}}</div>
        </div>
        <div class="form-item">
          <div class="form-label">手机：</div>
          <div class="form-data">{{personalForm.tel}}</div>
        </div>
        <div class="form-item">
          <div class="form-label">邮箱：</div>
          <div class="form-data">{{personalForm.email}}</div>
        </div>
      </div>
      <div class="edit-form" v-if="editState1===true">
        <el-form ref="baseInfo" :model="ModifypersonalForm" :rules="baseInfoRules">
          <div class="form-item">
            <div class="form-label">账户：</div>
            <div class="form-data">
              <el-form-item prop="account">
                <el-input v-model="ModifypersonalForm.account" placeholder="请输入账户" disabled></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="form-item">
            <div class="form-label">姓名：</div>
            <div class="form-data">
              <el-form-item prop="name">
                <el-input v-model="ModifypersonalForm.name" placeholder="请输入姓名"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="form-item">
            <div class="form-label">手机：</div>
            <div class="form-data">
              <el-form-item prop="tel">
                <el-input v-model="ModifypersonalForm.tel" placeholder="请输入手机"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="form-item">
            <div class="form-label">邮箱：</div>
            <div class="form-data">
              <el-form-item prop="email">
                <el-input v-model="ModifypersonalForm.email" placeholder="请输入邮箱"></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>
        <div class="submit-form">
          <el-button @click="cancel('baseInfo')">取消</el-button>
          <el-button type="primary" @click="subBaseInfo('baseInfo')">确定</el-button>
        </div>
      </div>
    </div>
    <div class="personal-center-header second-header" v-if="companyForm.dname !== ''">
      <div class="left">单位信息</div>
      <div class="right">
        <!--<i class="w-icon-edit" @click="editBaseInfo1"></i>-->
      </div>
    </div>
    <div class="personal-center-content" v-if="companyForm.dname !== ''">
      <div class="detail-form" v-if="editState2===false">
        <div class="form-item">
          <div class="form-label">单位名称：</div>
          <div class="form-data">{{companyForm.dname}}</div>
        </div>
        <div class="form-item">
          <div class="form-label">单位类型：</div>
          <div class="form-data">{{companyForm.value}}</div>
        </div>
        <div class="form-item">
          <div class="form-label">单位法人：</div>
          <div class="form-data">{{companyForm.owner}}</div>
        </div>
        <div class="form-item">
          <div class="form-label">联系方式：</div>
          <div class="form-data">{{companyForm.dtel}}</div>
        </div>
        <div class="form-item">
          <div class="form-label">详细地址：</div>
          <div class="form-data">{{companyForm.address}}</div>
        </div>
      </div>
      <div class="edit-form" v-if="editState2===true">
        <el-form :model="ModifycompanyForm" :rules="companyInfoRules">
          <div class="formList">
            <div class="form-item">
              <div class="form-label">单位名称：</div>
              <div class="form-data">
                <el-form-item prop="account">
                  <el-input v-model="ModifycompanyForm.dname" placeholder="请输入单位名称" disabled></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="form-item">
              <div class="form-label">单位类型：</div>
              <div class="form-data">
                <el-form-item prop="unitType">
                  <el-select v-model="ModifycompanyForm.type" placeholder="请选择单位类型" style="width: 100%" disabled>
                    <el-option v-for="item in unitList" :label="item.value" :value="item.datakey"
                               :key="item.datakey"></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="formList">
            <div class="form-item">
              <div class="form-label">单位法人：</div>
              <div class="form-data">
                <el-form-item prop="phone">
                  <el-input v-model="ModifycompanyForm.owner" placeholder="请输入单位法人" disabled></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="form-item">
              <div class="form-label">联系方式：</div>
              <div class="form-data">
                <el-form-item prop="email">
                  <el-input v-model="ModifycompanyForm.dtel" placeholder="请输入联系方式" disabled></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
          <form class="city">
            <el-form-item label="详细地址：">
              <div class="cityForm">
                <el-select v-model="ModifycompanyForm.province" @change="choseProvince" placeholder="请选择省" disabled>
                  <el-option v-for="item in provinceData" :label="item.value" :value="item.id"
                             :key="item.datakey"></el-option>
                </el-select>
                <el-select v-model="ModifycompanyForm.city" @change="choseCity" placeholder="请选择市" disabled>
                  <el-option v-for="item in cityData" :label="item.value" :value="item.id"
                             :key="item.datakey"></el-option>
                </el-select>
                <el-select v-model="ModifycompanyForm.district" @change="choseArea" placeholder="请选择区" disabled>
                  <el-option v-for="item in areaData" :label="item.value" :value="item.id"
                             :key="item.datakey"></el-option>
                </el-select>
                <el-select v-model="ModifycompanyForm.street" @change="choseStreet" placeholder="请选择街道" disabled>
                  <el-option v-for="item in streetData" :label="item.value" :value="item.id"
                             :key="item.datakey"></el-option>
                </el-select>
              </div>
              <div>
                <el-form-item prop="address">
                  <el-input class="textarea" placeholder="请输入详细地址" v-model="ModifycompanyForm.address" type="textarea"
                            disabled></el-input>
                </el-form-item>
              </div>
            </el-form-item>
          </form>
        </el-form>
        <div class="submit-form">
          <el-button @click="cancel('unitInfo')">返回</el-button>
          <!--<el-button type="primary" @click="subBaseInfo2()">确定</el-button>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Axios from '@/common/Axios/interface';

  export default {
    name: 'personalCenter',
    data () {
      return {
        // 省市区街道数据
        provinceData: [],
        cityData: [],
        areaData: [],
        streetData: [],
        unitList: [],
        detailedData: '',
        // 个人信息
        personalForm: {
          id: '',
          // 账户
          account: '',
          // 邮箱
          email: '',
          // 名字
          name: '',
          // 电话
          tel: ''
        },
        // 修改个人信息
        ModifypersonalForm: {
          // 账户
          account: '',
          // 邮箱
          email: '',
          // 名字
          name: '',
          // 电话
          tel: ''
        },
        // 个人信息认证
        baseInfoRules: {
          account: [
            {required: true, message: '请输入账户', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ],
          tel: [
            {required: true, pattern: /^1[34578]\d{9}$/, message: '请输正确的手机号码', trigger: 'blur'}
          ],
          email: [
            {
              required: true,
              pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
              message: '请输正确的邮箱',
              trigger: 'blur'
            }
          ]
        },
        // 公司信息
        companyForm: {
          // 单位ID
          deptid: '',
          //  单位名称
          dname: '',
          // 单位类型
          value: '',
          type: '',
          // 单位法人
          owner: '',
          // 单位电话
          dtel: '',
          // 详细地址:
          address: '',
          // 省市区
          province: '',
          city: '',
          district: '',
          street: ''
        },
        // 修改公司信息
        ModifycompanyForm: {
          //  单位名称
          dname: '',
          // 单位类型
          value: '',
          type: '',
          // 单位法人
          owner: '',
          // 单位电话
          dtel: '',
          // 详细地址:
          address: '',
          // 省市区
          province: '',
          city: '',
          district: '',
          street: ''
        },
        // 城市信息
        city: {},
        // 公司信息认证
        companyInfoRules: {
          dname: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ],
          value: [
            {required: true, message: '请输入类型', trigger: 'blur'}
          ],
          owner: [
            {required: true, message: '请输入法人', trigger: 'blur'}
          ],
          dtel: [
            {required: true, message: '请输入电话', trigger: 'blur'}
          ]
        },
        editState1: false,
        editState2: false
      }
    },
    methods: {
      // 信息数据
      personnalinfo () {
        Axios.personnalinfo().then(data => {
          if (data.rtnCode === '1') {
            let res = data.rtnMap.personnal;
            this.personalForm = {
              id: res.ID,
              // 账号
              account: res.ACCOUNT,
              // 邮箱
              email: res.EMAIL,
              // 名字
              name: res.NAME,
              // 电话
              tel: res.TEL
            }
            this.companyForm = {
              // 单位ID
              deptid: res.DEPTID,
              //  单位名称
              dname: res.DNAME,
              // 单位类型
              value: res.VALUE,
              type: res.TYPE,
              // 单位法人
              owner: res.OWNER,
              // 单位电话
              dtel: res.DTEL,
              // 详细地址:
              address: res.ADDRESS,
              // 省市区
              province: res.SHENG,
              city: res.SHI,
              district: res.QU,
              street: res.JD
            }
          }
        })
        Axios.getdatadict({type: 'DEPTtype'}).then((e) => {
          this.unitList = e.rtnMap.result;
        })
      },
      // 修改个人信息
      cancel (name) {
        if (name === 'baseInfo') {
          this.editState1 = !this.editState1
        } else if (name === 'unitInfo') {
          this.editState2 = !this.editState2
        }
      },
      editBaseInfo () {
        // 修改个人信息
        this.editState1 = !this.editState1;
        this.ModifypersonalForm = {
          // 账户
          account: this.personalForm.account,
          // 邮箱
          email: this.personalForm.email,
          // 名字
          name: this.personalForm.name,
          // 电话
          tel: this.personalForm.tel
        }
      },
      subBaseInfo (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              id: this.personalForm.id,
              account: this.ModifypersonalForm.account,
              name: this.ModifypersonalForm.name,
              tel: this.ModifypersonalForm.tel,
              email: this.ModifypersonalForm.email
            }
            Axios.updateuser(params).then(data => {
              if (data.rtnCode === '1') {
                this.$message({
                  type: 'success',
                  message: '修改信息成功!'
                })
                this.personnalinfo()
                this.editState1 = false
              } else {
                this.$message({
                  type: 'error',
                  message: data.rtnMsg
                })
              }
            })
          }
        })
      },
      // 修改单位信息
      editBaseInfo1 () {
        this.editState2 = !this.editState2;
        this.ModifycompanyForm = {
          // 单位ID
          deptid: this.companyForm.deptid,
          //  单位名称
          dname: this.companyForm.dname,
          // 单位类型
          value: this.companyForm.value,
          type: this.companyForm.type,
          // 单位法人
          owner: this.companyForm.owner,
          // 单位电话
          dtel: this.companyForm.dtel,
          // 详细地址:
          address: this.companyForm.address,
          // 省市区
          province: this.companyForm.province,
          city: this.companyForm.city,
          district: this.companyForm.district,
          street: this.companyForm.street
        }
        // 如果没有城市信息
        Axios.getdatadict({type: 'SHENG'}).then((e) => {
          this.provinceData = e.rtnMap.result
          Axios.getdatadict({pId: this.companyForm.province}).then((e) => {
            this.cityData = e.rtnMap.result
          })
          Axios.getdatadict({pId: this.companyForm.city}).then((e) => {
            this.areaData = e.rtnMap.result
          })
          Axios.getdatadict({pId: this.companyForm.district}).then((e) => {
            this.streetData = e.rtnMap.result
          })
        })
      },
      // 省数据 请求市数据
      choseProvince () {
        Axios.getdatadict({pId: this.ModifycompanyForm.province}).then((e) => {
          this.cityData = e.rtnMap.result
          this.ModifycompanyForm.city = '';
          this.ModifycompanyForm.district = '';
          this.ModifycompanyForm.street = '';
        })
      },
      // 市数据 请求区数据
      choseCity () {
        Axios.getdatadict({pId: this.ModifycompanyForm.city}).then((e) => {
          this.areaData = e.rtnMap.result
          this.ModifycompanyForm.district = '';
          this.ModifycompanyForm.street = '';
        })
      },
      // 区数据 请求街道数据
      choseArea () {
        Axios.getdatadict({pId: this.ModifycompanyForm.district}).then((e) => {
          this.streetData = e.rtnMap.result
          this.ModifycompanyForm.street = '';
        })
      },
      choseStreet () {
      },
      subBaseInfo2 () {
        let params = {
          id: this.companyForm.deptid,
          //  单位名称
          name: this.ModifycompanyForm.dname,
          // 单位类型
          // value: this.ModifycompanyForm.value,
          type: this.ModifycompanyForm.type,
          // 单位法人
          owner: this.ModifycompanyForm.owner,
          // 单位电话
          tel: this.ModifycompanyForm.dtel,
          // 详细地址:
          address: this.ModifycompanyForm.address,
          // 省市区
          province: this.ModifycompanyForm.province,
          city: this.ModifycompanyForm.city,
          district: this.ModifycompanyForm.district,
          street: this.ModifycompanyForm.street
        }
        Axios.updateUnit(params).then(data => {
          if (data.rtnCode === '1') {
            this.$message({
              type: 'success',
              message: '修改信息成功!'
            });
            location.reload();
          } else {
            this.$message({
              type: 'error',
              message: data.rtnMsg
            });
          }
        })
      }
    },
    async mounted () {
      await
        this.personnalinfo()
    }
  }
</script>

<style lang="scss">
  #personal_center {
    .personal-center-header {
      display: flex;
      height: 50px;
      line-height: 50px;
      padding: 0 30px;
      border-bottom: 1px solid #EBEBEB;
      background: #fff;
      .left {
        flex-grow: 1;
      }
      .right {
        width: 50px;
        text-align: center;
        cursor: pointer;
        color: #999999;
        font-size: 20px;
      }
    }
    .personal-center-content {
      padding: 20px 0;
      background: #fff;
      overflow: hidden;
      min-width: 600px;
      text-align: center;
      .detail-form, .edit-form {
        .formList {
          display: flex;
          .form-item {
            display: flex;flex: 1;
            &:nth-child(2n) {
              padding-left: 0;
            }
          }
        }
        .el-form {
          display: inline-block;
        }
        .form-item {
          display: flex;
          line-height: 40px;
          height: 63px;
          .form-label {
            width: 95px;
            // text-align: right;
            color: #666666;
          }
          .form-data {
            padding-left: 5px;
            font-size: 16px;
            text-align: left;
          }
        }
        .submit-form {
          padding-top: 20px;
          padding-right: 40px;
          text-align: right;
          border-top: 1px solid #EBEBEB;
        }
      }
      .detail-form {
        /* display: inline-block;*/
        /* min-width: 408px; */
        .form-item {
          height: 42px;
          .form-label {
            text-align: left;
            width: auto;
            padding-left: 30px;
          }
        }
      }
    }
    .city {
      display: flex;
      label {
        width: 100px;
        font-size: 16px;
        text-align: right;
      }
      .form-item {
        height: auto;
      }
      .cityForm {
        .el-select {display: inline-block;width: 20.8%;margin-bottom: 20px;margin-right: 10px}
      }
    }
    .second-header {
      margin-top: 20px;
    }
  }
</style>
