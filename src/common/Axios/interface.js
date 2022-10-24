/**
 User: burning <923398776@qq.com>
 Date: 2018年08月04日
 */
import axios from './api' // 倒入 api

/* 将所有接口统一起来便于维护
 * 如果项目很大可以将 url 独立成文件，接口分成不同的模块
 * 此处的数据依然来自 Easy Mock
 */

// 获取验证码
export const getcode = params => {
  return axios({
    url: '/admin/getcode',
    method: 'get',
    params
  })
}

// 登录
// 账号 => account
// 密码 => password
// 验证码 => authCode
// 返回token 登录之后的所有请求都需要带上
export const login = params => {
  return axios({
    url: '/admin/login',
    method: 'get',
    params
  })
}

// 百度地图
// token
export const map = params => {
  return axios({
    url: '/map/map',
    method: 'get',
    params
  })
}

// 使用率排名和总数据展示
// token
export const parkinfo = params => {
  return axios({
    url: '/map/parkinfo',
    method: 'get',
    params
  })
}

// 个人中心
// token
export const personnalinfo = params => {
  return axios({
    url: '/admin/personnalinfo',
    method: 'post',
    params
  })
}
export const updatepassword = params => {
  return axios({
    url: '/admin/updatepassword',
    method: 'post',
    params
  })
}

// 运营管理 =>  获取黑白名单车辆信息，支持条件查询
// token
// 0白名单 1黑名单   => markedType
// 当前页数         =>  pageNum
// 每页显示条数     =>  pageLength
// 车牌号          =>  carId
// 录入时间        =>  timeStart
// 录入时间        =>  timeEnd 2018-06-27 10:26:39时分秒可传可
export const getmarkedcars = params => {
  return axios({
    url: '/car/getmarkedcars',
    method: 'get',
    params
  })
}

// 运营管理 =>  新增黑白名单车辆
// token
// 车牌号         => carid
// 车主名字       =>  drivename
// 车主电话       =>  drivertel
// 1表示黑名单    =>  isblack
// 1表示白名单    =>  iswhite
// 车辆类型       =>  cartype
// 备注           =>  commnet
export const addcar = params => {
  return axios({
    url: '/car/addcar',
    method: 'post',
    params
  })
}

// 运营管理 =>  删除黑白名单车辆 支持批量删除
// token
// ids => 车辆的id，多个逗号分开
export const deletecar = params => {
  return axios({
    url: '/car/deletecar',
    method: 'get',
    params
  })
}

// 运营管理 => 运营管理修改黑白名单
// token
// id         =>  车辆id
// comment    =>  备注
// drivername =>  车主名字
// drivertel  =>  车主电话
export const updatecarinfo = params => {
  return axios({
    url: '/car/updatecarinfo',
    method: 'get',
    params
  })
}

// 统计管理 => 实时车位
// token
// parkName    =>   停车场名字
// pdistrict   =>   区（对应字典表的key）
// pstreet     =>   街道(对应字典表的key)
export const carportused = params => {
  return axios({
    url: '/statistics/carportused',
    method: 'get',
    params
  })
}

// 实时车位总数据展示
export const carportdata = params => {
  return axios({
    url: '/statistics/carportdata',
    method: 'get',
    params
  })
}
// 实时车位-获取区/县（无锡）
export const carGetdatadict = params => {
  return axios({
    url: '/statistics/getdatadict',
    method: 'get',
    params
  })
}

// 统计管理 => 缴费分析
// 图标数据单位下每天停车场总收入
// token
// timeStart    =>     开始时间
// timeEnd      =>     结束时间
export const charge = params => {
  return axios({
    url: '/statistics/charge',
    method: 'get',
    params
  })
}

// 统计管理 => 缴费分析
// 缴费分析 总数据展示
// token
export const chargedata = params => {
  return axios({
    url: '/statistics/chargedata',
    method: 'get',
    params
  })
}
// 统计管理 => 停车记录
export const parkrecords = params => {
  return axios({
    url: '/statistics/parkrecords',
    method: 'get',
    params
  })
}

// 获取停车场记录
// 通过调用此接口获取当前登陆人权限下的所有停车场（模糊查询）
// token
// paddr        =>     停车场地址
// linkphone    =>     联系人电话
// pname        =>     停车场名称
// linkman      =>     联系人
// parea        =>     片区id
// deptid       =>     部门id
// plocation    =>     地理位置
// proad        =>     路段id
// pdistrict    =>     区id
// pageNum      =>     当前页码
// pageLength   =>     每页显示条数
export const getparks = params => {
  return axios({
    url: '/park/getparks',
    method: 'post',
    params
  })
}

