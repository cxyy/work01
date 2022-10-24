import Axios from '@/common/Axios/interface';

export default {
  // 列表数据
  getParkinfo (e) {
    return Axios.getUnitInfo(e).then(data => {
      return data;
    })
  },
  // 字典
  getdatadict (e) {
    return Axios.getdatadict(e).then(data => {
      return data.rtnMap.result;
    })
  },
  // 新增单位
  addUnit (e) {
    return Axios.addUnit(e).then(data => {
      return data;
    })
  },
  // 修改单位
  updateUnit (e) {
    return Axios.updateUnit(e).then(data => {
      return data;
    })
  },
  // 删除单位
  deleteUnit (e) {
    return Axios.deleteUnit(e).then(data => {
      return data;
    })
  }
}
