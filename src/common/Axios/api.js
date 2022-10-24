/**
 User: burning <923398776@qq.com>
 Date: 2018年07月02日
 */

import { MessageBox } from 'element-ui'
import axios from 'axios'
import config from './config.js'
import qs from 'qs'
import cookie from '../cookie/cookie'

export default function $axios (options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: config.baseURL,
      headers: {},
      transformResponse: [
        function (data) {
        }
      ]
    })
    // request 拦截器
    instance.interceptors.request.use(
      config => {
        // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
        let token = ''
        if (cookie.getCookie('token')){
          token = cookie.getCookie('token').val
        }
        if (token){
          let str = {
            ...config.params,
            token: token
          }
          config.params = str;
        }
        // 根据请求方法，序列化传来的参数，根据后端需求是否序列化
        if (config.method.toLocaleLowerCase() === 'post' || config.method.toLocaleLowerCase() === 'put' || config.method.toLocaleLowerCase() === 'delete'){
          config.data = qs.stringify(config.data)
        }
        return config
      },
      error => {
        //  判断请求超时
        if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1){
          console.log('根据你设置的timeout/真的请求超时 判断请求现在超时了，你可以在这里加入超时的处理方案')
          // return service.request(originalRequest);//重复请求一次
        }
        //  需要重定向到错误页面
        const errorInfo = error.response
        if (errorInfo){
          error = errorInfo.data
          // const errorStatus = errorInfo.status; // 404 403 500 ... 等
          // router.push({
          //   path: `/error/${errorStatus}`
          // })
        }
        return Promise.reject(error) // 在调用的那边可以拿到(catch)你想返回的错误信息
      }
    )
    // response 拦截器
    instance.interceptors.response.use(
      response => {
        if (response.config.url === 'park/admin/getcode'){
          return response.request.responseText
        }
        if (response.config.url === 'park/car/exportcarlist' || response.config.url === 'park/statistics/parkrecordsexcel' || response.config.url === 'park/park/payexcel'){
          let a = document.createElement('a')
          a.href = response.request.responseURL
          document.getElementsByTagName('body')[0].appendChild(a)
          a.click()
          document.getElementsByTagName('body')[0].removeChild(a)
          return response
        }
        let data;
        // IE9时response.data是undefined，因此需要使用response.request.responseText(Stringify后的字符串)
        if (response.data === undefined){
          data = JSON.parse(response.request.responseText)
        } else {
          data = JSON.parse(response.data)
        }
        // 根据返回的code值来做不同的处理（和后端约定）
        switch (data.rtnMsg) {
          case 'token失效':
            MessageBox.alert('登录超时，请重新登录', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                location.href = '/'
              }
            })
            break;
          default:
        }
        // 若不是正确的返回code，且已经登录，就抛出错误
        // const err = new Error(data.description)

        // err.data = data
        // err.response = response

        // throw err
        return data
      },
      err => {
        if (err && err.response){
          switch (err.response.status) {
            case 400:
              err.message = '请求错误'
              break

            case 401:
              err.message = '未授权，请登录'
              break

            case 403:
              err.message = '拒绝访问'
              break

            case 404:
              err.message = `请求地址出错: ${err.response.config.url}`
              break

            case 408:
              err.message = '请求超时'
              break

            case 500:
              err.message = '服务器内部错误'
              break

            case 501:
              err.message = '服务未实现'
              break

            case 502:
              err.message = '网关错误'
              break

            case 503:
              err.message = '服务不可用'
              break

            case 504:
              err.message = '网关超时'
              break

            case 505:
              err.message = 'HTTP版本不受支持'
              break

            default:
          }
        }
        console.error(err)
        return Promise.reject(err) // 返回接口返回的错误信息
      }
    )

    // 请求处理
    instance(options)
      .then((res) => {
        resolve(res);
        return false;
      })
      .catch((error) => {
        reject(error);
      })
  })
}
