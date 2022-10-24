/**
 User: burning <923398776@qq.com>
 Date: 2018年07月03日
 */

// 获取cookie、
export function getCookie (name) {
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  if (document.cookie.match(reg)){
    // 解码cookie
    let data = unescape(document.cookie.match(reg)[0]);
    let arr = data.split('=');
    return {
      name: arr[0],
      val: arr[1]
    };
  } else {
    return null;
  }
}

// 设置cookie,增加到vue实例方便全局调用
export function setCookie (cName, value, expiredays) {
  // 当前时间戳
  let exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays);
  // 设置cookie && 过期时间
  document.cookie = cName + '=' + escape(value) + ';' + 'expires' + '=' + exdate.toString();
}

// 删除cookie
export function delCookie (name) {
  let exp = new Date();
  exp.setTime(exp.getTime() - 1);
  let cval = getCookie(name);
  if (cval !== null){
    document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString();
  }
}

export default {
  getCookie,
  setCookie,
  delCookie
}
