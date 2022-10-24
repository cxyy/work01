// 公用API 比如角色列表、用户列表、经常使用的

export default {
  getRoleList (params = {}) {
    return new Promise(function (resolve, reject) {
      resolve({
        re: '200',
        data: [
          {
            'key': '111',
            'label': '世界五百强'
          },
          {
            'key': '222',
            'label': '世界五百渣'
          }
        ]
      })
    })
  }
}