// 新增停车场
// token
// pname        =>     停车场名称
// linkphone    =>     联系人电话
// paddr        =>     停车场地址
// linkman      =>     联系人
// parea        =>     片区id
// deptid       =>     部门id
// plocation    =>     地理位置
// proad        =>     路段id
// pdistrict    =>     区id
// pageNum      =>     当前页码
// pageLength   =>     每页显示条数
export const addpark = params => {
  return axios({
    url: 'park/addpark',
    method: 'post',
    params
  })
}

// 修改停车场
// token
// pname        =>     停车场名称
// linkphone    =>     联系人电话
// paddr        =>     停车场地址
// linkman      =>     联系人
// parea        =>     片区id
// deptid       =>     部门id
// plocation    =>     地理位置
// proad        =>     路段id
// pdistrict    =>     区id
export const updateParksById = params => {
  return axios({
    url: 'park/updateParksById',
    method: 'post',
    params
  })
}

// 删除停车场
// token
// ids   =>     停车场id（逗号分隔）
export const deleteParks = params => {
  return axios({
    url: 'park/deleteParks',
    method: 'post',
    params
  })
}

// 新增收费规则
// token
// standard   =>     收费公式
// commint    =>     备注
// fname      =>     规则名称
export const addfees = params => {
  return axios({
    url: 'park/addfees',
    method: 'get',
    params
  })
}

// 删除收费规则
// token
// ids   =>     收费规则id（逗号分隔）
export const deletefees = params => {
  return axios({
    url: 'park/deletefees',
    method: 'get',
    params
  })
}

// 修改收费规则
// token
// ids   =>     收费规则id（逗号分隔）
export const updateFees = params => {
  return axios({
    url: 'park/updateFees',
    method: 'get',
    params
  })
}

// 查询收费规则
// token
// id         =>     收费规则id
// standard   =>     收费公式
// commint    =>     备注
// fname      =>     规则名称
// used       =>     规则启用状态（0：未使用，1：使用）
export const getfees = params => {
  return axios({
    url: 'park/getfees',
    method: 'get',
    params
  })
}

// 新增单位
// token
// name         =>     单位名称
// tel          =>     公司电话
// address      =>     单位地址
// email        =>     邮箱
// owner        =>     企业法人
// type         =>     单位类型
// phone        =>     单位座机
export const addUnit = params => {
  return axios({
    url: 'unit/addUnit',
    method: 'get',
    params
  })
}

// 删除单位
// token
// ids    =>   单位id(逗号分隔)
export const deleteUnit = params => {
  return axios({
    url: 'unit/deleteUnit',
    method: 'get',
    params
  })
}

// 修改单位
// token
// id           =>     单位id
// name         =>     单位名称
// tel          =>     公司电话
// address      =>     单位地址
// email        =>     邮箱
// owner        =>     企业法人
// type         =>     单位类型
// phone        =>     单位座机
export const updateUnit = params => {
  return axios({
    url: 'unit/updateUnit',
    method: 'post',
    params
  })
}

// 查询单位（超管才可新增）
// token    接口有问题
export const getUnitInfo = params => {
  return axios({
    url: 'unit/getUnitInfo',
    method: 'get',
    params
  })
}

// 查询收款记录
// token
// id               =>     停车记录id
// carid            =>     车牌号
// entrytime        =>     进场时间
// departuretime    =>     出场时间
// recieveman       =>     收款人id
// parkid           =>     停车场id
// payid            =>     订单号
// recieveunit      =>     收费单位id
// recievetype      =>     支付方式（0：微信支付，1：小程序2.支付宝3：现金）
// recievestate     =>     收费状态（0：未付费，1：已付费，2：白名单，3：月卡用户）
export const getPayManagement = params => {
  return axios({
    url: 'park/getPayManagement',
    method: 'get',
    params
  })
}
// 查款详情
export const getOrderDetail = params => {
  return axios({
    url: 'park/getOrderDetail',
    method: 'get',
    params
  })
}

// 菜单
export const getmenu = params => {
  return axios({
    url: 'admin/getmenu',
    method: 'post',
    params
  })
}
export const getmenubyid = params => {
  return axios({
    url: 'admin/getmenubyid',
    method: 'post',
    params
  })
}
export const addmenu = params => {
  return axios({
    url: 'admin/addmenu',
    method: 'get',
    params
  })
}
export const updatemenuinfo = params => {
  return axios({
    url: 'admin/updatemenuinfo',
    method: 'get',
    params
  })
}
export const delmenu = params => {
  return axios({
    url: 'admin/delmenu',
    method: 'get',
    params
  })
}

