// 公用API 比如角色列表、用户列表、经常使用的

export default {
  getRoleList (params = {}) {
    return new Promise(function (resolve, reject) {
      resolve({
        re: '200',
        data: [
          {
            'key': 'admin',
            'label': '超级管理员'
          },
          {
            'key': 'user',
            'label': '普通用户'
          }
        ]
      })
    })
  }
}
