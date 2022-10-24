/**
 User: burning <923398776@qq.com>
 Date: 2018年08月04日
 */
// 倒入所有接口
import apiList from './interface'

const install = Vue => {
  if (install.installed){
    return
  }
  install.installed = true;

  Object.defineProperties(Vue.prototype, {
    // 处挂载在 Vue 原型的 $api 对象上
    '$api': {
      get () {
        return apiList
      }
    }
  })
}

export default install
