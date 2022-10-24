/**
 User: burning <923398776@qq.com>
 Date: 2018年07月26日
 */
export default {
  getTableData (params = {}) {
    return new Promise(function (resolve, reject) {
      resolve({
        re: '200',
        data: {
          'login': true,
          'message': '失败'
        }
      })
    })
  }
}
