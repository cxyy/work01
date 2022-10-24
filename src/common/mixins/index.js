import { Message } from 'element-ui'

var mixin = {
  data: function () {
    return {
    }
  },
  watch: {
    'tableData': function(newVal, oldVal){
      if (!newVal.length) {
        Message({
          type: 'info',
          message: '没有查询到数据！'
        })
      } else {
        let startIndex = (this.currentPage - 1) * this.pageSize
        this.tableData.forEach(val => {
          val.sortIndex = ++startIndex
        })
      }
    },
    'currentPage': function(newVal, oldVal){
      let startIndex = (this.currentPage - 1) * this.pageSize
      let tmp = JSON.parse(JSON.stringify(this.tableData))
      tmp.forEach(val => {
        val.sortIndex = ++startIndex
      })
      this.tableData = tmp
    }
  }
}

export default mixin
