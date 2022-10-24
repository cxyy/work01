import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/styleSheet/all.scss'
import './common/directive/index'
import cookie from './common/cookie/cookie'
import store from './store/store.js'
import Vuex from 'vuex'

Vue.prototype.GLOBALWIDTH = 50
Vue.prototype.LOADING = function (time = 500) {
  let loadingInstance = this.$loading({
    fullscreen: true,
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  setTimeout(function () {
    loadingInstance.close()
  }, time)
}
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Vuex)
Vue.prototype.downLoadFileByStream = function (url, param, errorFeedBack, fileName) {
  return new Promise((resolve, reject) => {
    let fname = 'template' + '.xlsx'
    let xhr = new XMLHttpRequest()
    xhr.open('POST', url)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.responseType = 'blob'
    xhr.onload = function (e) {
      if (this.status === 200) {
        fname = xhr.getResponseHeader('content-disposition').split('=')[1]
        let blob = this.response
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, fname)
        } else {
          let a = document.createElement('a')
          let url = (window.URL) ? window.URL.createObjectURL(blob) : window.webkitURL.createObjectURL(blob)
          a.href = url
          a.download = fname
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          resolve()
        }
      } else {
        Vue.prototype.$message({
          type: 'error',
          message: errorFeedBack
        })
      }
    }
    xhr.send(JSON.stringify(param))
  })
}
// this.downLoadFileByStream(service.export(), {}, '网络错误，导出失败')
// export () {
//   return '/api/admin/export'
// }
// 路由跳转后
router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    next()
  } else {
    let token = cookie.getCookie('token')
    if (!token){
      next({
        path: '/'
      })
    } else {
      next()
    }
  }
})

router.afterEach((to, from) => {})

new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