// 用户管理
export const adduser = params => {
  return axios({
    url: 'admin/adduser',
    method: 'get',
    params
  })
}
export const deluser = params => {
  return axios({
    url: 'admin/deluser',
    method: 'get',
    params
  })
}
export const updateuser = params => {
  return axios({
    url: 'admin/updateuser',
    method: 'get',
    params
  })
}
export const getuser = params => {
  return axios({
    url: 'admin/getuser',
    method: 'get',
    params
  })
}
export const getroletype = params => {
  return axios({
    url: 'admin/getroletype',
    method: 'get',
    params
  })
}
export const getdept = params => {
  return axios({
    url: 'admin/getdept',
    method: 'get',
    params
  })
}

// 角色管理
export const getrole = params => {
  return axios({
    url: 'admin/getrole',
    method: 'get',
    params
  })
}
export const addrole = params => {
  return axios({
    url: 'admin/addrole',
    method: 'get',
    params
  })
}
export const delrole = params => {
  return axios({
    url: 'admin/delrole',
    method: 'get',
    params
  })
}
export const updaterolemenu = params => {
  return axios({
    url: 'admin/updaterolemenu',
    method: 'get',
    params
  })
}

// 车位管理
export const getCarport = params => {
  return axios({
    url: 'park/getCarport',
    method: 'get',
    params
  })
}
export const addCarport = params => {
  return axios({
    url: 'park/addCarport',
    method: 'get',
    params
  })
}
export const getGeoma = params => {
  return axios({
    url: 'park/getGeoma',
    method: 'get',
    params
  })
}
export const updateCarport = params => {
  return axios({
    url: 'park/updateCarport',
    method: 'get',
    params
  })
}
export const deleteCarports = params => {
  return axios({
    url: 'park/deleteCarports',
    method: 'get',
    params
  })
}

// 设备管理
export const queryEqpt = params => {
  return axios({
    url: 'barrier/queryEqpt',
    method: 'get',
    params
  })
}
export const addEqpt = params => {
  return axios({
    url: 'barrier/addEqpt',
    method: 'get',
    params
  })
}
export const updateEqpt = params => {
  return axios({
    url: 'barrier/updateEqpt',
    method: 'get',
    params
  })
}
export const deleteEqpt = params => {
  return axios({
    url: 'barrier/deleteEqpt',
    method: 'get',
    params
  })
}

// 小票管理
export const addReceipt = params => {
  return axios({
    url: 'park/addReceipt',
    method: 'get',
    params
  })
}
export const updateReceipt = params => {
  return axios({
    url: 'park/updateReceipt',
    method: 'get',
    params
  })
}
export const getReceipt = params => {
  return axios({
    url: 'park/getReceipt',
    method: 'get',
    params
  })
}
export const deleteReceipt = params => {
  return axios({
    url: 'park/deleteReceipt',
    method: 'get',
    params
  })
}

// 收费员管理
export const addToll = params => {
  return axios({
    url: 'admin/addToll',
    method: 'get',
    params
  })
}

// 修改收费员
export const editToll = params => {
  return axios({
    url: 'admin/editToll',
    method: 'get',
    params
  })
}

export const updateToll = params => {
  return axios({
    url: 'admin/updateToll',
    method: 'get',
    params
  })
}
export const getToll = params => {
  return axios({
    url: 'admin/getToll',
    method: 'get',
    params
  })
}
export const delToll = params => {
  return axios({
    url: 'admin/delToll',
    method: 'get',
    params
  })
}

// 代金券管理
export const adddis = params => {
  return axios({
    url: 'card/adddis',
    method: 'get',
    params
  })
}
export const getdis = params => {
  return axios({
    url: 'card/getdis',
    method: 'get',
    params
  })
}
export const updatedis = params => {
  return axios({
    url: 'card/updatedis',
    method: 'post',
    params
  })
}
export const deldis = params => {
  return axios({
    url: 'card/deldis',
    method: 'post',
    params
  })
}

// 月卡管理
export const addmon = params => {
  return axios({
    url: 'card/addmon',
    method: 'get',
    params
  })
}
export const getmon = params => {
  return axios({
    url: 'card/getmon',
    method: 'get',
    params
  })
}
export const updatemon = params => {
  return axios({
    url: 'card/updatemon',
    method: 'get',
    params
  })
}
export const delmon = params => {
  return axios({
    url: 'card/delmon',
    method: 'post',
    params
  })
}

// 账户管理
export const getAccount = params => {
  return axios({
    url: 'unit/getAccount',
    method: 'get',
    params
  })
}
export const addAccount = params => {
  return axios({
    url: 'unit/addAccount',
    method: 'get',
    params
  })
}
export const editAccount = params => {
  return axios({
    url: 'unit/editAccount',
    method: 'get',
    params
  })
}
export const delAccount = params => {
  return axios({
    url: 'unit/delAccount',
    method: 'get',
    params
  })
}

// 车主管理
export const driveradd = params => {
  return axios({
    url: 'driver/add',
    method: 'get',
    params
  })
}
export const driverupdate = params => {
  return axios({
    url: 'driver/update',
    method: 'get',
    params
  })
}
export const driverget = params => {
  return axios({
    url: 'driver/get',
    method: 'get',
    params
  })
}
export const driverdel = params => {
  return axios({
    url: 'driver/del',
    method: 'get',
    params
  })
}

// 字典 单位类型
export const getdatadict = params => {
  return axios({
    url: 'datadict/getdatadict',
    method: 'get',
    params
  })
}

// 字典管理
export const getall = params => {
  return axios({
    url: 'datadict/getall',
    method: 'get',
    params
  })
}
export const updatedatadict = params => {
  return axios({
    url: 'datadict/updatedatadict',
    method: 'get',
    params
  })
}
export const adddatadict = params => {
  return axios({
    url: 'datadict/adddatadict',
    method: 'get',
    params
  })
}

// 日志
export const getoperation = params => {
  return axios({
    url: 'admin/getoperation',
    method: 'get',
    params
  })
}

// 消息中心
export const personMsg = params => {
  return axios({
    url: 'message/personmsg',
    method: 'get',
    params
  })
}
export const readmsg = params => {
  return axios({
    url: 'message/readmsg',
    method: 'get',
    params
  })
}
export const messageQuery = params => {
  return axios({
    url: 'message/query',
    method: 'get',
    params
  })
}
export const messageUpdate = params => {
  return axios({
    url: 'message/update',
    method: 'get',
    params
  })
}
export const messageDel = params => {
  return axios({
    url: 'message/del',
    method: 'get',
    params
  })
}
export const messageAdd = params => {
  return axios({
    url: 'message/add',
    method: 'get',
    params
  })
}
export const messagePublish = params => {
  return axios({
    url: 'message/publish',
    method: 'get',
    params
  })
}
export const qcmessage = params => {
  return axios({
    url: 'card/qcmessage',
    method: 'get',
    params
  })
}

// 查询设备
export const getPDA = params => {
  return axios({
    url: 'admin/getPDA',
    method: 'get',
    params
  })
}
export const exportcarlist = params => {
  return axios({
    url: 'car/exportcarlist',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
export const parkrecordsexcel = params => {
  return axios({
    url: 'statistics/parkrecordsexcel',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

// 抬杆
export const sendcmd = params => {
  return axios({
    url: 'barrier/sendcmd',
    method: 'get',
    params
  })
}

// 收款记录导出
export const payexcel = params => {
  return axios({
    url: 'park/payexcel',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export default {
  getcode,
  login,
  map,
  parkinfo,
  personnalinfo,
  updatepassword,
  getmarkedcars,
  addcar,
  deletecar,
  updatecarinfo,
  carportused,
  carportdata,
  carGetdatadict,
  charge,
  chargedata,
  parkrecords,
  getparks,
  addpark,
  updateParksById,
  deleteParks,
  addfees,
  deletefees,
  updateFees,
  getfees,
  addUnit,
  getUnitInfo,
  deleteUnit,
  updateUnit,
  getPayManagement,
  getOrderDetail,
  adduser,
  deluser,
  updateuser,
  getuser,
  getroletype,
  getdept,
  getmenu,
  getmenubyid,
  addmenu,
  updatemenuinfo,
  delmenu,
  getrole,
  addrole,
  delrole,
  updaterolemenu,
  getCarport,
  addCarport,
  getGeoma,
  updateCarport,
  deleteCarports,
  addReceipt,
  updateReceipt,
  getReceipt,
  deleteReceipt,
  queryEqpt,
  addEqpt,
  updateEqpt,
  deleteEqpt,
  getdatadict,
  addToll,
  updateToll,
  getToll,
  delToll,
  adddis,
  getdis,
  updatedis,
  deldis,
  addmon,
  getmon,
  updatemon,
  delmon,
  getoperation,
  getall,
  updatedatadict,
  adddatadict,
  getAccount,
  addAccount,
  editAccount,
  delAccount,
  driveradd,
  driverupdate,
  driverget,
  driverdel,
  personMsg,
  readmsg,
  messageQuery,
  messageUpdate,
  messageDel,
  messageAdd,
  messagePublish,
  qcmessage,
  editToll,
  getPDA,
  exportcarlist,
  parkrecordsexcel,
  sendcmd,
  payexcel
}
